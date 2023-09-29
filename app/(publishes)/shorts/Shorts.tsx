"use client"

import React, { useCallback, useState, useMemo } from "react"
import _ from "lodash"
import { isMobile } from "react-device-detect"

import ButtonLoader from "@/components/ButtonLoader"
import ShortItem from "./ShortItem"
import MobileViewModal from "./MobileViewModal"
import DesktopViewModal from "./DesktopViewModal"
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll"
import { combineEdges } from "@/lib/helpers"
import type {
  FetchPlaylistsResponse,
  FetchPublishesResponse,
  Maybe,
  PublishEdge,
  Profile,
  Account,
} from "@/graphql/codegen/graphql"

interface Props {
  isAuthenticated: boolean
  account?: Maybe<Account> | undefined
  profile: Maybe<Profile> | undefined
  fetchResult: Maybe<FetchPublishesResponse> | undefined
  playlistsResult: Maybe<FetchPlaylistsResponse> | undefined
  initialId?: string // The first publish to be displayed when `ViewModal` is openned
}

export default function Shorts({
  isAuthenticated,
  account,
  profile,
  fetchResult,
  playlistsResult,
  initialId,
}: Props) {
  const [prevShorts, setPrevShorts] = useState(fetchResult?.edges)
  const [shorts, setShorts] = useState(fetchResult?.edges || [])
  const isShortsEqual = useMemo(
    () => _.isEqual(fetchResult?.edges, prevShorts),
    [fetchResult?.edges, prevShorts]
  )
  // When shorts changed
  if (!isShortsEqual) {
    setPrevShorts(fetchResult?.edges)
    setShorts(fetchResult?.edges || [])
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
          publishType: "shorts",
        }),
      })
      const data = (await res.json()) as {
        result: FetchPublishesResponse
      }
      setShorts((prev) => combineEdges<PublishEdge>(prev, data?.result?.edges))
      setPageInfo(data?.result?.pageInfo)
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }, [pageInfo])
  const { observedRef } = useInfiniteScroll(0.5, fetchMore)

  return (
    <>
      <div className="mt-4">
        {!loading && shorts.length === 0 ? (
          <div className="w-full text-center">
            <h6>No videos found</h6>
          </div>
        ) : (
          <div className="pb-20 flex flex-col items-center gap-y-4 sm:gap-y-5 md:gap-y-6 lg:gap-y-7 xl:gap-y-8">
            {shorts.map((edge) =>
              !edge.node ? null : (
                <ShortItem
                  key={edge.node.id}
                  publish={edge?.node}
                  isAuthenticated={isAuthenticated}
                  account={account}
                  playlistsResult={playlistsResult}
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
          </div>
        )}
      </div>

      {/* Mobile/tablet view */}
      {isMobile && shorts.length > 0 && shorts[0]?.node && (
        <MobileViewModal
          items={shorts}
          isAuthenticated={isAuthenticated}
          account={account}
          profile={profile}
          playlistsResult={playlistsResult}
          activeId={initialId || shorts[0]?.node?.id}
          fetchMoreShorts={fetchMore}
        />
      )}

      {/* Desktop view */}
      {!isMobile && initialId && (
        <DesktopViewModal
          items={shorts}
          isAuthenticated={isAuthenticated}
          account={account}
          profile={profile}
          playlistsResult={playlistsResult}
          activeId={initialId}
          fetchMoreShorts={fetchMore}
        />
      )}
    </>
  )
}
