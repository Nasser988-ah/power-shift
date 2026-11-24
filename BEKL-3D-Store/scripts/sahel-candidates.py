from PIL import Image
from pathlib import Path
import urllib.request, io, re

TMP = Path(r"E:\3d web\BEKL-3D-Store\public\images\mens\cutouts\_sahel")
TMP.mkdir(exist_ok=True)
UA = {"User-Agent": "Mozilla/5.0", "Referer": "https://pngimg.com/"}


def fetch(url):
    req = urllib.request.Request(url, headers=UA)
    return Image.open(io.BytesIO(urllib.request.urlopen(req, timeout=40).read())).convert("RGBA")


def get_urls(page):
    req = urllib.request.Request(page, headers=UA)
    html = urllib.request.urlopen(req, timeout=40).read().decode("utf-8", "ignore")
    return list(dict.fromkeys(re.findall(r"https://pngimg\.com/uploads/[^\"']+\.png", html)))


urls = []
for page in (
    "https://pngimg.com/images/clothing/tshirt",
    "https://pngimg.com/images/clothing/sweater",
):
    try:
        u = get_urls(page)
        print(page, len(u))
        urls.extend(u)
    except Exception as e:
        print("fail", page, e)

n = 0
for url in urls:
    name = url.split("/")[-1]
    low = name.lower()
    if any(x in low for x in ("woman", "girl", "man_", "boy", "model")):
        continue
    try:
        im = fetch(url)
        if min(im.size) < 320:
            continue
        aspect = im.height / max(im.width, 1)
        # garment-only shirts are usually not ultra-tall full-body
        if aspect < 1.05 or aspect > 1.65:
            continue
        bbox = im.getbbox()
        if bbox:
            im = im.crop(bbox)
        im.thumbnail((420, 560), Image.Resampling.LANCZOS)
        out = TMP / f"{n:02d}_{name.replace('.png', '.webp')}"
        im.save(out, "WEBP", quality=82, method=4)
        print("saved", out.name, im.size, round(aspect, 2))
        n += 1
        if n >= 12:
            break
    except Exception as e:
        print("skip", name, type(e).__name__)

print("total", n)
