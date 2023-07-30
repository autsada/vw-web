import React from "react"
import { BiCommentDetail } from "react-icons/bi"

import Reaction from "@/components/Reaction"

interface Props {
  commentAction: () => void
  commentsCount: number
  verticalLayout?: boolean
  buttonHeight?: string // h-[40px]
  descriptionColor?: string // text-white for exp
}

export default function CommentsReaction({
  commentAction,
  commentsCount,
  verticalLayout,
  buttonHeight,
  descriptionColor,
}: Props) {
  return (
    <Reaction
      IconOutline={BiCommentDetail}
      IconFill={BiCommentDetail}
      withDescription
      description={commentsCount ? `${commentsCount}` : undefined}
      height={buttonHeight}
      onClick={commentAction}
      verticalLayout={verticalLayout}
      descriptionColor={descriptionColor}
    />
  )
}
