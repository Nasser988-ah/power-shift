import {
  ACESFilmicToneMapping,
  AmbientLight,
  BoxGeometry,
  Color,
  DirectionalLight,
  Group,
  HemisphereLight,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  PCFSoftShadowMap,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  Raycaster,
  Scene,
  SRGBColorSpace,
  Vector2,
  WebGLRenderer,
} from "three"
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import type { House } from "../../data/houses"
import { makeShopSign } from "./shopSign"

export type MallApi = {
  setQuery: (query: string) => void
  dispose: () => void
}

type MountOptions = {
  houses: House[]
  onSelect: (house: House) => void
}

/** Left to right along the street. BEKL stays in the middle. */
const STREET = [
  "bekl",
  "uruz",
  "nourvive",
  "luna",
  "bloom",
  "fekra",
  "raha",
  "availio",
  "zaytoon",
  "tasty",
  "mishmish",
  "fitzone",
  "pixel",
  "via",
  "haseb",
]

/** Distinct facade colours so neighbouring shops do not disappear into one white row. */
const FACADE: Record<string, string> = {
  bekl: "#8C5A32",
  uruz: "#C4A04A",
  nourvive: "#C86B73",
  luna: "#C45E8C",
  bloom: "#3F8A5C",
  fekra: "#6B5140",
  raha: "#8D6B50",
  availio: "#A67C45",
  zaytoon: "#4C7A42",
  tasty: "#C56A34",
  mishmish: "#E08A28",
  fitzone: "#3D6C96",
  pixel: "#2C3E52",
  via: "#3E6890",
  haseb: "#2E6A56",
}

const PITCH = 8.6

type Shop = {
  house: House
  index: number
  anchorX: number
  group: Group
}

