import React, { useState, useCallback, useMemo } from "react"
import { MdCheckCircle, MdContentCopy, MdOutlineRefresh } from "react-icons/md"
import Link from "next/link"

import ModalWrapper from "./ModalWrapper"
import CloseButton from "./CloseButton"
import ButtonLoader from "./ButtonLoader"
import { formatAmount } from "@/lib/client"
import type { Publish, Account, Maybe } from "@/graphql/codegen/graphql"

interface Props {
  account?: Maybe<Account> | undefined
  balance: string
  loadingBalance: boolean
  onCancel: () => void
  tipInUSD: number // Tip in USD
  tipInETH: string // Tip in ETH
  publish: Publish
  refreshBalance: () => Promise<void>
}

export default function TipConfirmModal({
  account,
  balance,
  loadingBalance,
  onCancel,
  tipInUSD,
  tipInETH,
  publish,
  refreshBalance,
}: Props) {
  const accountType = account?.type
  const formattedBalance = useMemo(
    () =>
      !balance || loadingBalance
        ? "   loading...   "
        : `${Number(balance).toFixed(5)} ETH`,
    [balance, loadingBalance]
  )
  const formattedTip = useMemo(
    () =>
      !tipInETH ? "   checking...   " : `${Number(tipInETH).toFixed(5)} ETH `,
    [tipInETH]
  )
  const isBalanceEnough = useMemo(
    () =>
      tipInETH && balance
        ? parseFloat(balance) - parseFloat(tipInETH) > 0.0003
        : true, // Assump that gas cost is 0.0003 ETH per transaction
    [tipInETH, balance]
  )

  const [loading, setLoading] = useState(false)
  const [finished, setFinished] = useState(false)
  const [isError, setIsError] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

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

  const clickToCopy = useCallback(async (addr: string) => {
    // Use the Clipboard API to copy text to the clipboard
    await navigator.clipboard.writeText(addr)
    setIsCopied(true)

    // Reset the copied state after a short delay
    const id = setTimeout(() => {
      setIsCopied(false)
      clearTimeout(id)
    }, 1000) // You can adjust the duration as needed
  }, [])

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
            <p className=" text-sm">
              Tip amount:{" "}
              <span className="text-blueBase">
                {formattedTip}
                <span className="italic text-textLight">
                  ({formatAmount(tipInUSD, true)})
                </span>
              </span>
            </p>
            <p className=" text-sm">
              Creator name:{" "}
              <span className="text-blueBase">@{publish?.creator?.name}</span>
            </p>
          </div>
          <div className="bg-neutral-100 rounded-md py-2 px-4">
            <div className="flex items-end gap-x-4 bg-gray-100 rounded-lg cursor-pointer">
              <p className=" text-sm">
                Your balance:{" "}
                <span className="text-blueBase">{formattedBalance}</span>
              </p>
              <div>
                <MdOutlineRefresh
                  size={20}
                  className="cursor-pointer"
                  onClick={refreshBalance}
                />
              </div>
            </div>
            <div className="relative">
              <div className="flex items-end gap-x-4 bg-gray-100 rounded-lg cursor-pointer">
                <p className=" text-sm">
                  Your wallet address:{" "}
                  <span className="text-blueBase">{account?.owner}</span>
                </p>
                <div>
                  <MdContentCopy
                    size={20}
                    className="cursor-pointer"
                    onClick={clickToCopy.bind(undefined, account?.owner!)}
                  />
                </div>
              </div>
              {isCopied && (
                <div className="absolute top-0 right-5 flex items-center justify-center p-1 rounded-sm bg-black text-white text-xs">
                  Copied
                </div>
              )}
            </div>
          </div>
          <div className="mt-10">
            {!isBalanceEnough && (
              <div className="mb-10 py-2 px-4 rounded-md bg-neutral-200">
                <p className="error font-semibold text-base">
                  Your balance is not enough to cover the tip.
                </p>
                <p className="text-sm my-1">
                  You can buy some ETH to increase your balance from the below
                  link.
                </p>
                <Link href="https://global.transak.com/" target="blank">
                  <button className="btn-orange px-5 rounded-full">
                    Buy ETH
                  </button>
                </Link>
                <p className="mt-2 italic text-xs text-blueLight">
                  Once finished, you can click the reload icon above to update
                  your balance.
                </p>
              </div>
            )}
            <button
              className={`btn-dark w-full ${
                loading || finished || !isBalanceEnough
                  ? "cursor-not-allowed"
                  : ""
              }`}
              disabled={loading || finished || !isBalanceEnough}
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
          </div>
          {isError && (
            <p className="error">Failed to send tip, please try again.</p>
          )}
        </div>
      </div>
    </ModalWrapper>
  )
}
