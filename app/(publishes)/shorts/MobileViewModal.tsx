// For mobile view only
import React, { useCallback, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MdKeyboardBackspace } from "react-icons/md"
import { Carousel } from "react-responsive-carousel"
import "react-responsive-carousel/lib/styles/carousel.min.css"

import MobileViewItem from "./MobileViewItem"
import CommentsModal from "@/app/(publish)/watch/[id]/CommentsModal"
import { combineEdges } from "@/lib/helpers"
import type {
  PublishEdge,
  Maybe,
  FetchPlaylistsResponse,
  Profile,
  Publish,
  CheckPublishPlaylistsResponse,
  PageInfo,
  CommentEdge,
  FetchCommentsResponse,
  Comment,
  Account,
} from "@/graphql/codegen/graphql"
import type { CommentsOrderBy } from "@/graphql/types"
import ReportModal from "@/components/ReportModal"

interface Props {
  isAuthenticated: boolean
  account?: Maybe<Account> | undefined
  profile: Maybe<Profile> | undefined
  playlistsResult: Maybe<FetchPlaylistsResponse> | undefined
  items: PublishEdge[]
  activeId: string
  fetchMoreShorts: () => Promise<void>
}

export default function MobileViewModal({
  isAuthenticated,
  account,
  profile,
  playlistsResult,
  items,
  activeId,
  fetchMoreShorts,
}: Props) {
  const initialItem = items.find((item) => item.node?.id === activeId)?.node
  const activeIndex = items.findIndex((item) => item.node?.id === activeId)

  const [targetPublish, setTargetPublish] = useState(initialItem)
  const [publishPlaylistsData, setPublishPlaylistsData] =
    useState<CheckPublishPlaylistsResponse>()
  const [loading, setLoading] = useState(false)
  const [commentsModalVisible, setCommentsModalVisible] = useState(false)
  const [commentPageInfo, setCommentPageInfo] = useState<PageInfo>()
  const [commentEdges, setCommentEdges] = useState<CommentEdge[]>([])
  const [commentsLoading, setCommentsLoading] = useState(false)
  const [subCommentsVisible, setSubCommentsVisible] = useState(false)
  const [activeComment, setActiveComment] = useState<Comment>()
  const [subCommentsLoading, setSubCommentsLoading] = useState(false)
  const [subCommentsEdges, setSubCommentsEdges] = useState<CommentEdge[]>([])
  const [subCommentsPageInfo, setSubCommentsPageInfo] = useState<PageInfo>()
  const [commentToBeReported, setCommentToBeReported] = useState<Comment>()

  const router = useRouter()

  // Set video el style to cover
  useEffect(() => {
    const container = document?.getElementById("short-mobile-player")
    if (container) {
      const nodes = container.children
      if (nodes[0]) {
        const videos = nodes[0].children
        if (videos.length > 0) {
          for (let i = 0; i < videos.length; i++) {
            const vid = videos[i] as HTMLVideoElement
            if (vid) {
              vid.style.objectFit = "cover"
            }
          }
        }
      }
    }
  }, [])

  const fetchPublishComments = useCallback(
    async (
      publishId: string,
      orderBy?: CommentsOrderBy,
      stateHandling?: "combine" | "no-combine"
    ) => {
      try {
        setCommentsLoading(true)
        const res = await fetch(`/api/comments`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            publishId,
            sortBy: orderBy,
          }),
        })
        const data = (await res.json()) as {
          result: FetchCommentsResponse
        }
        setCommentEdges((prev) =>
          combineEdges<CommentEdge>(prev, data?.result?.edges, stateHandling)
        )
        setCommentPageInfo(data?.result?.pageInfo)
        setCommentsLoading(false)
      } catch (error) {
        setCommentsLoading(false)
      }
    },
    []
  )
  // Fetch publish's comments for the first slide
  useEffect(() => {
    if (!initialItem?.id) return
    // Reset states before setting the new one
    setCommentEdges([])
    setCommentPageInfo(undefined)
    fetchPublishComments(initialItem.id)
  }, [initialItem?.id, fetchPublishComments])

  const onSlideChange = useCallback(
    (index: number, item: React.ReactNode) => {
      const viewItem = item as ReturnType<typeof MobileViewItem>
      const { publish } = viewItem?.props as { publish: Publish }
      setTargetPublish(publish)
      setCommentEdges([])
      setCommentPageInfo(undefined)
      fetchPublishComments(publish.id)
      if (typeof window !== "undefined") {
        window.history.replaceState("", "", `/shorts?id=${publish.id}`)
      }
      // If the slide reaches the end of the items array
      if (index === items.length - 1) {
        fetchMoreShorts()
      }
    },
    [items.length, fetchMoreShorts, fetchPublishComments]
  )

  const fetchPublishPlaylistData = useCallback(async () => {
    try {
      if (!targetPublish || !isAuthenticated || !profile) return

      // Call the api route to check if the publish already add to any user's playlists
      setLoading(true)
      const res = await fetch(`/api/playlist/publish`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ publishId: targetPublish.id }),
      })
      const data = (await res.json()) as {
        result: CheckPublishPlaylistsResponse
      }
      setPublishPlaylistsData(data.result)
      setLoading(false)
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  }, [targetPublish, isAuthenticated, profile])
  // Fetch publish playlist data
  useEffect(() => {
    fetchPublishPlaylistData()
  }, [fetchPublishPlaylistData])

  const openCommentsModal = useCallback(() => {
    setCommentsModalVisible(true)
  }, [])

  const closeCommentsModal = useCallback(() => {
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

  const goBack = useCallback(() => {
    router.back()
  }, [router])

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

  const openReportModal = useCallback((c: Comment) => {
    setCommentToBeReported(c)
  }, [])

  const closeReportModal = useCallback(() => {
    setCommentToBeReported(undefined)
  }, [])

  return (
    <>
      <div className="fixed z-20 inset-0 bg-black">
        <div
          className="fixed z-20 top-8 left-4 p-2 cursor-pointer bg-neutral-400 rounded-full"
          onClick={loading || commentsLoading ? undefined : goBack}
        >
          <MdKeyboardBackspace color="white" size={25} />
        </div>
        {/* <div ref={containerRef} className="relative h-full z-40 w-full"> */}
        {items.length > 0 && (
          <Carousel
            selectedItem={activeIndex}
            axis="vertical"
            swipeable
            showThumbs={false}
            showIndicators={false}
            showArrows={false}
            showStatus={false}
            renderItem={(item: any, options) => {
              return <item.type {...item.props} {...options} />
            }}
            onChange={onSlideChange}
          >
            {items
              .filter((edge) => !!edge.node)
              .map((edge) => (
                <MobileViewItem
                  key={edge.node?.id}
                  publish={edge.node!}
                  isAuthenticated={isAuthenticated}
                  account={account}
                  playlistsResult={playlistsResult}
                  publishPlaylistsData={publishPlaylistsData}
                  openCommentsModal={openCommentsModal}
                />
              ))}
          </Carousel>
        )}
      </div>

      {/* Comments modal */}
      {commentsModalVisible && targetPublish && (
        <CommentsModal
          isAuthenticated={isAuthenticated}
          profile={profile}
          commentsCount={targetPublish?.commentsCount}
          closeModal={closeCommentsModal}
          publishId={targetPublish?.id}
          pageInfo={commentPageInfo}
          setPageInfo={setCommentPageInfo}
          edges={commentEdges}
          setEdges={setCommentEdges}
          reloadComments={fetchPublishComments}
          subCommentsVisible={subCommentsVisible}
          subCommentsEdges={subCommentsEdges}
          subCommentsPageInfo={subCommentsPageInfo}
          fetchSubComments={fetchSubComments}
          reloadSubComments={reloadSubComments}
          subCommentsLoading={subCommentsLoading}
          openSubComments={openSubComments}
          activeComment={activeComment}
          closeSubComments={closeSubComments}
          openReportModal={openReportModal}
        />
      )}

      {targetPublish && commentToBeReported && (
        <ReportModal
          title="Report this comment"
          publishId={targetPublish?.id}
          closeModal={closeReportModal}
        />
      )}
    </>
  )
}
