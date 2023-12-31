"use client"

import React from "react"
import Link from "next/link"
import { AiOutlinePlusCircle } from "react-icons/ai"

export default function UploadBtn({
  onClick,
  size = 20,
  color = "white",
}: {
  onClick?: () => void
  size?: number
  color?: string
}) {
  return (
    <>
      <AiOutlinePlusCircle
        size={size}
        color={color}
        className="sm:hidden cursor-pointer"
        onClick={onClick}
      />
      <button
        type="button"
        className="hidden sm:block btn-orange px-4 h-8 rounded-full text-sm"
        onClick={onClick}
      >
        Upload
      </button>
    </>
  )
  return
  // return !isAuthenticated ? (
  //   <>
  //     <AiOutlinePlusCircle
  //       size={size}
  //       color={color}
  //       className="sm:hidden cursor-pointer"
  //       onClick={onClick}
  //     />
  //     <button
  //       type="button"
  //       className="hidden sm:block btn-orange px-4 h-8 rounded-full text-sm"
  //       onClick={onClick}
  //     >
  //       Upload
  //     </button>
  //   </>
  // ) : (
  //   <Link href="/upload">
  //     <AiOutlinePlusCircle
  //       size={size}
  //       color={color}
  //       className="sm:hidden cursor-pointer"
  //     />
  //     <button
  //       type="button"
  //       className="hidden sm:block btn-orange px-4 h-8 rounded-full text-sm"
  //     >
  //       Upload
  //     </button>
  //   </Link>
  // )
}
