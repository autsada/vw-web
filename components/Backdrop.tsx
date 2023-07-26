import React from "react"

interface Props {
  visible: boolean
  onClick?: () => void
  zIndex?: string
}

export default function Backdrop({
  visible = false,
  onClick,
  zIndex = "z-40",
}: Props) {
  return (
    <div
      className={`fixed ${zIndex} bg-black ${
        visible ? "inset-0 opacity-30 visible" : "hidden"
      } transition-all duration-300`}
      onClick={onClick}
    />
  )
}
