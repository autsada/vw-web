import React from "react"
import {
  AiOutlineDislike,
  AiOutlineDollarCircle,
  AiOutlineFlag,
  AiOutlineLike,
  AiOutlineShareAlt,
} from "react-icons/ai"
import { BsBookmark } from "react-icons/bs"
import type { IconType } from "react-icons"

export default function PreviewReactions() {
  return (
    <div className="w-max flex items-center gap-x-2 sm:gap-x-3 xl:gap-x-4">
      <div className="h-[40px] flex items-center justify-center rounded-full overflow-hidden">
        <Reaction IconOutline={AiOutlineLike} width="w-[80px]" />
      </div>
      <div className="h-[40px] flex items-center justify-center rounded-full overflow-hidden">
        <Reaction IconOutline={AiOutlineDislike} />
      </div>
      <div className="h-[40px] flex items-center rounded-full overflow-hidden divide-x bg-gray-100">
        <Reaction IconOutline={BsBookmark} size={19} width="w-[70px]" />
      </div>
      <div className="h-[40px] flex items-center rounded-full overflow-hidden divide-x bg-gray-100">
        <Reaction IconOutline={AiOutlineDollarCircle} description="Tip" />
      </div>
      <div className="h-[40px] flex items-center rounded-full overflow-hidden divide-x bg-gray-100">
        <Reaction IconOutline={AiOutlineShareAlt} description="Share" />
      </div>
      <div className="h-[40px] flex items-center rounded-full overflow-hidden divide-x bg-gray-100">
        <Reaction IconOutline={AiOutlineFlag} description="Report" />
      </div>
    </div>
  )
}

interface ReactionProps {
  IconOutline: IconType
  description?: string
  width?: string // w-[100px] for exp
  size?: number
}

function Reaction({ IconOutline, description, width, size }: ReactionProps) {
  return (
    <div
      className={`relative h-full ${
        !width ? "w-max" : width
      } px-4 flex items-center justify-center gap-x-2 cursor-pointer bg-gray-100 hover:bg-gray-200`}
    >
      <div className="h-full flex items-center justify-center">
        <IconOutline size={size} className="text-2xl" />
      </div>

      {description && (
        <div className="h-full font-semibold text-xs sm:text-sm flex items-center justify-center">
          {description}
        </div>
      )}
    </div>
  )
}
