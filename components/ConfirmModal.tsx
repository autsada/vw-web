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
  error?: string
  disabled?: boolean
  useRedBgForConfirm?: boolean
}

export default function ConfirmModal({
  children,
  cancelText = "Cancel",
  onCancel,
  confirmText = "Confirm",
  onConfirm,
  loading,
  error,
  disabled,
  useRedBgForConfirm = false,
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
              useRedBgForConfirm ? "btn-cancel" : "btn-dark"
            } min-w-[100px] px-5 rounded-full ${
              disabled ? "opacity-30 cursor-not-allowed" : "opacity-100"
            }`}
            disabled={typeof disabled === "boolean" && disabled}
            onClick={onConfirm}
          >
            {loading ? <ButtonLoader loading size={8} /> : confirmText}
          </button>
        </div>
        {error && (
          <div className="absolute left-0 right-0 bottom-2">
            <p className="error">{error}</p>
          </div>
        )}
      </div>
    </ModalWrapper>
  )
}
