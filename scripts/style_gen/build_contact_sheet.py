"""
Assembles public/models/comparison/contact_sheet.png from every style's
three_quarter.png (same camera angle across all styles, per spec), each
labeled. Plain Pillow - runs in regular Python, not Blender.
"""
import os

from PIL import Image, ImageDraw, ImageFont

THUMB = 400
LABEL_H = 40
COLS = 4


def build_contact_sheet(styles, models_dir):
    cells = []
    for style_key, label in styles:
        img_path = os.path.join(models_dir, style_key, "three_quarter.png")
        if os.path.isfile(img_path):
            img = Image.open(img_path).convert("RGB").resize((THUMB, THUMB))
        else:
            img = Image.new("RGB", (THUMB, THUMB), (200, 60, 60))
        cells.append((label, img))

    rows = (len(cells) + COLS - 1) // COLS
    sheet_w = COLS * THUMB
    sheet_h = rows * (THUMB + LABEL_H)
    sheet = Image.new("RGB", (sheet_w, sheet_h), (245, 245, 247))
    draw = ImageDraw.Draw(sheet)
    try:
        font = ImageFont.truetype("arial.ttf", 22)
    except Exception:
        font = ImageFont.load_default()

    for i, (label, img) in enumerate(cells):
        col, row = i % COLS, i // COLS
        x, y = col * THUMB, row * (THUMB + LABEL_H)
        sheet.paste(img, (x, y))
        bbox = draw.textbbox((0, 0), label, font=font)
        text_w = bbox[2] - bbox[0]
        draw.text((x + (THUMB - text_w) / 2, y + THUMB + 6), label, fill=(20, 20, 20), font=font)

    out_dir = os.path.join(models_dir, "comparison")
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, "contact_sheet.png")
    sheet.save(out_path, "PNG")
    return out_path


if __name__ == "__main__":
    import sys

    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    from run_all import STYLES, MODELS_DIR

    print(build_contact_sheet(STYLES, MODELS_DIR))
