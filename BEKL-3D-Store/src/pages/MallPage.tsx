import { Search } from "lucide-react"
import { useEffect, useState } from "react"
import { AccountButton, BagButton } from "../components/chrome/IconButtons"
import { MallWorld } from "../components/mall/MallWorld"

export function MallPage() {
  const [query, setQuery] = useState("")

  useEffect(() => {
    document.title = "Power Shift Mall"
    const idle = window.requestIdleCallback?.(() => {
      void import("./BeklPage")
    })
    return () => {
      if (idle) window.cancelIdleCallback(idle)
    }
  }, [])

  return (
    <div className="min-h-dvh bg-paper text-navy lg:flex lg:h-dvh lg:flex-col lg:overflow-hidden">
      <header className="sticky top-0 z-20 flex shrink-0 items-center gap-3 border-b border-navy/8 bg-paper/90 px-4 py-3 backdrop-blur-md lg:static lg:border-0 lg:bg-transparent">
        <a href="#content" className="shrink-0">
          <p className="font-display text-2xl leading-none">Power Shift</p>
          <p className="hidden text-[11px] tracking-[0.14em] text-navy/55 sm:block">AERIAL COURT · NEW CAIRO</p>
        </a>
        <label className="ml-auto flex h-11 min-w-[7.5rem] flex-1 items-center gap-2 border border-navy/10 bg-white/70 px-3 sm:max-w-xs">
          <Search size={16} aria-hidden="true" />
          <span className="sr-only">Find a house</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Houses"
            className="w-full min-w-0 bg-transparent text-sm outline-none"
          />
        </label>
        <AccountButton />
        <BagButton />
      </header>

      <main id="content" className="relative min-h-[calc(100dvh-4.25rem)] flex-1">
        <div className="absolute inset-0">
          <MallWorld query={query} />
        </div>
      </main>
    </div>
  )
}
