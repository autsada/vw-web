import React, { useTransition, useCallback, useState } from "react"

import ConfirmModal from "@/components/ConfirmModal"
import Mask from "@/components/Mask"
import { removeAllItemsInPlaylist } from "@/app/actions/playlist-actions"
import type { PlaylistItemEdge } from "@/graphql/codegen/graphql"

interface Props {
  playlistId: string
  playlistName: string
  setItems: React.Dispatch<React.SetStateAction<PlaylistItemEdge[]>>
}

export default function RemoveAllBtn({
  playlistId,
  playlistName,
  setItems,
}: Props) {
  const [confirmModalVisible, setConfirmModalVisible] = useState(false)

  const [isPending, startTransition] = useTransition()

  const startRemove = useCallback(() => {
    setConfirmModalVisible(true)
  }, [])

  const endRemove = useCallback(() => {
    setConfirmModalVisible(false)
  }, [])

  const confirmRemove = useCallback(() => {
    setItems([])
    startTransition(() => removeAllItemsInPlaylist(playlistId))
    endRemove()
  }, [endRemove, playlistId, setItems])

  return (
    <>
      <button
        type="button"
        className="btn-cancel px-5 rounded-full text-sm"
        onClick={startRemove}
      >
        Remove all from {playlistName}
      </button>

      {confirmModalVisible && (
        <ConfirmModal onCancel={endRemove} onConfirm={confirmRemove}>
          <div className="text-base sm:text-lg">
            This will remove all publishes from{" "}
            <span className="font-semibold">{playlistName}</span>.
          </div>
        </ConfirmModal>
      )}

      {/* Prevent interaction while loading */}
      {isPending && <Mask />}
    </>
  )
}
