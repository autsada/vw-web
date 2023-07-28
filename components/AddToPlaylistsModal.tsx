import React, { useState, useCallback } from "react"
import { BsPlusLg } from "react-icons/bs"
import { MdOutlineKeyboardBackspace } from "react-icons/md"

import ModalWrapper from "@/components/ModalWrapper"
import CreatePlaylistForm from "./CreatePlaylistForm"
import UpdatePlaylistsForm from "./UpdatePlaylistsForm"
import type {
  CheckPublishPlaylistsResponse,
  PageInfo,
  PlaylistEdge,
} from "@/graphql/codegen/graphql"

interface Props {
  closeModal: () => void
  publishId: string
  playlists: PlaylistEdge[]
  setPlaylists: React.Dispatch<React.SetStateAction<PlaylistEdge[]>>
  playlistsPageInfo: PageInfo | undefined
  setPlaylistsPageInfo: React.Dispatch<
    React.SetStateAction<PageInfo | undefined>
  >
  publishPlaylistsData: CheckPublishPlaylistsResponse
}

export default function AddToPlaylistsModal({
  closeModal,
  publishId,
  playlists,
  setPlaylists,
  playlistsPageInfo,
  setPlaylistsPageInfo,
  publishPlaylistsData,
}: Props) {
  const [createFormVisible, setCreateFormVisible] = useState(false)

  const onStartCreateNewPlaylist = useCallback(() => {
    setCreateFormVisible(true)
  }, [])

  const onEndCreateNewPlaylist = useCallback(() => {
    setCreateFormVisible(false)
  }, [])

  return (
    <ModalWrapper visible>
      <div className="fixed z-10 inset-0" onClick={closeModal}></div>
      <div className="relative z-20 pt-5 w-[400px] max-w-[80%] text-center bg-white rounded-xl overflow-hidden">
        <div className="px-10 flex items-center justify-between gap-x-5">
          <p className="text-lg">Add to...</p>
          <div
            className="flex-grow flex items-center justify-end gap-x-2 cursor-pointer rounded-md"
            onClick={
              !createFormVisible
                ? onStartCreateNewPlaylist
                : onEndCreateNewPlaylist
            }
          >
            {!createFormVisible ? (
              <>
                <BsPlusLg size={20} className="text-blueBase" />
                <div className="text-blueBase">Create playlist</div>
              </>
            ) : (
              <MdOutlineKeyboardBackspace size={24} className="text-blueBase" />
            )}
          </div>
        </div>

        {!createFormVisible ? (
          <UpdatePlaylistsForm
            publishId={publishId}
            onFinished={closeModal}
            playlists={playlists}
            setPlaylists={setPlaylists}
            playlistsPageInfo={playlistsPageInfo}
            setPlaylistsPageInfo={setPlaylistsPageInfo}
            publishPlaylistsData={publishPlaylistsData}
          />
        ) : (
          <CreatePlaylistForm publishId={publishId} onFinished={closeModal} />
        )}
      </div>
    </ModalWrapper>
  )
}
