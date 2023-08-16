"use client"

import React, { useCallback } from "react"
import { useRouter } from "next/navigation"

import UploadVideoModal from "./UploadVideoModal"
import CreateBlogModal from "./CreateBlogModal"
import { Maybe, Profile } from "@/graphql/codegen/graphql"
interface Props {
  uploadType: "video" | "blog"
  isAuthenticated: boolean
  profile: Maybe<Profile> | undefined
  idToken: string
  profileName: string
}

export default function Upload({
  uploadType,
  profile,
  idToken,
  profileName,
}: Props) {
  const router = useRouter()

  const cancelSelectContentType = useCallback(() => {
    router.back()
  }, [router])

  if (!profile) return null

  return (
    <>
      {uploadType === "video" && (
        <UploadVideoModal
          cancelUpload={cancelSelectContentType}
          idToken={idToken}
          profileName={profileName}
        />
      )}

      {uploadType === "blog" && (
        <CreateBlogModal
          profile={profile}
          cancelUpload={cancelSelectContentType}
          profileName={profileName}
        />
      )}
    </>
  )
}
