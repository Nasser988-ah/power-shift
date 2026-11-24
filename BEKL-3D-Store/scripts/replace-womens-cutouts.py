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


def save_pair(key, im):
    bbox = im.getbbox()
    if bbox:
        im = im.crop(bbox)
    s = im.copy()
    s.thumbnail((420, 520), Image.Resampling.LANCZOS)
    d = im.copy()
    d.thumbnail((720, 960), Image.Resampling.LANCZOS)
    s.save(SCENE / f"{key}.webp", "WEBP", quality=78, method=4)
    d.save(DETAIL / f"{key}.webp", "WEBP", quality=85, method=4)
    print("OK", key, "scene", s.size, (SCENE / f"{key}.webp").stat().st_size // 1024, "KB")


def pick_best(urls, min_aspect=1.15, prefer_keywords=None, avoid_keywords=None, limit=40):
    prefer_keywords = prefer_keywords or []
    avoid_keywords = avoid_keywords or ["woman", "girl", "dress", "skirt"]
    best = None
    checked = 0
    for url in urls:
        name = url.lower()
        if any(a in name for a in avoid_keywords):
            continue
        try:
            im = fetch(url)
            checked += 1
            if not alpha_ok(im) or min(im.size) < 280:
                continue
            aspect = im.height / im.width
            if aspect < min_aspect:
                continue
            score = aspect + im.height / 2500.0
            if any(k in name for k in prefer_keywords):
                score += 0.45
            if best is None or score > best[0]:
                best = (score, url, im.copy())
                print(" candidate", url.split("/")[-1], im.size, round(aspect, 2))
            if checked >= limit and best:
                break
        except Exception:
            pass
    return best


trench_urls = []
for page in (
    "https://pngimg.com/images/clothing/coat",
    "https://pngimg.com/images/clothing/jacket",
):
    try:
        trench_urls += get_urls(page)
    except Exception as e:
        print("page fail", page, e)
print("trench urls", len(trench_urls))
best = pick_best(trench_urls, min_aspect=1.2, prefer_keywords=["coat", "trench", "overcoat"])
if best:
    print("trench src", best[1].split("/")[-1])
    save_pair("trench", best[2])

jacket_urls = get_urls("https://pngimg.com/images/clothing/leather_jacket")
print("leather urls", len(jacket_urls))
best = pick_best(jacket_urls, min_aspect=1.0, prefer_keywords=["leather", "jacket", "bomber"])
if best:
    print("bomber src", best[1].split("/")[-1])
    save_pair("bomber", best[2])

shirt_urls = get_urls("https://pngimg.com/images/clothing/shirt")
print("shirt urls", len(shirt_urls))
best = pick_best(shirt_urls, min_aspect=1.15, prefer_keywords=["shirt"])
if best:
    print("oxford src", best[1].split("/")[-1])
    save_pair("oxford", best[2])
