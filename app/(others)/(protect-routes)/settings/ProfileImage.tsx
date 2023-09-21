"use client"

import React, { useState, useCallback } from "react"
import Dropzone from "react-dropzone"
import Image from "next/image"

import Avatar from "@/components/Avatar"
import ImageModal from "./ImageModal"
import { dropzoneImageTypes } from "@/lib/helpers"
import type { FileWithPrview } from "@/types"
import type { Profile } from "@/graphql/codegen/graphql"

interface Props {
  profile: Profile
  idToken: string
}

export default function ProfileImage({ profile, idToken }: Props) {
  const [image, setImage] = useState<FileWithPrview>()
  const [imageError, setImageError] = useState("")
  const [previewUrl, setPreviewUrl] = useState("") // For `.heic` or `.heif` image

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    // Do something with the files
    const f = acceptedFiles[0] as FileWithPrview

    // Check size
    if (f.size / 1000 > 4096) {
      // Maximum allowed image size = 4mb
      setImageError("File too big")
    }

    // For `heic` or `heif` image, we need to have a specific preview url
    if (f.type.endsWith("heic") || f.type.endsWith("heif")) {
      const heic2any = (await import("heic2any")).default

      // Convert HEIC/HEIF file to JPEG Blob
      const file = (await heic2any({
        blob: f, // Use the original file object
        toType: "image/jpeg",
        quality: 1, // adjust quality as needed
      })) as Blob

      const previewFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      }) as FileWithPrview

      setPreviewUrl(previewFile.preview)
    } else {
      // For other formats we use `image.preview` so need to set `previewUrl` to ''
      setPreviewUrl("")
    }

    const fileWithPreview = Object.assign(f, {
      preview: URL.createObjectURL(f),
    })
    setImage(fileWithPreview)
  }, [])

  const cancelUpload = useCallback(() => {
    setImage(undefined)
    setImageError("")
  }, [])

  return (
    <>
      <div
        className={`relative z-10 mx-auto w-[130px] h-[130px] cursor-pointer rounded ${
          !!imageError
            ? "border-[2px] border-red-500"
            : "border border-gray-200"
        }`}
      >
        <Dropzone onDrop={onDrop} multiple={false} accept={dropzoneImageTypes}>
          {({ getRootProps, getInputProps }) => (
            <section className="h-full w-full">
              <div {...getRootProps()} className="h-full">
                <input {...getInputProps()} />
                <div className="h-full w-full text-center flex flex-col justify-center items-center">
                  <div className="relative h-full w-full rounded-full overflow-hidden">
                    {image && imageError ? (
                      <Image
                        src={previewUrl || image.preview}
                        alt={image.name}
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    ) : (
                      <Avatar
                        profile={profile}
                        width={130}
                        height={130}
                        fontSize="text-4xl"
                        withLink={false}
                      />
                    )}
                  </div>
                </div>
              </div>
            </section>
          )}
        </Dropzone>
        <p className="error">{!!imageError ? imageError : <>&nbsp;</>}</p>
      </div>

      {image && imageError && (
        <div className="absolute z-20 top-0 right-0">
          <button
            className="btn-cancel px-4 h-[25px] text-xs rounded-full"
            onClick={cancelUpload}
          >
            Cancel
          </button>
        </div>
      )}

      {image && !imageError && (
        <ImageModal
          profile={profile}
          idToken={idToken}
          image={image}
          previewUrl={previewUrl}
          cancelUpload={cancelUpload}
        />
      )}
    </>
  )
}
