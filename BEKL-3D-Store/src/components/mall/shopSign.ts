import { CanvasTexture, SRGBColorSpace } from "three"
import type { House } from "../../data/houses"

/** A lit fascia: the trade icon, the house name, and what it sells. */
export function makeShopSign(house: House) {
  const canvas = document.createElement("canvas")
  canvas.width = 1280
  canvas.height = 320
  const pen = canvas.getContext("2d")
  if (!pen) throw new Error("Could not draw the shop sign")

  pen.fillStyle = "#1a2330"
  pen.fillRect(0, 0, canvas.width, canvas.height)
  pen.fillStyle = house.trim
  pen.fillRect(0, 292, canvas.width, 28)

  const glow = pen.createRadialGradient(168, 160, 20, 168, 160, 130)
  glow.addColorStop(0, house.trim)
  glow.addColorStop(1, "rgba(0,0,0,0)")
  pen.fillStyle = glow
  pen.globalAlpha = 0.45
  pen.beginPath()
  pen.arc(168, 150, 130, 0, Math.PI * 2)
  pen.fill()
  pen.globalAlpha = 1

  pen.beginPath()
  pen.arc(168, 150, 92, 0, Math.PI * 2)
  pen.fillStyle = house.trim
  pen.fill()
  pen.lineWidth = 6
  pen.strokeStyle = "#f7f8f7"
  pen.stroke()
  drawIcon(pen, house.id)

  const nameSize = house.name.length > 12 ? 72 : 88
  const categorySize = house.category.length > 22 ? 40 : 50
  pen.fillStyle = "#f7f4ee"
  pen.textBaseline = "middle"
  pen.font = `600 ${nameSize}px "Cormorant Garamond", Georgia, serif`
  pen.fillText(house.name, 300, 108)
  pen.fillStyle = house.trim
  pen.fillRect(300, 162, 92, 4)
  pen.fillStyle = "#f7f4ee"
  pen.font = `600 ${categorySize}px Manrope, "Segoe UI", sans-serif`
  pen.fillText(house.category, 300, 214)

  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  texture.anisotropy = 8
  return texture
}

function drawIcon(pen: CanvasRenderingContext2D, id: string) {
  pen.save()
  pen.translate(168, 150)
  pen.strokeStyle = "#f7f8f7"
  pen.fillStyle = "#f7f8f7"
  pen.lineWidth = 8
  pen.lineJoin = "round"
  pen.lineCap = "round"

  if (id === "bekl") {
    pen.beginPath()
    pen.arc(0, -22, 12, Math.PI * 0.15, Math.PI * 0.85, true)
    pen.stroke()
    pen.beginPath()
    pen.moveTo(-36, 6)
    pen.lineTo(0, -14)
    pen.lineTo(36, 6)
    pen.moveTo(-36, 6)
    pen.quadraticCurveTo(0, 42, 36, 6)
    pen.stroke()
  } else if (id === "nourvive") {
    pen.beginPath()
    pen.moveTo(0, -40)
    pen.bezierCurveTo(34, -10, 28, 28, 0, 42)
    pen.bezierCurveTo(-28, 28, -34, -10, 0, -40)
    pen.fill()
  } else if (id === "uruz") {
    pen.beginPath()
    pen.moveTo(0, -40)
    pen.lineTo(28, 0)
    pen.lineTo(0, 40)
    pen.lineTo(-28, 0)
    pen.closePath()
    pen.fill()
  } else if (id === "via") {
    pen.beginPath()
    pen.arc(0, 8, 30, Math.PI * 1.05, Math.PI * 1.95)
    pen.stroke()
    pen.beginPath()
    pen.moveTo(-6, 18)
    pen.lineTo(34, -28)
    pen.lineTo(6, -8)
    pen.closePath()
    pen.fill()
  } else if (id === "availio") {
    pen.beginPath()
    pen.moveTo(-30, 8)
    pen.lineTo(-30, 36)
    pen.lineTo(30, 36)
    pen.lineTo(30, 8)
    pen.quadraticCurveTo(0, -8, -30, 8)
    pen.closePath()
    pen.fill()
    pen.strokeStyle = "#1a2330"
    pen.beginPath()
    pen.moveTo(-8, 36)
    pen.lineTo(-8, 16)
    pen.lineTo(8, 16)
    pen.lineTo(8, 36)
    pen.stroke()
  } else if (id === "haseb") {
    pen.strokeRect(-32, -8, 64, 42)
    pen.beginPath()
    pen.moveTo(-14, -8)
    pen.quadraticCurveTo(-14, -28, 0, -28)
    pen.quadraticCurveTo(14, -28, 14, -8)
    pen.stroke()
  } else if (id === "luna") {
    pen.beginPath()
    pen.arc(-6, 2, 32, 0, Math.PI * 2)
    pen.arc(12, -8, 26, 0, Math.PI * 2)
    pen.fill("evenodd")
  } else if (id === "zaytoon") {
    pen.beginPath()
    pen.ellipse(8, 8, 16, 22, 0.4, 0, Math.PI * 2)
    pen.fill()
    pen.beginPath()
    pen.moveTo(-6, 20)
    pen.quadraticCurveTo(-30, -10, 10, -34)
    pen.quadraticCurveTo(-8, -8, -6, 20)
    pen.fill()
  } else if (id === "tasty") {
    pen.beginPath()
    pen.roundRect(-28, -6, 56, 40, 6)
    pen.fill()
    pen.fillRect(-32, -18, 64, 14)
  } else if (id === "fekra") {
    pen.beginPath()
    pen.moveTo(-4, -28)
    pen.lineTo(-36, -16)
    pen.lineTo(-36, 32)
    pen.lineTo(-4, 18)
    pen.closePath()
    pen.moveTo(4, -28)
    pen.lineTo(36, -16)
    pen.lineTo(36, 32)
    pen.lineTo(4, 18)
    pen.closePath()
    pen.fill()
  } else if (id === "raha") {
    pen.beginPath()
    pen.moveTo(-28, -8)
    pen.lineTo(28, -8)
    pen.lineTo(16, 16)
    pen.lineTo(-16, 16)
    pen.closePath()
    pen.fill()
    pen.fillRect(-3, 16, 6, 18)
    pen.fillRect(-18, 34, 36, 6)
  } else if (id === "mishmish") {
    pen.beginPath()
    pen.arc(0, -10, 26, 0, Math.PI * 2)
    pen.fill()
    pen.beginPath()
    pen.moveTo(0, 16)
    pen.lineTo(0, 38)
    pen.moveTo(-8, 40)
    pen.lineTo(8, 40)
    pen.lineTo(0, 32)
    pen.closePath()
    pen.stroke()
    pen.fill()
  } else if (id === "fitzone") {
    pen.fillRect(-40, -8, 18, 16)
    pen.fillRect(22, -8, 18, 16)
    pen.fillRect(-22, -4, 44, 8)
  } else if (id === "bloom") {
    for (let petal = 0; petal < 5; petal += 1) {
      const turn = (petal / 5) * Math.PI * 2 - Math.PI / 2
      pen.beginPath()
      pen.ellipse(Math.cos(turn) * 18, Math.sin(turn) * 18, 12, 18, turn, 0, Math.PI * 2)
      pen.fill()
    }
    pen.fillStyle = "#1a2330"
    pen.beginPath()
    pen.arc(0, 0, 8, 0, Math.PI * 2)
    pen.fill()
  } else {
    pen.beginPath()
    pen.roundRect(-18, -34, 36, 64, 8)
    pen.stroke()
    pen.fillRect(-8, 22, 16, 4)
  }
  pen.restore()
}
