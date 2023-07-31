import React, { useState, useCallback, useTransition, useMemo } from "react"
import {
  AiOutlineDislike,
  AiFillDislike,
  AiFillLike,
  AiOutlineLike,
  AiOutlineFlag,
} from "react-icons/ai"
import { HiDotsHorizontal } from "react-icons/hi"
import _ from "lodash"
import parse from "html-react-parser"

import Avatar from "@/components/Avatar"
import CommentBox from "./CommentBox"
import ProfileName from "@/components/ProfileName"
import { useAuthContext } from "@/context/AuthContext"
import { calculateTimeElapsed } from "@/lib/client"
import {
  commentOnBlogComment,
  deletePublishComment,
  disLikePublishComment,
  likePublishComment,
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
  reloadComments?: (
    publishId: string,
    orderBy?: CommentsOrderBy,
    stateHandling?: "combine" | "no-combine"
  ) => void
  reloadSubComments?: (stateHandling?: "combine" | "no-combine") => void
}

export default function CommentItem({
  isAuthenticated,
  profile,
  publishId,
  parentComment,
  comment,
  avatarSize,
  isSub = false,
  openReportModal,
  reloadComments,
  reloadSubComments,
}: Props) {
  const parentCommentId = parentComment?.id
  const commentId = comment?.id || ""
  const content = comment?.htmlContentBlog
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

  const handleLikeComment = useCallback(async () => {
    if (!publishId || !commentId) return

    if (!isAuthenticated) {
      openAuthModal("Sign in to react to comments.")
    } else {
      setOptimisticLiked(!liked)
      if (!liked && disLiked) {
        setOptimisticDisLiked(!disLiked)
      }
      setOptimisticLikesCount(
        liked ? (likesCount > 0 ? likesCount - 1 : likesCount) : likesCount + 1
      )
      startTransition(() => likePublishComment(publishId, commentId))

      if (reloadComments) {
        await wait(1000)
        reloadComments(publishId)
      }

      if (reloadSubComments) {
        await wait(1000)
        reloadSubComments()
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
    reloadSubComments,
  ])

  const likeDebounce = useMemo(
    () => _.debounce(handleLikeComment, 200),
    [handleLikeComment]
  )

  const handleDisLikeComment = useCallback(async () => {
    if (!publishId || !commentId) return

    if (!isAuthenticated) {
      openAuthModal("Sign in to react to comments.")
    } else {
      setOptimisticDisLiked(!disLiked)
      if (!disLiked && liked) {
        setOptimisticLiked(!liked)
        setOptimisticLikesCount(likesCount > 0 ? likesCount - 1 : likesCount)
      }
      startTransition(() => disLikePublishComment(publishId, commentId))

      if (reloadComments) {
        await wait(1000)
        reloadComments(publishId)
      }

      if (reloadSubComments) {
        await wait(1000)
        reloadSubComments()
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
    reloadSubComments,
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
      }
    },
    [isAuthenticated, openAuthModal, toggleDeleteModal, reloadSubComments]
  )

  const replyComment = useCallback(
    async (content: string, htmlContent: string) => {
      if (!publishId || !commentId || !content || !htmlContent) return

      if (!isAuthenticated) {
        openAuthModal("Sign in to reply.")
      } else {
        if (parentCommentId) {
          // Commenting on a sub-comment, we need to pass the id of the parent of the sub-comment.
          startTransition(() =>
            commentOnBlogComment({
              publishId: publishId,
              commentId: parentCommentId,
              contentBlog: content,
              htmlContentBlog: htmlContent,
            })
          )
        } else {
          // Commenting to a comment
          startTransition(() =>
            commentOnBlogComment({
              publishId: publishId,
              commentId,
              contentBlog: content,
              htmlContentBlog: htmlContent,
            })
          )
        }

        if (reloadComments) {
          await wait(1000)
          reloadComments(publishId)
        }

        if (reloadSubComments) {
          await wait(1000)
          reloadSubComments()
        }
      }
    },
    [
      isAuthenticated,
      openAuthModal,
      publishId,
      parentCommentId,
      commentId,
      reloadComments,
      reloadSubComments,
    ]
  )

  return (
    <div className="relative">
      <div className="flex gap-x-4">
        <Avatar
          profile={comment.creator}
          width={avatarSize}
          height={avatarSize}
        />
        {/* Owner info */}
        <div className="flex items-center gap-x-4">
          <ProfileName
            profile={comment.creator}
            fontSize={isSub ? "sm" : "base"}
          />
          <p className="italic text-xs text-textExtraLight">
            {calculateTimeElapsed(comment.createdAt)}
          </p>
        </div>
      </div>

      <div className="mt-5">
        {/* Content */}
        {content && (
          <article className="max-w-none prose prose-a:text-blue-500 prose-blockquote:font-light prose-blockquote:italic">
            {parse(content)}
          </article>
        )}
      </div>

      {/* Like/Dislike */}
      <div className="mt-4 flex items-center gap-x-8">
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
              {optimisticLikesCount > 0 ? optimisticLikesCount : null}
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

      <div className="mt-5 pl-5 sm:pl-8 md:pl-12">
        {isReplying && isAuthenticated && (
          <CommentBox
            profile={profile}
            placeholder="Your reply..."
            avatarSize={30}
            submitComment={replyComment}
            cancelEdit={toggleCommentBox}
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
    </div>
  )
}
