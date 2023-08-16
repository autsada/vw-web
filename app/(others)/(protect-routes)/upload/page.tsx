import React, { Suspense } from "react"
import { redirect } from "next/navigation"

import Upload from "./Upload"
import { getAccount } from "@/lib/server"
import { getProfileById } from "@/graphql"

type Props = {
  searchParams: { t?: "video" | "blog" }
}

export default async function Page({ searchParams }: Props) {
  const data = await getAccount()
  const account = data?.account

  // Get user profile
  const profile = !account?.defaultProfile
    ? null
    : await getProfileById(account?.defaultProfile?.id)

  const uploadType = searchParams.t

  if (!uploadType) {
    redirect("/upload?t=video")
  }

  return (
    <>
      <h5>Upload content</h5>

      <Suspense fallback={<div>Loading...</div>}>
        <Upload
          uploadType={uploadType || "video"}
          isAuthenticated={!!account}
          profile={profile}
          idToken={data?.idToken || ""}
          profileName={profile?.name || ""}
        />
      </Suspense>
    </>
  )
}
