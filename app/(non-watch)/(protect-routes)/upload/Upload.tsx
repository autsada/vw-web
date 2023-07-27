"use client"

import React, { useCallback, useState } from "react"
import { AiFillRead } from "react-icons/ai"
import { MdPlayArrow } from "react-icons/md"
import type { IconType } from "react-icons/lib"

import UploadVideoModal from "./UploadVideoModal"
import CreateBlogModal from "./CreateBlogModal"
import { Maybe, Profile } from "@/graphql/codegen/graphql"

type ContentType = "video" | "blog"

interface Props {
  isAuthenticated: boolean
  profile: Maybe<Profile> | undefined
  idToken: string
  profileName: string
}

export default function Upload({ profile, idToken, profileName }: Props) {
  const [contentType, setContentType] = useState<ContentType>()

  const selectContentType = useCallback((t: ContentType) => {
    setContentType(t)
  }, [])

  const cancelSelectContentType = useCallback(() => {
    setContentType(undefined)
  }, [])

  if (!profile) return null

  return (
    <>
      <div className="mt-5 flex flex-col sm:flex-row sm:justify-around gap-y-5 sm:gap-y-0 sm:gap-x-5">
        <UploadType
          title="Upload video"
          Icon={MdPlayArrow}
          onClick={selectContentType.bind(undefined, "video")}
        />
        <UploadType
          title="Create blog"
          Icon={AiFillRead}
          onClick={selectContentType.bind(undefined, "blog")}
          iconBgColor="bg-blue-500"
        />
      </div>

      {contentType === "video" && (
        <UploadVideoModal
          cancelUpload={cancelSelectContentType}
          idToken={idToken}
          profileName={profileName}
        />
      )}

      {contentType === "blog" && (
        <CreateBlogModal
          profile={profile}
          cancelUpload={cancelSelectContentType}
          profileName={profileName}
        />
      )}
    </>
  )
}

function UploadType({
  title,
  Icon,
  onClick,
  iconBgColor = "bg-orangeDark",
}: {
  title: string
  Icon: IconType
  onClick: () => void
  iconBgColor?: string
}) {
  return (
    <div
      className="w-full sm:w-[50%] md:w-[40%] lg:w-[35%] text-center px-5 py-5 sm:py-10 border border-neutral-200 rounded-md cursor-pointer hover:bg-neutral-100"
      onClick={onClick}
    >
      <h6>{title}</h6>
      <div className="mt-5 sm:mt-10">
        <div
          className={`w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] mx-auto rounded-full flex items-center justify-center ${iconBgColor}`}
        >
          <Icon size={50} color="white" />
        </div>
      </div>
    </div>
  )
}
