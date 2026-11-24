from PIL import Image
from pathlib import Path
import urllib.request, io

TMP = Path(r"E:\3d web\BEKL-3D-Store\public\images\mens\cutouts\_candidates")
TMP.mkdir(exist_ok=True)
UA = {"User-Agent": "Mozilla/5.0", "Referer": "https://pngimg.com/"}

URLS = [
    # coats / overcoats
    "https://pngimg.com/uploads/coat/coat_PNG5.png",
    "https://pngimg.com/uploads/coat/coat_PNG8.png",
    "https://pngimg.com/uploads/coat/coat_PNG12.png",
    "https://pngimg.com/uploads/coat/coat_PNG15.png",
    "https://pngimg.com/uploads/coat/coat_PNG18.png",
    "https://pngimg.com/uploads/coat/coat_PNG22.png",
    "https://pngimg.com/uploads/coat/coat_PNG30.png",
    "https://pngimg.com/uploads/coat/coat_PNG50.png",
    "https://pngimg.com/uploads/coat/coat_PNG55.png",
    "https://pngimg.com/uploads/coat/coat_PNG60.png",
    # leather / bomber
    "https://pngimg.com/uploads/leather_jacket/leather_jacket_PNG1.png",
    "https://pngimg.com/uploads/leather_jacket/leather_jacket_PNG5.png",
    "https://pngimg.com/uploads/leather_jacket/leather_jacket_PNG10.png",
    "https://pngimg.com/uploads/leather_jacket/leather_jacket_PNG15.png",
    "https://pngimg.com/uploads/leather_jacket/leather_jacket_PNG20.png",
    "https://pngimg.com/uploads/leather_jacket/leather_jacket_PNG25.png",
    "https://pngimg.com/uploads/leather_jacket/leather_jacket_PNG30.png",
    "https://pngimg.com/uploads/leather_jacket/leather_jacket_PNG35.png",
    "https://pngimg.com/uploads/leather_jacket/leather_jacket_PNG40.png",
    # shirts
    "https://pngimg.com/uploads/dress_shirt/dress_shirt_PNG1.png",
    "https://pngimg.com/uploads/dress_shirt/dress_shirt_PNG2.png",
    "https://pngimg.com/uploads/dress_shirt/dress_shirt_PNG3.png",
    "https://pngimg.com/uploads/dress_shirt/dress_shirt_PNG4.png",
    "https://pngimg.com/uploads/dress_shirt/dress_shirt_PNG5.png",
    "https://pngimg.com/uploads/shirt/shirt_PNG1.png",
    "https://pngimg.com/uploads/shirt/shirt_PNG2.png",
    "https://pngimg.com/uploads/shirt/shirt_PNG3.png",
    "https://pngimg.com/uploads/shirt/shirt_PNG4.png",
    "https://pngimg.com/uploads/shirt/shirt_PNG5.png",
]


def fetch(url):
    req = urllib.request.Request(url, headers=UA)
    return Image.open(io.BytesIO(urllib.request.urlopen(req, timeout=25).read())).convert("RGBA")


for url in URLS:
    name = url.split("/")[-1].replace(".png", ".webp")
    try:
        im = fetch(url)
        bbox = im.getbbox()
        if bbox:
            im = im.crop(bbox)
        im.thumbnail((480, 640), Image.Resampling.LANCZOS)
        im.save(TMP / name, "WEBP", quality=80, method=4)
        print("saved", name, im.size)
    except Exception as e:
        print("fail", name, type(e).__name__)
