import { useState } from "react"
import { useMall } from "../../state/mall-state"

export function AccountDialog() {
  const { accountOpen, setAccountOpen, guestName, setGuestName } = useMall()
  const [draft, setDraft] = useState(guestName)
  if (!accountOpen) return null

  return (
    <div className="fixed inset-0 z-40 grid place-items-end px-4 pb-4 sm:place-items-center">
      <button className="absolute inset-0 bg-navy/35" aria-label="Close account" onClick={() => setAccountOpen(false)} />
      <form
        className="relative w-full max-w-sm bg-ivory p-6 text-ink"
        onSubmit={(event) => {
          event.preventDefault()
          setGuestName(draft.trim())
          setAccountOpen(false)
        }}
      >
        <p className="text-[11px] tracking-[0.18em] text-ink/50">GUEST BOOK</p>
        <h2 className="mt-1 font-display text-4xl leading-none">Your name</h2>
        <p className="mt-3 text-sm leading-6 text-ink/70">
          This prototype keeps a name on this device only. There is no account server.
        </p>
        <label className="mt-5 block text-xs tracking-wide text-ink/60" htmlFor="guest-name">
          Name
        </label>
        <input
          id="guest-name"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          className="mt-2 h-12 w-full border border-ink/15 bg-white px-3 text-base outline-none focus:border-ink"
          placeholder="Your name"
          autoComplete="name"
        />
        <button className="mt-4 h-12 w-full bg-ink text-sm text-ivory" type="submit">
          Save on this device
        </button>
      </form>
    </div>
  )
}
