from pathlib import Path
import re

root = Path(r"E:/power shift")
skip = {
    root / "index.html",
    root / "ar" / "index.html",
    root / "reviews" / "index.html",
    root / "ar" / "reviews" / "index.html",
    root / "scripts" / "make-reviews-pages.py",
}

about_re = re.compile(
    r'^([ \t]*)<a href="([^"]+)"([^>]*data-i18n="nav\.about"[^>]*)>(.*?)</a>\s*$',
    re.M,
)
footer_about_re = re.compile(
    r'^([ \t]*)<a href="((?:/ar)?/about)"([^>]*)>(About|من نحن)</a>\s*$',
    re.M,
)


def reviews_href(about_href: str) -> str:
    if about_href.startswith("/ar"):
        return "/ar/reviews"
    return "/reviews"


def reviews_label(about_href: str, about_text: str) -> str:
    if about_href.startswith("/ar") or about_text == "من نحن":
        return "آراء العملاء"
    return "Reviews"


def insert_nav(text: str) -> str:
    if 'data-i18n="nav.reviews"' in text:
        return text

    def repl(match):
        indent, href, attrs, label = match.groups()
        current = ' aria-current="page"' if "aria-current" in attrs else ""
        review = (
            f'{indent}<a href="{reviews_href(href)}" data-i18n="nav.reviews"{current and ""}>'
            f"{reviews_label(href, label)}</a>"
        )
        return f"{match.group(0)}\n{review}"

    return about_re.sub(repl, text)


def insert_footer(text: str) -> str:
    if re.search(r'href="/(?:ar/)?reviews"', text):
        return text

    def repl(match):
        indent, href, attrs, label = match.groups()
        review = f'{indent}<a href="{reviews_href(href)}">{reviews_label(href, label)}</a>'
        return f"{match.group(0)}\n{review}"

    return footer_about_re.sub(repl, text)


changed = []
for path in root.rglob("*.html"):
    if path in skip or "node_modules" in path.parts:
        continue
    original = path.read_text(encoding="utf-8")
    updated = insert_footer(insert_nav(original))
    if updated != original:
        path.write_text(updated, encoding="utf-8")
        changed.append(str(path.relative_to(root)))

print(f"updated {len(changed)} files")
for item in changed:
    print(item)
