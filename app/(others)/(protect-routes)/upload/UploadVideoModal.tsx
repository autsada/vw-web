import React, { useState, useCallback } from "react"
import { MdFileUpload } from "react-icons/md"
import { useDropzone } from "react-dropzone"
import { useRouter } from "next/navigation"

import CloseButton from "@/components/CloseButton"
import ModalWrapper from "@/components/ModalWrapper"
import ButtonLoader from "@/components/ButtonLoader"
import Mask from "@/components/Mask"
import { useAuthContext } from "@/context/AuthContext"
import { upload } from "@/lib/client"
import type { FileWithPrview } from "@/types"

interface Props {
  cancelUpload: () => void
  idToken: string
  profileName: string
}

export default function UploadVideoModal({
  cancelUpload,
  idToken,
  profileName,
}: Props) {
  const [fileError, setFileError] = useState("")
  const [draftLoading, setDraftLoading] = useState(false)

  const router = useRouter()
  const { onVisible: openAuthModal } = useAuthContext()

  const createDraft = useCallback(
    async (file: FileWithPrview) => {
      setDraftLoading(true)

      // Validate auth before upload
      const authResult = await fetch(`/api/account/validateAuth`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
      const authData = await authResult.json()
      const isAuthenticated = authData.isAuthenticated

      if (!isAuthenticated) {
        openAuthModal("Please sign in to upload.")
      } else {
        const result = await fetch(`/api/publish/draftVideo`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            filename: file.name,
          }),
        })
        const data = await result.json()
        // Upload file to cloud storage (without waiting)
        upload({ idToken, file, publishId: data?.id, profileName })
        // Push user to upload/[id]
        router.push(`/upload/${data?.id}`)
      }
    },
    [router, idToken, profileName, openAuthModal]
  )

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Do something with the files
      const f = acceptedFiles[0] as FileWithPrview

      // Check size
      if (f.size / 1000 > 102400000) {
        // Maximum allowed image size = 100GB
        setFileError("File too big")
      }
      const fileWithPreview = Object.assign(f, {
        preview: URL.createObjectURL(f),
      })

      // Create a draft publish immediately
      createDraft(fileWithPreview)
    },
    [createDraft]
  )

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    isDragAccept,
  } = useDropzone({
    onDrop: onDrop,
    accept: {
      "video/*": [],
    },
  })

  return (
    <ModalWrapper visible>
      <div className="w-full h-full min-w-full min-h-full max-w-full max-h-full flex items-center justify-center">
        <div className="relative w-[95%] h-[95%] pb-20 bg-white rounded-md overflow-hidden">
          <div className="w-full py-2 px-5 8-red-200 flex items-center justify-between border-b border-gray-100">
            <h6>Upload video</h6>
            <div>
              <CloseButton onClick={cancelUpload} className="text-base" />
            </div>
          </div>

          <div className="h-full flex flex-col items-center justify-center px-5">
            <div
              className="text-center"
              {...getRootProps({
                isDragActive,
                isDragReject,
                isDragAccept,
              })}
            >
              <input {...getInputProps()} />
              <div className="w-[200px] h-[200px] mx-auto rounded-full bg-gray-100 flex items-center justify-center cursor-pointer">
                {draftLoading ? (
                  <ButtonLoader loading color="#3b82f6" />
                ) : (
                  <MdFileUpload size={50} />
                )}
              </div>
              <p className="mt-5 text-lg">Drag and drop a file to upload</p>
              <p className="font-light text-textLight">
                Your video will be private until you publish it.
              </p>
            </div>
            <p className="error">{fileError ? fileError : <>&nbsp;</>}</p>
          </div>
        </div>
      </div>

      {/* Prevent interaction while creating a draft */}
      {draftLoading && <Mask />}
    </ModalWrapper>
  )
}
