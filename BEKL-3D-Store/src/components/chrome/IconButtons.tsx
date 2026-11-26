import { ShoppingBag, UserRound } from "lucide-react"
import { useMall } from "../../state/mall-state"

export function BagButton({ tone = "navy" }: { tone?: "navy" | "ink" }) {
  const { count, setCartOpen } = useMall()
  const color = tone === "ink" ? "text-ink" : "text-navy"
  return (
    <button className={`relative grid h-11 w-11 place-items-center ${color}`} aria-label={`Open bag, ${count} items`} onClick={() => setCartOpen(true)}>
      <ShoppingBag size={20} />
      {count > 0 && (
        <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-mint px-1 text-[10px] font-semibold text-navy">
          {count}
        </span>
      )}
    </button>
  )
}

export function AccountButton({ tone = "navy" }: { tone?: "navy" | "ink" }) {
  const { guestName, setAccountOpen } = useMall()
  const color = tone === "ink" ? "text-ink" : "text-navy"
  const initial = guestName.trim().slice(0, 1).toUpperCase()
  return (
    <button className={`grid h-11 w-11 place-items-center ${color}`} aria-label="Account" onClick={() => setAccountOpen(true)}>
      {initial ? <span className="text-sm font-semibold">{initial}</span> : <UserRound size={20} />}
    </button>
  )
}
