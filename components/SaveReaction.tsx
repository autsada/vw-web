import React, { useCallback, useState } from "react"
import { AiOutlineFolderAdd, AiFillFolderAdd } from "react-icons/ai"

import Reaction from "./Reaction"
import AddToPlaylistsModal from "./AddToPlaylistsModal"
import { useAuthContext } from "@/context/AuthContext"
import type {
  CheckPublishPlaylistsResponse,
  FetchPlaylistsResponse,
  Maybe,
} from "@/graphql/codegen/graphql"

interface Props {
  isAuthenticated: boolean
  publishId: string
  playlistsResult: Maybe<FetchPlaylistsResponse> | undefined
  publishPlaylistsData: Maybe<CheckPublishPlaylistsResponse> | undefined
  withDescription?: boolean
}

export default function SaveReaction({
  publishId,
  isAuthenticated,
  playlistsResult,
  publishPlaylistsData,
  withDescription = true,
}: Props) {
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

  const { onVisible: openAuthModal } = useAuthContext()

  const handleSavePublish = useCallback(async () => {
    if (!publishId) return

    if (!isAuthenticated) {
      openAuthModal()
    } else {
      setAddToPlaylistsModalVisible(true)
    }
  }, [publishId, isAuthenticated, openAuthModal])

  const closeAddToPlaylistsModal = useCallback(() => {
    setAddToPlaylistsModalVisible(false)
  }, [])

  return (
    <>
      <Reaction
        IconOutline={AiOutlineFolderAdd}
        IconFill={AiFillFolderAdd}
        description="Save"
        withDescription={withDescription}
        isActive={false}
        onClick={handleSavePublish}
      />

      {/* Add to playlist modal */}
      {addToPlaylistsModalVisible && publishPlaylistsData && publishId && (
        <AddToPlaylistsModal
          closeModal={closeAddToPlaylistsModal}
          publishId={publishId}
          playlists={playlists}
          setPlaylists={setPlaylists}
          playlistsPageInfo={playlistsPageInfo}
          setPlaylistsPageInfo={setPlaylistsPageInfo}
          publishPlaylistsData={publishPlaylistsData}
        />
      )}
    </>
  )
}
