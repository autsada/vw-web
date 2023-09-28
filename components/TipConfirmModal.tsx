import React, { useState, useCallback } from "react"
import { MdCheckCircle } from "react-icons/md"

import ModalWrapper from "./ModalWrapper"
import CloseButton from "./CloseButton"
import ButtonLoader from "./ButtonLoader"
import { formatAmount } from "@/lib/client"
import type { Publish, Account, Maybe } from "@/graphql/codegen/graphql"

interface Props {
  account?: Maybe<Account> | undefined
  balance: string
  onCancel: () => void
  tipInUSD: number // Tip in USD
  tipInETH: string // Tip in ETH
  publish: Publish
  refreshBalance: () => Promise<void>
}

export default function TipConfirmModal({
  account,
  balance,
  onCancel,
  tipInUSD,
  tipInETH,
  publish,
  refreshBalance,
}: Props) {
  const accountType = account?.type
  const formattedBalance = Number(balance).toFixed(5)
  const formattedTip = Number(tipInETH).toFixed(5)

  const [loading, setLoading] = useState(false)
  const [finished, setFinished] = useState(false)
  const [isError, setIsError] = useState(false)

  const confirmTip = useCallback(async () => {
    if (!publish || !tipInUSD || !accountType) return

    try {
      setLoading(true)

      if (accountType === "TRADITIONAL") {
        // Send tip via the backend
        await fetch(`/api/tip/send`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            publishId: publish.id,
            receiverId: publish.creator?.id,
            qty: tipInUSD,
          }),
        })
      } else if (accountType === "WALLET") {
        // Send tip directly from user's wallet
      }

      await refreshBalance()
      setLoading(false)
      setFinished(true)
    } catch (error) {
      setLoading(false)
      setIsError(true)
    }
  }, [publish, tipInUSD, refreshBalance, accountType])

  return (
    <ModalWrapper visible withBackdrop={false}>
      <div className="fixed z-20 inset-0" onClick={onCancel}></div>
      <div className="relative z-30 py-6 px-8 w-[90%] sm:w-[500px] max-w-[95%] h-[90%] text-left bg-white rounded-xl overflow-hidden">
        <div className="flex items-center justify-between">
          <div>
            <h6 className="mt-2">Verify information and confirm</h6>
          </div>
          <div>
            <CloseButton onClick={onCancel} />
          </div>
        </div>
        <div className="mt-5 pb-2">
          <div className="mb-2 bg-neutral-100 rounded-md py-2 px-4">
            <p>
              Tip amount:{" "}
              <span className="text-blueBase">
                {formattedTip} ETH{" "}
                <span className="italic text-textLight">
                  ({formatAmount(tipInUSD, true)})
                </span>
              </span>
            </p>
            <p>
              Creator name:{" "}
              <span className="text-blueBase">@{publish?.creator?.name}</span>
            </p>
          </div>
          <div className="bg-neutral-100 rounded-md py-2 px-4">
            <p>
              Your balance:{" "}
              <span className="text-blueBase">{formattedBalance} ETH</span>
            </p>
          </div>
          <div className="mt-10">
            {formattedTip >= formattedBalance ? (
              <div>Not enough balance</div>
            ) : (
              <button
                className="btn-dark w-full"
                disabled={loading || finished}
                onClick={confirmTip}
              >
                {loading ? (
                  <ButtonLoader loading />
                ) : finished ? (
                  <MdCheckCircle size={28} className="text-green-500" />
                ) : (
                  "CONFIRM"
                )}
              </button>
            )}
          </div>
          {isError && (
            <p className="error">Failed to send tip, please try again.</p>
          )}
        </div>
      </div>
    </ModalWrapper>
  )
}
