"""Place each BEKL garment on one shared ivory studio frame, with the green field removed."""

from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

SRC = Path(r"C:\Users\USER\.cursor\projects\e-power-shift-3D-project\assets")
DST = Path(r"E:\power shift 3D project\public\products")
NAMES = [
    "bekl-column-shirt",
    "bekl-sand-trouser",
    "bekl-cedar-overshirt",
    "bekl-pearl-dress",
    "bekl-dune-trouser",
    "bekl-clay-knit",
    "bekl-sable-collar",
    "bekl-atelier-tote",
    "bekl-woven-belt",
    "bekl-ivory-scarf",
]
CANVAS = (900, 1120)
PAPER = (244, 236, 227)


def cutout(path: Path) -> Image.Image:
    im = Image.open(path).convert("RGBA")
    arr = np.asarray(im).astype(np.int16)
    rgb = arr[:, :, :3]
    samples = np.stack([rgb[1, 1], rgb[1, -2], rgb[-2, 1], rgb[-2, -2], rgb[0, rgb.shape[1] // 2]])
    bg = samples.mean(axis=0)
    red, green, blue = rgb[:, :, 0], rgb[:, :, 1], rgb[:, :, 2]
    dist = np.sqrt(((rgb - bg) ** 2).sum(axis=2))
    is_green = (green > red + 12) & (green > blue + 12) & (green > 60)
    alpha = np.where(is_green | (dist < 48), 0, 255).astype(np.uint8)
    # Eat the leftover green rim.
    clear = alpha == 0
    for _ in range(3):
        pad = np.pad(clear, 1, constant_values=True)
        neighbor = np.zeros(clear.shape, dtype=bool)
        height, width = clear.shape
        for dy in (-1, 0, 1):
            for dx in (-1, 0, 1):
                if dx == 0 and dy == 0:
                    continue
                neighbor |= pad[1 + dy : 1 + dy + height, 1 + dx : 1 + dx + width]
        fringe = neighbor & (green > red + 4) & (green > blue + 4)
        clear |= fringe
        alpha[fringe] = 0
    cap = np.maximum(red, blue)
    green = np.where((green > cap) & (alpha > 0), cap, green)
    out = np.dstack([red, green, blue, alpha]).clip(0, 255).astype(np.uint8)
    image = Image.fromarray(out, "RGBA")
    bbox = image.getbbox()
    if bbox:
        image = image.crop(bbox)
    return image


def studio(cut: Image.Image, size: tuple[int, int]) -> Image.Image:
    canvas = Image.new("RGB", size, PAPER)
    # Soft floor shadow, independent of the old green shadow.
    shadow = Image.new("RGBA", size, (0, 0, 0, 0))
    ellipse = Image.new("RGBA", size, (0, 0, 0, 0))
    from PIL import ImageDraw

    draw = ImageDraw.Draw(ellipse)
    cx, cy = size[0] // 2, int(size[1] * 0.9)
    rx, ry = int(size[0] * 0.28), int(size[1] * 0.035)
    draw.ellipse((cx - rx, cy - ry, cx + rx, cy + ry), fill=(58, 46, 40, 70))
    shadow.alpha_composite(ellipse.filter(ImageFilter.GaussianBlur(radius=18)))

    limit_w = int(size[0] * 0.84)
    limit_h = int(size[1] * 0.78)
    scale = min(limit_w / cut.width, limit_h / cut.height)
    resized = cut.resize((max(1, round(cut.width * scale)), max(1, round(cut.height * scale))), Image.Resampling.LANCZOS)
    x = (size[0] - resized.width) // 2
    y = int(size[1] * 0.08) + (limit_h - resized.height) // 2
    frame = Image.new("RGBA", size, (0, 0, 0, 0))
    frame.alpha_composite(shadow)
    frame.paste(resized, (x, y), resized)
    canvas.paste(frame, mask=frame.getchannel("A"))
    return canvas


def kill_green(image: Image.Image) -> Image.Image:
    """Fill leftover screen-green holes so the weave and seams match the studio paper."""
    arr = np.asarray(image).copy()
    red = arr[:, :, 0].astype(np.int16)
    green = arr[:, :, 1].astype(np.int16)
    blue = arr[:, :, 2].astype(np.int16)
    spill = (green > red + 8) & (green > blue + 8) & (green > 35)
    arr[spill, 0] = PAPER[0]
    arr[spill, 1] = PAPER[1]
    arr[spill, 2] = PAPER[2]
    return Image.fromarray(arr, "RGB")


def main() -> None:
    DST.mkdir(parents=True, exist_ok=True)
    for name in NAMES:
        src = next(p for p in (SRC / f"{name}.jpg", SRC / f"{name}.png") if p.exists())
        cut = cutout(src)
        large = kill_green(studio(cut, CANVAS))
        small = large.resize((450, 560), Image.Resampling.LANCZOS)
        large.save(DST / f"{name}-960.webp", "WEBP", quality=86, method=6)
        small.save(DST / f"{name}-520.webp", "WEBP", quality=82, method=6)
        print(name, flush=True)


if __name__ == "__main__":
    main()
