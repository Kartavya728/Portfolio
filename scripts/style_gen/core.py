"""
Shared Blender-side helpers for the style-generation pipeline. Imported by
render_style.py, which Blender runs once per style (fresh process each
time, so one style's failure/state can never leak into another).
"""
import math
import os

import bpy
import mathutils

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
INPUT_GLB = os.path.join(PROJECT_ROOT, "public", "models", "character_final_v16.glb")
MODELS_DIR = os.path.join(PROJECT_ROOT, "public", "models")

RESOLUTION = 1024
TARGET_HEIGHT_FRACTION = 0.78  # midpoint of the requested 70-85% range
FACE_FILL_FRACTION = 0.92  # face crop should fill almost the whole frame


def clear_scene():
    """Wipe every object/mesh/material/etc from the default scene."""
    bpy.ops.wm.read_factory_settings(use_empty=True)
    for coll in (
        bpy.data.meshes,
        bpy.data.materials,
        bpy.data.images,
        bpy.data.armatures,
        bpy.data.actions,
        bpy.data.node_groups,
    ):
        for block in list(coll):
            try:
                coll.remove(block)
            except Exception:
                pass


def import_character():
    """Import a fresh copy of the source GLB. Never mutates the source file."""
    if not os.path.isfile(INPUT_GLB):
        raise FileNotFoundError(f"Source GLB not found: {INPUT_GLB}")
    bpy.ops.import_scene.gltf(filepath=INPUT_GLB)
    armature = next((o for o in bpy.data.objects if o.type == "ARMATURE"), None)
    if armature is None:
        raise RuntimeError("No armature found after import")
    return armature


def get_character_objects(armature):
    """The humanoid character only - the armature plus everything parented
    under it - excluding unrelated desk/scene props (keyboard, monitor
    planes, ground, screenlight) that sit at the top level of the scene."""
    objs = [armature]
    objs.extend(armature.children_recursive)
    return [o for o in objs if o.type in ("MESH", "ARMATURE")]

def hide_non_character_objects(character_objs):
    keep = set(character_objs)
    for obj in bpy.data.objects:
        if obj not in keep:
            obj.hide_render = True
            obj.hide_set(True)


def compute_bounds(mesh_objs):
    """World-space AABB across a list of mesh objects."""
    mins = mathutils.Vector((1e9, 1e9, 1e9))
    maxs = mathutils.Vector((-1e9, -1e9, -1e9))
    found = False
    for obj in mesh_objs:
        if obj.type != "MESH":
            continue
        found = True
        for corner in obj.bound_box:
            world = obj.matrix_world @ mathutils.Vector(corner)
            mins.x, mins.y, mins.z = min(mins.x, world.x), min(mins.y, world.y), min(mins.z, world.z)
            maxs.x, maxs.y, maxs.z = max(maxs.x, world.x), max(maxs.y, world.y), max(maxs.z, world.z)
    if not found:
        raise RuntimeError("No mesh objects to bound")
    return mins, maxs


def setup_camera(mins, maxs, angle_deg):
    """Place + frame a camera so the whole character fits with head/feet
    never cropped and the figure filling ~70-85% of the frame height,
    computed from the bounding box rather than a fixed distance."""
    center = (mins + maxs) / 2.0
    size = maxs - mins
    height = size.z
    # Character radius as seen from the front (a bit of slack over the
    # raw half-width/half-depth so nothing clips at grazing angles).
    radius = max(size.x, size.y) / 2.0 * 1.15

    cam_data = bpy.data.cameras.new("StyleCam")
    cam_data.lens = 50
    cam_obj = bpy.data.objects.new("StyleCam", cam_data)
    bpy.context.scene.collection.objects.link(cam_obj)

    fov = 2 * math.atan((36 / 2) / cam_data.lens)  # horizontal-ish FOV proxy
    # Distance so the character's height fills TARGET_HEIGHT_FRACTION of frame.
    distance = (height / 2) / math.tan(fov / 2) / TARGET_HEIGHT_FRACTION
    distance = max(distance, radius / math.tan(fov / 2) + radius)

    angle_rad = math.radians(angle_deg)
    cam_pos = center + mathutils.Vector(
        (distance * math.sin(angle_rad), -distance * math.cos(angle_rad), 0)
    )
    # Aim slightly above vertical center (a common portrait convention that
    # still keeps head/feet inside frame given the extra distance margin).
    look_at = mathutils.Vector((center.x, center.y, mins.z + height * 0.52))
    cam_obj.location = cam_pos
    direction = look_at - cam_pos
    cam_obj.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()

    bpy.context.scene.camera = cam_obj
    return cam_obj


def get_head_world_position(armature):
    """World-space position of the FACE (not just the head bone's own
    root joint) - used to frame the per-style face-crop render. Bone-
    based rather than name-matching a mesh object, since this file's
    glTF object names turned out inconsistent between imports (the mesh
    actually holding the face geometry imported as an object literally
    named "Hand" in one run), while the bone names are the one thing
    every style can rely on.

    The head bone's own .head joint sits down near the jaw/chin (it's
    the neck-to-head pivot, not the middle of the head volume) - an
    earlier version centered the crop there and it framed mostly chin
    and neck with the eyes cropped out. Blending most of the way toward
    .tail (up near the crown) lands roughly at eye/nose level instead.
    """
    bpy.context.view_layer.update()
    pbone = armature.pose.bones.get("spine.006")
    if pbone is None:
        return None
    head_joint = armature.matrix_world @ pbone.head
    tail_joint = armature.matrix_world @ pbone.tail
    return head_joint.lerp(tail_joint, 0.55)


