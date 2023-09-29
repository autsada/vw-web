import React, { useState, useCallback, useEffect } from "react"

import ModalWrapper from "@/components/ModalWrapper"
import CloseButton from "@/components/CloseButton"
import TipConfirmModal from "./TipConfirmModal"
import { formatAmount } from "@/lib/client"
import type { TipAmount } from "@/graphql/types"
import type { Publish, Account, Maybe } from "@/graphql/codegen/graphql"

interface Props {
  account?: Maybe<Account> | undefined
  closeModal: () => void
  publish: Publish
}

export default function TipModal({ closeModal, publish, account }: Props) {
  const [loadingBalance, setLoadingBalance] = useState(false)
  const [balance, setBalance] = useState("")
  const [tipInUSD, setTipInUSD] = useState<TipAmount>(1)
  const [tipInETH, setTipInETH] = useState("")
  const [isNext, setIsNext] = useState(false)

  const selectTip = useCallback((t: TipAmount) => {
    setTipInUSD(t)
  }, [])

  // Get user's wallet balance when the modal is openned.
  const getUserBalance = useCallback(async () => {
    try {
      setLoadingBalance(true)
      const res = await fetch(`/api/account/balance`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
      const data = (await res.json()) as { balance: string; address: string }
      setLoadingBalance(false)
      setBalance(data.balance)
    } catch (error) {
      setLoadingBalance(false)
    }
  }, [])
  useEffect(() => {
    getUserBalance()
  }, [getUserBalance])

  // Get tip amount in ETH
  const calculateTip = useCallback(async () => {
    try {
      setTipInETH("")
      const res = await fetch(`/api/tip/calculate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tip: tipInUSD }),
      })
      const data = (await res.json()) as { tips: string }
      setTipInETH(data.tips)
    } catch (error) {
      console.error(error)
    }
  }, [tipInUSD])

  const onNext = useCallback(() => {
    setIsNext(true)
    calculateTip()
  }, [calculateTip])

  const onBack = useCallback(() => {
    setIsNext(false)
    setTipInETH("")
  }, [])

  return (
    <ModalWrapper visible>
      <div
        className="fixed z-10 inset-0"
        onClick={loadingBalance ? undefined : closeModal}
      ></div>
      <div className="relative z-20 py-6 px-8 w-[90%] sm:w-[500px] max-w-[95%] text-left bg-white rounded-xl overflow-hidden">
        <div className="flex items-center justify-between">
          <div>
            <p className="mt-2">Send a tip to directly support the creator.</p>
          </div>
          <div>{!loadingBalance && <CloseButton onClick={closeModal} />}</div>
        </div>
        <div className="mt-5 pb-2">
          <p className="font-semibold">
            How much you want to tip{" "}
            <span className="font-semibold text-blueBase">
              @{publish?.creator?.name}
            </span>
            ?
          </p>
          <div className="mt-2 w-full grid grid-cols-3 gap-5">
            <TipItem selected={tipInUSD === 1} amount={1} onClick={selectTip} />
            <TipItem selected={tipInUSD === 2} amount={2} onClick={selectTip} />
            <TipItem selected={tipInUSD === 5} amount={5} onClick={selectTip} />
            <TipItem
              selected={tipInUSD === 10}
              amount={10}
              onClick={selectTip}
            />
            <TipItem
              selected={tipInUSD === 25}
              amount={25}
              onClick={selectTip}
            />
            <TipItem
              selected={tipInUSD === 50}
              amount={50}
              onClick={selectTip}
            />
            <TipItem
              selected={tipInUSD === 100}
              amount={100}
              onClick={selectTip}
            />
            <TipItem
              selected={tipInUSD === 1000}
              amount={1000}
              onClick={selectTip}
            />
            <TipItem
              selected={tipInUSD === 2000}
              amount={2000}
              onClick={selectTip}
            />
          </div>
          <div className="mt-6 w-full py-4 border border-neutral-400 text-center bg-gray-50">
            <span className="font-semibold text-2xl">
              {formatAmount(tipInUSD, true)}
            </span>
          </div>
          <button
            type="submit"
            className="mt-6 btn-dark px-6 rounded-full"
            onClick={onNext}
          >
            Next
          </button>
        </div>
      </div>

      {isNext && (
        <TipConfirmModal
          account={account}
          balance={balance}
          onCancel={onBack}
          tipInUSD={tipInUSD}
          tipInETH={tipInETH}
          publish={publish}
          refreshBalance={getUserBalance}
        />
      )}
    </ModalWrapper>
  )
}

function TipItem({
  amount,
  selected,
  onClick,
}: {
  amount: TipAmount
  selected: boolean
  onClick: (t: TipAmount) => void
}) {
  return (
    <div
      className={`w-[100px] h-[60px] border-[2px] flex flex-col items-center justify-center ${
        selected
          ? "bg-orangeBase border-orangeDark hover:bg-orangeDark text-white"
          : "bg-neutral-100 border-none text-textRegular hover:bg-neutral-200"
      } cursor-pointer rounded-md`}
      onClick={onClick ? onClick.bind(undefined, amount) : undefined}
    >
      <h6>{formatAmount(amount)}</h6>
    </div>
  )
}
