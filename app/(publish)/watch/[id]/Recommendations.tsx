"use client"

import React, { useState, useCallback } from "react"

import RecommendationItem from "./RecommendationItem"
import ActionsModal from "@/components/ActionsModal"
import AddToPlaylistsModal from "@/components/AddToPlaylistsModal"
import ShareModal from "@/components/ShareModal"
import ReportModal from "@/components/ReportModal"
import ButtonLoader from "@/components/ButtonLoader"
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll"
import { useAuthContext } from "@/context/AuthContext"
import { BASE_URL } from "@/lib/constants"
import type {
  FetchPlaylistsResponse,
  FetchPublishesResponse,
  Maybe,
  Profile,
  Publish,
  CheckPublishPlaylistsResponse,
} from "@/graphql/codegen/graphql"

interface Props {
  publishId: string
  isAuthenticated: boolean
  profile: Maybe<Profile> | undefined
  suggestedResult: Maybe<FetchPublishesResponse> | undefined
  playlistsResult: FetchPlaylistsResponse | undefined
}

export default function Recommendations({
  publishId,
  isAuthenticated,
  profile,
  suggestedResult,
  playlistsResult,
}: Props) {
  const pageInfo = suggestedResult?.pageInfo
  const [loading, setLoading] = useState(false)
  const [prevSuggestedItems, setPrevSuggestedItems] = useState(
    suggestedResult?.edges
  )
  const [suggestedItems, setSuggestedItems] = useState(
    suggestedResult?.edges || []
  )
  // If suggested list changed
  if (suggestedResult?.edges !== prevSuggestedItems) {
    setPrevSuggestedItems(suggestedResult?.edges)
    setSuggestedItems(suggestedResult?.edges || [])
  }

  const [prevSuggestedItemsPageInfo, setPrevSuggestedItemsPageInfo] =
    useState(pageInfo)
  const [suggestedItemsPageInfo, setSuggestedItemsPageInfo] = useState(pageInfo)
  // When page info changed
  if (pageInfo !== prevSuggestedItemsPageInfo) {
    setPrevSuggestedItemsPageInfo(pageInfo)
    setSuggestedItemsPageInfo(pageInfo)
  }

  const [targetPublish, setTargetPublish] = useState<Publish>()
  const [actionsModalVisible, setActionsModalVisible] = useState(false)
  const [positionX, setPositionX] = useState(0)
  const [positionY, setPositionY] = useState(0)
  const [screenHeight, setScreenHeight] = useState(0)

  const [addToPlaylistsModalVisible, setAddToPlaylistsModalVisible] =
    useState(false)
  const [prevPlaylists, setPrevPlaylists] = useState(playlistsResult?.edges)
  const [playlists, setPlaylists] = useState(playlistsResult?.edges || [])
  // When playlists result changed
  if (playlistsResult?.edges !== prevPlaylists) {
    setPrevPlaylists(playlistsResult?.edges)
    setPlaylists(playlistsResult?.edges || [])
  }

  const [prevPlaylistsPageInfo, setPrevPlaylistsPageInfo] = useState(
    playlistsResult?.pageInfo
  )
  const [playlistsPageInfo, setPlaylistsPageInfo] = useState(
    playlistsResult?.pageInfo
  )
  // When playlists page info changed
  if (playlistsResult?.pageInfo !== prevPlaylistsPageInfo) {
    setPrevPlaylistsPageInfo(playlistsResult?.pageInfo)
    setPlaylistsPageInfo(playlistsResult?.pageInfo)
  }

  const [loadingPublishPlaylistsData, setLoadingPublishPlaylistsData] =
    useState(false)
  const [publishPlaylistsData, setPublishPlaylistsData] = useState<
    CheckPublishPlaylistsResponse | undefined
  >()

  const [shareModalVisible, setShareModalVisible] = useState(false)
  const [reportModalVisible, setReportModalVisible] = useState(false)

  const { onVisible: openAuthModal } = useAuthContext()

  const onOpenActions = useCallback((p: Publish) => {
    setTargetPublish(p)
    setActionsModalVisible(true)
  }, [])

  const oncloseActions = useCallback(() => {
    setTargetPublish(undefined)
    setActionsModalVisible(false)
  }, [])

  const setPOS = useCallback(
    (posX: number, posY: number, screenHeight: number) => {
      setPositionX(posX)
      setPositionY(posY)
      setScreenHeight(screenHeight)
    },
    []
  )

  const openAddToPlaylistsModal = useCallback(() => {
    if (!isAuthenticated) {
      openAuthModal()
    } else {
      setAddToPlaylistsModalVisible(true)
      setActionsModalVisible(false)
    }
  }, [isAuthenticated, openAuthModal])

  const closeAddToPlaylistsModal = useCallback(() => {
    setAddToPlaylistsModalVisible(false)
    setTargetPublish(undefined)
  }, [])

  const openShareModal = useCallback(() => {
    setShareModalVisible(true)
    setActionsModalVisible(false)
  }, [])

  const closeShareModal = useCallback(() => {
    setShareModalVisible(false)
    setTargetPublish(undefined)
  }, [])

  const openReportModal = useCallback(() => {
    setReportModalVisible(true)
    setActionsModalVisible(false)
  }, [])

  const closeReportModal = useCallback(() => {
    setReportModalVisible(false)
    setTargetPublish(undefined)
  }, [])

  const fetchMoreSuggestions = useCallback(async () => {
    if (
      !publishId ||
      !suggestedItemsPageInfo ||
      !suggestedItemsPageInfo.endCursor ||
      !suggestedItemsPageInfo.hasNextPage
    )
      return

    try {
      setLoading(true)
      const res = await fetch(`/suggestions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cursor: suggestedItemsPageInfo?.endCursor,
          publishId,
        }),
      })
      const data = (await res.json()) as {
        result: FetchPublishesResponse
      }
      setSuggestedItems((prev) => [...prev, ...data.result?.edges])
      setSuggestedItemsPageInfo(data.result?.pageInfo)
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }, [suggestedItemsPageInfo, publishId])
  const { observedRef } = useInfiniteScroll(0.5, fetchMoreSuggestions)

  if (suggestedItems.length === 0) return null

  return (
    <>
      <div className="pb-10 sm:pb-0 bg-white">
        {suggestedItems.map((edge, index) =>
          !edge.node ? null : (
            <RecommendationItem
              key={`${edge.node?.id}-${index}`}
              publish={edge.node}
              setPOS={setPOS}
              onOpenActions={onOpenActions}
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

      {/* Actions modal */}
      {actionsModalVisible && (
        <ActionsModal
          isAuthenticated={isAuthenticated}
          profile={profile}
          publish={targetPublish}
          closeModal={oncloseActions}
          top={screenHeight - positionY < 280 ? positionY - 280 : positionY} // 280 is modal height
          left={positionX - 300} // 300 is modal width
          openAddToPlaylistsModal={openAddToPlaylistsModal}
          loadingPublishPlaylistsData={loadingPublishPlaylistsData}
          setLoadingPublishPlaylistsData={setLoadingPublishPlaylistsData}
          setPublishPlaylistsData={setPublishPlaylistsData}
          openShareModal={openShareModal}
          openReportModal={openReportModal}
        />
      )}

      {/* Add to playlists modal */}
      {addToPlaylistsModalVisible && targetPublish && publishPlaylistsData && (
        <AddToPlaylistsModal
          closeModal={closeAddToPlaylistsModal}
          publishId={targetPublish.id}
          playlists={playlists}
          setPlaylists={setPlaylists}
          playlistsPageInfo={playlistsPageInfo}
          setPlaylistsPageInfo={setPlaylistsPageInfo}
          publishPlaylistsData={publishPlaylistsData}
        />
      )}

      {/* Share modal */}
      {shareModalVisible && targetPublish && (
        <ShareModal
          title={targetPublish.title!}
          closeModal={closeShareModal}
          shareUrl={`${BASE_URL}/watch/${targetPublish.id}`}
        />
      )}

      {/* Report modal */}
      {reportModalVisible && targetPublish && (
        <ReportModal
          closeModal={closeReportModal}
          publishId={targetPublish.id}
        />
      )}
    </>
  )
}
