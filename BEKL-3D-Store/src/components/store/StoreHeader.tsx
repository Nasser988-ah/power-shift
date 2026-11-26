import { ArrowLeft, Search } from "lucide-react"
import { Link } from "react-router-dom"
import { AccountButton, BagButton } from "../chrome/IconButtons"

type StoreHeaderProps = {
  query: string
  onQuery: (value: string) => void
}

export function StoreHeader({ query, onQuery }: StoreHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-ink/10 bg-ivory/92 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center gap-1 px-2 py-2 sm:gap-2 sm:px-3 lg:px-6">
        <Link to="/" className="inline-flex h-11 min-w-11 items-center justify-center text-sm text-ink sm:min-w-0 sm:justify-start sm:pr-2" aria-label="Back to mall">
          <ArrowLeft size={18} />
          <span className="hidden sm:inline">Mall</span>
        </Link>
        <Link to="/bekl" className="min-w-0 leading-none" aria-label="BEKL home">
          <span className="block font-display text-2xl text-ink sm:text-3xl">BEKL</span>
          <span className="hidden text-[10px] tracking-[0.16em] text-ink/50 sm:block">CLOTHING HOUSE</span>
        </Link>
        <label className="ml-auto flex h-11 min-w-0 flex-1 items-center gap-2 border border-ink/10 bg-white/80 px-3 sm:max-w-xs">
          <Search size={16} aria-hidden="true" />
          <span className="sr-only">Search the collection</span>
          <input
            value={query}
            onChange={(event) => onQuery(event.target.value)}
            placeholder="Search"
            className="w-full bg-transparent text-sm text-ink outline-none"
          />
        </label>
        <AccountButton tone="ink" />
        <BagButton tone="ink" />
      </div>
    </header>
  )
}
