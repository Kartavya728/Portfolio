"""
Orchestrator (plain Python, not Blender) - runs render_style.py once per
style as its OWN Blender subprocess, so one style crashing can never take
down the rest. After all styles finish, builds the contact sheet and
prints the final summary the spec asks for.
"""
import os
import subprocess
import sys
import time

# Windows consoles default to cp1252, which can't encode the check/cross
# marks used in the final summary - force UTF-8 on stdout so that always
# works regardless of what codepage the calling shell is using.
sys.stdout.reconfigure(encoding="utf-8")

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
MODELS_DIR = os.path.join(PROJECT_ROOT, "public", "models")
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
RENDER_SCRIPT = os.path.join(SCRIPT_DIR, "render_style.py")

BLENDER_EXE = r"C:\Program Files\Blender Foundation\Blender 5.2\blender.exe"

STYLES = [
    ("original", "Original"),
    ("low_poly", "Low Poly"),
    ("faceted", "Faceted"),
    ("voxel_detailed", "Voxel Detailed"),
    ("voxel_medium", "Voxel Medium"),
    ("voxel_blocky", "Voxel Blocky"),
    ("blocky", "Blocky"),
    ("smooth_cartoon", "Smooth Cartoon"),
    ("toon", "Toon"),
    ("clay", "Clay"),
    ("chibi", "Chibi"),
    ("stylized_realism", "Stylized Realism"),
    ("semi_realistic_cartoon", "Semi-Realistic Cartoon"),
    ("anime", "Anime"),
]


def run_style(style_key: str) -> tuple[bool, str]:
    cmd = [
        BLENDER_EXE,
        "--background",
        "--factory-startup",
        "--python",
        RENDER_SCRIPT,
        "--",
        style_key,
    ]
    try:
        proc = subprocess.run(
            cmd, capture_output=True, text=True, timeout=600, cwd=PROJECT_ROOT
        )
    except subprocess.TimeoutExpired:
        return False, "timed out after 600s"

    out_dir = os.path.join(MODELS_DIR, style_key)
    front = os.path.join(out_dir, "front.png")
    three_q = os.path.join(out_dir, "three_quarter.png")
    face = os.path.join(out_dir, "face.png")
    ok = (
        proc.returncode == 0
        and f"STYLE_OK:{style_key}" in proc.stdout
        and os.path.isfile(front)
        and os.path.isfile(three_q)
        and os.path.isfile(face)
    )
    if ok:
        return True, ""
    tail = "\n".join((proc.stdout + "\n" + proc.stderr).splitlines()[-25:])
    return False, tail


def main():
    results = {}
    for style_key, label in STYLES:
        t0 = time.time()
        print(f"--- Rendering {label} ({style_key}) ---", flush=True)
        ok, err = run_style(style_key)
        dt = time.time() - t0
        results[style_key] = ok
        status = "OK" if ok else "FAILED"
        print(f"    {status} in {dt:.1f}s", flush=True)
        if not ok:
            print(f"    error tail:\n{err}\n", flush=True)

    print("\nBuilding comparison contact sheet...", flush=True)
    try:
        from build_contact_sheet import build_contact_sheet

        sheet_path = build_contact_sheet(STYLES, MODELS_DIR)
        print(f"Contact sheet: {sheet_path}")
    except Exception as e:
        print(f"Contact sheet FAILED: {e}")

    print("\nSTYLE GENERATION COMPLETE\n")
    label_width = max(len(label) for _, label in STYLES) + 2
    for style_key, label in STYLES:
        mark = "\u2713" if results.get(style_key) else "\u2717"
        print(f"{label + ':':<{label_width}} {mark}")

    print("\nGenerated files:")
    for style_key, _ in STYLES:
        out_dir = os.path.join(MODELS_DIR, style_key)
        for fname in ("front.png", "three_quarter.png", "face.png", "model.glb"):
            fpath = os.path.join(out_dir, fname)
            if os.path.isfile(fpath):
                print(f"  {fpath}")
    sheet_path = os.path.join(MODELS_DIR, "comparison", "contact_sheet.png")
    if os.path.isfile(sheet_path):
        print(f"  {sheet_path}")

    failed = [label for key, label in STYLES if not results.get(key)]
    if failed:
        print(f"\n{len(failed)} style(s) failed: {', '.join(failed)}")
        sys.exit(1)


if __name__ == "__main__":
    main()
