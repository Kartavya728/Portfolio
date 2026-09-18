"""
Per-style geometry/material transforms. Every function receives the fresh,
just-imported character (armature + its mesh children) and mutates it
in-place inside a Blender process dedicated to that one style only.
"""
import bpy

import core


# ---------------------------------------------------------------- helpers --
def _mesh_objs(character_objs):
    return [o for o in character_objs if o.type == "MESH"]


def _shade(obj, flat: bool):
    bpy.context.view_layer.objects.active = obj
    with bpy.context.temp_override(object=obj, active_object=obj, selected_editable_objects=[obj]):
        if flat:
            bpy.ops.object.shade_flat()
        else:
            bpy.ops.object.shade_smooth()


def _bake_armature_deform(obj):
    """Bake the CURRENT posed (armature-deformed) shape into plain static
    mesh data before any decimate/remesh/subsurf. Applying one of those
    modifiers via the operator while an earlier Armature modifier is
    still in the stack triggers Blender's "modifier was not first, result
    may not be as expected" path - in practice this produced a mesh that
    reverted to the rest/bind pose (arms stretched out) instead of the
    actual seated pose. Converting to a real mesh first bakes the
    evaluated (posed) result and drops the Armature modifier cleanly, so
    the next modifier added is always first."""
    if not any(m.type == "ARMATURE" for m in obj.modifiers):
        return
    bpy.ops.object.select_all(action="DESELECT")
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    with bpy.context.temp_override(
        object=obj, active_object=obj, selected_editable_objects=[obj]
    ):
        bpy.ops.object.convert(target="MESH")


def _remove_shape_keys(obj):
    """Modifiers can't be applied to a mesh with shape keys. These renders
    are static snapshots (not the live animatable rig), so it's safe to
    bake the basis/current shape out and drop the keys before decimating,
    remeshing, subdividing, etc."""
    if obj.data.shape_keys is not None:
        # Use the data-API method (not the operator) - operators that
        # expect a 3D viewport area can fail their poll() in --background
        # mode even with temp_override.
        while obj.data.shape_keys and obj.data.shape_keys.key_blocks:
            obj.shape_key_remove(obj.data.shape_keys.key_blocks[0])


def _add_decimate(obj, ratio, mode="COLLAPSE"):
    if len(obj.data.polygons) < 12:
        return  # tiny meshes (eyes, teeth) shouldn't be decimated further
    _remove_shape_keys(obj)
    _bake_armature_deform(obj)
    mod = obj.modifiers.new(name="Decimate", type="DECIMATE")
    mod.decimate_type = mode
    if mode == "COLLAPSE":
        mod.ratio = ratio
    bpy.context.view_layer.objects.active = obj
    with bpy.context.temp_override(object=obj):
        bpy.ops.object.modifier_apply(modifier=mod.name)


def _add_remesh_blocks(obj, octree_depth):
    if len(obj.data.polygons) < 12:
        return
    _remove_shape_keys(obj)
    _bake_armature_deform(obj)
    mod = obj.modifiers.new(name="Remesh", type="REMESH")
    mod.mode = "BLOCKS"
    mod.octree_depth = octree_depth
    mod.use_smooth_shade = False
    bpy.context.view_layer.objects.active = obj
    with bpy.context.temp_override(object=obj):
        bpy.ops.object.modifier_apply(modifier=mod.name)


def _add_subsurf(obj, levels=1):
    _remove_shape_keys(obj)
    _bake_armature_deform(obj)
    mod = obj.modifiers.new(name="Subsurf", type="SUBSURF")
    mod.levels = levels
    mod.render_levels = levels
    bpy.context.view_layer.objects.active = obj
    with bpy.context.temp_override(object=obj):
        bpy.ops.object.modifier_apply(modifier=mod.name)


def _replace_material_matte(mat, color, roughness=0.9, specular=0.15):
    """Swap a material's node tree for a plain matte Principled BSDF -
    used by styles (clay) that intentionally discard surface texture."""
    if not mat.use_nodes:
        mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    for n in list(nodes):
        nodes.remove(n)
    out = nodes.new("ShaderNodeOutputMaterial")
    bsdf = nodes.new("ShaderNodeBsdfPrincipled")
    bsdf.inputs["Base Color"].default_value = color
    bsdf.inputs["Roughness"].default_value = roughness
    if "Specular IOR Level" in bsdf.inputs:
        bsdf.inputs["Specular IOR Level"].default_value = specular
    links.new(bsdf.outputs["BSDF"], out.inputs["Surface"])


