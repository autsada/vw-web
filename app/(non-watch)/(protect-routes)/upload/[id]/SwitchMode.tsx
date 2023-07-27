import React, { useCallback } from "react"

interface Props {
  mode: "edit" | "preview"
  setMode: React.Dispatch<React.SetStateAction<"edit" | "preview">>
}

export default function SwitchMode({ mode, setMode }: Props) {
  const changeMode = useCallback(
    (m: "edit" | "preview") => {
      setMode(m)
    },
    [setMode]
  )

  return (
    <>
      <button
        onClick={changeMode.bind(undefined, "edit")}
        className={`w-[50px] mx-0 ${
          mode === "edit" ? "font-semibold" : "font-light"
        }`}
      >
        Edit
      </button>
      <button
        onClick={changeMode.bind(undefined, "preview")}
        className={`w-[80px] mx-0 ${
          mode === "preview" ? "font-semibold" : "font-light"
        }`}
      >
        Preview
      </button>
    </>
  )
}
