import React, { Suspense } from "react"
import { redirect } from "next/navigation"

import Streaming from "./Streaming"
import { getAccount } from "@/lib/server"
import { getProfileById, getLiveStreamPublish } from "@/graphql"

export default async function StreamingPage({
  params,
}: {
  params: { id: string }
}) {
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

  // Check ownership of the profile
  if (account.owner?.toLowerCase() !== profile.owner?.toLowerCase()) {
    redirect("/")
  }

  // Get publish from the database
  const result = await getLiveStreamPublish({
    idToken,
    signature,
    input: {
      accountId: account.id,
      owner: account.owner,
      profileId: profile.id,
      publishId: params.id,
    },
  })

  if (!result || !result.publish || result.publish.streamType !== "Live") {
    redirect("/livestreaming")
  }

  return (
    <div className="relative w-full h-full">
      <Suspense fallback={<div>Loading...</div>}>
        <Streaming
          profile={profile}
          publish={result.publish}
          liveInput={result.liveInput}
        />
      </Suspense>
    </div>
  )
}
