"""Replace feminine / model cutouts with garment-only men's assets."""
from PIL import Image
from pathlib import Path
import urllib.request, io

OUT = Path(r"E:\3d web\BEKL-3D-Store\public\images\mens\cutouts")
SCENE, DETAIL = OUT / "scene", OUT / "detail"
UA = {"User-Agent": "Mozilla/5.0", "Referer": "https://pngimg.com/"}

# Curated garment-only PNGimg URLs (no full person / face)
CANDIDATES = {
    "trench": [
        "https://pngimg.com/uploads/coat/coat_PNG45.png",
        "https://pngimg.com/uploads/coat/coat_PNG41.png",
        "https://pngimg.com/uploads/coat/coat_PNG39.png",
        "https://pngimg.com/uploads/coat/coat_PNG36.png",
        "https://pngimg.com/uploads/coat/coat_PNG33.png",
        "https://pngimg.com/uploads/coat/coat_PNG28.png",
        "https://pngimg.com/uploads/coat/coat_PNG24.png",
        "https://pngimg.com/uploads/jacket/jacket_PNG8056.png",
        "https://pngimg.com/uploads/jacket/jacket_PNG8048.png",
    ],
    "bomber": [
        "https://pngimg.com/uploads/leather_jacket/leather_jacket_PNG45.png",
        "https://pngimg.com/uploads/leather_jacket/leather_jacket_PNG41.png",
        "https://pngimg.com/uploads/leather_jacket/leather_jacket_PNG37.png",
        "https://pngimg.com/uploads/leather_jacket/leather_jacket_PNG33.png",
        "https://pngimg.com/uploads/leather_jacket/leather_jacket_PNG28.png",
        "https://pngimg.com/uploads/jacket/jacket_PNG8035.png",
        "https://pngimg.com/uploads/jacket/jacket_PNG8028.png",
    ],
    "oxford": [
        "https://pngimg.com/uploads/dress_shirt/dress_shirt_PNG20.png",
        "https://pngimg.com/uploads/dress_shirt/dress_shirt_PNG16.png",
        "https://pngimg.com/uploads/dress_shirt/dress_shirt_PNG12.png",
        "https://pngimg.com/uploads/dress_shirt/dress_shirt_PNG8.png",
        "https://pngimg.com/uploads/shirt/shirt_PNG6513.png",
        "https://pngimg.com/uploads/shirt/shirt_PNG6508.png",
        "https://pngimg.com/uploads/shirt/shirt_PNG6495.png",
    ],
}


def fetch(url):
    req = urllib.request.Request(url, headers=UA)
    return Image.open(io.BytesIO(urllib.request.urlopen(req, timeout=40).read())).convert("RGBA")


def alpha_ok(im):
    h = im.getchannel("A").histogram()
    return sum(h[:32]) / (im.width * im.height) > 0.08


def save_pair(key, im, tag):
    bbox = im.getbbox()
    if bbox:
        im = im.crop(bbox)
    s = im.copy()
    s.thumbnail((420, 520), Image.Resampling.LANCZOS)
    d = im.copy()
    d.thumbnail((720, 960), Image.Resampling.LANCZOS)
    s.save(SCENE / f"{key}.webp", "WEBP", quality=78, method=4)
    d.save(DETAIL / f"{key}.webp", "WEBP", quality=85, method=4)
    print("OK", key, "from", tag, "scene", s.size, "detail", d.size)


for key, urls in CANDIDATES.items():
    saved = False
    for url in urls:
        try:
            im = fetch(url)
            if not alpha_ok(im) or min(im.size) < 250:
                print("skip small/opaque", url.split("/")[-1])
                continue
            # Reject very tall full-body model shots (person head-to-toe)
            aspect = im.height / max(im.width, 1)
            if aspect > 2.35:
                print("skip tall person-like", url.split("/")[-1], round(aspect, 2))
                continue
            save_pair(key, im, url.split("/")[-1])
            saved = True
            break
        except Exception as e:
            print("fail", url.split("/")[-1], e)
    if not saved:
        print("NONE for", key)
