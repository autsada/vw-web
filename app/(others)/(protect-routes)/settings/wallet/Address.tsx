"use client"

import React from "react"
import { MdContentCopy } from "react-icons/md"

interface Props {
  address: string
  balance: string
}

export default function Address({ address, balance }: Props) {
  return (
    <div className="w-full text-textLight px-4 py-2 max-w-max flex items-center gap-x-4 bg-gray-100 rounded-lg cursor-pointer">
      <div className="text-xs sm:text-base">{address}</div>
      <MdContentCopy size={20} className="cursor-pointer" />
    </div>
  )
}
