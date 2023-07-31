"use client"

import React, { useCallback, useState } from "react"

import WLActionsModal from "./WLActionsModal"
import ItemsHeader from "./ItemsHeader"
import ContentItem from "./ContentItem"
import AddToPlaylistsModal from "@/components/AddToPlaylistsModal"
import ShareModal from "@/components/ShareModal"
import ButtonLoader from "@/components/ButtonLoader"
import Poster from "./Poster"
import Mask from "@/components/Mask"
import { useAuthContext } from "@/context/AuthContext"
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll"
import { BASE_URL } from "@/lib/constants"
import type {
  CheckPublishPlaylistsResponse,
  FetchPlaylistsResponse,
  FetchWatchLaterResponse,
  Maybe,
  Publish,
  Profile,
} from "@/graphql/codegen/graphql"
import type { PlaylistOrderBy } from "@/graphql/types"

interface Props {
  isAuthenticated: boolean
  profile: Profile | undefined
  itemsResult: FetchWatchLaterResponse
  playlistsResult: Maybe<FetchPlaylistsResponse> | undefined
}

export default function ContentItems({
  isAuthenticated,
  profile,
  itemsResult,
  playlistsResult,
}: Props) {
  const itemsCount = itemsResult?.pageInfo?.count || 0

  const [prevFirstItem, setPrevFirstItem] = useState(
    itemsResult?.edges[0]?.node
  )
  const [firstItem, setFirstItem] = useState(itemsResult?.edges[0]?.node)
  const [prevItems, setPrevItems] = useState(itemsResult?.edges)
  const [items, setItems] = useState(itemsResult?.edges || [])
  const [prevPageInfo, setPrevPageInfo] = useState(itemsResult?.pageInfo)
  const [loading, setLoading] = useState(false)
  const [sortBy, setSortBy] = useState<PlaylistOrderBy>("newest")
  const [pageInfo, setPageInfo] = useState(itemsResult?.pageInfo)
  // When props fetch result changed
  if (itemsResult) {
    if (itemsResult.edges[0]?.node !== prevFirstItem) {
      setPrevFirstItem(itemsResult.edges[0]?.node)
      setFirstItem(itemsResult.edges[0]?.node)
    }
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

  const fetchMoreItems = useCallback(async () => {
    if (!pageInfo || !pageInfo.endCursor || !pageInfo.hasNextPage) return

    try {
      setLoading(true)
      const res = await fetch(`/api/wl`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cursor: pageInfo.endCursor,
          sortBy,
        }),
      })
      const data = (await res.json()) as {
        result: FetchWatchLaterResponse
      }
      setItems((prev) => [...prev, ...data.result.edges])
      setPageInfo(data?.result?.pageInfo)
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }, [pageInfo, setLoading, sortBy])
  const { observedRef } = useInfiniteScroll(0.5, fetchMoreItems)

  // Fetch watch later when user selects sort by
  const fetchWithSortBy = useCallback(
    async (ob: PlaylistOrderBy) => {
      try {
        setLoading(true)
        const res = await fetch(`/api/wl`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sortBy: ob,
          }),
        })
        const data = (await res.json()) as {
          result: FetchWatchLaterResponse
        }
        setItems(data.result?.edges)
        setPageInfo(data.result?.pageInfo)
        setLoading(false)
      } catch (error) {
        setLoading(false)
      }
    },
    [setItems, setPageInfo]
  )

  const onSelectSortBy = useCallback(
    (s: PlaylistOrderBy) => {
      setSortBy(s)
      if (s !== sortBy) {
        // Check if all items already fetched
        if (!pageInfo?.hasNextPage) {
          // A. Already fetched all, just sort the items.
          if (s === "newest") {
            setItems((prev) =>
              prev.sort(
                (a, b) =>
                  (new Date(b.node?.createdAt) as any) -
                  (new Date(a.node?.createdAt) as any)
              )
            )
          } else {
            setItems((prev) =>
              prev.sort(
                (a, b) =>
                  (new Date(a.node?.createdAt) as any) -
                  (new Date(b.node?.createdAt) as any)
              )
            )
          }
        } else {
          // B. Has more items, start fetch from the beginning.
          fetchWithSortBy(s)
        }
      }
    },
    [sortBy, fetchWithSortBy, setSortBy, pageInfo, setItems]
  )

  return (
    <>
      {items.length === 0 ? (
        <div className="py-6 px-4">
          <h6 className="text-lg sm:text-xl">Watch later</h6>
          <p className="mt-1 text-textLight">
            No publishes in this playlist yet.
          </p>
        </div>
      ) : (
        <>
          <div className="md:fixed md:z-20 md:left-[100px] md:top-[70px] md:bottom-0 sm:py-5">
            {firstItem && (
              <Poster
                isAuthenticated={isAuthenticated}
                publish={firstItem.publish}
                totalItems={itemsCount}
                setItems={setItems}
              />
            )}
          </div>

          <div className="ml-0 md:ml-[300px] lg:ml-[400px] mt-5 md:mt-0 sm:py-5 pb-20 md:pb-0">
            <div className="px-2 grid grid-cols-1 gap-y-3 sm:gap-y-4 md:px-14 lg:px-0">
              {items.length > 1 && (
                <ItemsHeader sortBy={sortBy} onSelectSortBy={onSelectSortBy} />
              )}
              <>
                {items.map((edge, i) =>
                  !edge.node?.publish ? null : (
                    <ContentItem
                      key={`${edge.node?.id}-${i}`}
                      publish={edge.node?.publish}
                      setPOS={setPOS}
                      onOpenActions={onOpenActions}
                    />
                  )
                )}
              </>
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
        </>
      )}

      {/* Actions modal */}
      {actionsModalVisible && (
        <WLActionsModal
          isAuthenticated={isAuthenticated}
          profile={profile}
          publish={targetPublish}
          closeModal={oncloseActions}
          top={screenHeight - positionY < 180 ? positionY - 180 : positionY} // 180 is modal height
          left={positionX - 300} // 300 is modal width
          openAddToPlaylistsModal={openAddToPlaylistsModal}
          loadingPublishPlaylistsData={loadingPublishPlaylistsData}
          setLoadingPublishPlaylistsData={setLoadingPublishPlaylistsData}
          setPublishPlaylistsData={setPublishPlaylistsData}
          openShareModal={openShareModal}
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
