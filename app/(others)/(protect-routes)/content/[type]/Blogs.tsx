"use client"

import React, { useState, useCallback, useMemo } from "react"
import _ from "lodash"

import BlogItem from "./BlogItem"
import ButtonLoader from "@/components/ButtonLoader"
import Mask from "@/components/Mask"
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll"
import { combineEdges } from "@/lib/helpers"
import type { FetchPublishesResponse, Maybe } from "@/graphql/codegen/graphql"

interface Props {
  fetchResult: Maybe<FetchPublishesResponse> | undefined
}

export default function Blogs({ fetchResult }: Props) {
  const [loading, setLoading] = useState(false)
  const [prevEdges, setPrevEdges] = useState(fetchResult?.edges)
  const [edges, setEdges] = useState(fetchResult?.edges || [])
  const isDeleting = edges.map((edge) => !!edge?.node?.deleting).includes(true)
  const isUploading = edges
    .map((edge) => !!edge?.node?.uploading)
    .includes(true)
  const isEdgesEqual = useMemo(
    () => _.isEqual(fetchResult?.edges, prevEdges),
    [fetchResult?.edges, prevEdges]
  )
  // When shorts changed
  if (!isEdgesEqual) {
    setPrevEdges(fetchResult?.edges)
    setEdges(fetchResult?.edges || [])
  }

  const [prevPageInfo, setPrevPageInfo] = useState(fetchResult?.pageInfo)
  const [pageInfo, setPageInfo] = useState(fetchResult?.pageInfo)
  const isPageInfoEqual = useMemo(
    () => _.isEqual(fetchResult?.pageInfo, prevPageInfo),
    [fetchResult?.pageInfo, prevPageInfo]
  )
  // When page info changed
  if (!isPageInfoEqual) {
    setPrevPageInfo(fetchResult?.pageInfo)
    setPageInfo(fetchResult?.pageInfo)
  }

  const fetchMore = useCallback(async () => {
    if (!pageInfo || !pageInfo.endCursor || !pageInfo.hasNextPage) return

    try {
      setLoading(true)
      const res = await fetch(`/api/publish/query/my-publishes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          publishType: "blogs",
          cursor: pageInfo.endCursor,
        }),
      })
      const data = (await res.json()) as {
        result: FetchPublishesResponse
      }
      setEdges((prev) => combineEdges(prev, data?.result?.edges))
      setPageInfo(data?.result?.pageInfo)
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }, [pageInfo])
  const { observedRef } = useInfiniteScroll(0.5, fetchMore)

  return edges?.length === 0 ? (
    <div className="text-center px-4 py-10">
      <h6>No results found.</h6>
    </div>
  ) : (
    <div className="relative px-0 sm:px-4 overflow-y-auto">
      {(isUploading || isDeleting) && (
        <div className="absolute top-0 right-[2px] bg-white text-blueBase px-4 py-2 font-semibold text-lg">
          While processing you can safely leave this page.
        </div>
      )}
      <table className="table-fixed w-full border-collapse border border-gray-200">
        <thead>
          <tr className="text-sm font-semibold bg-gray-100">
            <th className="w-[30%] sm:w-[20%] lg:w-[15%] xl:w-[12%] font-normal py-2 border border-gray-200 break-words">
              Cover image
            </th>
            <th className="w-[40%] sm:w-[40%] lg:w-[35%] xl:w-[35%] font-normal py-2 border border-gray-200 break-words">
              Title
            </th>
            <th className="hidden sm:table-cell sm:w-[20%] lg:w-[10%] xl:w-[7%] font-normal py-2 border border-gray-200 break-words">
              Visibility
            </th>
            <th className="w-[30%] sm:w-[20%] lg:w-[10%] xl:w-[11%] font-normal py-2 border border-gray-200 break-words">
              Date
            </th>
            <th className="hidden lg:table-cell w-[20%] lg:w-[10%] xl:w-[7%] font-normal py-2 border border-gray-200 break-words">
              Views
            </th>
            <th className="hidden lg:table-cell w-[20%] lg:w-[10%] xl:w-[7%] font-normal py-2 border border-gray-200 break-words">
              Tips
            </th>
            <th className="hidden xl:table-cell w-[20%] xl:w-[7%] font-normal py-2 border border-gray-200 break-words">
              Comments
            </th>
            <th className="hidden lg:table-cell w-[20%] lg:w-[10%] xl:w-[7%] font-normal py-2 border border-gray-200 break-words">
              Likes
            </th>
            <th className="hidden xl:table-cell xl:w-[7%] font-normal py-2 border border-gray-200 break-words">
              Dislikes
            </th>
          </tr>
        </thead>

        <tbody>
          {edges?.map(({ cursor, node: publish }) =>
            !publish ? null : <BlogItem key={publish.id} blog={publish} />
          )}
        </tbody>
      </table>

      <div
        ref={observedRef}
        className="w-full h-4 flex items-center justify-center"
      >
        {loading && <ButtonLoader loading={loading} size={8} color="#d4d4d4" />}
      </div>

      {/* Prevent interaction while loading */}
      {loading && <Mask />}
    </div>
  )
}
