import React from "react"

import ModalWrapper from "./ModalWrapper"
import ButtonLoader from "./ButtonLoader"

interface Props {
  children: React.ReactNode
  cancelText?: string
  onCancel: () => void
  confirmText?: string
  onConfirm: () => void
  loading?: boolean
  info?: string
  error?: string
  disabled?: boolean
  useRedBgForConfirm?: boolean
  confirmBtnBgColor?: string // eg 'bg-blue-200'
  confirmBtnBgHoverColor?: string // eg 'hover:bg-blue-100'
  confirmBtnTextColor?: string // eg 'text-white'
}

export default function ConfirmModal({
  children,
  cancelText = "Cancel",
  onCancel,
  confirmText = "Confirm",
  onConfirm,
  loading,
  info,
  error,
  disabled,
  useRedBgForConfirm = false,
  confirmBtnBgColor,
  confirmBtnBgHoverColor,
  confirmBtnTextColor,
}: Props) {
  return (
    <ModalWrapper visible>
      <div className="relative z-50 w-[90%] sm:w-[60%] md:w-[50%] lg:w-[35%] mx-auto p-10 bg-white rounded-xl text-center">
        <>{children}</>

        <div className="mt-6 flex justify-around items-center">
          <button
            className={`${
              useRedBgForConfirm ? "btn-dark" : "btn-cancel"
            } min-w-[100px] px-5 rounded-full ${
              loading ? "opacity-30 cursor-not-allowed" : "opacity-100"
            }`}
            disabled={loading}
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className={`${
              useRedBgForConfirm
                ? "btn-cancel"
                : !confirmBtnBgColor
                ? "btn-dark"
                : confirmBtnBgColor
            } min-w-[100px] px-5 rounded-full ${
              disabled ? "opacity-30 cursor-not-allowed" : "opacity-100"
            } ${confirmBtnTextColor ? confirmBtnTextColor : ""} ${
              confirmBtnBgHoverColor ? confirmBtnBgHoverColor : ""
            }`}
            disabled={typeof disabled === "boolean" && disabled}
            onClick={onConfirm}
          >
            {loading ? <ButtonLoader loading size={8} /> : confirmText}
          </button>
        </div>
        {(error || info) && (
          <div className="absolute left-0 right-0 bottom-2">
            {error && <p className="error">{error}</p>}
            {info && <p className="error text-blueBase">{info}</p>}
          </div>
        )}
      </div>
    </ModalWrapper>
  )
}
