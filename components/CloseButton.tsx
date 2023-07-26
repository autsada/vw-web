import React from "react"

interface Props {
  onClick: () => void
  className?: string
}

export default function CloseButton({ onClick, className }: Props) {
  return (
    <button
      type="button"
      className={`text-xl text-textExtraLight ${className || ""}`}
      onClick={onClick}
    >
      &#10005;
    </button>
  )
}
