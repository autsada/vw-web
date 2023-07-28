"use client"

import React, { useState, useCallback, useTransition, useMemo } from "react"
import Link from "next/link"
import _ from "lodash"
import { AiOutlinePlus, AiOutlineCheck } from "react-icons/ai"

import ConfirmModal from "@/components/ConfirmModal"
import { useAuthContext } from "@/context/AuthContext"
import { followProfile } from "@/app/actions/profile-actions"
import type { Profile } from "@/graphql/codegen/graphql"

interface Props {
  isAuthenticated: boolean
  follow: Profile
  ownerHref: string
  ownerLinkText: string
  useIconStyle?: boolean
}

export default function ManageFollow({
  isAuthenticated,
  follow,
  ownerHref,
  ownerLinkText,
  useIconStyle = false,
}: Props) {
  const isOwner = follow?.isOwner
  const followerId = follow?.id
  const followerName = follow?.name
  const isFollowing = !!follow?.isFollowing
  const [prevFollowingStatus, setPrevFollowingStatus] = useState(isFollowing)
  const [optimisticFollowing, setOptimisticFollowing] = useState(isFollowing)

  // When following status changed
  if (isFollowing !== prevFollowingStatus) {
    // Update the displayed following status (optimisticFollowing)
    setOptimisticFollowing(isFollowing)
    setPrevFollowingStatus(isFollowing)
  }

  const { onVisible: openAuthModal } = useAuthContext()
  const [isPending, startTransition] = useTransition()

  const [followingText, setFollowingText] = useState<"Following" | "Unfollow">(
    "Following"
  )
  const [confirmModalVisible, setConfirmModalVisible] = useState(false)

  const handleFollow = useCallback(() => {
    if (!followerId) return

    if (!isAuthenticated) {
      openAuthModal()
    } else {
      setOptimisticFollowing(!isFollowing)

      startTransition(() => followProfile(followerId))
      if (confirmModalVisible) setConfirmModalVisible(false)
    }
  }, [
    isAuthenticated,
    openAuthModal,
    followerId,
    isFollowing,
    confirmModalVisible,
  ])

  const followDebounce = useMemo(
    () => _.debounce(handleFollow, 200),
    [handleFollow]
  )

  const onMouseOverFollowing = useCallback(() => {
    setFollowingText("Unfollow")
  }, [])

  const onMouseLeaveFollowing = useCallback(() => {
    setFollowingText("Following")
  }, [])

  const openConfirmModal = useCallback(() => {
    setConfirmModalVisible(true)
  }, [])

  const closeConfirmModal = useCallback(() => {
    setConfirmModalVisible(false)
  }, [])

  if (!follow) return null

  return useIconStyle ? (
    <>
      {!isOwner && (
        <div
          className={`w-[20px] h-[20px] mx-auto flex items-center justify-center ${
            !optimisticFollowing ? "bg-orangeBase" : "bg-blueBase"
          } rounded-full cursor-pointer`}
          onClick={isPending ? undefined : followDebounce}
        >
          {!optimisticFollowing ? (
            <AiOutlinePlus size={12} className="text-white" />
          ) : (
            <AiOutlineCheck size={12} className="text-white" />
          )}
        </div>
      )}
    </>
  ) : (
    <>
      {isOwner ? (
        <Link href={ownerHref}>
          <button className="btn-dark text-sm sm:text-base px-5 rounded-full">
            {ownerLinkText}
          </button>
        </Link>
      ) : optimisticFollowing ? (
        <button
          type="button"
          className={`btn-blue text-sm sm:text-base mx-0 w-[90px] h-8 sm:h-10 sm:w-[110px] rounded-full ${
            followingText === "Following"
              ? "text-white bg-blueBase"
              : "text-red-500 bg-blueLighter hover:bg-blueLighter"
          }`}
          onClick={openConfirmModal}
          onMouseOver={onMouseOverFollowing}
          onMouseLeave={onMouseLeaveFollowing}
        >
          {followingText}
        </button>
      ) : (
        <button
          type="button"
          className="btn-orange mx-0 text-sm sm:text-base w-[80px] h-8 sm:h-10 sm:w-[110px] rounded-full"
          onClick={followDebounce}
        >
          Follow
        </button>
      )}

      {confirmModalVisible && (
        <ConfirmModal onCancel={closeConfirmModal} onConfirm={followDebounce}>
          <div className="mb-8">
            <h5>
              Unfollow <span className="text-blueBase">@{followerName}</span>?
            </h5>
          </div>
        </ConfirmModal>
      )}
    </>
  )
}
