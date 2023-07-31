import React, { useTransition, useCallback } from "react"
import { AiOutlineShareAlt } from "react-icons/ai"
import { IoTrashOutline } from "react-icons/io5"
import { toast } from "react-toastify"
import type { IconType } from "react-icons"

import ModalWrapper from "@/components/ModalWrapper"
import Mask from "@/components/Mask"
import { useAuthContext } from "@/context/AuthContext"
import { removeOneBookmark } from "@/app/actions/publish-actions"
import { BASE_URL } from "@/lib/constants"
import type { Publish } from "@/graphql/codegen/graphql"

interface Props {
  isAuthenticated: boolean
  closeModal: () => void
  top: number
  left: number
  publish?: Publish
  openShareModal: () => void
}

export default function ReadingListActionsModal({
  isAuthenticated,
  closeModal,
  publish,
  top,
  left,
  openShareModal,
}: Props) {
  const { onVisible: openAuthModal } = useAuthContext()
  const [isPending, startTransition] = useTransition()

  const removeItem = useCallback(() => {
    if (!publish) return

    if (!isAuthenticated) {
      openAuthModal()
    } else {
      startTransition(() => removeOneBookmark(publish.id))
      toast.success("Removed from Reading list", { theme: "dark" })
    }
    closeModal()
  }, [publish, isAuthenticated, openAuthModal, closeModal])

  const onStartShare = useCallback(async () => {
    if (typeof window === "undefined" || !publish) return

    const shareData = {
      title: publish.title || "",
      text: publish.title || "",
      url: `${BASE_URL}/read/${publish.id}`,
    }

    if (navigator.share && navigator.canShare(shareData)) {
      try {
        closeModal()
        await navigator.share(shareData)
      } catch (error) {
        console.error(error)
      }
    } else {
      openShareModal()
    }
  }, [publish, openShareModal, closeModal])

  return (
    <ModalWrapper visible>
      <div className="relative z-0 w-full h-full">
        <div className="relative z-0 w-full h-full" onClick={closeModal}></div>

        <div
          className={`absolute z-10 flex flex-col items-center justify-center bg-white rounded-xl w-[300px] h-[140px]`}
          style={{
            top,
            left,
          }}
        >
          <Item
            Icon={IoTrashOutline}
            text="Remove from reading list"
            onClick={removeItem}
          />
          <Item Icon={AiOutlineShareAlt} text="Share" onClick={onStartShare} />
        </div>
      </div>

      {/* Prevent interaction while loading */}
      {isPending && <Mask />}
    </ModalWrapper>
  )
}

function Item({
  Icon,
  text,
  onClick,
}: {
  Icon: IconType
  text: string
  onClick: React.MouseEventHandler<HTMLDivElement> | undefined
}) {
  return (
    <div
      className="w-full flex items-center justify-center py-2 px-8 my-1 cursor-pointer hover:bg-neutral-100"
      onClick={onClick}
    >
      <div className="w-[30px] flex items-center justify-center">
        <Icon size={24} />
      </div>
      <div className="flex-grow text-left">
        <p className="font-light ml-5">{text}</p>
      </div>
    </div>
  )
}
