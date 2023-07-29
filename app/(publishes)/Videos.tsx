"use client"

import React, { useState, useCallback } from "react"

import PublishTabs from "./PublishTabs"
import Mask from "@/components/Mask"
import ActionsModal from "@/components/ActionsModal"
import AddToPlaylistsModal from "@/components/AddToPlaylistsModal"
import ShareModal from "@/components/ShareModal"
import ReportModal from "@/components/ReportModal"
import VideosByCat from "./VideosByCat"
import Shorts from "./Shorts"
import { contentCategories } from "@/lib/helpers"
import { useAuthContext } from "@/context/AuthContext"
import { BASE_URL } from "@/lib/constants"
import type { PublishCategory } from "@/graphql/types"
import type {
  Publish,
  Profile,
  FetchPublishesResponse,
  FetchPlaylistsResponse,
  CheckPublishPlaylistsResponse,
  Maybe,
} from "@/graphql/codegen/graphql"
import { divide } from "lodash"
import Divider from "@/components/Divider"

interface Props {
  isAuthenticated: boolean
  profile: Profile | undefined
  videosResult: Maybe<FetchPublishesResponse> | undefined
  shortsResult: Maybe<FetchPublishesResponse> | undefined
  playlistsResult: Maybe<FetchPlaylistsResponse> | undefined
}

export default function Videos({
  isAuthenticated,
  profile,
  videosResult,
  shortsResult,
  playlistsResult,
}: Props) {
  const [loading, setLoading] = useState(false)
  const [selectedCat, setSelectedCat] = useState<PublishCategory | "All">("All")

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

  const [publishPlaylistsData, setPublishPlaylistsData] =
    useState<CheckPublishPlaylistsResponse>()
  const [loadingPublishPlaylistsData, setLoadingPublishPlaylistsData] =
    useState(false)

  const [shareModalVisible, setShareModalVisible] = useState(false)
  const [reportModalVisible, setReportModalVisible] = useState(false)

  const { onVisible: openAuthModal } = useAuthContext()

  const onSelectTab = useCallback(async (t: PublishCategory | "All") => {
    setSelectedCat(t)
  }, [])

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

  return (
    <>
      <div className="fixed z-10 top-[70px] left-0 sm:left-[116px] right-0 h-[40px] bg-white">
        <div className="h-full py-4 px-2 w-full overflow-x-auto scrollbar-hide">
          <div className="h-full w-max flex items-center gap-x-2 sm:gap-x-4">
            <PublishTabs
              category={selectedCat}
              onSelectTab={onSelectTab}
              loading={loading}
            />
          </div>
        </div>
      </div>

      <div className="py-1 pb-20 md:py-5 md:px-10 lg:px-24 xl:px-14">
        {/* Short videos */}
        <Shorts fetchResult={shortsResult} selectedTab={selectedCat} />

        {shortsResult?.edges?.length && shortsResult?.edges?.length > 0 && (
          <div className="w-full h-[4px] bg-neutral-200 my-10" />
        )}

        {/* Render videos by category */}
        <VideosByCat
          tab="All"
          selectedTab={selectedCat}
          fetchResult={videosResult}
          loading={loading}
          setLoading={setLoading}
          onOpenActions={onOpenActions}
          setPOS={setPOS}
        />

        {contentCategories.map((cat) => (
          <VideosByCat
            key={cat}
            tab={cat}
            selectedTab={selectedCat}
            loading={loading}
            setLoading={setLoading}
            onOpenActions={onOpenActions}
            setPOS={setPOS}
          />
        ))}
      </div>

      {/* Actions modal */}
      {actionsModalVisible && (
        <ActionsModal
          isAuthenticated={isAuthenticated}
          profile={profile}
          publish={targetPublish}
          closeModal={oncloseActions}
          top={
            screenHeight - positionY <
            (profile?.id === targetPublish?.creator?.id ? 200 : 280)
              ? positionY -
                (profile?.id === targetPublish?.creator?.id ? 200 : 280)
              : positionY
          } // 280 is modal height
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

      {loadingPublishPlaylistsData && (
        <Mask backgroundColor="#fff" opacity={0.2} />
      )}
    </>
  )
}
