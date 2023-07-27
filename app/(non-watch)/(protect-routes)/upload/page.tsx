import React, { Suspense } from "react"
import { redirect } from "next/navigation"

import Upload from "./Upload"
import { getAccount } from "@/lib/server"
import { getProfileById } from "@/graphql"

export default async function Page() {
  const data = await getAccount()
  const account = data?.account

  // Get user profile
  const profile = !account?.defaultProfile
    ? null
    : await getProfileById(account?.defaultProfile?.id)

  return (
    <>
      <h5>Upload content</h5>

      <Suspense fallback={<div>Loading...</div>}>
        <Upload
          isAuthenticated={!!account}
          profile={profile}
          idToken={data?.idToken || ""}
          profileName={profile?.name || ""}
        />
      </Suspense>
    </>
  )
}
