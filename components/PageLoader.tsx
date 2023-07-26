"use client"

import React from "react"
import Backdrop from "./Backdrop"
import Spinner from "./Spinner"

export default function PageLoader() {
  return (
    <div className="fixed inset-0 flex justify-center items-center">
      <Backdrop visible />
      <div className="relative z-50">
        <Spinner loading />
      </div>
    </div>
  )
}
