import React from "react"
import Image from "next/image"

import VwLight from "../../public/vw.png"
import VwDark from "../../public/vw-dark.png"

export default function Logo({
  size = "h-[70px]",
  theme = "light",
}: {
  size?: string
  theme?: "light" | "dark"
}) {
  return (
    <Image
      src={theme === "light" ? VwLight : VwDark}
      alt="VW"
      className={`${size} cursor-pointer`}
    />
  )
}
