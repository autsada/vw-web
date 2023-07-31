import React, { useCallback } from "react"
import { HiDotsVertical } from "react-icons/hi"

import ReadingListItem from "../ReadingListItem"
import type { Publish } from "@/graphql/codegen/graphql"

interface Props {
  publish: Publish
  setPOS: (posX: number, posY: number, screenHeight: number) => void
  onOpenActions: (p: Publish) => void
}

export default function ContentItem({ publish, setPOS, onOpenActions }: Props) {
  const openActionsModal = useCallback(
    (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
      onOpenActions(publish)
      setPOS(e.clientX, e.clientY, window?.innerHeight)
    },
    [publish, setPOS, onOpenActions]
  )

  if (!publish) return null

  return (
    <div className="relative w-full lg:max-w-none">
      <div className="relative">
        <ReadingListItem publish={publish} />
      </div>

      <div
        className="absolute -top-1 md:top-[110px] lg:-top-1 right-0 cursor-pointer py-2 px-1"
        onClick={openActionsModal}
      >
        <HiDotsVertical />
      </div>
    </div>
  )
}
