import React from "react"

interface Props {
  size?: "sm" | "base" | "lg"
  onCancel: () => void
  onSubmit: () => void
  disabled?: boolean
}

export default function ActionsButtons({
  size = "base",
  onCancel,
  onSubmit,
  disabled,
}: Props) {
  return (
    <>
      <button
        type="button"
        className={`btn-cancel mx-0 rounded-full ${
          size === "sm"
            ? "text-xs px-3 h-6"
            : size === "lg"
            ? "text-lg  px-4 h-8"
            : "text-base px-4 h-8"
        }`}
        onClick={onCancel}
      >
        Cancel
      </button>
      <button
        type="button"
        className={`btn-dark mx-0 rounded-full ${
          size === "sm"
            ? "text-xs px-3 h-6"
            : size === "lg"
            ? "text-lg px-4 h-8"
            : "text-base px-4 h-8"
        }`}
        disabled={disabled}
        onClick={onSubmit}
      >
        Submit
      </button>
    </>
  )
}
