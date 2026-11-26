import { Minus, Plus, X } from "lucide-react"
import { formatEgp } from "../../lib/money"
import { useMall } from "../../state/mall-state"

export function CartDrawer() {
  const { lines, total, cartOpen, setCartOpen, setQty, removeLine, placeOrder } = useMall()
  if (!cartOpen) return null

  return (
    <div className="fixed inset-0 z-40">
      <button className="absolute inset-0 bg-navy/35" aria-label="Close bag" onClick={() => setCartOpen(false)} />
      <aside className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-ivory text-ink shadow-2xl">
        <header className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
          <div>
            <p className="text-[11px] tracking-[0.18em] text-ink/50">BEKL</p>
            <h2 className="font-display text-3xl leading-none">Your bag</h2>
          </div>
          <button className="grid h-11 w-11 place-items-center" onClick={() => setCartOpen(false)} aria-label="Close bag">
            <X />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {lines.length === 0 ? (
            <p className="pt-8 text-sm leading-6 text-ink/70">The bag is empty. The collection is on the floor of the house.</p>
          ) : (
            <ul className="space-y-4">
              {lines.map((line) => (
                <li key={line.id} className="grid grid-cols-[4.5rem_1fr] gap-3">
                  <img src={line.image} alt="" className="h-24 w-full object-contain" />
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-medium">{line.name}</p>
                      <button className="text-xs text-ink/50 underline" onClick={() => removeLine(line.id)}>
                        Remove
                      </button>
                    </div>
                    <p className="mt-1 text-sm">{formatEgp(line.price)}</p>
                    <div className="mt-3 inline-flex items-center border border-ink/15">
                      <button className="grid h-11 w-11 place-items-center" aria-label={`Decrease ${line.name}`} onClick={() => setQty(line.id, line.qty - 1)}>
                        <Minus size={16} />
                      </button>
                      <span className="w-6 text-center text-sm">{line.qty}</span>
                      <button className="grid h-11 w-11 place-items-center" aria-label={`Increase ${line.name}`} onClick={() => setQty(line.id, line.qty + 1)}>
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <footer className="border-t border-ink/10 px-5 py-4">
          <div className="mb-3 flex items-baseline justify-between">
            <span className="text-sm text-ink/60">Subtotal</span>
            <span className="font-medium">{formatEgp(total)}</span>
          </div>
          <button
            className="h-12 w-full bg-ink text-sm tracking-wide text-ivory disabled:opacity-40"
            disabled={lines.length === 0}
            onClick={placeOrder}
          >
            Request from the atelier
          </button>
        </footer>
      </aside>
    </div>
  )
}
