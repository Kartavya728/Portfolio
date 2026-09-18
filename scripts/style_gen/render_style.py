"""
Entry point Blender runs (once per style, as a fresh subprocess) via:
  blender --background --factory-startup --python render_style.py -- <style_name>

Isolated per-process so one style crashing can never affect another and so
every style starts from a clean re-import of the source GLB, per spec.
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import bpy  # noqa: E402

import core  # noqa: E402
import styles  # noqa: E402


def main():
    argv = sys.argv
    if "--" in argv:
        argv = argv[argv.index("--") + 1 :]
    else:
        argv = []
    if not argv:
        print("ERROR: no style name passed after '--'")
        sys.exit(2)
    style_name = argv[0]

    if style_name not in styles.STYLE_REGISTRY:
        print(f"ERROR: unknown style '{style_name}'")
        sys.exit(2)

    out_dir = os.path.join(core.MODELS_DIR, style_name)
    os.makedirs(out_dir, exist_ok=True)

    core.clear_scene()
    armature = core.import_character()
    character_objs = core.get_character_objects(armature)
    core.hide_non_character_objects(character_objs)

    transform_fn = styles.STYLE_REGISTRY[style_name]
    transform_fn(character_objs, armature)

    # Re-resolve character objects post-transform: some styles (chibi,
    # anime) re-parent/apply pose, and modifier-apply can occasionally
    # spawn new mesh data, so recompute rather than trusting the old list.
    character_objs = core.get_character_objects(armature)
    mesh_objs = [o for o in character_objs if o.type == "MESH"]
    mins, maxs = core.compute_bounds(mesh_objs)

    front_path, three_q_path = core.render_front_and_three_quarter(mins, maxs, out_dir)
    print(f"RENDERED front: {front_path}")
    print(f"RENDERED three_quarter: {three_q_path}")

    head_center = core.get_head_world_position(armature)
    if head_center is not None:
        head_radius = (maxs.z - mins.z) * 0.13
        face_path = core.render_face_crop(head_center, head_radius, out_dir)
        print(f"RENDERED face: {face_path}")
    else:
        print("WARNING: no head bone found, skipping face crop")

    if style_name in styles.GEOMETRY_STYLES:
        glb_path = os.path.join(out_dir, "model.glb")
        core.export_glb(character_objs, glb_path)
        print(f"EXPORTED glb: {glb_path}")

    print(f"STYLE_OK:{style_name}")


if __name__ == "__main__":
    try:
        main()
    except Exception as e:  # pragma: no cover
        import traceback

        traceback.print_exc()
        print(f"STYLE_FAILED:{sys.argv[-1]}:{e}")
        sys.exit(1)
