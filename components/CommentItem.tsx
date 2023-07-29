import React, { useState, useCallback, useTransition, useMemo } from "react"
import {
  AiOutlineDislike,
  AiFillDislike,
  AiFillLike,
  AiOutlineLike,
  AiOutlineFlag,
} from "react-icons/ai"
import _ from "lodash"
import { HiDotsHorizontal } from "react-icons/hi"

import Avatar from "@/components/Avatar"
import CommentBox from "./CommentBox"
import ProfileName from "@/components/ProfileName"
import Mask from "@/components/Mask"
import { useExpandContent } from "@/hooks/useExpandContent"
import { useAuthContext } from "@/context/AuthContext"
import { calculateTimeElapsed } from "@/lib/client"
import {
  commentOnVideoComment,
  likePublishComment,
  disLikePublishComment,
  deletePublishComment,
} from "@/app/actions/publish-actions"
import { wait } from "@/lib/helpers"
import type { Comment, Maybe, Profile } from "@/graphql/codegen/graphql"
import type { CommentsOrderBy } from "@/graphql/types"

interface Props {
  isAuthenticated: boolean
  profile: Maybe<Profile> | undefined
  publishId: string
  parentComment?: Comment
  comment: Comment
  avatarSize?: number
  isSub?: boolean
  openReportModal: (c: Comment) => void
  reloadSubComments?: (stateHandling?: "combine" | "no-combine") => void
  reloadComments?: (
    publishId: string,
    orderBy?: CommentsOrderBy,
    stateHandling?: "combine" | "no-combine"
  ) => void
  fetchCommentsSortBy?: CommentsOrderBy
}

