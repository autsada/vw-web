import React from "react"
import type { IconType } from "react-icons"

interface Props {
  IconOutline: IconType
  IconFill: IconType
  size?: number
  description?: string
  withDescription?: boolean
  isActive?: boolean
  onClick: () => void
  width?: string // w-[100px] for exp
  height?: string // w-[100px] for exp
  verticalLayout?: boolean
  descriptionColor?: string // text-white for exp
}

export default function Reaction({
  IconOutline,
  IconFill,
  size = 22,
  description,
  withDescription = true,
  isActive,
  onClick,
  width,
  height = "h-[40px]",
  verticalLayout = false,
  descriptionColor,
}: Props) {
  return !verticalLayout ? (
    <div
      className={`${
        !width ? "px-5" : width
      } ${height} flex items-center justify-center gap-x-2 cursor-pointer bg-neutral-100 hover:bg-neutral-200 rounded-full`}
      onClick={onClick}
    >
      <div className="h-full flex items-center justify-center">
        {isActive ? <IconFill size={size} /> : <IconOutline size={size} />}
      </div>

      {description && withDescription && (
        <div
          className={`h-full font-semibold text-xs sm:text-sm flex items-center justify-center ${
            descriptionColor ? descriptionColor : "text-textRegular"
          }`}
        >
          {description}
        </div>
      )}
    </div>
  ) : (
    <div className="w-full relative">
      <div
        className={`${
          !width ? "w-full" : width
        } ${height} flex items-center justify-center gap-x-2 cursor-pointer bg-neutral-100 hover:bg-neutral-200 rounded-full`}
        onClick={onClick}
      >
        <div className="h-full flex items-center justify-center">
          {isActive ? <IconFill size={size} /> : <IconOutline size={size} />}
        </div>
      </div>
      {description && withDescription && (
        <div
          className={`absolute h-[10px] -bottom-[15px] left-0 right-0 py-2 text-xs flex items-center justify-center ${
            descriptionColor ? descriptionColor : "text-textRegular"
          }`}
        >
          {description}
        </div>
      )}
    </div>
  )
}
