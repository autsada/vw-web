"use client"

import React from "react"
import DotLoader from "react-spinners/DotLoader"

interface Props {
  loading: boolean
  size?: number
}

export default function Spinner({ loading, size = 100 }: Props) {
  return (
    <DotLoader
      color="#f97316"
      loading={loading}
      cssOverride={{
        display: "block",
        margin: "0 auto",
        borderColor: "#fb923c",
      }}
      size={size}
      aria-label="Loading Spinner"
      data-testid="loader"
    />
  )
}
