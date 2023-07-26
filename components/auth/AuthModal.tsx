import React, { useCallback, useState, useEffect } from "react"
import { MdKeyboardBackspace } from "react-icons/md"

import ModalWrapper from "../ModalWrapper"
import CloseButton from "../CloseButton"
import SelectAuth from "./SelectAuth"
import PhoneAuth from "./PhoneAuth"
import EmailAuth from "./EmailAuth"
import WalletAuth from "./WalletAuth"
import { useWindowDimension } from "@/hooks/useWindowDimension"
import type { AuthMethod } from "./SelectAuth"

interface Props {
  visible: boolean
  closeModal: () => void
  headerText?: string
}

export default function AuthModal({ visible, closeModal, headerText }: Props) {
  const [authMethod, setAuthMethod] = useState<AuthMethod>()

  const { windowWidth, windowHeight } = useWindowDimension()

  useEffect(() => {
    if (!visible) {
      setAuthMethod(undefined)
    }
  }, [visible])

  function closeAuthModal() {
    setAuthMethod(undefined)
    closeModal()
  }

  const selectMethod = useCallback((m: AuthMethod) => {
    setAuthMethod(m)
  }, [])

  const deSelectMethod = useCallback(() => {
    setAuthMethod(undefined)
  }, [])

  if (!visible) return null

  return (
    <ModalWrapper visible={visible} zIndex="z-[60]">
      <div
        className={`relative h-full w-full ${
          windowWidth && windowHeight && windowWidth > windowHeight
            ? "sm:h-full sm:min-h-full"
            : "sm:h-[65%] sm:min-h[65%]"
        } lg:h-[98%] lg:min-h-[98%] sm:w-[60%] lg:w-[45%] lg:max-w-[500px] bg-white opacity-95 overflow-y-auto pt-5 py-10 sm:rounded-2xl`}
      >
        <CloseButton
          onClick={closeAuthModal}
          className="absolute top-5 right-10"
        />
        {authMethod ? (
          <>
            <MdKeyboardBackspace
              size={22}
              className="text-textLight cursor-pointer absolute top-[26px] left-10"
              onClick={deSelectMethod}
            />

            {authMethod === "phone" && <PhoneAuth />}
            {authMethod === "email" && <EmailAuth />}
            {authMethod === "wallet" && <WalletAuth closeModal={closeModal} />}
          </>
        ) : (
          <SelectAuth selectMethod={selectMethod} headerText={headerText} />
        )}
      </div>
    </ModalWrapper>
  )
}