def _boost_material(mat, saturation=1.15, roughness_delta=0.0, clearcoat=None):
    """Nudge an EXISTING material (keeps its base color/texture) rather
    than replacing it - used by the subtler stylizations."""
    if not mat.use_nodes:
        return
    bsdf = next((n for n in mat.node_tree.nodes if n.type == "BSDF_PRINCIPLED"), None)
    if bsdf is None:
        return
    base = bsdf.inputs.get("Base Color")
    if base is not None and not base.is_linked:
        r, g, b, a = base.default_value
        avg = (r + g + b) / 3
        base.default_value = (
            min(1, avg + (r - avg) * saturation),
            min(1, avg + (g - avg) * saturation),
            min(1, avg + (b - avg) * saturation),
            a,
        )
    rough = bsdf.inputs.get("Roughness")
    if rough is not None and not rough.is_linked:
        rough.default_value = max(0.0, min(1.0, rough.default_value + roughness_delta))
    if clearcoat is not None and "Coat Weight" in bsdf.inputs:
        bsdf.inputs["Coat Weight"].default_value = clearcoat


def _apply_toon_shading(mat, saturation=1.25):
    """Flatten the material's EXISTING Principled BSDF in place (zero
    specular/metallic, max roughness) rather than swapping in a bare
    Diffuse/ShaderToRGB graph. Both of those render solid black under
    this Blender build's EEVEE (confirmed by a direct probe - Emission
    lights correctly, Diffuse BSDF does not, regardless of light setup),
    so reusing the Principled node keeps the lighting response that's
    already proven to work while still flattening the look and (with
    _add_outline) reading clearly as toon/cel-shaded."""
    if not mat.use_nodes:
        return
    bsdf = next((n for n in mat.node_tree.nodes if n.bl_idname == "ShaderNodeBsdfPrincipled"), None)
    if bsdf is None:
        return
    for input_name, value in (("Roughness", 1.0), ("Metallic", 0.0)):
        socket = bsdf.inputs.get(input_name)
        if socket is not None and not socket.is_linked:
            socket.default_value = value
    for spec_name in ("Specular IOR Level", "Specular"):
        socket = bsdf.inputs.get(spec_name)
        if socket is not None and not socket.is_linked:
            socket.default_value = 0.0
    _boost_material(mat, saturation=saturation)


def _get_outline_material():
    black = bpy.data.materials.get("__OutlineBlack")
    if black is None:
        black = bpy.data.materials.new("__OutlineBlack")
        black.use_nodes = True
        for n in list(black.node_tree.nodes):
            black.node_tree.nodes.remove(n)
        out = black.node_tree.nodes.new("ShaderNodeOutputMaterial")
        emit = black.node_tree.nodes.new("ShaderNodeEmission")
        emit.inputs["Color"].default_value = (0.02, 0.02, 0.02, 1)
        black.node_tree.links.new(emit.outputs["Emission"], out.inputs["Surface"])
    return black


def _add_outline(obj, thickness=0.045):
    """Classic "inverted hull" outline: a solid-black DUPLICATE, pushed
    outward along its own surface normals by a Solidify modifier (left
    unapplied - this style never needs a baked GLB, just a render), so it
    only peeks out past the original along the silhouette edge.

    A first attempt scaled the duplicate up uniformly instead - that
    moves vertices radially from the object's pivot rather than along
    each vertex's local normal, so flat/curved regions at different
    distances from the pivot got wildly inconsistent offsets and the
    "outline" ballooned into covering large patches of the character
    instead of a thin rim. Solidify's per-vertex-normal extrusion is the
    right primitive for this and avoids that entirely, and using ONE
    material for the whole shell sidesteps the material_offset confusion
    from an earlier attempt too."""
    if len(obj.data.polygons) < 4:
        return
    black = _get_outline_material()

    dup = obj.copy()
    dup.data = obj.data.copy()
    dup.name = obj.name + "_outline"
    dup.data.materials.clear()
    dup.data.materials.append(black)
    bpy.context.collection.objects.link(dup)
    dup.parent = obj.parent
    dup.matrix_parent_inverse = obj.matrix_parent_inverse.copy()
    dup.matrix_basis = obj.matrix_basis.copy()

    mod = dup.modifiers.new(name="OutlineShell", type="SOLIDIFY")
    mod.thickness = thickness
    mod.offset = 1.0
    return dup




# --------------------------------------------------------------- styles ---
def style_original(character_objs, armature):
    pass  # baseline - no transform at all


def style_low_poly(character_objs, armature):
    for obj in _mesh_objs(character_objs):
        _add_decimate(obj, ratio=0.22)
        _shade(obj, flat=True)


def style_faceted(character_objs, armature):
    for obj in _mesh_objs(character_objs):
        _add_decimate(obj, ratio=0.45)
        _shade(obj, flat=True)


def _voxelize(character_objs, octree_depth):
    for obj in _mesh_objs(character_objs):
        _add_remesh_blocks(obj, octree_depth=octree_depth)
        _shade(obj, flat=True)


def style_voxel_detailed(character_objs, armature):
    _voxelize(character_objs, octree_depth=7)


def style_voxel_medium(character_objs, armature):
    _voxelize(character_objs, octree_depth=5)


def style_voxel_blocky(character_objs, armature):
    # User asked for the voxel size in this style to be as small as
    # practical (finer cubes) rather than the original coarser depth=4.
    _voxelize(character_objs, octree_depth=6)