export function mountMall(root: HTMLElement, options: MountOptions): MallApi {
  const byId = new Map(options.houses.map((house) => [house.id, house]))
  const lineup = STREET.map((id) => byId.get(id)).filter((house): house is House => Boolean(house))

  const scene = new Scene()
  scene.background = new Color("#d5e2da")

  const camera = new PerspectiveCamera(34, 1, 0.1, 200)
  const renderer = new WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))
  renderer.outputColorSpace = SRGBColorSpace
  renderer.toneMapping = ACESFilmicToneMapping
  renderer.toneMappingExposure = 1
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = PCFSoftShadowMap
  renderer.domElement.className = "mall-canvas"
  root.appendChild(renderer.domElement)
  const pmrem = new PMREMGenerator(renderer)
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
  pmrem.dispose()

  scene.add(new HemisphereLight("#fff8f0", "#9eb5a8", 0.42))
  scene.add(new AmbientLight("#ffffff", 0.16))
  const sun = new DirectionalLight("#fff3e2", Math.PI * 0.72)
  sun.position.set(-16, 22, 18)
  sun.castShadow = true
  sun.shadow.mapSize.set(1024, 1024)
  sun.shadow.camera.near = 2
  sun.shadow.camera.far = 80
  sun.shadow.camera.left = -40
  sun.shadow.camera.right = 40
  sun.shadow.camera.top = 30
  sun.shadow.camera.bottom = -30
  sun.shadow.bias = -0.0006
  scene.add(sun)

  const lawn = new Mesh(
    new PlaneGeometry(180, 90),
    new MeshStandardMaterial({ color: "#b7cbbd", roughness: 1 }),
  )
  lawn.rotation.x = -Math.PI / 2
  lawn.receiveShadow = true
  scene.add(lawn)

  const pavement = new Mesh(
    new PlaneGeometry(130, 22),
    new MeshStandardMaterial({ color: "#e7e2d8", roughness: 0.92 }),
  )
  pavement.rotation.x = -Math.PI / 2
  pavement.position.set(0, 0.02, 7)
  pavement.receiveShadow = true
  scene.add(pavement)

  const row = new Group()
  scene.add(row)

  const shops: Shop[] = []
  const pickable: Mesh[] = []
  let focus = Math.max(0, lineup.findIndex((house) => house.active))
  let shown = 0
  let goal = 0
  let gliding = false
  let alive = true
  let phone = false

  const loading = document.createElement("p")
  loading.className = "mall-loading"
  loading.textContent = "Placing the houses…"
  root.appendChild(loading)

  const previous = document.createElement("button")
  previous.type = "button"
  previous.className = "mall-nav is-prev"
  previous.setAttribute("aria-label", "Previous house")
  previous.textContent = "‹"
  const next = document.createElement("button")
  next.type = "button"
  next.className = "mall-nav is-next"
  next.setAttribute("aria-label", "Next house")
  next.textContent = "›"
  root.appendChild(previous)
  root.appendChild(next)

  const card = document.createElement("div")
  card.className = "mall-focus"
  const cardKicker = document.createElement("p")
  const cardName = document.createElement("strong")
  const cardMeta = document.createElement("span")
  const cardGo = document.createElement("button")
  cardGo.type = "button"
  const cardNote = document.createElement("p")
  cardNote.className = "mall-note"
  cardNote.textContent = "you can only test BEKL store"
  card.append(cardKicker, cardName, cardMeta, cardGo, cardNote)
  root.appendChild(card)

  function render() {
    renderer.render(scene, camera)
  }

  function frameCamera() {
    const width = Math.max(renderer.domElement.clientWidth || root.clientWidth || 1, 1)
    phone = width < 800
    let height = renderer.domElement.clientHeight
    if (height < 2) {
      height = phone ? window.innerHeight : root.clientHeight || 1
    }
    camera.aspect = width / height
    camera.fov = phone ? 33 : 30
    camera.position.set(0, phone ? 3.55 : 3.15, phone ? 27.5 : 15.5)
    camera.lookAt(0, phone ? 0.95 : 2.3, 0)
    camera.updateProjectionMatrix()
    renderer.setSize(width, height, false)
  }

  function worldPerPixel() {
    const distance = camera.position.length()
    const height = 2 * Math.tan((camera.fov * Math.PI) / 360) * distance
    return (height * camera.aspect) / Math.max(renderer.domElement.clientWidth, 1)
  }

  function updateChrome() {
    const shop = shops[focus]
    if (!shop) return
    for (const entry of shops) {
      const away = Math.abs(entry.index - focus)
      entry.group.position.y += ((away === 0 ? 0.08 : 0) - entry.group.position.y) * 1
    }
    cardKicker.textContent = `${focus + 1} of ${shops.length}`
    cardName.textContent = shop.house.name
    cardMeta.textContent = shop.house.category
    const open = shop.house.active
    cardGo.textContent = open ? "Enter the house" : "Opening soon"
    cardGo.classList.toggle("is-open", open)
    cardGo.classList.toggle("is-soon", !open)
    cardNote.hidden = open
  }

  function glide() {
    if (!gliding || !alive) return
    shown += (goal - shown) * 0.22
    row.position.x = shown
    render()
    if (Math.abs(goal - shown) < 0.04) {
      shown = goal
      row.position.x = goal
      gliding = false
      render()
      return
    }
    requestAnimationFrame(glide)
  }

  function focusOn(index: number, immediate = false) {
    if (!shops.length) return
    focus = Math.min(shops.length - 1, Math.max(0, index))
    goal = -shops[focus].anchorX
    updateChrome()
    if (immediate) {
      shown = goal
      row.position.x = goal
      gliding = false
      render()
      return
    }
    if (!gliding) {
      gliding = true
      requestAnimationFrame(glide)
    }
  }

  function step(delta: number) {
    focusOn(focus + delta)
  }

  const pointer = new Vector2()
  const raycaster = new Raycaster()
  let dragOrigin = 0
  let dragMoved = 0
  let dragging = false

  function pick(event: PointerEvent) {
    const rect = renderer.domElement.getBoundingClientRect()
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
    raycaster.setFromCamera(pointer, camera)
    const hit = raycaster.intersectObjects(pickable, false)[0]
    const id = hit?.object.userData.houseId as string | undefined
    return shops.find((shop) => shop.house.id === id)
  }

  function onPointerDown(event: PointerEvent) {
    dragging = true
    gliding = false
    dragMoved = 0
    dragOrigin = event.clientX
    renderer.domElement.setPointerCapture(event.pointerId)
  }

  function onPointerMove(event: PointerEvent) {
    if (!dragging) return
    const dx = event.clientX - dragOrigin
    dragOrigin = event.clientX
    dragMoved += Math.abs(dx)
    shown += dx * worldPerPixel()
    goal = shown
    row.position.x = shown
    render()
  }

  function onPointerUp(event: PointerEvent) {
    if (!dragging) return
    dragging = false
    if (dragMoved < 8) {
      const found = pick(event)
      if (!found) return
      if (found.index === focus) options.onSelect(found.house)
      else focusOn(found.index)
      return
    }
    let nearest = 0
    let best = Number.POSITIVE_INFINITY
    shops.forEach((shop, index) => {
      const distance = Math.abs(shop.anchorX + shown)
      if (distance < best) {
        best = distance
        nearest = index
      }
    })
    focusOn(nearest)
  }

  previous.addEventListener("click", () => step(-1))
  next.addEventListener("click", () => step(1))
  cardGo.addEventListener("click", () => {
    const shop = shops[focus]
    if (shop) options.onSelect(shop.house)
  })

  function onKey(event: KeyboardEvent) {
    const target = event.target as HTMLElement | null
    if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return
    if (event.key === "ArrowRight") step(1)
    if (event.key === "ArrowLeft") step(-1)
    if (event.key === "Enter") {
      const shop = shops[focus]
      if (shop) options.onSelect(shop.house)
    }
  }

  const resizeObserver = new ResizeObserver(() => {
    frameCamera()
    updateChrome()
    render()
  })
  resizeObserver.observe(root)
  renderer.domElement.addEventListener("pointerdown", onPointerDown)
  renderer.domElement.addEventListener("pointermove", onPointerMove)
  renderer.domElement.addEventListener("pointerup", onPointerUp)
  renderer.domElement.addEventListener("pointercancel", onPointerUp)
  window.addEventListener("keydown", onKey)
  frameCamera()
  render()

  const loader = new GLTFLoader()
  void (async () => {
    await document.fonts.ready
    const [glazed, door, pier] = await Promise.all([
      loader.loadAsync(`${import.meta.env.BASE_URL}models/shops/glazed.glb`),
      loader.loadAsync(`${import.meta.env.BASE_URL}models/shops/door.glb`),
      loader.loadAsync(`${import.meta.env.BASE_URL}models/shops/pier.glb`),
    ])
    if (!alive) return
    const parts = {
      glazed: glazed.scene,
      door: door.scene,
      pier: pier.scene,
    }

    const mid = (lineup.length - 1) / 2
    lineup.forEach((house, index) => {
      const slot = new Group()
      const along = index - mid
      slot.position.set(along * PITCH, 0, 1.6 - along * along * 0.035)
      buildShop(slot, house, parts, pickable)
      row.add(slot)
      shops.push({ house, index, anchorX: slot.position.x, group: slot })
    })

    loading.remove()
    focusOn(focus, true)
  })().catch(() => {
    if (!alive) return
    loading.textContent = "The houses could not be placed."
  })

  return {
    setQuery(query: string) {
      const q = query.trim().toLowerCase()
      let firstMatch = -1
      for (const shop of shops) {
        const match =
          !q ||
          shop.house.name.toLowerCase().includes(q) ||
          shop.house.category.toLowerCase().includes(q) ||
          shop.house.blurb.toLowerCase().includes(q)
        if (match && firstMatch < 0 && q) firstMatch = shop.index
        shop.group.traverse((child) => {
          if (!(child instanceof Mesh)) return
          const list = Array.isArray(child.material) ? child.material : [child.material]
          for (const material of list) {
            if (!(material instanceof MeshStandardMaterial)) continue
            const base = typeof material.userData.baseOpacity === "number" ? material.userData.baseOpacity : 1
            material.opacity = match ? base : 0.22
            material.transparent = material.opacity < 0.98
          }
        })
      }
      if (firstMatch >= 0) focusOn(firstMatch)
      else render()
    },
    dispose() {
      alive = false
      gliding = false
      resizeObserver.disconnect()
      renderer.domElement.removeEventListener("pointerdown", onPointerDown)
      renderer.domElement.removeEventListener("pointermove", onPointerMove)
      renderer.domElement.removeEventListener("pointerup", onPointerUp)
      renderer.domElement.removeEventListener("pointercancel", onPointerUp)
      window.removeEventListener("keydown", onKey)
      renderer.dispose()
      renderer.domElement.remove()
      previous.remove()
      next.remove()
      card.remove()
      loading.remove()
    },
  }
}

