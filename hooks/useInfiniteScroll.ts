import { useRef, useEffect } from "react"

/**
 * @param threshold number between 0 to 1
 * @param onIntersacting a callback function when an element is in the view
 * @param onLeave a callback function when an element is leaving the view
 */
export function useInfiniteScroll(
  threshold: number,
  onIntersacting: () => void,
  onLeave?: () => void
) {
  const observedRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === "undefined") return

    if (!observedRef?.current) return
    const ref = observedRef.current

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (entry.intersectionRatio >= threshold) {
            onIntersacting()
          }
        } else {
          if (onLeave) onLeave()
        }
      },
      { root: null, threshold: threshold }
    )

    observer.observe(ref)

    return () => {
      if (ref) {
        observer.unobserve(ref)
      }
    }
  }, [onIntersacting, threshold, onLeave])

  return { observedRef }
}
