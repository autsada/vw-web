import React, { useState, useTransition } from "react"
import Image from "next/image"

import ConfirmModal from "@/components/ConfirmModal"
import ProgressBar from "@/components/ProgressBar"
import Mask from "@/components/Mask"
import { uploadFile } from "@/firebase/helpers"
import { profilesFolder } from "@/firebase/config"
import { updateBannerImage } from "@/app/actions/profile-actions"
import type { FileWithPrview } from "@/types"
import type { Profile } from "@/graphql/codegen/graphql"

interface Props {
  profile: Profile
  image: FileWithPrview
  cancelUpload: () => void
}

export default function BannerModal({ profile, image, cancelUpload }: Props) {
  const [loading, setLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState("")

  const [isPending, startTransition] = useTransition()

  async function updateBanner() {
    try {
      if (!image) return

      setLoading(true)
      // Upload the image to cloud storage
      const { url, fileRef } = await uploadFile({
        folder: `${profilesFolder}/${profile?.name}/banner`,
        file: image,
        setProgress: setUploadProgress,
      })
      startTransition(() => updateBannerImage(url, fileRef))
      setLoading(false)
      cancelUpload()
    } catch (error) {
      setLoading(false)
      setError("Update profile image failed.")
    }
  }

  return (
    <>
      <ConfirmModal
        onConfirm={updateBanner}
        onCancel={cancelUpload}
        loading={loading || isPending}
        error={error}
        disabled={!image}
      >
        <div className="w-full">
          <h6 className="mb-4">Change banner image</h6>

          <div className="relative w-full py-5 bg-gray-50">
            <div className="relative w-full h-[160px] sm:h-[200px] mx-auto border border-gray-200 rounded">
              <Image
                src={image.preview}
                alt={image.name}
                fill
                style={{ objectFit: "cover" }}
              />
            </div>

            <ProgressBar progress={uploadProgress} />
          </div>
        </div>
      </ConfirmModal>

      {/* Prevent interaction while loading */}
      {(loading || isPending) && <Mask />}
    </>
  )
}
