# Power Shift Mall

An aerial shopping-court prototype. Fifteen houses sit around a central plaza. BEKL, the clothing house, is the only one you can enter.

## Run

```bash
npm install
npm run dev
```

Open the local Vite URL. The mall is `/`. BEKL is `/bekl`.

## Edit the court and the collection

- Houses: `src/data/houses.ts`
- BEKL products and prices: `src/data/products.ts`
- Product photographs: `public/products/`

The bag, favorites, and guest name stay in `localStorage` on this device. There is no backend.

## Why the mall is drawn, not a live 3D scene

The court is an isometric architectural model in SVG. Brand names are real text, so they stay sharp on a phone, and the first screen does not download a 3D engine or a desktop-sized render. Product pictures are flat photographs with the studio field removed. They are not 3D models and they do not rotate.

Blender was not used for these assets. The installed Blender is 4.3.2, and the official Blender Lab MCP needs 5.1 or newer. The community Blender connection also needs the app to be open.

## Images

`scripts/key_products.py` turns the green studio photographs into transparent WebP at 960 and 520 pixels on the long edge.
