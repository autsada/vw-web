"use client"

import React from "react"
import Backdrop from "./Backdrop"
import ButtonLoader from "./ButtonLoader"

interface Props {
  children: React.ReactNode
  loading: boolean
  loaderColor?: string
  zIndex?: string
}

export default function PageLoaderWithInfo({
  children,
  loading,
  loaderColor,
  zIndex = "z-50",
}: Props) {
  return (
    <div className={`fixed inset-0 flex justify-center items-center ${zIndex}`}>
      <Backdrop visible />
      <div className="relative w-full z-50">
        <div className="pt-8 pb-4 px-4 mx-auto w-[90%] sm:w-[40%] bg-white rounded-xl">
          {children}

          <div className="w-full mt-8 flex justify-center">
            <ButtonLoader loading={loading} color={loaderColor} />
          </div>
        </div>
      </div>
    </div>
  )
}
