import React from "react"
import { MdSmartphone, MdOutlineEmail } from "react-icons/md"

import Logo from "../nav/Logo"

export type AuthMethod = "phone" | "email" | "wallet"

interface Props {
  selectMethod: (m: AuthMethod) => void
  headerText?: string
}

export default function SelectAuth({ selectMethod, headerText }: Props) {
  return (
    <>
      <div className="w-[120px] max-h-max mx-auto">
        <Logo size="h-[100px]" />
      </div>

      <div className="w-full px-8 sm:px-12">
        <h5 className="text-center font-bold leading-10">
          {headerText || "Sign in to proceed."}
        </h5>
      </div>

      <div className="mt-10">
        <div
          className="btn-blue flex justify-between items-center w-72 h-14 rounded-full mx-auto px-3 mb-8"
          onClick={selectMethod.bind(undefined, "phone")}
        >
          <div className=" w-14 flex justify-center items-center">
            <MdSmartphone size={22} />
          </div>
          <button
            type="button"
            className="w-full text-lg ml-5 flex justify-start items-center text-white focus:outline-none"
          >
            Continue with Phone
          </button>
        </div>

        <div
          className="btn-dark flex justify-between items-center w-72 h-14 rounded-full mx-auto px-3 mb-8"
          onClick={selectMethod.bind(undefined, "email")}
        >
          <div className="w-14 flex justify-center items-center">
            <MdOutlineEmail size={20} color="white" />
          </div>
          <button
            type="button"
            className="w-full text-lg ml-5 flex justify-start items-center text-white focus:outline-none"
          >
            Continue with Email
          </button>
        </div>

        <div className="w-3/4 my-8 mx-auto px-8 flex items-center">
          <div className="h-[1px] flex-grow border-b border-neutral-300 rounded-md" />
          <label className="mx-2 font-thin text-base text-textLight">OR</label>
          <div className="h-[1px] flex-grow border-b border-neutral-300 rounded-md" />
        </div>

        <div
          className="btn-orange flex justify-between items-center w-72 h-14 rounded-full mx-auto px-3 mb-8 hover:bg-orangeDark"
          onClick={selectMethod.bind(undefined, "wallet")}
        >
          <button
            type="button"
            className="w-full text-lg text-white focus:outline-none"
          >
            Continue with Wallet
          </button>
        </div>
      </div>
    </>
  )
}
