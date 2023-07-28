"use client"

import React, { useCallback, useState } from "react"

import VideoItem from "./VideoItem"
import ItemsHeader from "./ItemsHeader"
import ActionsModal from "@/components/ActionsModal"
import AddToPlaylistsModal from "@/components/AddToPlaylistsModal"
import ShareModal from "@/components/ShareModal"
import ButtonLoader from "@/components/ButtonLoader"
import Mask from "@/components/Mask"
import BlogItem from "./BlogItem"
import { useAuthContext } from "@/context/AuthContext"
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll"
import { BASE_URL } from "@/lib/constants"
import type {
  CheckPublishPlaylistsResponse,
  FetchPlaylistsResponse,
  FetchPublishesResponse,
  Maybe,
  Publish,
  Profile,
} from "@/graphql/codegen/graphql"
import type { PublishOrderBy, QueryPublishType } from "@/graphql/types"

interface Props {
  creatorName: string
  creatorId: string
  isAuthenticated: boolean
  profile: Profile | undefined
  itemsResult: Maybe<FetchPublishesResponse> | undefined
  playlistsResult: Maybe<FetchPlaylistsResponse> | undefined
  tab?: QueryPublishType
}

export default function ContentItems({
  creatorName,
  creatorId,
  isAuthenticated,
  profile,
  itemsResult,
  playlistsResult,
  tab,
}: Props) {
  const [prevItems, setPrevItems] = useState(itemsResult?.edges)
  const [items, setItems] = useState(itemsResult?.edges || [])
  const [prevPageInfo, setPrevPageInfo] = useState(itemsResult?.pageInfo)
  const [loading, setLoading] = useState(false)
  const [sortBy, setSortBy] = useState<PublishOrderBy>("latest")
  const [pageInfo, setPageInfo] = useState(itemsResult?.pageInfo)
  // When props fetch result changed
  if (itemsResult) {
    if (itemsResult.edges !== prevItems) {
      setPrevItems(itemsResult?.edges)
      setItems(itemsResult?.edges || [])
    }
    if (itemsResult.pageInfo !== prevPageInfo) {
      setPrevPageInfo(itemsResult.pageInfo)
      setPageInfo(itemsResult.pageInfo)
    }
  }

  const [targetPublish, setTargetPublish] = useState<Publish>()
  const [actionsModalVisible, setActionsModalVisible] = useState(false)
  const [positionX, setPositionX] = useState(0)
  const [positionY, setPositionY] = useState(0)
  const [screenHeight, setScreenHeight] = useState(0)
  const [screenWidth, setScreenWidth] = useState(0)

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
    (posX: number, posY: number, screenHeight: number, screenWidth: number) => {
      setPositionX(posX)
      setPositionY(posY)
      setScreenHeight(screenHeight)
      setScreenWidth(screenWidth)
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

  const fetchMoreItems = useCallback(async () => {
    if (
      !creatorId ||
      !creatorName ||
      !pageInfo ||
      !pageInfo.endCursor ||
      !pageInfo.hasNextPage
    )
      return

    try {
      setLoading(true)
      const res = await fetch(`/api/publishe/query/by-profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          creatorId,
          publishType: tab,
          cursor: pageInfo.endCursor,
          sortBy,
        }),
      })
      const data = (await res.json()) as {
        result: FetchPublishesResponse
      }
      setItems((prev) => [...prev, ...data.result.edges])
      setPageInfo(data?.result?.pageInfo)
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }, [creatorId, creatorName, tab, pageInfo, setLoading, sortBy])
  const { observedRef } = useInfiniteScroll(0.5, fetchMoreItems)

  // Fetch publishes when user selects sort by
  // It's a first fetch so there is no cursor
  const fetchWithSortBy = useCallback(
    async (ob: PublishOrderBy) => {
      if (!creatorId || !creatorName) return
      try {
        setLoading(true)
        const res = await fetch(`/@${creatorName}/publishes`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            creatorId,
            kind: tab,
            sortBy: ob,
          }),
        })
        const data = (await res.json()) as {
          result: FetchPublishesResponse
        }
        setItems(data.result?.edges)
        setPageInfo(data.result?.pageInfo)
        setLoading(false)
      } catch (error) {
        setLoading(false)
      }
    },
    [creatorName, creatorId, tab, setItems, setPageInfo]
  )

  const onSelectSortBy = useCallback(
    (s: PublishOrderBy) => {
      setSortBy(s)
      if (s !== sortBy) {
        // Check if all items already fetched
        if (!pageInfo?.hasNextPage) {
          // A. Already fetched all, just sort the items.
          if (s === "latest") {
            setItems((prev) =>
              prev.sort(
                (a, b) =>
                  (new Date(b.node?.createdAt) as any) -
                  (new Date(a.node?.createdAt) as any)
              )
            )
          } else {
            if (tab === "videos") {
              setItems((prev) =>
                prev.sort((a, b) => (b.node?.views || 0) - (a.node?.views || 0))
              )
            } else if (tab === "blogs") {
              setItems((prev) =>
                prev.sort(
                  (a, b) =>
                    (b.node?.commentsCount || 0) - (a.node?.commentsCount || 0)
                )
              )
            }
          }
        } else {
          // B. Has more items, start fetch from the beginning.
          fetchWithSortBy(s)
        }
      }
    },
    [sortBy, fetchWithSortBy, setSortBy, pageInfo, setItems, tab]
  )

  return (
    <>
      {items.length === 0 ? (
        <div className="py-10">
          <h6 className="text-center">No results found.</h6>
        </div>
      ) : (
        <div className="pb-20 sm:pb-10">
          {items.length > 1 && (
            <ItemsHeader sortBy={sortBy} onSelectSortBy={onSelectSortBy} />
          )}
          <div className="mt-4 flex flex-col sm:flex-row gap-y-2 sm:gap-x-4 flex-wrap">
            {items.map((edge, i) =>
              !edge.node ? null : edge.node.publishType === "Blog" ? (
                <BlogItem key={`${edge.node?.id}-${i}`} publish={edge.node} />
              ) : (
                <VideoItem
                  key={`${edge.node?.id}-${i}`}
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
        </div>
      )}

      {/* Actions modal */}
      {actionsModalVisible && (
        <ActionsModal
          isAuthenticated={isAuthenticated}
          profile={profile}
          publish={targetPublish}
          closeModal={oncloseActions}
          top={screenHeight - positionY < 200 ? positionY - 200 : positionY} // 200 is modal height
          left={
            positionX > 300
              ? positionX - 300
              : screenWidth - positionX > 300
              ? positionX
              : positionX / 2
          } // 300 is modal width
          openAddToPlaylistsModal={openAddToPlaylistsModal}
          setPublishPlaylistsData={setPublishPlaylistsData}
          loadingPublishPlaylistsData={loadingPublishPlaylistsData}
          setLoadingPublishPlaylistsData={setLoadingPublishPlaylistsData}
          openShareModal={openShareModal}
          setItems={setItems}
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

      {/* Prevent user interaciton while loading */}
      {loading && <Mask backgroundColor="white" opacity={0.2} />}
    </>
  )
}
