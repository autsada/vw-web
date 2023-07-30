import React, { useState, useCallback } from "react"

import ButtonLoader from "@/components/ButtonLoader"
import VideoItem from "@/app/(publishes)/VideoItem"
import BlogItem from "./BlogItem"
import ActionsModal from "@/components/ActionsModal"
import AddToPlaylistsModal from "@/components/AddToPlaylistsModal"
import ShareModal from "@/components/ShareModal"
import ReportModal from "@/components/ReportModal"
import Mask from "@/components/Mask"
import { useAuthContext } from "@/context/AuthContext"
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll"
import { BASE_URL } from "@/lib/constants"
import type {
  Maybe,
  FetchPublishesResponse,
  Publish,
  FetchPlaylistsResponse,
  CheckPublishPlaylistsResponse,
  Profile,
  PageInfo,
  PublishEdge,
} from "@/graphql/codegen/graphql"

interface Props {
  isAuthenticated: boolean
  profile: Maybe<Profile> | undefined
  fetchResult: Maybe<FetchPublishesResponse> | undefined
  playlistsResult: Maybe<FetchPlaylistsResponse> | undefined
  fetchMore: (
    setEdges: React.Dispatch<React.SetStateAction<PublishEdge[]>>,
    pageInfo: PageInfo | undefined,
    setPageInfo: React.Dispatch<React.SetStateAction<PageInfo | undefined>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) => Promise<void>
}

export default function DisplayedResults({
  isAuthenticated,
  profile,
  fetchResult,
  playlistsResult,
  fetchMore,
}: Props) {
  const [prevEdges, setPrevEdges] = useState(fetchResult?.edges)
  const [edges, setEdges] = useState(fetchResult?.edges || [])
  if (fetchResult?.edges !== prevEdges) {
    setPrevEdges(fetchResult?.edges)
    setEdges(fetchResult?.edges || [])
  }

  const [prevPageInfo, setPrevPageInfo] = useState(fetchResult?.pageInfo)
  const [pageInfo, setPageInfo] = useState(fetchResult?.pageInfo)
  if (fetchResult?.pageInfo !== prevPageInfo) {
    setPrevPageInfo(fetchResult?.pageInfo)
    setPageInfo(fetchResult?.pageInfo)
  }

  const [loading, setLoading] = useState(false)
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

  const { observedRef } = useInfiniteScroll(
    0.5,
    fetchMore.bind(undefined, setEdges, pageInfo, setPageInfo, setLoading)
  )

  return (
    <>
      <div className="pb-20">
        {!loading && edges.length === 0 ? (
          <div className="py-44 flex items-center justify-center font-semibold text-2xl">
            No results found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-y-2 sm:gap-y-4 md:gap-y-2 md:gap-x-4 justify-items-center bg-white divide-y-[4px] sm:divide-y-0 divide-neutral-200">
            {edges.map((edge, i) =>
              !edge.node ? null : edge.node.publishType === "Blog" ? (
                <BlogItem
                  key={edge?.node?.id}
                  publish={edge?.node}
                  onOpenActions={onOpenActions}
                  setPOS={setPOS}
                />
              ) : (
                <VideoItem
                  key={edge?.node?.id}
                  publish={edge?.node}
                  onOpenActions={onOpenActions}
                  setPOS={setPOS}
                />
              )
            )}
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

      {/* Actions modal */}
      {actionsModalVisible && targetPublish && (
        <ActionsModal
          actionsFor={
            targetPublish?.publishType === "Blog" ? "blogs" : "videos"
          }
          isAuthenticated={isAuthenticated}
          profile={profile}
          publish={targetPublish}
          closeModal={oncloseActions}
          top={
            targetPublish.publishType === "Blog"
              ? screenHeight - positionY <
                (profile?.id === targetPublish?.creator?.id ? 150 : 200)
                ? profile?.id === targetPublish?.creator?.id
                  ? 150
                  : 200 // 200 is modal height
                : positionY
              : screenHeight - positionY <
                (profile?.id === targetPublish?.creator?.id ? 200 : 280)
              ? positionY -
                (profile?.id === targetPublish?.creator?.id ? 200 : 280) // 280 is modal height
              : positionY
          }
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
          shareUrl={
            targetPublish.publishType === "Blog"
              ? `${BASE_URL}/read/${targetPublish.id}`
              : `${BASE_URL}/watch/${targetPublish.id}`
          }
        />
      )}

      {/* Report modal */}
      {reportModalVisible && targetPublish && (
        <ReportModal
          closeModal={closeReportModal}
          publishId={targetPublish.id}
          title={
            targetPublish.publishType === "Blog" ? "Report blog" : undefined
          }
        />
      )}

      {loadingPublishPlaylistsData && (
        <Mask backgroundColor="#fff" opacity={0.2} />
      )}
    </>
  )
}
