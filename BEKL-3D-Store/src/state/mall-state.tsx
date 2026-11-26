import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react"

export type CartLine = {
  id: string
  name: string
  price: number
  image: string
  qty: number
}

type MallState = {
  lines: CartLine[]
  count: number
  total: number
  cartOpen: boolean
  accountOpen: boolean
  guestName: string
  notice: string | null
  setCartOpen: (open: boolean) => void
  setAccountOpen: (open: boolean) => void
  setGuestName: (name: string) => void
  setNotice: (notice: string | null) => void
  addLine: (line: Omit<CartLine, "qty">) => void
  setQty: (id: string, qty: number) => void
  removeLine: (id: string) => void
  placeOrder: () => void
}

const MallContext = createContext<MallState | null>(null)
const CART_KEY = "psm-cart"
const GUEST_KEY = "psm-guest"

function readCart(): CartLine[] {
  try {
    const raw = localStorage.getItem(CART_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as CartLine[]
    if (!Array.isArray(parsed)) return []
    return parsed.filter((line) => line && typeof line.id === "string" && line.qty > 0)
  } catch {
    return []
  }
}

export function MallProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(readCart)
  const [cartOpen, setCartOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const [guestName, setGuestNameState] = useState(() => localStorage.getItem(GUEST_KEY) ?? "")
  const [notice, setNotice] = useState<string | null>(null)

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(lines))
  }, [lines])

  useEffect(() => {
    if (!notice) return
    const timer = window.setTimeout(() => setNotice(null), 2800)
    return () => window.clearTimeout(timer)
  }, [notice])

  const value = useMemo<MallState>(() => {
    const count = lines.reduce((sum, line) => sum + line.qty, 0)
    const total = lines.reduce((sum, line) => sum + line.qty * line.price, 0)
    return {
      lines,
      count,
      total,
      cartOpen,
      accountOpen,
      guestName,
      notice,
      setCartOpen,
      setAccountOpen,
      setGuestName: (name) => {
        setGuestNameState(name)
        localStorage.setItem(GUEST_KEY, name)
      },
      setNotice,
      addLine: (line) => {
        setLines((current) => {
          const existing = current.find((item) => item.id === line.id)
          if (!existing) return [...current, { ...line, qty: 1 }]
          return current.map((item) => (item.id === line.id ? { ...item, qty: item.qty + 1 } : item))
        })
        setNotice(`${line.name} added to the bag`)
      },
      setQty: (id, qty) => {
        setLines((current) =>
          qty <= 0 ? current.filter((item) => item.id !== id) : current.map((item) => (item.id === id ? { ...item, qty } : item)),
        )
      },
      removeLine: (id) => setLines((current) => current.filter((item) => item.id !== id)),
      placeOrder: () => {
        setLines([])
        setCartOpen(false)
        setNotice("Request received. The atelier will prepare this edit.")
      },
    }
  }, [accountOpen, cartOpen, guestName, lines, notice])

  return <MallContext.Provider value={value}>{children}</MallContext.Provider>
}

export function useMall() {
  const value = useContext(MallContext)
  if (!value) throw new Error("useMall must be used inside MallProvider")
  return value
}
