import React, { useCallback, useTransition, useMemo, useState } from "react"
import {
  AiOutlineDislike,
  AiFillDislike,
  AiFillLike,
  AiOutlineLike,
} from "react-icons/ai"
import _ from "lodash"

import Reaction from "./Reaction"
import Mask from "@/components/Mask"
import { useAuthContext } from "@/context/AuthContext"
import { likePublish, disLikePublish } from "@/app/actions/publish-actions"

interface Props {
  isAuthenticated: boolean
  publishId: string
  liked: boolean
  likesCount: number
  disLiked: boolean
  withDescription?: boolean
  likeButtonWidth?: string // w-[100px] for exp
  dislikeButtonWidth?: string // w-[100px] for exp
  likeButtonHeight?: string // h-[40px] for exp
  dislikeButtonHeight?: string // h-[40px] for exp
  verticalLayout?: boolean
  descriptionColor?: string // text-white for exp
}

export default function LikeReaction({
  isAuthenticated,
  publishId,
  liked,
  likesCount,
  disLiked,
  withDescription = true,
  likeButtonWidth,
  dislikeButtonWidth,
  likeButtonHeight,
  dislikeButtonHeight,
  verticalLayout = false,
  descriptionColor,
}: Props) {
  const [isPending, startTransition] = useTransition()

  const [prevLiked, setPrevLiked] = useState(!!liked)
  const [optimisticLiked, setOptimisticLiked] = useState(!!liked)
  // When liked changed
  if (!!liked !== prevLiked) {
    setOptimisticLiked(!!liked)
    setPrevLiked(!!liked)
  }

  const [prevLikesCount, setPrevLikesCount] = useState(likesCount)
  const [optimisticLikesCount, setOptimisticLikesCount] = useState(likesCount)
  // When likes count changed
  if (likesCount !== prevLikesCount) {
    setOptimisticLikesCount(likesCount)
    setPrevLikesCount(likesCount)
  }

  const [prevDisLiked, setPrevDisLiked] = useState(!!disLiked)
  const [optimisticDisLiked, setOptimisticDisLiked] = useState(!!disLiked)
  // When disLiked changed
  if (!!disLiked !== prevDisLiked) {
    setOptimisticDisLiked(!!disLiked)
    setPrevDisLiked(!!disLiked)
  }

  const { onVisible: openAuthModal } = useAuthContext()

  const handleLikePublish = useCallback(() => {
    if (!publishId) return

    if (!isAuthenticated) {
      openAuthModal()
    } else {
      setOptimisticLiked(!liked)
      if (!liked && disLiked) {
        setOptimisticDisLiked(!disLiked)
      }
      setOptimisticLikesCount(
        liked ? (likesCount > 0 ? likesCount - 1 : likesCount) : likesCount + 1
      )
      startTransition(() => likePublish(publishId))
    }
  }, [isAuthenticated, openAuthModal, publishId, liked, likesCount, disLiked])

  const likeDebounce = useMemo(
    () => _.debounce(handleLikePublish, 200),
    [handleLikePublish]
  )

  const handleDisLikePublish = useCallback(() => {
    if (!publishId) return

    if (!isAuthenticated) {
      openAuthModal()
    } else {
      setOptimisticDisLiked(!disLiked)
      if (!disLiked && liked) {
        setOptimisticLiked(!liked)
        setOptimisticLikesCount(likesCount > 0 ? likesCount - 1 : likesCount)
      }
      startTransition(() => disLikePublish(publishId))
    }
  }, [isAuthenticated, openAuthModal, publishId, disLiked, liked, likesCount])

  const disLikeDebounce = useMemo(
    () => _.debounce(handleDisLikePublish, 200),
    [handleDisLikePublish]
  )

  return (
    <>
      <Reaction
        IconOutline={AiOutlineLike}
        IconFill={AiFillLike}
        description={`${optimisticLikesCount || ""}`}
        withDescription={withDescription}
        descriptionColor={descriptionColor}
        isActive={optimisticLiked}
        onClick={likeDebounce}
        width={likeButtonWidth}
        height={likeButtonHeight}
        verticalLayout={verticalLayout}
      />
      <Reaction
        IconOutline={AiOutlineDislike}
        IconFill={AiFillDislike}
        withDescription={false}
        isActive={optimisticDisLiked}
        onClick={disLikeDebounce}
        width={dislikeButtonWidth}
        height={dislikeButtonHeight}
        verticalLayout={verticalLayout}
      />

      {/* Prevent interaction while loading */}
      {isPending && <Mask />}
    </>
  )
}