def setup_face_camera(head_center, head_radius, angle_deg=15):
    """A close, tightly-framed camera centered on the head only."""
    cam_data = bpy.data.cameras.new("FaceCam")
    cam_data.lens = 50
    cam_obj = bpy.data.objects.new("FaceCam", cam_data)
    bpy.context.scene.collection.objects.link(cam_obj)

    fov = 2 * math.atan((36 / 2) / cam_data.lens)
    # head_radius is a half-extent already, matching tan(fov/2)'s own
    # half-angle convention - an earlier version multiplied it by 2 here
    # (treating it as a full extent, so dividing by half-angle-tan
    # double counted), which put the camera about 2x farther back than
    # intended and made the "face" crop barely different from the full
    # front render.
    distance = head_radius / math.tan(fov / 2) / FACE_FILL_FRACTION

    angle_rad = math.radians(angle_deg)
    cam_pos = head_center + mathutils.Vector(
        (distance * math.sin(angle_rad), -distance * math.cos(angle_rad), -distance * 0.05)
    )
    cam_obj.location = cam_pos
    direction = head_center - cam_pos
    cam_obj.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()

    bpy.context.scene.camera = cam_obj
    return cam_obj


def render_face_crop(head_center, head_radius, out_dir):
    for obj in list(bpy.data.objects):
        if obj.type == "CAMERA":
            bpy.data.objects.remove(obj, do_unlink=True)
    setup_face_camera(head_center, head_radius)
    return render_to(os.path.join(out_dir, "face.png"))


def setup_lighting():
    """Consistent three-point + neutral studio background for every style."""
    scene = bpy.context.scene

    world = bpy.data.worlds.new("StudioWorld")
    scene.world = world
    world.use_nodes = True
    bg = world.node_tree.nodes["Background"]
    bg.inputs[0].default_value = (0.93, 0.93, 0.95, 1.0)
    bg.inputs[1].default_value = 1.0

    def add_light(name, kind, energy, location, size=2.0, color=(1, 1, 1)):
        data = bpy.data.lights.new(name, type=kind)
        data.energy = energy
        data.color = color
        if kind == "AREA":
            data.size = size
        obj = bpy.data.objects.new(name, data)
        scene.collection.objects.link(obj)
        obj.location = location
        direction = mathutils.Vector((0, 0, 1.6)) - mathutils.Vector(location)
        obj.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()
        return obj

    # Near-white (barely tinted) on purpose: flat-shaded/low-poly styles
    # have far fewer, larger facets than the dense original mesh, so they
    # don't blend directional light the way smooth dense geometry does -
    # a strongly colored rim/fill light that looked fine on the original
    # skewed those styles' skin tones hard toward that light's color
    # (e.g. a lavender rim light on a voxelized head's few big flat
    # faces read as an outright purple face, not stylization).
    add_light("KeyLight", "AREA", 900, (5, -6, 8), size=3.0)
    add_light("FillLight", "AREA", 300, (-6, -4, 5), size=4.0, color=(0.97, 0.98, 1.0))
    add_light("RimLight", "AREA", 500, (0, 6, 7), size=2.5, color=(0.98, 0.97, 1.0))


def configure_render():
    scene = bpy.context.scene
    scene.render.engine = "BLENDER_EEVEE"
    scene.render.resolution_x = RESOLUTION
    scene.render.resolution_y = RESOLUTION
    scene.render.film_transparent = False
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGB"
    try:
        scene.eevee.taa_render_samples = 32
    except Exception:
        pass


def render_to(filepath):
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    bpy.context.scene.render.filepath = filepath
    bpy.ops.render.render(write_still=True)
    if not os.path.isfile(filepath):
        raise RuntimeError(f"Render did not produce expected file: {filepath}")
    return filepath


def render_front_and_three_quarter(mins, maxs, out_dir):
    configure_render()
    setup_lighting()

    setup_camera(mins, maxs, angle_deg=0)
    front_path = render_to(os.path.join(out_dir, "front.png"))

    for obj in list(bpy.data.objects):
        if obj.type == "CAMERA":
            bpy.data.objects.remove(obj, do_unlink=True)
    setup_camera(mins, maxs, angle_deg=37.5)
    three_q_path = render_to(os.path.join(out_dir, "three_quarter.png"))

    return front_path, three_q_path


def export_glb(objs, filepath):
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    bpy.ops.object.select_all(action="DESELECT")
    for obj in objs:
        obj.select_set(True)
    bpy.ops.export_scene.gltf(
        filepath=filepath,
        export_format="GLB",
        use_selection=True,
    )
    if not os.path.isfile(filepath):
        raise RuntimeError(f"GLB export did not produce expected file: {filepath}")
    return filepath


def apply_modifier(obj, mod):
    """Apply a modifier via the modern (5.x) operator, falling back for
    objects that aren't the active object."""
    bpy.context.view_layer.objects.active = obj
    with bpy.context.temp_override(object=obj):
        bpy.ops.object.modifier_apply(modifier=mod.name)


def for_each_character_mesh(character_objs, fn):
    for obj in character_objs:
        if obj.type == "MESH":
            fn(obj)
