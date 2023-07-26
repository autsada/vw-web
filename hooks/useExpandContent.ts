import { useState, useCallback } from "react"

import { getPostExcerpt } from "@/lib/client"

export function useExpandContent(
  content: string,
  initialDisplayedLen?: number
) {
  const [displayedContent, setDisplayedContent] = useState(() =>
    getPostExcerpt(content, initialDisplayedLen)
  )

  const expandContent = useCallback(() => {
    if (!content) return
    setDisplayedContent(content)
  }, [content])

  const shrinkContent = useCallback(() => {
    if (!content) return
    setDisplayedContent(getPostExcerpt(content, initialDisplayedLen))
  }, [content, initialDisplayedLen])

  return { displayedContent, expandContent, shrinkContent }
}
