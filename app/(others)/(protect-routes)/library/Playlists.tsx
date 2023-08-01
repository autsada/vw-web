"use client"

import React, { useState, useCallback, useTransition } from "react"
import { MdOutlinePlaylistAdd } from "react-icons/md"
import { toast } from "react-toastify"

import ButtonLoader from "@/components/ButtonLoader"
import ConfirmModal from "@/components/ConfirmModal"
import PlaylistItem from "./PlaylistItem"
import PlaylistActionsModal from "./PlaylistActionsModal"
import UpdatePlaylistNameModal from "./UpdatePlaylistNameModal"
import Mask from "@/components/Mask"
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll"
import { useAuthContext } from "@/context/AuthContext"
import { deletePL, updatePLName } from "@/app/actions/library-actions"
import type {
  FetchPreviewPlaylistsResponse,
  Maybe,
  PreviewPlaylist,
} from "@/graphql/codegen/graphql"

interface Props {
  isAuthenticated: boolean
  itemsCount: number
  playlistsResult: Maybe<FetchPreviewPlaylistsResponse> | undefined
}

export default function Playlists({
  isAuthenticated,
  itemsCount,
  playlistsResult,
}: Props) {
  const [targetPlaylist, setTargetPlaylist] = useState<PreviewPlaylist>()
  const [actionsModalVisible, setActionsModalVisible] = useState(false)
  const [positionX, setPositionX] = useState(0)
  const [positionY, setPositionY] = useState(0)
  const [screenHeight, setScreenHeight] = useState(0)
  const [screenWidth, setScreenWidth] = useState(0)

  const [prevPlaylists, setPrevPlaylists] = useState(playlistsResult?.edges)
  const [playlists, setPlaylists] = useState(playlistsResult?.edges || [])
  const [loading, setLoading] = useState(false)
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

  const [confirmDeleteModalVisible, setConfirmDeleteModalVisible] =
    useState(false)
  const [updatePlaylistModalVisible, setUpdatePlaylistModalVisible] =
    useState(false)

  const { onVisible: openAuthModal } = useAuthContext()
  const [isPending, startTransition] = useTransition()

  const fetchMorePlaylists = useCallback(async () => {
    if (
      !playlistsPageInfo ||
      !playlistsPageInfo.endCursor ||
      !playlistsPageInfo.hasNextPage
    )
      return

    try {
      setLoading(true)
      const res = await fetch(`/api/playlist/preview`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cursor: playlistsPageInfo?.endCursor }),
      })
      const data = (await res.json()) as {
        result: FetchPreviewPlaylistsResponse
      }
      setPlaylists((prev) => [...prev, ...data.result?.edges])
      setPlaylistsPageInfo(data.result?.pageInfo)
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }, [playlistsPageInfo, setPlaylists, setPlaylistsPageInfo])
  const { observedRef } = useInfiniteScroll(0.5, fetchMorePlaylists)

  const onOpenActions = useCallback((pl: PreviewPlaylist) => {
    setTargetPlaylist(pl)
    setActionsModalVisible(true)
  }, [])

  const oncloseActions = useCallback(() => {
    setTargetPlaylist(undefined)
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

  const startDeletePlaylist = useCallback(() => {
    setConfirmDeleteModalVisible(true)
    setActionsModalVisible(false)
  }, [])

  const endDeletePlaylist = useCallback(() => {
    setConfirmDeleteModalVisible(false)
  }, [])

  const confirmDeletePlaylist = useCallback(() => {
    if (!targetPlaylist) return

    if (!isAuthenticated) {
      openAuthModal()
    } else {
      startTransition(() => deletePL(targetPlaylist.id))
      toast.success(`Deleted ${targetPlaylist.name}`, { theme: "dark" })
    }
    setConfirmDeleteModalVisible(false)
  }, [targetPlaylist, isAuthenticated, openAuthModal])

  const startUpdatePlaylist = useCallback(() => {
    setUpdatePlaylistModalVisible(true)
    setActionsModalVisible(false)
  }, [])

  const endUpdatePlaylist = useCallback(() => {
    setUpdatePlaylistModalVisible(false)
  }, [])

  const confirmUpdatePlaylist = useCallback(() => {
    if (!targetPlaylist) return

    if (!isAuthenticated) {
      openAuthModal()
    } else {
      const el = document?.getElementById(
        "playlist-new-name"
      ) as HTMLInputElement
      if (!el || !el.value || el.value.length < 3 || el.value.length > 120)
        return

      const name = el.value
      if (name === targetPlaylist.name) return

      startTransition(() => updatePLName(targetPlaylist.id, name))
      toast.success("Updated playlist name", { theme: "dark" })
    }
    setUpdatePlaylistModalVisible(false)
  }, [targetPlaylist, isAuthenticated, openAuthModal])

  return (
    <>
      <div className="w-full py-5">
        <div>
          <div className="w-full flex items-start gap-x-4">
            <MdOutlinePlaylistAdd size={28} />
            <h6 className="text-lg sm:text-xl">Playlists</h6>
            {itemsCount > 0 && (
              <p className="sm:text-lg text-textLight">{itemsCount}</p>
            )}
          </div>
          {itemsCount === 0 && (
            <p className="mt-1 text-textLight">{`You don't have any playlists.`}</p>
          )}
        </div>

        <div className="mt-5 w-full overflow-x-auto scrollbar-hide">
          {playlists.length > 0 && (
            <div className="w-full flex gap-x-2 sm:gap-x-4 gap-y-4 flex-wrap">
              {playlists.map((edge) =>
                !edge.node ? null : (
                  <PlaylistItem
                    key={edge.node?.id}
                    item={edge.node}
                    onOpenActions={onOpenActions}
                    setPOS={setPOS}
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
      </div>

      {/* Actions modal */}
      {actionsModalVisible && targetPlaylist && (
        <PlaylistActionsModal
          closeModal={oncloseActions}
          top={screenHeight - positionY < 120 ? positionY - 120 : positionY} // 120 is modal height
          left={
            positionX > 250
              ? positionX - 250
              : screenWidth - positionX > 250
              ? positionX
              : positionX / 2
          } // 250 is modal width
          startDeletePlaylist={startDeletePlaylist}
          startUpdatePlaylist={startUpdatePlaylist}
        />
      )}

      {/* Confirm delete modal */}
      {confirmDeleteModalVisible && targetPlaylist && (
        <ConfirmModal
          onCancel={endDeletePlaylist}
          onConfirm={confirmDeletePlaylist}
        >
          <div className="text-base sm:text-lg">
            This will remove{" "}
            <span className="font-semibold">{targetPlaylist.name}</span>{" "}
            playlist and all its content.
          </div>
        </ConfirmModal>
      )}

      {/* Update modal */}
      {updatePlaylistModalVisible && targetPlaylist && (
        <UpdatePlaylistNameModal
          playlist={targetPlaylist}
          closeModal={endUpdatePlaylist}
          confirmUpdatePlaylist={confirmUpdatePlaylist}
        />
      )}

      {/* Prevent user interaction */}
      {isPending && <Mask />}
    </>
  )
}