export default function CommentItem({
  isAuthenticated,
  profile,
  parentComment,
  comment,
  publishId,
  avatarSize = 40,
  isSub = false,
  reloadComments,
  fetchCommentsSortBy,
  reloadSubComments,
  openReportModal,
}: Props) {
  const parentCommentId = parentComment?.id
  const commentId = comment?.id || ""
  const content = comment?.content || ""
  const initialDisplayed = 200
  const { displayedContent, expandContent, shrinkContent } = useExpandContent(
    content,
    initialDisplayed
  )

  const liked = !!comment?.liked
  const likesCount = comment?.likesCount || 0
  const disLiked = !!comment?.disLiked

  const [isReplying, setIsReplying] = useState(false)
  const [optimisticLiked, setOptimisticLiked] = useState(liked)
  const [optimisticLikesCount, setOptimisticLikesCount] = useState(likesCount)
  const [optimisticDisLiked, setOptimisticDisLiked] = useState(disLiked)
  const [deleteModalVisible, setDeletModalVisible] = useState(false)

  const [isPending, startTransition] = useTransition()
  const { onVisible: openAuthModal } = useAuthContext()

  const toggleCommentBox = useCallback(() => {
    if (!isAuthenticated) {
      openAuthModal("Sign in to reply.")
    } else {
      setIsReplying((prev) => !prev)
    }
  }, [isAuthenticated, openAuthModal])

  const confirmReply = useCallback(async () => {
    if (!publishId || !commentId) return null
    const el = document.getElementById(
      `${commentId}-comment-box`
    ) as HTMLTextAreaElement
    if (!el) return null

    const content = el.value
    if (!content) return null

    if (parentCommentId) {
      // Commenting on a sub-comment, we need to pass the id of the parent of the sub-comment.
      startTransition(() =>
        commentOnVideoComment(content, publishId, parentCommentId)
      )
    } else {
      // Commenting to a comment
      startTransition(() =>
        commentOnVideoComment(content, publishId, commentId)
      )
    }
    // Close input box
    setIsReplying(false)
    // Clear text input
    el.value = ""

    // Reload comments
    // Wait 1000 ms before loading
    if (reloadComments) {
      await wait(1000)
      reloadComments(publishId, fetchCommentsSortBy)
    }

    if (reloadSubComments) {
      await wait(1000)
      reloadSubComments()
    }

    return "Ok"
  }, [
    publishId,
    parentCommentId,
    commentId,
    reloadComments,
    fetchCommentsSortBy,
    reloadSubComments,
  ])

  const clearComment = useCallback(() => {
    if (!commentId) return
    const el = document.getElementById(
      `${commentId}-comment-box`
    ) as HTMLTextAreaElement
    if (!el) return

    el.value = ""
  }, [commentId])

  const handleLikeComment = useCallback(async () => {
    if (!publishId || !commentId) return

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
      startTransition(() => likePublishComment(publishId, commentId))
      // Reload comments
      // Wait 1000 ms before loading
      if (reloadComments) {
        await wait(1000)
        reloadComments(publishId, fetchCommentsSortBy)
      }
    }
  }, [
    isAuthenticated,
    openAuthModal,
    publishId,
    commentId,
    liked,
    likesCount,
    disLiked,
    reloadComments,
    fetchCommentsSortBy,
  ])

  const likeDebounce = useMemo(
    () => _.debounce(handleLikeComment, 200),
    [handleLikeComment]
  )

  const handleDisLikeComment = useCallback(async () => {
    if (!publishId || !commentId) return

    if (!isAuthenticated) {
      openAuthModal()
    } else {
      setOptimisticDisLiked(!disLiked)
      if (!disLiked && liked) {
        setOptimisticLiked(!liked)
        setOptimisticLikesCount(likesCount > 0 ? likesCount - 1 : likesCount)
      }
      startTransition(() => disLikePublishComment(publishId, commentId))
      // Reload comments
      // Wait 1000 ms before loading
      if (reloadComments) {
        await wait(1000)
        reloadComments(publishId, fetchCommentsSortBy)
      }
    }
  }, [
    isAuthenticated,
    openAuthModal,
    publishId,
    commentId,
    disLiked,
    liked,
    likesCount,
    reloadComments,
    fetchCommentsSortBy,
  ])

  const disLikeDebounce = useMemo(
    () => _.debounce(handleDisLikeComment, 200),
    [handleDisLikeComment]
  )

  const toggleDeleteModal = useCallback(() => {
    if (!isAuthenticated) {
      openAuthModal("Sign in to reply.")
    } else {
      setDeletModalVisible((prev) => !prev)
    }
  }, [isAuthenticated, openAuthModal])

  const deleteItem = useCallback(
    async (id: string) => {
      if (!isAuthenticated) {
        openAuthModal()
      } else {
        startTransition(() => deletePublishComment(id))
        toggleDeleteModal()

        if (reloadSubComments) {
          await wait(1000)
          reloadSubComments("no-combine")
        }

        if (reloadComments) {
          await wait(1000)
          reloadComments(publishId, fetchCommentsSortBy, "no-combine")
        }
      }
    },
    [
      isAuthenticated,
      openAuthModal,
      toggleDeleteModal,
      reloadSubComments,
      publishId,
      reloadComments,
      fetchCommentsSortBy,
    ]
  )

  return (
    <div className="relative w-full flex items-start gap-x-4">
      <div>
        <Avatar
          profile={comment.creator}
          width={avatarSize}
          height={avatarSize}
        />
      </div>

      <div className="flex-grow">
        {/* Comment owner */}
        <div className="flex items-center gap-x-4">
          <ProfileName
            profile={comment.creator}
            fontSize={isSub ? "sm" : "base"}
          />
          <p className="italic text-xs text-textExtraLight">
            {calculateTimeElapsed(comment.createdAt)}
          </p>
        </div>

        {/* Content */}
        <div
          className={`mt-1 ${
            isSub ? "text-xs sm:text-sm" : "text-sm sm:text-base"
          }`}
        >
          {displayedContent}{" "}
          {comment.content &&
            comment?.content.length > displayedContent.length && (
              <span
                className="ml-1 font-semibold cursor-pointer"
                onClick={expandContent}
              >
                Show more
              </span>
            )}
          {content.length > initialDisplayed &&
            content.length === displayedContent.length && (
              <p
                className="mt-2 font-semibold cursor-pointer text-sm"
                onClick={shrinkContent}
              >
                Show less
              </p>
            )}
        </div>

        {/* Like/Dislike */}
        <div className="mt-2 flex items-center gap-x-8">
          <div className="flex items-center gap-x-2">
            <div
              className="cursor-pointer w-[70px] py-1 flex items-center justify-center gap-x-2 rounded-full hover:bg-neutral-100"
              onClick={likeDebounce}
            >
              {optimisticLiked ? (
                <AiFillLike size={20} />
              ) : (
                <AiOutlineLike size={20} />
              )}
              <p className="text-sm text-textLight">
                {optimisticLikesCount > 0 ? optimisticLikesCount : <>&nbsp;</>}
              </p>
            </div>
            <div
              className="w-[40px] cursor-pointer p-1 flex items-center justify-center rounded-full hover:bg-neutral-100"
              onClick={disLikeDebounce}
            >
              {optimisticDisLiked ? (
                <AiFillDislike size={20} />
              ) : (
                <AiOutlineDislike size={20} />
              )}
            </div>
          </div>

          <div
            className="w-[40px] cursor-pointer p-1 flex items-center justify-center rounded-full hover:bg-neutral-100"
            onClick={openReportModal.bind(undefined, comment)}
          >
            <AiOutlineFlag size={20} />
          </div>

          <button
            className={`mx-0 font-semibold ${
              isSub ? "text-xs" : "text-sm"
            } hover:bg-neutral-100 px-3 h-8 rounded-full`}
            onClick={toggleCommentBox}
          >
            Reply
          </button>
        </div>

        {/* Reply box */}
        {isAuthenticated && isReplying && (
          <CommentBox
            inputId={`${commentId}-comment-box`}
            profile={profile}
            avatarSize={avatarSize}
            replyTo={parentComment ? `@${comment.creator?.name}` : undefined}
            onSubmit={confirmReply}
            fontSize="sm"
            clearComment={clearComment}
          />
        )}
      </div>

      {/* Show this for comment owner  */}
      {profile?.id === comment.creator?.id &&
        parentComment?.id !== comment?.id && (
          <>
            <div
              className="absolute cursor-pointer right-1 top-1"
              onClick={toggleDeleteModal}
            >
              <HiDotsHorizontal size={isSub ? 18 : 24} />
            </div>
            {deleteModalVisible && (
              <div className="absolute cursor-pointer right-1 top-8 rounded-md overflow-hidden shadow-2xl">
                <button
                  type="button"
                  className="w-full h-full py-1 px-2 text-sm justify-start bg-neutral-100 hover:bg-neutral-200"
                  onClick={deleteItem.bind(undefined, comment.id)}
                >
                  Delete
                </button>
              </div>
            )}
          </>
        )}

      {isPending && <Mask />}
    </div>
  )
}
