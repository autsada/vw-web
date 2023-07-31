import React from "react"

import BlogCommentItem from "./BlogCommentItem"
import type { Comment, Maybe, Profile } from "@/graphql/codegen/graphql"
import type { CommentsOrderBy } from "@/graphql/types"

interface Props {
  isAuthenticated: boolean
  profile: Maybe<Profile> | undefined
  publishId: string
  comment: Maybe<Comment> | undefined
  openSubComments: (c: Comment) => void
  openReportModal: (c: Comment) => void
  reloadComments?: (
    publishId: string,
    orderBy?: CommentsOrderBy,
    stateHandling?: "combine" | "no-combine"
  ) => void
}

export default function CommentBaseItem({
  isAuthenticated,
  profile,
  publishId,
  comment,
  openSubComments,
  openReportModal,
  reloadComments,
}: Props) {
  if (!comment) return null

  return (
    <div className="py-5 border-b border-neutral-200">
      <BlogCommentItem
        isAuthenticated={isAuthenticated}
        profile={profile}
        comment={comment}
        publishId={publishId}
        openReportModal={openReportModal}
        reloadComments={reloadComments}
      />

      {/* Comments */}
      {comment.commentsCount > 0 && (
        <div className="mt-2">
          <div
            className="w-max py-2 px-4 rounded-full flex items-center gap-x-1 font-semibold text-blueBase text-sm cursor-pointer hover:bg-neutral-100"
            onClick={openSubComments.bind(undefined, comment)}
          >
            <p>{comment.commentsCount}</p>
            <p>repl{comment.commentsCount === 1 ? "y" : "ies"}</p>
          </div>
        </div>
      )}
    </div>
  )
}
