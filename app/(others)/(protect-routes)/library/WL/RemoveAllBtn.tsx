import React, { useTransition, useCallback, useState } from "react"

import ConfirmModal from "@/components/ConfirmModal"
import Mask from "@/components/Mask"
import { removeAllWL } from "@/app/actions/library-actions"
import type { WatchLaterEdge } from "@/graphql/codegen/graphql"

interface Props {
  setItems: React.Dispatch<React.SetStateAction<WatchLaterEdge[]>>
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
    startTransition(() => removeAllWL())
    endRemove()
  }, [endRemove, setItems])

  return (
    <>
      <button
        type="button"
        className="btn-cancel px-5 rounded-full text-sm"
        onClick={startRemove}
      >
        Remove all from Watch later
      </button>

      {confirmModalVisible && (
        <ConfirmModal onCancel={endRemove} onConfirm={confirmRemove}>
          <div className="text-base sm:text-lg">
            This will remove all videos from{" "}
            <span className="font-semibold">Watch later</span>.
          </div>
        </ConfirmModal>
      )}

      {/* Prevent interaction while loading */}
      {isPending && <Mask />}
    </>
  )
}
