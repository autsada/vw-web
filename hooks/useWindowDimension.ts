import { useEffect, useState } from "react"

export function useWindowDimension() {
  const [windowWidth, setWindowWidth] = useState<number | null>(null)
  const [windowHeight, setWindowHeight] = useState<number | null>(null)

  useEffect(() => {
    if (window === undefined) return

    setWindowWidth(window.innerWidth)
    setWindowHeight(window.innerHeight)

    const handleResize = () => {
      setWindowWidth(window.innerWidth)
      setWindowHeight(window.innerHeight)
    }

    window.addEventListener("resize", handleResize)

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return { windowWidth, windowHeight }
}
