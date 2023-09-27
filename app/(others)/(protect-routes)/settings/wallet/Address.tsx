"use client"

import React, { useCallback, useState } from "react"
import { MdContentCopy } from "react-icons/md"

import { useSubscribeToAddress } from "@/hooks/useSubscribe"

interface Props {
  address: string
  balance: string
}

export default function Address({ address, balance }: Props) {
  const [isCopied, setIsCopied] = useState(false)

  useSubscribeToAddress(address)

  const clickToCopy = useCallback(async (addr: string) => {
    // Use the Clipboard API to copy text to the clipboard
    await navigator.clipboard.writeText(addr)
    setIsCopied(true)

    // Reset the copied state after a short delay
    const id = setTimeout(() => {
      setIsCopied(false)
      clearTimeout(id)
    }, 1000) // You can adjust the duration as needed
  }, [])

  return (
    <div>
      <div className="flex items-center gap-x-2">
        <div className="w-full text-textLight px-4 py-2 max-w-max flex items-center gap-x-4 bg-gray-100 rounded-lg cursor-pointer">
          <div className="text-xs sm:text-base">{address}</div>
          <MdContentCopy
            size={20}
            className="cursor-pointer"
            onClick={clickToCopy.bind(undefined, address)}
          />
        </div>
        {isCopied && (
          <div className="flex items-center justify-center p-1 rounded-sm bg-black text-white text-xs">
            Copied
          </div>
        )}
      </div>
      <div className="px-4 py-2 font-semibold text-base">
        {Number(balance).toFixed(4)} ETH
      </div>
    </div>
  )
}
