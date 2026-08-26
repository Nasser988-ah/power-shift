export function workStem(imagePath) {
  return String(imagePath || "").replace(/\.(jpe?g|png|webp)$/i, "");
}

export function workSrcset(stem) {
  return `${stem}-480.webp 480w, ${stem}-800.webp 800w, ${stem}-1200.webp 1200w, ${stem}-2160.webp 2160w`;
}

export function workPictureHTML({
  image,
  alt,
  eager = false,
  sizes = "(max-width: 768px) 92vw, 820px",
  width = 1200,
  height = 750,
} = {}) {
  const stem = workStem(image);
  const loading = eager ? "eager" : "lazy";
  const priority = eager ? ' fetchpriority="high"' : "";
  return `<picture>
    <source type="image/webp" srcset="${workSrcset(stem)}" sizes="${sizes}">
    <img src="${stem}.webp" alt="${alt}" width="${width}" height="${height}" loading="${loading}" decoding="async"${priority}>
  </picture>`;
}
