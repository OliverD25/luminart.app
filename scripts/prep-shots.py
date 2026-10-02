"""Prepare a product page's screenshots for the web.

Usage:
    python scripts/prep-shots.py <label> <input_dir> <hero_file>

<label>       the site folder under sites/ (for example cabinetos)
<input_dir>   a folder of PNG screenshots, usually ../_io/<label>-screenshots
<hero_file>   the file name in that folder that becomes the hero image

Writes, overwriting what is there:
    sites/<label>/public/images/<name>.webp   hero 1600 wide, the others 1200 wide
    sites/<label>/public/images/og.jpg        1200x630 from the hero, for link previews
    src/static/images/<label>.webp            560x350 crop of the hero, the card on luminart.app

Needs Pillow (python -m pip install pillow). Keeps the aspect ratio of every image;
the page's CSS frames assume 1920x1020 windows, so crop screenshots to the window.
"""
import sys
from pathlib import Path

from PIL import Image

if len(sys.argv) != 4:
    sys.exit(__doc__)

label, input_dir, hero_file = sys.argv[1], Path(sys.argv[2]), sys.argv[3]
repo = Path(__file__).resolve().parent.parent
page_images = repo / "sites" / label / "public" / "images"
card_images = repo / "src" / "static" / "images"
page_images.mkdir(parents=True, exist_ok=True)
card_images.mkdir(parents=True, exist_ok=True)


def scaled(image, width):
    w, h = image.size
    if w <= width:
        return image
    return image.resize((width, round(h * width / w)), Image.LANCZOS)


def report(path, image):
    print(f"{path.relative_to(repo)}  {image.size[0]}x{image.size[1]}  {path.stat().st_size // 1024} KB")


sources = sorted(input_dir.glob("*.png"))
if not sources:
    sys.exit(f"no PNG files in {input_dir}")
if not (input_dir / hero_file).exists():
    sys.exit(f"{hero_file} is not in {input_dir}")

for src in sources:
    image = Image.open(src).convert("RGB")
    is_hero = src.name == hero_file
    # The output name drops a leading "01-" style number, so 01-dual-pane.png becomes dual-pane.webp.
    stem = "hero" if is_hero else src.stem.split("-", 1)[-1] if src.stem[:2].isdigit() else src.stem
    out = page_images / f"{stem}.webp"
    page = scaled(image, 1600 if is_hero else 1200)
    page.save(out, "WEBP", quality=82, method=6)
    report(out, page)

    if is_hero:
        w, h = image.size
        crop_w = min(w, round(h * 1.6))
        card = image.crop((0, 0, crop_w, round(crop_w / 1.6))).resize((560, 350), Image.LANCZOS)
        out = card_images / f"{label}.webp"
        card.save(out, "WEBP", quality=82, method=6)
        report(out, card)

        og = scaled(image, 1200)
        og = og.crop((0, 0, 1200, min(630, og.size[1])))
        out = page_images / "og.jpg"
        og.save(out, "JPEG", quality=88, optimize=True)
        report(out, og)
