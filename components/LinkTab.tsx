import React from "react"
import Link from "next/link"

export default function LinkTab({
  href,
  name,
  isActive,
}: {
  href: string
  name: string
  isActive: boolean
}) {
  return (
    <div
      className={`px-1 sm:px-2 text-sm sm:text-base cursor-pointer ${
        isActive
          ? "font-semibold border-b-[2px] border-gray-600"
          : "text-textLight border-none"
      }`}
    >
      <Link href={href}>{name}</Link>
    </div>
  )
}
