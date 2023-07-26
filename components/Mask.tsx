"use client"

import React from "react"

interface Props {
  backgroundColor?: string
  opacity?: number
}

export default function Mask({ backgroundColor, opacity }: Props) {
  return (
    <div className="fixed z-50 inset-0" style={{ backgroundColor, opacity }} />
  )
}
