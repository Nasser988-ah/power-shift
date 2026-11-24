from PIL import Image
from pathlib import Path
import urllib.request, io, re

OUT = Path(r"E:\3d web\BEKL-3D-Store\public\images\mens\cutouts")
SCENE, DETAIL = OUT / "scene", OUT / "detail"
UA = {"User-Agent": "Mozilla/5.0", "Referer": "https://pngimg.com/"}


def fetch(url):
    req = urllib.request.Request(url, headers=UA)
    return Image.open(io.BytesIO(urllib.request.urlopen(req, timeout=40).read())).convert("RGBA")


def get_urls(page):
    req = urllib.request.Request(page, headers=UA)
    html = urllib.request.urlopen(req, timeout=40).read().decode("utf-8", "ignore")
    return list(dict.fromkeys(re.findall(r"https://pngimg\.com/uploads/[^\"']+\.png", html)))


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
    print("OK", key, tag, s.size)


urls = get_urls("https://pngimg.com/images/clothing/tshirt")
for url in urls:
    name = url.lower()
    if any(x in name for x in ("man_", "woman", "girl", "boy", "model")):
        continue
    try:
        im = fetch(url)
        if min(im.size) < 320:
            continue
        aspect = im.height / max(im.width, 1)
        if aspect < 1.08 or aspect > 1.5:
            continue
        px = list(im.getdata())
        opaque = [p for p in px if p[3] > 40]
        if len(opaque) < 2000:
            continue
        mean = sum(p[0] + p[1] + p[2] for p in opaque) / (3 * len(opaque))
        if mean < 50:
            continue  # skip black graphic shirts
        save_pair("oxford", im, url.split("/")[-1])
        print("mean", round(mean, 1), "aspect", round(aspect, 2))
        break
    except Exception:
        continue
else:
    print("NONE")
