import React, { useEffect, useState, useCallback } from "react"

import Mask from "@/components/Mask"
import VideoItem from "./VideoItem"
import ButtonLoader from "@/components/ButtonLoader"
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll"
import { combineEdges } from "@/lib/helpers"
import type {
  Maybe,
  FetchPublishesResponse,
  Publish,
} from "@/graphql/codegen/graphql"
import type { PublishCategory } from "@/graphql/types"

interface Props {
  tab: PublishCategory | "All"
  selectedTab: PublishCategory | "All"
  fetchResult?: Maybe<FetchPublishesResponse> | undefined
  loading: boolean
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
  onOpenActions: (p: Publish) => void
  setPOS: (posX: number, posY: number, screenHeight: number) => void
}

export default function VideosByCat({
  tab,
  selectedTab,
  fetchResult,
  loading,
  setLoading,
  onOpenActions,
  setPOS,
}: Props) {
  const [prevVideos, setPrevVideos] = useState(fetchResult?.edges)
  const [videos, setVideos] = useState(fetchResult?.edges || [])
  const [prevPageInfo, setPrevPageInfo] = useState(fetchResult?.pageInfo)
  const [pageInfo, setPageInfo] = useState(fetchResult?.pageInfo)
  // When props fetch result changed
  if (fetchResult) {
    if (fetchResult.edges !== prevVideos) {
      setPrevVideos(fetchResult?.edges)
      setVideos(fetchResult?.edges || [])
    }
    if (fetchResult.pageInfo !== prevPageInfo) {
      setPrevPageInfo(fetchResult.pageInfo)
      setPageInfo(fetchResult.pageInfo)
    }
  }

  // Fetch videos on first mount
  useEffect(() => {
    if (!tab || tab === "All") return
    async function fetchVideos() {
      try {
        setLoading(true)
        const res = await fetch(`/api/publish/query/by-category`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            category: tab,
          }),
        })
        const data = (await res.json()) as {
          result: FetchPublishesResponse
        }
        setVideos(data.result.edges || [])
        setPageInfo(data?.result?.pageInfo)
        setLoading(false)
      } catch (error) {
        setLoading(false)
      }
    }
    fetchVideos()
  }, [tab, setLoading])

  const fetchMoreVideos = useCallback(async () => {
    if (!tab || !pageInfo || !pageInfo.endCursor || !pageInfo.hasNextPage)
      return

    try {
      setLoading(true)
      const res = await fetch(`/api/publish/query/by-category`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category: tab,
          cursor: pageInfo.endCursor,
        }),
      })
      const data = (await res.json()) as {
        result: FetchPublishesResponse
      }
      setVideos((prev) => combineEdges(prev, data.result.edges))
      setPageInfo(data?.result?.pageInfo)
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }, [tab, pageInfo, setLoading])
  const { observedRef } = useInfiniteScroll(0.5, fetchMoreVideos)

  return (
    <>
      <div className={`${tab !== selectedTab ? "hidden" : "block"}`}>
        {!loading && videos.length === 0 ? (
          <div className="w-full text-center">
            <h6>No videos found</h6>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-2 sm:gap-y-4 md:gap-y-2 md:gap-x-4 justify-items-center bg-white divide-y-[4px] sm:divide-y-0 divide-neutral-200">
            {videos.map((edge, i) => (
              <VideoItem
                key={`${edge?.node?.id}-${tab}-${i}`}
                publish={edge?.node}
                onOpenActions={onOpenActions}
                setPOS={setPOS}
              />
            ))}
          </div>
        )}

        <div
          ref={observedRef}
          className="w-full h-4 flex items-center justify-center"
        >
          {loading && (
            <ButtonLoader loading={loading} size={8} color="#d4d4d4" />
          )}
        </div>
      </div>

      {tab === selectedTab && loading && (
        <Mask backgroundColor="#fff" opacity={0.3} />
      )}
    </>
  )
}
