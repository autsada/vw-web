import React, { useState, useCallback } from "react"
import { AiOutlineDollarCircle, AiFillDollarCircle } from "react-icons/ai"

import Reaction from "./Reaction"
import TipModal from "./TipModal"
import { useAuthContext } from "@/context/AuthContext"
import type { Publish, Account, Maybe } from "@/graphql/codegen/graphql"

interface Props {
  isAuthenticated: boolean
  account?: Maybe<Account> | undefined
  publish: Publish
  withDescription?: boolean
  verticalLayout?: boolean
  buttonWidth?: string // h-[40px]
  buttonHeight?: string // h-[40px]
}

export default function TipReaction({
  isAuthenticated,
  account,
  publish,
  withDescription = true,
  verticalLayout,
  buttonWidth,
  buttonHeight,
}: Props) {
  const [tipModalVisible, setTipModalVisible] = useState(false)

  const { onVisible: openAuthModal } = useAuthContext()

  const handleStartTip = useCallback(() => {
    if (!publish?.id) return

    if (!isAuthenticated) {
      openAuthModal()
    } else {
      setTipModalVisible(true)
    }
  }, [publish, isAuthenticated, openAuthModal])

  const closeModal = useCallback(() => {
    setTipModalVisible(false)
  }, [])

  return (
    <>
      <Reaction
        IconOutline={AiOutlineDollarCircle}
        IconFill={AiFillDollarCircle}
        description="Tip"
        withDescription={withDescription}
        isActive={false}
        width={buttonWidth}
        height={buttonHeight}
        onClick={handleStartTip}
        verticalLayout={verticalLayout}
      />

      {tipModalVisible && publish && (
        <TipModal closeModal={closeModal} publish={publish} account={account} />
      )}
    </>
  )
}
