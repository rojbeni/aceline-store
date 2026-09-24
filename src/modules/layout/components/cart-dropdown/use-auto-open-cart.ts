import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"

const AUTO_CLOSE_DELAY_MS = 5000

/**
 * Opens the cart dropdown whenever the cart's item count changes, auto-closing
 * it after a delay unless the user re-opens it manually. Suppressed on the
 * cart page itself, since the drawer would be redundant there.
 */
export const useAutoOpenCart = (totalItems: number) => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTimer, setActiveTimer] = useState<
    ReturnType<typeof setTimeout> | undefined
  >(undefined)
  const previousTotalItems = useRef(totalItems)
  const pathname = usePathname()

  const open = () => setIsOpen(true)
  const close = () => setIsOpen(false)

  const openWithAutoClose = () => {
    open()
    setActiveTimer(setTimeout(close, AUTO_CLOSE_DELAY_MS))
  }

  const openAndCancelAutoClose = () => {
    if (activeTimer) {
      clearTimeout(activeTimer)
    }
    open()
  }

  // Clean up the timer when it changes or the component unmounts
  useEffect(() => {
    return () => {
      if (activeTimer) {
        clearTimeout(activeTimer)
      }
    }
  }, [activeTimer])

  useEffect(() => {
    if (
      previousTotalItems.current !== totalItems &&
      !pathname.includes("/cart")
    ) {
      openWithAutoClose()
    }
    previousTotalItems.current = totalItems
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalItems, pathname])

  return { isOpen, open: openAndCancelAutoClose, close }
}
