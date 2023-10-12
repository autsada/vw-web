import React, { useState, useCallback } from "react"

import BlogItem from "./BlogItem"
import ButtonLoader from "@/components/ButtonLoader"
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll"
import { combineEdges } from "@/lib/helpers"
import type {
  Maybe,
  FetchPublishesResponse,
  Publish,
  PublishEdge,
} from "@/graphql/codegen/graphql"

interface Props {
  fetchResult: Maybe<FetchPublishesResponse> | undefined
  bookmark: (publishId: string, callback: () => void) => void
  onShareBlog: (blog: Publish) => Promise<void>
  openReportModal: (blog: Publish) => void
}

/**
 * For small-medium device view only
 */
export default function PopularBlogs({
  fetchResult,
  bookmark,
  onShareBlog,
  openReportModal,
}: Props) {
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

  const [loading, setLoading] = useState(false)

  const fetchMore = useCallback(async () => {
    if (!pageInfo || !pageInfo.endCursor || !pageInfo.hasNextPage) return

    try {
      setLoading(true)
      const res = await fetch(`/api/publish/query/publishes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cursor: pageInfo.endCursor,
          publishType: "blogs",
          orderBy: "popular",
        }),
      })
      const data = (await res.json()) as {
        result: FetchPublishesResponse
      }
      setEdges((prev) => combineEdges<PublishEdge>(prev, data?.result?.edges))
      setPageInfo(data?.result?.pageInfo)
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }, [pageInfo])
  const { observedRef } = useInfiniteScroll(0.5, fetchMore)

  return (
    <div className="mt-5 w-full flex flex-col items-center gap-y-1 divide-y-2 divide-neutral-100 sm:pb-10">
      {edges.length > 0 &&
        edges.map((edge) =>
          !edge.node ? null : (
            <BlogItem
              key={edge.node?.id}
              publish={edge.node}
              bookmarkHandler={bookmark}
              onShare={onShareBlog}
              onReport={openReportModal}
            />
          )
        )}

      <div
        ref={observedRef}
        className="mt-2 py-10 w-full h-4 flex items-center justify-center"
      >
        {loading && <ButtonLoader loading={loading} size={8} color="#d4d4d4" />}
      </div>
    </div>
  )
}
