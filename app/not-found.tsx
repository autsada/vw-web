"use client"

import React from "react"
import { useRouter } from "next/navigation"

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="text-center py-10">
      <h4 className="font-semibold text-4xl">Page not found.</h4>
      <button
        className="mt-8 btn-light px-8 rounded-full"
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => router.replace("/")
        }
      >
        Home
      </button>
    </div>
  )
}
