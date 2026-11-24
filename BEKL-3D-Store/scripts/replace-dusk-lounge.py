"""Replace Dusk Lounge (crew.webp) with a men's garment-only sweatshirt/tee."""
from PIL import Image
from pathlib import Path
import urllib.request, io, re

OUT = Path(r"E:\3d web\BEKL-3D-Store\public\images\mens\cutouts")
SCENE, DETAIL = OUT / "scene", OUT / "detail"
UA = {"User-Agent": "Mozilla/5.0", "Referer": "https://pngimg.com/"}

# Prefer known men's sweatshirt / hoodie garment-only cutouts
CANDIDATES = [
    "https://pngimg.com/uploads/sweater/sweater_PNG50.png",
    "https://pngimg.com/uploads/sweater/sweater_PNG48.png",
    "https://pngimg.com/uploads/sweater/sweater_PNG45.png",
    "https://pngimg.com/uploads/sweater/sweater_PNG40.png",
    "https://pngimg.com/uploads/sweater/sweater_PNG35.png",
    "https://pngimg.com/uploads/sweater/sweater_PNG30.png",
    "https://pngimg.com/uploads/sweater/sweater_PNG25.png",
    "https://pngimg.com/uploads/sweater/sweater_PNG20.png",
    "https://pngimg.com/uploads/sweater/sweater_PNG15.png",
    "https://pngimg.com/uploads/sweater/sweater_PNG10.png",
    "https://pngimg.com/uploads/hoodie/hoodie_PNG40.png",
    "https://pngimg.com/uploads/hoodie/hoodie_PNG35.png",
    "https://pngimg.com/uploads/hoodie/hoodie_PNG30.png",
    "https://pngimg.com/uploads/hoodie/hoodie_PNG25.png",
    "https://pngimg.com/uploads/hoodie/hoodie_PNG20.png",
]


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
    print("OK", key, "from", tag, "scene", s.size, "detail", d.size)


def try_url(url):
    im = fetch(url)
    if not alpha_ok(im) or min(im.size) < 280:
        raise ValueError("small/opaque")
    aspect = im.height / max(im.width, 1)
    if aspect > 2.2:
        raise ValueError(f"too tall person-like {aspect:.2f}")
    # skip mostly-black stylized graphics
    px = [p for p in im.getdata() if p[3] > 40]
    if len(px) < 1500:
        raise ValueError("too few pixels")
    mean = sum(p[0] + p[1] + p[2] for p in px) / (3 * len(px))
    if mean < 35:
        raise ValueError("too dark graphic")
    return im, mean, aspect


# 1) curated list
for url in CANDIDATES:
    try:
        im, mean, aspect = try_url(url)
        save_pair("crew", im, url.split("/")[-1])
        print("mean", round(mean, 1), "aspect", round(aspect, 2))
        break
    except Exception as e:
        print("fail", url.split("/")[-1], e)
else:
    # 2) scrape sweater / hoodie galleries
    urls = []
    for page in (
        "https://pngimg.com/images/clothing/sweater",
        "https://pngimg.com/images/clothing/hoodie",
    ):
        try:
            urls.extend(get_urls(page))
            print("page", page, "count", len(urls))
        except Exception as e:
            print("page fail", page, e)
    for url in urls:
        name = url.lower()
        if any(x in name for x in ("woman", "girl", "dress")):
            continue
        try:
            im, mean, aspect = try_url(url)
            if aspect < 1.0 or aspect > 1.85:
                continue
            save_pair("crew", im, url.split("/")[-1])
            print("mean", round(mean, 1), "aspect", round(aspect, 2))
            break
        except Exception:
            continue
    else:
        print("NONE")
