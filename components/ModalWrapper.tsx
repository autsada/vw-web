import React, { useEffect } from "react"
import Backdrop from "./Backdrop"

interface Props {
  visible: boolean
  children: React.ReactNode
  withBackdrop?: boolean
  zIndex?: string
  backdropZIndex?: string
}

export default function ModalWrapper({
  visible,
  children,
  withBackdrop = true,
  zIndex = "z-50",
  backdropZIndex,
}: Props) {
  // Disable body scroll when actions modal openned
  useEffect(() => {
    const els = document?.getElementsByTagName("body")

    if (visible) {
      if (els[0]) {
        els[0].style.overflow = "hidden"
      }
    } else {
      if (els[0]) {
        els[0].style.overflow = "auto"
      }
    }

    return () => {
      if (els[0]) {
        els[0].style.overflow = "auto"
      }
    }
  }, [visible])

  if (!visible) return null

  return (
    <>
      <div
        className={`fixed inset-0 flex flex-col justify-center items-center ${zIndex}`}
      >
        {children}
      </div>
      {withBackdrop && <Backdrop visible={visible} zIndex={backdropZIndex} />}
    </>
  )
}
