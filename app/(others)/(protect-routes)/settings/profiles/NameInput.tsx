import React, { ChangeEvent } from "react"
import { MdCheck } from "react-icons/md"

interface Props {
  name: string
  placeholder: string
  value: string | number
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  error: string
  isMandatory: boolean
  valid: boolean | undefined
}

export default function NameInput({
  name,
  placeholder,
  value,
  onChange,
  error,
  isMandatory,
  valid,
}: Props) {
  return (
    <label htmlFor="name" className="block text-start">
      {name} {isMandatory && <span className="text-red-500">*</span>}
      <div className="relative">
        <input
          type="text"
          name="name"
          maxLength={64}
          placeholder={placeholder}
          className={`block w-full h-12 pl-5 text-lg rounded-lg border border-orangeBase focus:outline-none focus:border-[2px] focus:border-orangeDark`}
          value={value}
          onChange={onChange}
        />
        {valid && (
          <div className="absolute h-full top-0 bottom-0 right-0 w-[50px] flex items-center justify-center">
            <MdCheck className="text-green-600" size={25} />
          </div>
        )}
      </div>
      <p className="text-xs text-red-500">{error ? error : <>&nbsp;</>}</p>
    </label>
  )
}
