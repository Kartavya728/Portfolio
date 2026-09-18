"""
Step 1 - load and inspect the source GLB (read-only, never modifies it).
Run with the regular system Python (trimesh), not Blender.
"""
import os
import trimesh

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
INPUT_GLB = os.path.join(PROJECT_ROOT, "public", "models", "character_final_v16.glb")


def analyze_model(path: str) -> None:
    if not os.path.isfile(path):
        raise FileNotFoundError(f"Source GLB not found: {path}")

    scene = trimesh.load(path, process=False)
    print(f"=== ANALYSIS: {path} ===")
    print(f"Scene type: {type(scene).__name__}")
    print(f"Mesh count: {len(scene.geometry)}")

    total_v, total_f = 0, 0
    materials = set()
    for name, geom in scene.geometry.items():
        v = len(geom.vertices) if hasattr(geom, "vertices") else 0
        f = len(geom.faces) if hasattr(geom, "faces") else 0
        total_v += v
        total_f += f
        mat = getattr(geom.visual, "material", None)
        if mat is not None and getattr(mat, "name", None):
            materials.add(mat.name)

    print(f"Total vertices: {total_v}")
    print(f"Total polygons (faces): {total_f}")
    print(f"Materials referenced: {len(materials)}")
    for m in sorted(materials):
        print(f"  - {m}")

    print(f"Bounding box min: {scene.bounds[0]}")
    print(f"Bounding box max: {scene.bounds[1]}")
    extents = scene.bounds[1] - scene.bounds[0]
    print(f"Bounding box size: {extents}")

    print(f"Top-level graph nodes: {len(scene.graph.nodes)}")
    print("Object hierarchy (first 20 nodes):")
    for i, node in enumerate(scene.graph.nodes):
        if i >= 20:
            print(f"  ... ({len(scene.graph.nodes) - 20} more)")
            break
        print(f"  - {node}")

    # Animations aren't exposed by trimesh's glTF loader; report via raw glTF JSON instead.
    try:
        import json
        import struct

        with open(path, "rb") as fh:
            data = fh.read()
        json_len = struct.unpack_from("<I", data, 12)[0]
        gltf = json.loads(data[20 : 20 + json_len])
        anims = gltf.get("animations", [])
        print(f"Animations: {len(anims)}")
        for a in anims:
            print(f"  - {a.get('name')}")
    except Exception as e:  # pragma: no cover - diagnostic only
        print(f"(could not read animations: {e})")

    print("=== END ANALYSIS (source file untouched) ===")


if __name__ == "__main__":
    analyze_model(INPUT_GLB)
