"use client"

import React, { useCallback } from "react"

import DisplayedResults from "./DisplayedResults"
import { combineEdges } from "@/lib/helpers"
import type {
  Maybe,
  FetchPublishesResponse,
  FetchPlaylistsResponse,
  Profile,
  PageInfo,
  PublishEdge,
} from "@/graphql/codegen/graphql"
import Tabs from "./Tabs"

interface Props {
  isAuthenticated: boolean
  profile: Maybe<Profile> | undefined
  tag: string
  publishType: string
  fetchResult: Maybe<FetchPublishesResponse> | undefined
  playlistsResult: Maybe<FetchPlaylistsResponse> | undefined
}

export default function Results({
  isAuthenticated,
  profile,
  tag,
  publishType,
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
      if (!tag || !pageInfo || !pageInfo.endCursor || !pageInfo.hasNextPage)
        return

      try {
        setLoading(true)
        const res = await fetch(`/api/publish/query/by-tag`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tag,
            publishType,
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
    [tag, publishType]
  )

  return (
    <>
      {count > 0 && (
        <p className="mt-1 text-textLight">
          {count} publish{count === 1 ? "" : "es"}
        </p>
      )}
      <div className="my-5">
        <Tabs tag={tag} />
      </div>
      <DisplayedResults
        isAuthenticated={isAuthenticated}
        profile={profile}
        fetchResult={fetchResult}
        playlistsResult={playlistsResult}
        fetchMore={fetchMore}
      />
    </>
  )
}