type ShopParts = {
  glazed: Group
  door: Group
  pier: Group
}

function buildShop(slot: Group, house: House, parts: ShopParts, pickable: Mesh[]) {
  const bays: Array<[Group, number]> = [
    [parts.pier, -2.4],
    [parts.glazed, -1.2],
    [parts.door, 0],
    [parts.glazed, 1.2],
    [parts.pier, 2.4],
  ]
  for (const [source, x] of bays) {
    const bay = source.clone(true)
    styleShopMaterials(bay, FACADE[house.id] ?? house.trim)
    bay.position.x = x
    bay.getObjectByName("entrance-door")?.rotation.set(0, 0, 0)
    slot.add(bay)
  }

  const cloth = new MeshStandardMaterial({ color: house.trim, roughness: 0.74, metalness: 0 })
  cloth.userData.baseOpacity = 1
  const canopy = new Mesh(new BoxGeometry(5.5, 0.05, 1.45), cloth)
  canopy.position.set(0, 3.05, 0.78)
  canopy.rotation.x = 0.22
  slot.add(canopy)
  const valance = new Mesh(new BoxGeometry(5.5, 0.28, 0.045), cloth)
  valance.position.set(0, 2.78, 1.42)
  slot.add(valance)

  const shell = new MeshStandardMaterial({
    color: FACADE[house.id] ?? house.trim,
    roughness: 0.84,
    metalness: 0.04,
    envMapIntensity: 0.3,
  })
  shell.userData.baseOpacity = 1
  const side = new Mesh(new BoxGeometry(0.28, 4.4, 2.45), shell)
  side.position.set(-3.14, 2.2, -1.05)
  slot.add(side)
  const other = side.clone()
  other.position.x = 3.14
  slot.add(other)
  const back = new Mesh(new BoxGeometry(6.28, 4.4, 0.2), shell)
  back.position.set(0, 2.2, -2.22)
  slot.add(back)

  const cap = new Mesh(
    new BoxGeometry(6.4, 0.14, 2.55),
    new MeshStandardMaterial({ color: "#2c3238", roughness: 0.55, metalness: 0.25 }),
  )
  cap.material.userData.baseOpacity = 1
  cap.position.set(0, 4.45, -0.95)
  slot.add(cap)

  const fascia = new Mesh(
    new BoxGeometry(6.1, 1.24, 0.1),
    new MeshStandardMaterial({ color: "#141a22", roughness: 0.46, metalness: 0.18 }),
  )
  fascia.material.userData.baseOpacity = 1
  fascia.position.set(0, 3.74, 0.06)
  slot.add(fascia)

  const sign = new Mesh(
    new PlaneGeometry(5.9, 1.1),
    new MeshStandardMaterial({ map: makeShopSign(house), roughness: 0.62, metalness: 0.02 }),
  )
  sign.material.userData.baseOpacity = 1
  sign.position.set(0, 3.74, 0.13)
  slot.add(sign)

  const glow = new Mesh(
    new PlaneGeometry(4.6, 2.2),
    new MeshStandardMaterial({
      color: "#fff4e6",
      emissive: house.active ? "#ffd9a6" : "#f0e2d2",
      emissiveIntensity: house.active ? 0.75 : 0.32,
      roughness: 1,
    }),
  )
  glow.material.userData.baseOpacity = 1
  glow.position.set(0, 1.45, -1.95)
  slot.add(glow)

  slot.traverse((child) => {
    if (!(child instanceof Mesh)) return
    child.castShadow = true
    child.receiveShadow = true
    child.userData.houseId = house.id
    pickable.push(child)
  })
}

