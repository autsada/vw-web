import React from "react"
import { redirect } from "next/navigation"

import VideoModal from "./VideoModal"
import { getProfileById, getUploadedPublish } from "@/graphql"
import { getAccount } from "@/lib/server"
import BlogModal from "./BlogModal"

export default async function Page({ params }: { params: { id: string } }) {
  const data = await getAccount()
  const account = data?.account
  const idToken = data?.idToken
  const signature = data?.signature

  if (!idToken || !account?.defaultProfile) {
    redirect("/")
  }

  // Get user profile
  const profile = !account?.defaultProfile
    ? null
    : await getProfileById(account?.defaultProfile?.id)

  if (!profile) {
    redirect("/settings")
  }

  // Get publish from the database
  const publish = await getUploadedPublish({
    idToken,
    signature,
    input: {
      targetId: params.id,
      requestorId: profile.id,
    },
  })

  // If no publish found, or user is not the owner of the publish
  if (
    !publish ||
    !publish.creator?.isOwner ||
    profile.id !== publish?.creatorId
  ) {
    redirect("/upload")
  }

  return (
    <>
      <h5>Publish: {params.id}</h5>

      {publish.publishType === "Blog" ? (
        <BlogModal publish={publish} profile={profile} />
      ) : (
        <VideoModal publish={publish} profileName={profile?.name || ""} />
      )}
    </>
  )
}
