import React, { useTransition, useCallback, useState } from "react"

import ConfirmModal from "@/components/ConfirmModal"
import Mask from "@/components/Mask"
import { removeBookmarks } from "@/app/actions/publish-actions"
import type { BookmarkEdge } from "@/graphql/codegen/graphql"

interface Props {
  setItems: React.Dispatch<React.SetStateAction<BookmarkEdge[]>>
}

export default function RemoveAllBtn({ setItems }: Props) {
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
    startTransition(() => removeBookmarks())
    endRemove()
  }, [endRemove, setItems])

  return (
    <>
      <button
        type="button"
        className="btn-cancel px-5 rounded-full text-sm"
        onClick={startRemove}
      >
        Remove all from Reading list
      </button>

      {confirmModalVisible && (
        <ConfirmModal onCancel={endRemove} onConfirm={confirmRemove}>
          <div className="text-base sm:text-lg">
            This will remove all blogs from{" "}
            <span className="font-semibold">Reading list</span>.
          </div>
        </ConfirmModal>
      )}

      {/* Prevent interaction while loading */}
      {isPending && <Mask />}
    </>
  )
}
