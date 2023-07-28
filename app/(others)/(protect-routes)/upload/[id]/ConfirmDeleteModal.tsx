import React from "react"

import ConfirmModal from "@/components/ConfirmModal"

interface Props {
  loading: boolean
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDeleteModal({
  loading,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <ConfirmModal
      loading={loading}
      onConfirm={onConfirm}
      onCancel={onCancel}
      useRedBgForConfirm={true}
      confirmText="Delete"
    >
      <div className="text-lg">
        This will permanently delete the publish and cannot be undone.
      </div>
    </ConfirmModal>
  )
}
