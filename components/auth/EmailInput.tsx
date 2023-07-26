import { useEffect, useRef } from "react"
import type { ChangeEvent } from "react"

interface Props {
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void
  value: string
  placeholder?: string
  disabled?: boolean
}

export default function EmailInput({
  handleChange,
  value,
  placeholder = "Email address",
  disabled = false,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputRef?.current) {
      inputRef.current.focus()
    }
  }, [inputRef])

  return (
    <input
      ref={inputRef}
      type="email"
      name="email"
      className="h-14 md:h-12 w-full border border-orangeBase rounded-lg px-5 outline-none placeholder:font-extralight font-normal text-textRegular text-lg placeholder:text-textExtraLight focus:outline-none focus:border-[2px] focus:border-orangeDark"
      placeholder={placeholder}
      onChange={handleChange}
      value={value}
      disabled={disabled}
    />
  )
}
