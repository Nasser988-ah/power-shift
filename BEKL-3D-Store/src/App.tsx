import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { lazy, Suspense } from "react"
import { Route, Routes, useLocation } from "react-router-dom"
import { AccountDialog } from "./components/chrome/AccountDialog"
import { CartDrawer } from "./components/chrome/CartDrawer"
import { MallPage } from "./pages/MallPage"
import { useMall } from "./state/mall-state"

const BeklPage = lazy(() => import("./pages/BeklPage").then((module) => ({ default: module.BeklPage })))

export default function App() {
  const location = useLocation()
  const reduce = useReducedMotion()
  const { notice } = useMall()

  return (
    <>
      <a href="#content" className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:bg-white focus:px-3 focus:py-2">
        Skip to content
      </a>
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0, y: -8 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <Suspense fallback={<div className="grid min-h-dvh place-items-center bg-ivory font-display text-6xl text-ink/25">BEKL</div>}>
            <Routes location={location}>
              <Route path="/" element={<MallPage />} />
              <Route path="/bekl" element={<BeklPage />} />
            </Routes>
          </Suspense>
        </motion.div>
      </AnimatePresence>
      <CartDrawer />
      <AccountDialog />
      {notice && (
        <p className="fixed bottom-4 left-1/2 z-50 w-[min(92vw,28rem)] -translate-x-1/2 bg-navy px-4 py-3 text-center text-sm text-paper" role="status">
          {notice}
        </p>
      )}
    </>
  )
}
