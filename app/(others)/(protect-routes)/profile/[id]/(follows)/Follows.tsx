"use client"

import React, { useState, useCallback } from "react"

import Follow from "./Follow"
import ButtonLoader from "@/components/ButtonLoader"
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll"
import { combineEdges } from "@/lib/helpers"
import type { Maybe, FetchFollowsResponse } from "@/graphql/codegen/graphql"

interface Props {
  isAuthenticated: boolean
  fetchResult: Maybe<FetchFollowsResponse> | undefined
  followType: "followers" | "following"
  notFoundText: string
}

export default function Follows({
  isAuthenticated,
  fetchResult,
  followType,
  notFoundText,
}: Props) {
  const [prevEdges, setPrevEdges] = useState(fetchResult?.edges)
  const [edges, setEdges] = useState(fetchResult?.edges || [])
  if (prevEdges !== fetchResult?.edges) {
    setPrevEdges(fetchResult?.edges)
    setEdges(fetchResult?.edges || [])
  }
  const [prevPageInfo, setPrevPageInfo] = useState(fetchResult?.pageInfo)
  const [pageInfo, setPageInfo] = useState(fetchResult?.pageInfo)
  if (prevPageInfo !== fetchResult?.pageInfo) {
    setPrevPageInfo(fetchResult?.pageInfo)
    setPageInfo(fetchResult?.pageInfo)
  }
  const [loading, setLoading] = useState(false)

  const fetchMore = useCallback(async () => {
    if (!pageInfo || !pageInfo.endCursor || !pageInfo.hasNextPage) return

    try {
      setLoading(true)
      const res = await fetch(`/api/${followType}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cursor: pageInfo.endCursor,
        }),
      })
      const data = (await res.json()) as {
        result: FetchFollowsResponse
      }
      setEdges((prev) => combineEdges(prev, data.result.edges))
      setPageInfo(data?.result?.pageInfo)
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }, [pageInfo, setLoading, followType])
  const { observedRef } = useInfiniteScroll(0.5, fetchMore)

  return (
    <div className="h-full w-full py-5 overflow-y-auto">
      {edges.length === 0 ? (
        <div className="py-10 text-center">
          <h6>{notFoundText}</h6>
        </div>
      ) : (
        <>
          {edges.map((edge) =>
            !edge?.node ? null : (
              <Follow
                key={
                  followType === "followers"
                    ? edge.node.followingId
                    : edge.node.followerId
                }
                isAuthenticated={isAuthenticated}
                follow={
                  followType === "followers"
                    ? edge.node.following
                    : edge.node.follower
                }
              />
            )
          )}

          <div
            ref={observedRef}
            className="w-full h-4 flex items-center justify-center"
          >
            {loading && (
              <ButtonLoader loading={loading} size={8} color="#d4d4d4" />
            )}
          </div>
        </>
      )}
    </div>
  )
}
