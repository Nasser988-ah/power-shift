"""Download men's clothing PNGs that already have transparent backgrounds."""
from __future__ import annotations

import io
import urllib.request
from pathlib import Path

from PIL import Image

OUT = Path(__file__).resolve().parents[1] / "public" / "images" / "mens" / "cutouts"
OUT.mkdir(parents=True, exist_ok=True)

# PNGimg / similar free transparent cutouts (already alpha). Prefer clean product shots.
SOURCES = {
    "shirt.png": [
        "https://pngimg.com/uploads/dress_shirt/dress_shirt_PNG8081.png",
        "https://pngimg.com/uploads/dress_shirt/dress_shirt_PNG8117.png",
    ],
    "jacket.png": [
        "https://pngimg.com/uploads/leather_jacket/leather_jacket_PNG14.png",
        "https://pngimg.com/uploads/leather_jacket/leather_jacket_PNG40.png",
    ],
    "jeans.png": [
        "https://pngimg.com/uploads/jeans/jeans_PNG5767.png",
        "https://pngimg.com/uploads/jeans/jeans_PNG5770.png",
    ],
    "hoodie.png": [
        "https://pngimg.com/uploads/hoodie/hoodie_PNG30.png",
        "https://pngimg.com/uploads/hoodie/hoodie_PNG28.png",
        "https://pngimg.com/uploads/hoodie/hoodie_PNG19.png",
    ],
}

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"


def fetch(url: str) -> Image.Image:
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Referer": "https://pngimg.com/"})
    with urllib.request.urlopen(req, timeout=60) as resp:
        data = resp.read()
    return Image.open(io.BytesIO(data))


def ensure_alpha(img: Image.Image) -> Image.Image:
    rgba = img.convert("RGBA")
    # If somehow opaque, leave as-is; caller checks transparency ratio
    return rgba


def transparency_ratio(img: Image.Image) -> float:
    a = img.getchannel("A")
    hist = a.histogram()
    transparent = sum(hist[:32])  # nearly transparent
    return transparent / max(1, img.width * img.height)


def crop_and_fit(img: Image.Image, max_h: int = 1100) -> Image.Image:
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
    img.thumbnail((900, max_h), Image.Resampling.LANCZOS)
    return img


def main() -> None:
    for name, urls in SOURCES.items():
        out = OUT / name
        ok = False
        for url in urls:
            print(f"→ {name} try {url}")
            try:
                img = ensure_alpha(fetch(url))
                ratio = transparency_ratio(img)
                print(f"  size={img.size} alpha_ratio={ratio:.2f}")
                if ratio < 0.05:
                    print("  skip: little transparency")
                    continue
                cut = crop_and_fit(img)
                cut.save(out, "PNG", optimize=True)
                print(f"  saved {out} ({out.stat().st_size // 1024} KB)")
                ok = True
                break
            except Exception as e:
                print(f"  FAIL {e}")
        if not ok:
            print(f"!! no good source for {name}")


if __name__ == "__main__":
    main()
