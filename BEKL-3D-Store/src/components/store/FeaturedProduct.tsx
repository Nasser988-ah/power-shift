import { ChevronLeft, ChevronRight } from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { useRef } from "react"
import type { Product } from "../../data/products"
import { discountPercent } from "../../data/products"
import { formatEgp } from "../../lib/money"
import { useMall } from "../../state/mall-state"

type FeaturedProductProps = {
  product: Product
  onPrev: () => void
  onNext: () => void
  onViewAll: () => void
}

export function FeaturedProduct({ product, onPrev, onNext, onViewAll }: FeaturedProductProps) {
  const reduce = useReducedMotion()
  const { addLine } = useMall()
  const start = useRef<{ x: number; y: number } | null>(null)
  const off = discountPercent(product)

  function add() {
    addLine({ id: product.id, name: product.name, price: product.price, image: product.imageSmall })
  }

  return (
    <section className="bg-[#f4ece3] text-ink" aria-label="Featured piece">
      <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-4 lg:max-w-5xl lg:py-6">
        <div
          className="relative w-full max-sm:-mx-4 max-sm:w-[calc(100%+2rem)]"
          onTouchStart={(event) => {
            const touch = event.changedTouches[0]
            start.current = { x: touch.clientX, y: touch.clientY }
          }}
          onTouchEnd={(event) => {
            if (!start.current) return
            const touch = event.changedTouches[0]
            const dx = touch.clientX - start.current.x
            const dy = touch.clientY - start.current.y
            if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy)) {
              if (dx < 0) onNext()
              else onPrev()
            }
            start.current = null
          }}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={product.id}
              src={product.image}
              srcSet={`${product.imageSmall} 450w, ${product.image} 900w`}
              sizes="(min-width: 1024px) 560px, (min-width: 640px) 480px, calc(100vw - 4.5rem)"
              alt={product.name}
              width={900}
              height={1120}
              className="mx-auto h-auto w-[calc(100vw-4.5rem)] max-h-[68vh] object-contain sm:w-[min(52vw,480px)] sm:max-h-[58vh] lg:w-[min(40vw,560px)] lg:max-h-[calc(100dvh-23rem)]"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduce ? undefined : { opacity: 0 }}
              transition={{ duration: 0.28 }}
              fetchPriority="high"
              decoding="async"
            />
          </AnimatePresence>
          <button
            type="button"
            className="absolute left-0 top-[78%] grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-ivory/90 text-ink shadow-sm sm:top-1/2 sm:h-12 sm:w-12"
            onClick={onPrev}
            aria-label="Previous piece"
          >
            <ChevronLeft />
          </button>
          <button
            type="button"
            className="absolute right-0 top-[78%] grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-ivory/90 text-ink shadow-sm sm:top-1/2 sm:h-12 sm:w-12"
            onClick={onNext}
            aria-label="Next piece"
          >
            <ChevronRight />
          </button>
        </div>

        <div className="mt-5 w-full max-w-md text-center sm:max-w-xl">
          <div className="flex items-start justify-center gap-4">
            <h2 className="font-display text-4xl leading-none lg:text-5xl">{product.name}</h2>
            {off > 0 && <span className="mt-1 bg-ink px-2 py-1 text-[11px] tracking-wide text-ivory">-{off}%</span>}
          </div>
          <p className="mt-3 flex items-baseline justify-center gap-3">
            <span className="text-lg">{formatEgp(product.price)}</span>
            {product.compareAt && <span className="text-sm text-ink/45 line-through">{formatEgp(product.compareAt)}</span>}
          </p>
          <p className="mx-auto mt-3 max-w-prose text-sm leading-6 text-ink/75">{product.description}</p>
          <div className="mt-5 flex w-full flex-col items-stretch gap-3 sm:flex-row sm:justify-center">
            <button type="button" className="h-12 min-h-12 w-full bg-ink px-4 text-sm tracking-wide text-ivory sm:w-56" onClick={add}>
              Add to bag
            </button>
            <button type="button" className="h-12 min-h-12 w-full border border-ink/20 px-4 text-sm sm:w-56" onClick={onViewAll}>
              View all products
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