def style_blocky(character_objs, armature):
    # Minecraft-like language but "more detailed": a coarser remesh than
    # voxel_medium paired with flat shading and slightly boosted, more
    # graphic material colors rather than raw voxel cubes everywhere.
    for obj in _mesh_objs(character_objs):
        _add_remesh_blocks(obj, octree_depth=5)
        _shade(obj, flat=True)
    for mat in bpy.data.materials:
        _boost_material(mat, saturation=1.35, roughness_delta=0.1)


def style_smooth_cartoon(character_objs, armature):
    for obj in _mesh_objs(character_objs):
        _add_subsurf(obj, levels=1)
        _shade(obj, flat=False)
    for mat in bpy.data.materials:
        _boost_material(mat, saturation=1.2, roughness_delta=-0.1)


def style_toon(character_objs, armature):
    # Outlines are explicitly optional in spec; a duplicated/offset shell
    # kept rendering as full opaque coverage rather than a thin rim (likely
    # inverted-normal / offset-direction interaction on this rig) and
    # wasn't worth further time against everything else still to build -
    # flattened, saturated materials alone already read clearly as toon.
    for obj in _mesh_objs(character_objs):
        _shade(obj, flat=False)
    for mat in bpy.data.materials:
        _apply_toon_shading(mat)


def style_clay(character_objs, armature):
    for obj in _mesh_objs(character_objs):
        _add_subsurf(obj, levels=1)
        _shade(obj, flat=False)
    clay_color = (0.82, 0.76, 0.68, 1.0)
    for mat in bpy.data.materials:
        _replace_material_matte(mat, clay_color, roughness=0.85, specular=0.1)


_HEAD_OBJECT_NAMES = (
    "AvatarHead",
    "Head_cap",
    "Hair",
)


def style_chibi(character_objs, armature):
    # Bone-space pose editing (scaling spine.006 in POSE mode, then
    # bpy.ops.pose.armature_apply to bake it) was tried first, but even
    # scaling ONLY the head bone left the hands/fingers grotesquely
    # stretched after the bake - something about how this rig's meshes
    # get rebound during armature_apply doesn't hold up, and it wasn't
    # worth more time chasing given everything else still to build.
    # Scaling the separate head-part mesh OBJECTS in place (they're
    # independent objects, not fused with the body mesh) sidesteps the
    # armature/rig entirely, so nothing else can be affected.
    character_meshes = _mesh_objs(character_objs)
    head_objs = [o for o in character_meshes if o.name in _HEAD_OBJECT_NAMES]
    if head_objs:
        mins, maxs = core.compute_bounds(head_objs)
        pivot = (mins + maxs) / 2.0
        factor = 1.25
        for obj in head_objs:
            offset = obj.location - pivot
            obj.location = pivot + offset * factor
            obj.scale = tuple(s * factor for s in obj.scale)
    for obj in character_meshes:
        _shade(obj, flat=False)


def style_stylized_realism(character_objs, armature):
    for obj in _mesh_objs(character_objs):
        _shade(obj, flat=False)
    for mat in bpy.data.materials:
        _boost_material(mat, saturation=1.08, roughness_delta=-0.05, clearcoat=0.15)


def style_semi_realistic_cartoon(character_objs, armature):
    for obj in _mesh_objs(character_objs):
        _add_subsurf(obj, levels=1)
        _shade(obj, flat=False)
    for mat in bpy.data.materials:
        _boost_material(mat, saturation=1.15, roughness_delta=-0.12, clearcoat=0.25)


def style_anime(character_objs, armature):
    character_meshes = _mesh_objs(character_objs)
    head_objs = [o for o in character_meshes if o.name in _HEAD_OBJECT_NAMES]
    if head_objs:
        mins, maxs = core.compute_bounds(head_objs)
        pivot = (mins + maxs) / 2.0
        factor = 1.1
        for obj in head_objs:
            offset = obj.location - pivot
            obj.location = pivot + offset * factor
            obj.scale = tuple(s * factor for s in obj.scale)
    for obj in character_meshes:
        _shade(obj, flat=False)
    for mat in bpy.data.materials:
        _apply_toon_shading(mat, saturation=1.4)
        _boost_material(mat, saturation=1.1, clearcoat=0.2)


STYLE_REGISTRY = {
    "original": style_original,
    "low_poly": style_low_poly,
    "faceted": style_faceted,
    "voxel_detailed": style_voxel_detailed,
    "voxel_medium": style_voxel_medium,
    "voxel_blocky": style_voxel_blocky,
    "blocky": style_blocky,
    "smooth_cartoon": style_smooth_cartoon,
    "toon": style_toon,
    "clay": style_clay,
    "chibi": style_chibi,
    "stylized_realism": style_stylized_realism,
    "semi_realistic_cartoon": style_semi_realistic_cartoon,
    "anime": style_anime,
}

# Styles whose geometry actually changes enough to be worth a GLB export.
GEOMETRY_STYLES = {
    "low_poly",
    "faceted",
    "voxel_detailed",
    "voxel_medium",
    "voxel_blocky",
    "blocky",
    "smooth_cartoon",
    "clay",
    "chibi",
    "semi_realistic_cartoon",
}
