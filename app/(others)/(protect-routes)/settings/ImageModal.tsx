import React, { useState, useTransition } from "react"
import Image from "next/image"

import ConfirmModal from "@/components/ConfirmModal"
import ProgressBar from "@/components/ProgressBar"
import Mask from "@/components/Mask"
import { uploadFile } from "@/firebase/helpers"
import { profilesFolder } from "@/firebase/config"
import { uploadImage } from "@/lib/client"
import { updateImage } from "@/app/actions/profile-actions"
import type { FileWithPrview } from "@/types"
import type { Profile } from "@/graphql/codegen/graphql"

interface Props {
  profile: Profile
  idToken: string
  image: FileWithPrview
  previewUrl?: string // Use this url to preview an image for `.heic` or `.heif`
  cancelUpload: () => void
}

export default function ImageModal({
  profile,
  idToken,
  image,
  previewUrl,
  cancelUpload,
}: Props) {
  const [loading, setLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState("")

  const [isPending, startTransition] = useTransition()

  async function updateProfileImage() {
    try {
      if (!image) return

      setLoading(true)

      let imageUrl = ""
      let imagePath = ""

      if (image.type.endsWith("heic") || image.type.endsWith("heif")) {
        // Send the image to the Upload service to convert the image to `jpeg` before uploading to cloud storage as Firebase Cloud Storage cannot process `heic` and `heif` formats properly.
        const result = await uploadImage({
          idToken,
          file: image,
          profileName: profile.name,
        })

        const { url, fileRef } = (await result.json()) as {
          url: string
          fileRef: string
        }

        imageUrl = url
        imagePath = fileRef
      } else {
        // Upload the image to cloud storage using Firebase on client side
        const { url, fileRef } = await uploadFile({
          folder: `${profilesFolder}/${profile?.name}/profile`,
          file: image,
          setProgress: setUploadProgress,
        })

        imageUrl = url
        imagePath = fileRef
      }

      startTransition(() => updateImage(imageUrl, imagePath))
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
        onConfirm={updateProfileImage}
        onCancel={cancelUpload}
        loading={loading || isPending}
        error={error}
        disabled={!image}
      >
        <div className="w-full">
          <h6 className="mb-4">Change image</h6>

          <div className="relative w-full py-5 bg-gray-50">
            <div className="w-[150px] h-[150px] mx-auto border border-gray-200 rounded">
              <div className="relative w-full h-full rounded-full overflow-hidden">
                <Image
                  src={previewUrl || image.preview}
                  alt={image.name}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
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
