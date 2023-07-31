"use client"

import React, { useCallback } from "react"

import DisplayedResults from "../tag/[name]/DisplayedResults"
import { combineEdges } from "@/lib/helpers"
import type {
  Maybe,
  FetchPublishesResponse,
  FetchPlaylistsResponse,
  Profile,
  PageInfo,
  PublishEdge,
} from "@/graphql/codegen/graphql"

interface Props {
  isAuthenticated: boolean
  profile: Maybe<Profile> | undefined
  query: string
  fetchResult: Maybe<FetchPublishesResponse> | undefined
  playlistsResult: Maybe<FetchPlaylistsResponse> | undefined
}

export default function Results({
  isAuthenticated,
  profile,
  query,
  fetchResult,
  playlistsResult,
}: Props) {
  const count = fetchResult?.pageInfo?.count ?? 0

  const fetchMore = useCallback(
    async (
      setEdges: React.Dispatch<React.SetStateAction<PublishEdge[]>>,
      pageInfo: PageInfo | undefined,
      setPageInfo: React.Dispatch<React.SetStateAction<PageInfo | undefined>>,
      setLoading: React.Dispatch<React.SetStateAction<boolean>>
    ) => {
      if (!query || !pageInfo || !pageInfo.endCursor || !pageInfo.hasNextPage)
        return

      try {
        setLoading(true)
        const res = await fetch(`/api/publish/query/by-query`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query,
            cursor: pageInfo.endCursor,
          }),
        })
        const data = (await res.json()) as {
          result: FetchPublishesResponse
        }
        setEdges((prev) => combineEdges(prev, data.result.edges))
        setPageInfo(data?.result?.pageInfo)
        setLoading(false)
      } catch (error) {
        setLoading(false)
      }
    },
    [query]
  )

  return (
    <>
      <div className="px-2 sm:px-4">
        {count > 0 && (
          <p className="my-1 text-textLight">
            {count} publish{count === 1 ? "" : "es"} found
          </p>
        )}
      </div>

      <div className="sm:px-4">
        <DisplayedResults
          isAuthenticated={isAuthenticated}
          profile={profile}
          fetchResult={fetchResult}
          playlistsResult={playlistsResult}
          fetchMore={fetchMore}
        />
      </div>
    </>
  )
}
