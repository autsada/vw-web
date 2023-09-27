import React, { useState, useCallback } from "react"

import ModalWrapper from "@/components/ModalWrapper"
import CloseButton from "@/components/CloseButton"
import ConfirmModal from "@/components/ConfirmModal"
import { formatAmount } from "@/lib/client"
import type { TipAmount } from "@/graphql/types"
import type { Profile } from "@/graphql/codegen/graphql"

interface Props {
  closeModal: () => void
  creator: Profile
}

export default function TipModal({ closeModal, creator }: Props) {
  const [tip, setTip] = useState<TipAmount>(1)
  const [isNext, setIsNext] = useState(false)

  const selectTip = useCallback((t: TipAmount) => {
    setTip(t)
  }, [])

  const onNext = useCallback(() => {
    setIsNext(true)
  }, [])

  // TODO: Add a function to send tips

  return (
    <ModalWrapper visible>
      <div className="fixed z-10 inset-0" onClick={closeModal}></div>
      <div className="relative z-20 py-6 px-8 w-[500px] max-w-[95%] text-left bg-white rounded-xl overflow-hidden">
        <div className="flex items-center justify-between">
          {/* <h5>Tip @{creator.name}</h5> */}
          <div>
            <p className="mt-2">Send a tip to directly support the creator.</p>
          </div>
          <div>
            <CloseButton onClick={closeModal} />
          </div>
        </div>
        {/* <p className="mt-2 text-textLight">
          Send a tip to directly support the creator.
        </p> */}
        <div className="mt-5 pb-2">
          <p className="font-semibold">
            How much you want to tip{" "}
            <span className="font-semibold text-blueBase">@{creator.name}</span>
            ?
          </p>
          <div className="mt-2 w-full grid grid-cols-3 gap-5">
            <TipItem selected={tip === 1} amount={1} onClick={selectTip} />
            <TipItem selected={tip === 2} amount={2} onClick={selectTip} />
            <TipItem selected={tip === 5} amount={5} onClick={selectTip} />
            <TipItem selected={tip === 10} amount={10} onClick={selectTip} />
            <TipItem selected={tip === 25} amount={25} onClick={selectTip} />
            <TipItem selected={tip === 50} amount={50} onClick={selectTip} />
            <TipItem selected={tip === 100} amount={100} onClick={selectTip} />
            <TipItem
              selected={tip === 1000}
              amount={1000}
              onClick={selectTip}
            />
            <TipItem
              selected={tip === 2000}
              amount={2000}
              onClick={selectTip}
            />
          </div>
          <div className="mt-6 w-full py-4 border border-neutral-400 text-center bg-gray-50">
            <span className="font-semibold text-2xl">
              {formatAmount(tip, true)}
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
        <ConfirmModal onCancel={closeModal} onConfirm={() => {}}>
          <form>
            <p className="text-lg">
              You are going to send a tip to @{creator.name}.
            </p>
            <div className="mt-4 flex items-center justify-center font-semibold text-2xl">
              {formatAmount(tip, true)} = `Value in ETH`
            </div>
            <input type="hidden" defaultValue={tip} />
          </form>
        </ConfirmModal>
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
