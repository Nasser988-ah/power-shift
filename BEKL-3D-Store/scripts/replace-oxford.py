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
    print("OK", key, tag, s.size, d.size)


pages = [
    "https://pngimg.com/images/clothes/shirt",
    "https://pngimg.com/images/clothing/tshirt",
    "https://pngimg.com/images/clothing/t_shirt",
]
urls = []
for p in pages:
    try:
        u = get_urls(p)
        print(p, len(u))
        urls.extend(u)
    except Exception as e:
        print("fail page", p, e)

# Prefer dress/shirt assets; skip woman/model naming
urls = [u for u in urls if "woman" not in u.lower() and "girl" not in u.lower()]
print("urls", len(urls))

best = None
for url in urls[:80]:
    try:
        im = fetch(url)
        if not alpha_ok(im) or min(im.size) < 280:
            continue
        aspect = im.height / max(im.width, 1)
        if aspect < 1.05 or aspect > 2.2:
            continue
        score = aspect + im.height / 2200
        if "shirt" in url.lower():
            score += 0.3
        if best is None or score > best[0]:
            best = (score, url, im.copy())
            print("cand", url.split("/")[-1], im.size, round(aspect, 2))
    except Exception:
        pass

if best:
    save_pair("oxford", best[2], best[1].split("/")[-1])
else:
    print("NONE")
