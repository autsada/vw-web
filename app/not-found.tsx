"use client"

import React from "react"
import { useRouter } from "next/navigation"

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <h4 className="font-semibold text-4xl">This page DOES NOT exist.</h4>
      <button
        className="mt-8 btn-light px-8 rounded-full"
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => router.replace("/")
        }
      >
        Home
      </button>
      <button
        className="mt-8 btn-blue px-8 rounded-full"
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => router.back()
        }
      >
        Go back
      </button>
    </div>
  )
}
