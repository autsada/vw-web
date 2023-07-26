"use client"

import React from "react"
import PulseLoader from "react-spinners/PulseLoader"

interface Props {
  loading: boolean
  size?: number
  color?: string
}

export default function ButtonLoader({
  loading,
  size = 12,
  color = "#fff",
}: Props) {
  return (
    <PulseLoader
      color={color}
      loading={loading}
      cssOverride={{
        display: "block",
        // margin: "0 auto",
        margin: "5px 0 0 0",
        borderColor: color,
      }}
      size={size}
      aria-label="Loading Spinner"
      data-testid="loader"
    />
  )
}
