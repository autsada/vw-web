import React, { useState, useCallback } from "react"
import { AiOutlineShareAlt } from "react-icons/ai"

import Reaction from "./Reaction"
import ShareModal from "./ShareModal"
import { BASE_URL } from "@/lib/constants"
import type { PublishType } from "@/graphql/types"

interface Props {
  publishId: string
  publishType: PublishType
  title: string
  withDescription?: boolean
}

export default function ShareReaction({
  publishId,
  publishType,
  title,
  withDescription = true,
}: Props) {
  const [shareModalVisible, setShareModalVisible] = useState(false)

  const openShareModal = useCallback(() => {
    setShareModalVisible(true)
  }, [])

  const closeShareModal = useCallback(() => {
    setShareModalVisible(false)
  }, [])

  const onStartShare = useCallback(async () => {
    if (typeof window === "undefined" || !publishId) return

    const shareData = {
      title: title || "",
      text: title || "",
      url: `${BASE_URL}/${
        publishType === "Blog" ? "read" : "watch"
      }/${publishId}`,
    }

    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData)
      } catch (error) {
        console.error(error)
      }
    } else {
      openShareModal()
    }
  }, [publishId, publishType, title, openShareModal])

  return (
    <>
      <Reaction
        IconOutline={AiOutlineShareAlt}
        IconFill={AiOutlineShareAlt}
        description="Share"
        withDescription={withDescription}
        isActive={false}
        onClick={onStartShare}
      />

      {shareModalVisible && (
        <ShareModal
          title={title}
          closeModal={closeShareModal}
          shareUrl={`${BASE_URL}/watch/${publishId}`}
        />
      )}
    </>
  )
}
