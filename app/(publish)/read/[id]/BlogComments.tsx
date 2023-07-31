"use client"

import React, { useState, useCallback, useTransition, useEffect } from "react"

import CommentsHeader from "@/components/CommentsHeader"
import CommentBox from "./CommentBox"
import BlogCommentBaseItem from "./BlogCommentBaseItem"
import ReportModal from "@/components/ReportModal"
import BlogSubComments from "./BlogSubComments"
import Mask from "@/components/Mask"
import ButtonLoader from "@/components/ButtonLoader"
import { useAuthContext } from "@/context/AuthContext"
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll"
import { commentOnBlog } from "@/app/actions/publish-actions"
import { combineEdges } from "@/lib/helpers"
import type { CommentsOrderBy } from "@/graphql/types"
import type {
  Maybe,
  FetchCommentsResponse,
  Publish,
  Profile,
  Comment,
  CommentEdge,
  PageInfo,
} from "@/graphql/codegen/graphql"

interface Props {
  isAuthenticated: boolean
  publish: Publish
  profile: Maybe<Profile> | undefined
  fetchResult: Maybe<FetchCommentsResponse> | undefined
}

export default function Comments({
  isAuthenticated,
  publish,
  profile,
  fetchResult,
}: Props) {
  const [loading, setLoading] = useState(false)
  const [prevEdges, setPrevEdges] = useState(fetchResult?.edges)
  const [edges, setEdges] = useState(fetchResult?.edges || [])
  const [prevPageInfo, setPrevPageInfo] = useState(fetchResult?.pageInfo)
  const [pageInfo, setPageInfo] = useState(fetchResult?.pageInfo)
  if (fetchResult?.edges !== prevEdges) {
    setPrevEdges(fetchResult?.edges)
    setEdges(fetchResult?.edges || [])
  }
  if (fetchResult?.pageInfo !== prevPageInfo) {
    setPrevPageInfo(fetchResult?.pageInfo)
    setPageInfo(fetchResult?.pageInfo)
  }
  const [subCommentsVisible, setSubCommentsVisible] = useState(false)
  const [activeComment, setActiveComment] = useState<Comment>()
  const [sortBy, setSortBy] = useState<CommentsOrderBy>("counts")
  const [subCommentsLoading, setSubCommentsLoading] = useState(false)
  const [subCommentsEdges, setSubCommentsEdges] = useState<CommentEdge[]>([])
  const [subCommentsPageInfo, setSubCommentsPageInfo] = useState<PageInfo>()
  const [commentToBeReported, setCommentToBeReported] = useState<Comment>()

  const { onVisible: openAuthModal } = useAuthContext()
  const [isPending, startTransition] = useTransition()

  const fetchMoreComments = useCallback(async () => {
    if (!publish?.id || !pageInfo?.endCursor || !pageInfo?.hasNextPage) return

    try {
      setLoading(true)
      const res = await fetch(`/api/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cursor: pageInfo?.endCursor,
          publishId: publish?.id,
          sortBy,
        }),
      })
      const data = (await res.json()) as {
        result: FetchCommentsResponse
      }
      setEdges((prev) => combineEdges<CommentEdge>(prev, data?.result?.edges))
      setPageInfo(data?.result?.pageInfo)
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }, [
    publish?.id,
    pageInfo?.endCursor,
    pageInfo?.hasNextPage,
    sortBy,
    setEdges,
    setPageInfo,
  ])
  const { observedRef } = useInfiniteScroll(0.5, fetchMoreComments)

  const submitComment = useCallback(
    (content: string, htmlContent: string) => {
      if (!content || !htmlContent || !publish?.id) return

      if (!isAuthenticated) {
        openAuthModal("Sign in to leave comments.")
      } else {
        startTransition(() =>
          commentOnBlog({
            publishId: publish.id,
            contentBlog: content,
            htmlContentBlog: htmlContent,
          })
        )
      }
    },
    [isAuthenticated, openAuthModal, publish?.id]
  )

  const openReportModal = useCallback((c: Comment) => {
    setCommentToBeReported(c)
  }, [])

  const closeReportModal = useCallback(() => {
    setCommentToBeReported(undefined)
  }, [])

  const openSubComments = useCallback(
    (c: Comment) => {
      setSubCommentsVisible(true)
      if (c.id !== activeComment?.id) {
        setActiveComment(c)
        setSubCommentsEdges([])
        setSubCommentsPageInfo(undefined)
      }
    },
    [activeComment]
  )

  const closeSubComments = useCallback(() => {
    setSubCommentsVisible(false)
  }, [])

  const fetchSubComments = useCallback(
    async (
      parentCommentId: string,
      cursor?: string,
      stateHandling?: "combine" | "no-combine"
    ) => {
      if (!parentCommentId) return

      try {
        setSubCommentsLoading(true)
        const res = await fetch(`/api/comments/sub`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            commentId: parentCommentId,
            cursor,
          }),
        })
        const data = (await res.json()) as {
          result: FetchCommentsResponse
        }
        setSubCommentsEdges((prev) =>
          combineEdges<CommentEdge>(prev, data?.result?.edges, stateHandling)
        )
        setSubCommentsPageInfo(data?.result?.pageInfo)
        setSubCommentsLoading(false)
      } catch (error) {
        setSubCommentsLoading(false)
      }
    },
    []
  )

  // Load BlogsubComments when active comment changed
  useEffect(() => {
    if (activeComment?.id) {
      fetchSubComments(activeComment?.id)
    }
  }, [activeComment?.id, fetchSubComments])

  const reloadSubComments = useCallback(
    (stateHandling?: "combine" | "no-combine") => {
      if (activeComment?.id) {
        fetchSubComments(activeComment?.id, undefined, stateHandling)
      }
    },
    [activeComment?.id, fetchSubComments]
  )

  return (
    <div className="w-full pb-20 border-t border-neutral-200">
      <div className="py-5">
        {isAuthenticated ? (
          <CommentBox profile={profile} submitComment={submitComment} />
        ) : (
          <button
            className="px-4 font-semibold"
            onClick={openAuthModal.bind(
              undefined,
              "Sign in to leave comments."
            )}
          >
            Sign in to comment
          </button>
        )}
      </div>

      <div className="py-5">
        <CommentsHeader
          subCommentsVisible={subCommentsVisible}
          commentsCount={publish.commentsCount}
          publishId={publish.id}
          closeSubComments={closeSubComments}
          pageInfo={pageInfo}
          setPageInfo={setPageInfo}
          setEdges={setEdges}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
      </div>

      {subCommentsVisible && activeComment ? (
        <BlogSubComments
          isAuthenticated={isAuthenticated}
          profile={profile}
          publishId={publish?.id}
          parentComment={activeComment}
          subComments={subCommentsEdges}
          pageInfo={subCommentsPageInfo}
          fetchSubComments={fetchSubComments}
          reloadSubComments={reloadSubComments}
          loading={subCommentsLoading}
          openReportModal={openReportModal}
          reloadComments={fetchMoreComments}
        />
      ) : (
        <div className="mt-2">
          {edges &&
            edges.length > 0 &&
            // This is to make sure that we display the comments that belong to the correct publish
            edges.every((edge) => edge?.node?.publishId === publish?.id) &&
            edges.map((edge) => (
              <BlogCommentBaseItem
                isAuthenticated={isAuthenticated}
                key={edge.node?.id}
                profile={profile}
                publishId={publish.id}
                comment={edge.node}
                openSubComments={openSubComments}
                openReportModal={openReportModal}
                reloadComments={fetchMoreComments}
              />
            ))}

          <div
            ref={observedRef}
            className="w-full h-4 flex items-center justify-center"
          >
            {loading && (
              <ButtonLoader loading={loading} size={8} color="#d4d4d4" />
            )}
          </div>
        </div>
      )}

      {commentToBeReported && (
        <ReportModal
          title="Report this comment"
          publishId={publish?.id}
          closeModal={closeReportModal}
        />
      )}

      {/* Prevent user interaction */}
      {isPending && <Mask />}
    </div>
  )
}
