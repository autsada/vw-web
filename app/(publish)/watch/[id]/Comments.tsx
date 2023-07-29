"use client"

import React, { useState, useCallback, useEffect } from "react"
import { isMobile } from "react-device-detect"
import { BsCaretDown } from "react-icons/bs"
import { useRouter } from "next/navigation"
import { onSnapshot, doc } from "firebase/firestore"

import CommentDetails from "./CommentDetails"
import CommentsModal from "./CommentsModal"
import CommentsHeader from "@/components/CommentsHeader"
import Avatar from "@/components/Avatar"
import ReportModal from "@/components/ReportModal"
import { db, publishesCollection } from "@/firebase/config"
import { getPostExcerpt } from "@/lib/client"
import { combineEdges } from "@/lib/helpers"
import type {
  Maybe,
  Publish,
  Profile,
  FetchCommentsResponse,
  Comment,
  CommentEdge,
  PageInfo,
} from "@/graphql/codegen/graphql"
import type { CommentsOrderBy } from "@/graphql/types"

interface Props {
  isAuthenticated: boolean
  publish: Publish
  profile: Maybe<Profile> | undefined
  commentsResult: Maybe<FetchCommentsResponse> | undefined
  fetchComments?: (publishId: string, orderBy?: CommentsOrderBy) => void
}

export default function Comments({
  isAuthenticated,
  publish,
  profile,
  commentsResult,
  fetchComments,
}: Props) {
  const [prevEdges, setPrevEdges] = useState(commentsResult?.edges)
  const [edges, setEdges] = useState(commentsResult?.edges || [])
  const [prevPageInfo, setPrevPageInfo] = useState(commentsResult?.pageInfo)
  const [pageInfo, setPageInfo] = useState(commentsResult?.pageInfo)
  if (commentsResult?.edges !== prevEdges) {
    setPrevEdges(commentsResult?.edges)
    setEdges(commentsResult?.edges || [])
  }
  if (commentsResult?.pageInfo !== prevPageInfo) {
    setPrevPageInfo(commentsResult?.pageInfo)
    setPageInfo(commentsResult?.pageInfo)
  }

  const [commentsModalVisible, setCommentsModalVisible] = useState(false)
  const [subCommentsVisible, setSubCommentsVisible] = useState(false)
  const [activeComment, setActiveComment] = useState<Comment>()
  const [sortBy, setSortBy] = useState<CommentsOrderBy>("counts")
  const [subCommentsLoading, setSubCommentsLoading] = useState(false)
  const [subCommentsEdges, setSubCommentsEdges] = useState<CommentEdge[]>([])
  const [subCommentsPageInfo, setSubCommentsPageInfo] = useState<PageInfo>()
  const [commentToBeReported, setCommentToBeReported] = useState<Comment>()
  // 310px is from 270 for video player height plus 70 for navbar height
  const [modalPOS, setModalPOS] = useState(310)

  const router = useRouter()

  // Listen to update in Firestore
  useEffect(() => {
    if (!publish?.id) return

    const unsubscribe = onSnapshot(
      doc(db, publishesCollection, publish?.id),
      (doc) => {
        // Reload data to get the most updated publish
        router.refresh()
      }
    )

    return unsubscribe
  }, [router, publish?.id])

  const openCommentsModal = useCallback(() => {
    if (!isMobile) return
    // Get the player element to get its position for use to set comment modal position
    const el = document?.getElementById("player")
    if (el) {
      const { bottom } = el?.getBoundingClientRect()
      if (bottom >= 70) {
        setModalPOS(bottom)
      }
    }
    setCommentsModalVisible(true)
  }, [])

  const closeCommentsModal = useCallback(() => {
    if (!isMobile) return
    setCommentsModalVisible(false)
    setSubCommentsVisible(false)
    setActiveComment(undefined)
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

  const openReportModal = useCallback((c: Comment) => {
    setCommentToBeReported(c)
  }, [])

  const closeReportModal = useCallback(() => {
    setCommentToBeReported(undefined)
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
        const res = await fetch(`/comments/sub`, {
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
  // Load subComments when active comment changed
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
    <div className="mt-4">
      {isMobile ? (
        <>
          <div
            className="flex items-center justify-between bg-neutral-100 px-4 rounded-md"
            onClick={openCommentsModal}
          >
            <div className="h-full flex-grow py-2 flex flex-col items-start justify-center gap-y-2">
              <h6 className="text-base">{publish.commentsCount} Comments</h6>
              {publish.lastComment && (
                <div className="w-full flex items-center gap-x-2">
                  <div>
                    <Avatar
                      profile={publish.lastComment?.creator}
                      width={25}
                      height={25}
                    />
                  </div>
                  <div className="h-full w-full text-sm">
                    {getPostExcerpt(publish.lastComment?.content || "", 45)}
                  </div>
                </div>
              )}
            </div>
            <div className="w-[30px] py-2 text-right flex items-center justify-end">
              <BsCaretDown size={22} />
            </div>
          </div>
          {isMobile && commentsModalVisible && (
            <CommentsModal
              isAuthenticated={isAuthenticated}
              profile={profile}
              commentsCount={publish.commentsCount}
              closeModal={closeCommentsModal}
              publishId={publish?.id}
              pageInfo={pageInfo}
              setPageInfo={setPageInfo}
              edges={edges}
              setEdges={setEdges}
              subCommentsVisible={subCommentsVisible}
              subCommentsEdges={subCommentsEdges}
              subCommentsPageInfo={subCommentsPageInfo}
              fetchSubComments={fetchSubComments}
              reloadSubComments={reloadSubComments}
              subCommentsLoading={subCommentsLoading}
              openSubComments={openSubComments}
              activeComment={activeComment}
              closeSubComments={closeSubComments}
              modalTop={modalPOS}
              openReportModal={openReportModal}
            />
          )}
        </>
      ) : (
        <>
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
          <CommentDetails
            isAuthenticated={isAuthenticated}
            profile={profile}
            publishId={publish?.id}
            pageInfo={pageInfo}
            setPageInfo={setPageInfo}
            edges={edges}
            setEdges={setEdges}
            subCommentsVisible={subCommentsVisible}
            subCommentsEdges={subCommentsEdges}
            subCommentsPageInfo={subCommentsPageInfo}
            fetchSubComments={fetchSubComments}
            reloadSubComments={reloadSubComments}
            subCommentsLoading={subCommentsLoading}
            openSubComments={openSubComments}
            activeComment={activeComment}
            fetchCommentsSortBy={sortBy}
            reloadComments={fetchComments}
            openReportModal={openReportModal}
          />
        </>
      )}

      {commentToBeReported && (
        <ReportModal
          title="Report this comment"
          publishId={publish?.id}
          closeModal={closeReportModal}
        />
      )}
    </div>
  )
}
