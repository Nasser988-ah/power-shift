# BEKL 3D Store

Independent immersive 3D fashion boutique for **BEKL** — modern Egyptian fashion.

## Run

```bash
cd BEKL-3D-Store
npm install
npm run dev
```

Open [http://127.0.0.1:5201/](http://127.0.0.1:5201/)

## Features

- 20 perimeter displays in one walkable cream/brown showroom
- 4 real products + clearly labeled demo placeholders (not for sale)
- All Products grid with camera transitions to each piece
- Progressive WebP scene thumbs; detail images load with the product panel
- WASD / drag look / mobile joysticks, cart, demo-only checkout

## Edit catalogue & layout

All products, placeholders, categories, and pedestal positions live in:

`src/data/products.js`

## Assets

```
public/images/mens/cutouts/scene/   # lightweight WebP for the room
public/images/mens/cutouts/detail/  # higher-res WebP for panels
```
