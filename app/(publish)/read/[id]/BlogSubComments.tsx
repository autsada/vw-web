import React, { useCallback } from "react"

import BlogCommentItem from "./BlogCommentItem"
import ButtonLoader from "@/components/ButtonLoader"
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll"
import type {
  Maybe,
  Profile,
  Comment,
  CommentEdge,
  PageInfo,
} from "@/graphql/codegen/graphql"
import type { CommentsOrderBy } from "@/graphql/types"

interface Props {
  isAuthenticated: boolean
  profile: Maybe<Profile> | undefined
  publishId: string
  parentComment: Comment
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
}

export default function SubComments({
  isAuthenticated,
  profile,
  parentComment,
  publishId,
  subComments,
  pageInfo,
  fetchSubComments,
  reloadSubComments,
  loading,
  openReportModal,
  reloadComments,
}: Props) {
  const fetchMoreSubComments = useCallback(() => {
    if (!pageInfo || !pageInfo.endCursor || !pageInfo.hasNextPage) return

    fetchSubComments(pageInfo.endCursor)
  }, [pageInfo, fetchSubComments])
  const { observedRef } = useInfiniteScroll(1, fetchMoreSubComments)

  return (
    <>
      <BlogCommentItem
        isAuthenticated={isAuthenticated}
        profile={profile}
        parentComment={parentComment}
        comment={parentComment}
        publishId={publishId}
        reloadSubComments={reloadSubComments}
        openReportModal={openReportModal}
        reloadComments={reloadComments}
      />

      <div className="mt-6 pl-12 flex flex-col">
        {subComments
          .sort(
            (sub1, sub2) =>
              new Date(sub2?.node?.createdAt).getTime() -
              new Date(sub1?.node?.createdAt).getTime()
          )
          .map((sub) =>
            !sub.node ? null : (
              <div
                key={sub.node?.id}
                className="pt-5 pb-2 border-b border-neutral-200"
              >
                <BlogCommentItem
                  isAuthenticated={isAuthenticated}
                  profile={profile}
                  parentComment={parentComment}
                  comment={sub.node}
                  publishId={publishId}
                  avatarSize={30}
                  isSub={true}
                  reloadSubComments={reloadSubComments}
                  openReportModal={openReportModal}
                  reloadComments={reloadComments}
                />
              </div>
            )
          )}

        <div ref={observedRef} className="flex justify-center">
          {loading && (
            <ButtonLoader loading={loading} size={8} color="#d4d4d4" />
          )}
        </div>
      </div>
    </>
  )
}
