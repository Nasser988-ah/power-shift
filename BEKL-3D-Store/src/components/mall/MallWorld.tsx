import { useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { houses } from "../../data/houses"
import { useMall } from "../../state/mall-state"
import { mountMall, type MallApi } from "./createMall"

export function MallWorld({ query }: { query: string }) {
  const root = useRef<HTMLDivElement>(null)
  const api = useRef<MallApi | null>(null)
  const navigate = useNavigate()
  const { setNotice } = useMall()

  useEffect(() => {
    const element = root.current
    if (!element) return
    const mounted = mountMall(element, {
      houses,
      onSelect(house) {
        if (house.active) navigate("/bekl")
        else setNotice(`${house.name} is opening soon. BEKL is the house you can enter.`)
      },
    })
    api.current = mounted
    return () => {
      mounted.dispose()
      api.current = null
    }
  }, [navigate, setNotice])

  useEffect(() => {
    api.current?.setQuery(query)
  }, [query])

  return <div ref={root} className="mall-world relative h-full min-h-[calc(100dvh-4.25rem)] w-full" />
}
