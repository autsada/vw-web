// For desktop view
import React, { useCallback, useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { MdKeyboardBackspace } from "react-icons/md"
import { AiFillCaretUp, AiFillCaretDown } from "react-icons/ai"
import { Carousel } from "react-responsive-carousel"
import "react-responsive-carousel/lib/styles/carousel.min.css"

import DesktopViewItem from "./DesktopViewItem"
import type {
  PublishEdge,
  Maybe,
  FetchPlaylistsResponse,
  Profile,
  Publish,
  CheckPublishPlaylistsResponse,
  FetchCommentsResponse,
} from "@/graphql/codegen/graphql"
import type { CommentsOrderBy } from "@/graphql/types"

interface Props {
  isAuthenticated: boolean
  profile: Maybe<Profile> | undefined
  playlistsResult: Maybe<FetchPlaylistsResponse> | undefined
  items: PublishEdge[]
  activeId: string
  fetchMoreShorts: () => Promise<void>
}

export default function DesktopViewModal({
  isAuthenticated,
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
  const [commentsResult, setCommentsResult] = useState<FetchCommentsResponse>()
  const [commentsLoading, setCommentsLoading] = useState(false)

  const router = useRouter()
  const prevBtnRef = useRef<HTMLButtonElement>(null)
  const nextBtnRef = useRef<HTMLButtonElement>(null)

  // Set video el style to contain
  useEffect(() => {
    const container = document?.getElementById("short-desktop-player")
    if (container) {
      const nodes = container.children
      if (nodes[0]) {
        const videos = nodes[0].children
        if (videos.length > 0) {
          for (let i = 0; i < videos.length; i++) {
            const vid = videos[i] as HTMLVideoElement
            if (vid) {
              vid.style.objectFit = "contain"
            }
          }
        }
      }
    }
  }, [])

  const goBack = useCallback(() => {
    router.back()
  }, [router])

  const fetchPublishComments = useCallback(
    async (publishId: string, orderBy?: CommentsOrderBy) => {
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
        setCommentsResult(data?.result)
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
    setCommentsResult(undefined)
    fetchPublishComments(initialItem.id)
  }, [initialItem?.id, fetchPublishComments])

  const onSlideChange = useCallback(
    (index: number, item: React.ReactNode) => {
      const viewItem = item as ReturnType<typeof DesktopViewItem>
      const { publish } = viewItem?.props as { publish: Publish }
      setTargetPublish(publish)
      setCommentsResult(undefined)
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

  const goPrevShort = useCallback(() => {
    if (prevBtnRef?.current) {
      prevBtnRef.current.click()
    }
  }, [])

  const goNextShort = useCallback(() => {
    if (nextBtnRef?.current) {
      nextBtnRef.current.click()
    }
  }, [])

  return (
    <div className="fixed z-20 inset-0 bg-black">
      <div
        className="fixed z-20 top-8 left-4 p-2 cursor-pointer bg-neutral-400 rounded-full"
        onClick={loading || commentsLoading ? undefined : goBack}
      >
        <MdKeyboardBackspace color="white" size={25} />
      </div>
      <div className="fixed z-20 top-4 bottom-20 left-[450px] md:left-[550px] lg:left-[650px] xl:left-[750px] flex flex-col items-center justify-center gap-y-20">
        {activeIndex === items.length - 1 && items.length > 1 && (
          <AiFillCaretUp
            color="white"
            size={28}
            className="cursor-pointer"
            onClick={goPrevShort}
          />
        )}
        {activeIndex < items.length - 1 && (
          <AiFillCaretDown
            color="white"
            size={28}
            className="cursor-pointer"
            onClick={goNextShort}
          />
        )}
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
          renderArrowPrev={(onClick) => {
            return (
              <button
                ref={prevBtnRef}
                type="button"
                className="hidden"
                onClick={onClick}
              >
                Prev
              </button>
            )
          }}
          renderArrowNext={(onClick) => {
            return (
              <button
                ref={nextBtnRef}
                type="button"
                className="hidden"
                onClick={onClick}
              >
                Next
              </button>
            )
          }}
        >
          {items
            .filter((edge) => !!edge.node)
            .map((edge) => (
              <DesktopViewItem
                key={edge.node?.id}
                publish={edge.node!}
                isAuthenticated={isAuthenticated}
                profile={profile}
                onPrev={goPrevShort}
                onNext={goNextShort}
                commentsResult={commentsResult}
                fetchComments={fetchPublishComments}
                playlistsResult={playlistsResult}
                publishPlaylistsData={publishPlaylistsData}
              />
            ))}
        </Carousel>
      )}
    </div>
  )
}
