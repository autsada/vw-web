import React, { useCallback } from "react"

import CommentItem from "./CommentItem"
import ButtonLoader from "@/components/ButtonLoader"
import Mask from "@/components/Mask"
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll"
import type {
  Comment,
  CommentEdge,
  Maybe,
  PageInfo,
  Profile,
} from "@/graphql/codegen/graphql"
import type { CommentsOrderBy } from "@/graphql/types"

interface Props {
  isAuthenticated: boolean
  profile: Maybe<Profile> | undefined
  parentComment: Comment
  publishId: string
  subComments: CommentEdge[]
  pageInfo: PageInfo | undefined
  fetchSubComments: (parentCommentId: string, cursor?: string) => Promise<void>
  reloadSubComments: (stateHandling?: "combine" | "no-combine") => void
  loading: boolean
  openReportModal: (c: Comment) => void
  reloadComments?: (
    publishId: string,
    orderBy?: CommentsOrderBy,
    stateHandling?: "combine" | "no-combine"
  ) => void
  fetchCommentsSortBy?: CommentsOrderBy
}

export default function SubComments({
  publishId,
  parentComment,
  isAuthenticated,
  profile,
  subComments,
  pageInfo,
  fetchSubComments,
  reloadSubComments,
  loading,
  reloadComments,
  fetchCommentsSortBy,
  openReportModal,
}: Props) {
  const fetchMoreSubComments = useCallback(() => {
    if (!pageInfo || !pageInfo.endCursor || !pageInfo.hasNextPage) return

    fetchSubComments(pageInfo.endCursor)
  }, [pageInfo, fetchSubComments])
  const { observedRef } = useInfiniteScroll(1, fetchMoreSubComments)

  return (
    <>
      <CommentItem
        isAuthenticated={isAuthenticated}
        profile={profile}
        parentComment={parentComment}
        comment={parentComment}
        publishId={publishId}
        reloadComments={reloadComments}
        fetchCommentsSortBy={fetchCommentsSortBy}
        openReportModal={openReportModal}
      />

      <div className="mt-6 pl-12 flex flex-col gap-y-5">
        {subComments.length > 0 &&
          subComments
            .sort(
              (sub1, sub2) =>
                new Date(sub2?.node?.createdAt).getTime() -
                new Date(sub1?.node?.createdAt).getTime()
            )
            .map((sub) =>
              !sub.node ? null : (
                <CommentItem
                  key={sub.node.id}
                  isAuthenticated={isAuthenticated}
                  profile={profile}
                  parentComment={parentComment}
                  comment={sub.node}
                  publishId={publishId}
                  avatarSize={30}
                  isSub={true}
                  reloadComments={reloadComments}
                  reloadSubComments={reloadSubComments}
                  fetchCommentsSortBy={fetchCommentsSortBy}
                  openReportModal={openReportModal}
                />
              )
            )}

        <div ref={observedRef} className="flex justify-center">
          {loading && (
            <ButtonLoader loading={loading} size={8} color="#d4d4d4" />
          )}
        </div>
      </div>

      {/* Prevent user interactions while loading */}
      {loading && <Mask />}
    </>
  )
}
