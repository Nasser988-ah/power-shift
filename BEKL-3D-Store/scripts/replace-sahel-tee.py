"""Replace Sahel Crew Tee (oxford.webp) with a clean men's garment-only shirt."""
from PIL import Image
from pathlib import Path
import urllib.request, io, re

OUT = Path(r"E:\3d web\BEKL-3D-Store\public\images\mens\cutouts")
SCENE, DETAIL = OUT / "scene", OUT / "detail"
UA = {"User-Agent": "Mozilla/5.0", "Referer": "https://pngimg.com/"}

# Curated garment-only shirt / polo candidates (no person)
CANDIDATES = [
    "https://pngimg.com/uploads/polo_shirt/polo_shirt_PNG20.png",
    "https://pngimg.com/uploads/polo_shirt/polo_shirt_PNG18.png",
    "https://pngimg.com/uploads/polo_shirt/polo_shirt_PNG15.png",
    "https://pngimg.com/uploads/polo_shirt/polo_shirt_PNG12.png",
    "https://pngimg.com/uploads/polo_shirt/polo_shirt_PNG10.png",
    "https://pngimg.com/uploads/polo_shirt/polo_shirt_PNG8.png",
    "https://pngimg.com/uploads/polo_shirt/polo_shirt_PNG5.png",
    "https://pngimg.com/uploads/tshirt/tshirt_PNG5430.png",
    "https://pngimg.com/uploads/tshirt/tshirt_PNG5425.png",
    "https://pngimg.com/uploads/tshirt/tshirt_PNG5415.png",
    "https://pngimg.com/uploads/tshirt/tshirt_PNG5405.png",
    "https://pngimg.com/uploads/tshirt/tshirt_PNG5395.png",
    "https://pngimg.com/uploads/tshirt/tshirt_PNG5380.png",
    "https://pngimg.com/uploads/tshirt/tshirt_PNG5360.png",
    "https://pngimg.com/uploads/tshirt/tshirt_PNG5340.png",
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


def score_im(im):
    """Higher is better: upright garment, enough light pixels, not a black graphic."""
    aspect = im.height / max(im.width, 1)
    if aspect < 1.05 or aspect > 1.9:
        return -1
    px = [p for p in im.getdata() if p[3] > 40]
    if len(px) < 2000:
        return -1
    mean = sum(p[0] + p[1] + p[2] for p in px) / (3 * len(px))
    if mean < 55:
        return -1  # dark graphic / back-of-black-tee
    # Prefer classic tall shirt proportions
    return aspect * 2.0 + mean / 120.0 + im.height / 2000.0


def save_pair(key, im, tag):
    bbox = im.getbbox()
    if bbox:
        im = im.crop(bbox)
    s = im.copy()
    s.thumbnail((420, 520), Image.Resampling.LANCZOS)
    d = im.copy()
    d.thumbnail((720, 960), Image.Resampling.LANCZOS)
    s.save(SCENE / f"{key}.webp", "WEBP", quality=80, method=4)
    d.save(DETAIL / f"{key}.webp", "WEBP", quality=88, method=4)
    print("OK", key, "from", tag, "scene", s.size, "detail", d.size)


best = None
for url in CANDIDATES:
    try:
        im = fetch(url)
        if not alpha_ok(im) or min(im.size) < 280:
            print("skip", url.split("/")[-1], "size/alpha")
            continue
        sc = score_im(im)
        print("cand", url.split("/")[-1], im.size, "score", round(sc, 2))
        if sc < 0:
            continue
        if best is None or sc > best[0]:
            best = (sc, url, im.copy())
    except Exception as e:
        print("fail", url.split("/")[-1], type(e).__name__)

if best is None:
    # scrape polo / tshirt galleries
    urls = []
    for page in (
        "https://pngimg.com/images/clothing/polo",
        "https://pngimg.com/images/clothing/tshirt",
    ):
        try:
            urls.extend(get_urls(page))
        except Exception as e:
            print("page fail", page, e)
    print("scraped", len(urls))
    for url in urls[:70]:
        name = url.lower()
        if any(x in name for x in ("woman", "girl", "man_", "model")):
            continue
        try:
            im = fetch(url)
            if not alpha_ok(im) or min(im.size) < 300:
                continue
            sc = score_im(im)
            if sc < 0:
                continue
            print("cand", url.split("/")[-1], im.size, "score", round(sc, 2))
            if best is None or sc > best[0]:
                best = (sc, url, im.copy())
        except Exception:
            continue

if best:
    save_pair("oxford", best[2], best[1].split("/")[-1])
else:
    print("NONE")