function styleShopMaterials(root: Object3D, accent?: string) {
  root.traverse((child) => {
    if (!(child instanceof Mesh)) return
    const list = Array.isArray(child.material) ? child.material : [child.material]
    const styled = list.map((material) => {
      const next = material.clone()
      if (!(next instanceof MeshStandardMaterial)) return next
      if (material.name === "glass") {
        next.color.set("#e8f2f6")
        next.metalness = 1
        next.roughness = 0.04
        next.transparent = true
        next.opacity = 0.36
        next.envMapIntensity = 1.6
      } else if (material.name === "metal") {
        next.color.set("#c5cacf")
        next.metalness = 0.94
        next.roughness = 0.18
        next.envMapIntensity = 1.1
      } else if (material.name === "dark") {
        next.color.set("#1e2429")
        next.metalness = 0.45
        next.roughness = 0.42
      } else if (material.name === "carcass") {
        next.color.set(accent ?? "#d9c7ae")
        next.metalness = 0
        next.roughness = 0.86
        next.envMapIntensity = 0.3
      } else if (material.name === "accent") {
        next.color.set(accent ?? "#c4a574")
        next.metalness = 0
        next.roughness = 0.7
      }
      next.userData.baseOpacity = next.opacity
      return next
    })
    child.material = Array.isArray(child.material) ? styled : styled[0]
  })
}
