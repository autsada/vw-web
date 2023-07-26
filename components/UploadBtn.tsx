"use client"

import React from "react"
import Link from "next/link"
import { AiOutlinePlusCircle } from "react-icons/ai"

export default function UploadBtn({
  isAuthenticated,
  onClick,
  size = 20,
  color = "white",
}: {
  isAuthenticated: boolean
  onClick?: () => void
  size?: number
  color?: string
}) {
  return !isAuthenticated ? (
    <div onClick={onClick}>
      <AiOutlinePlusCircle
        size={size}
        color={color}
        className="cursor-pointer"
      />
    </div>
  ) : (
    <Link href="/upload">
      <AiOutlinePlusCircle
        size={size}
        color={color}
        className="cursor-pointer"
      />
    </Link>
  )
}
