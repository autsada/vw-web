import React, { Suspense } from "react"
import { redirect } from "next/navigation"

import ContentItems from "./ContentItems"
import { getAccount } from "@/lib/server"
import { getProfileById, fetchBookmarks } from "@/graphql"

export default async function ReadingList() {
  const data = await getAccount()
  const account = data?.account
  const idToken = data?.idToken
  const signature = data?.signature

  if (!data || !account || !idToken) {
    redirect("/")
  }

  if (!account?.defaultProfile) {
    redirect("/profile")
  }

  // Get user profile
  const profile = await getProfileById(account?.defaultProfile?.id)

  if (!profile) {
    redirect("/profile")
  }

  // Get bookmarked blogs from the database for the first render
  const bookmarksResult = await fetchBookmarks({
    idToken,
    signature,
    input: {
      accountId: account?.id,
      owner: account?.owner,
      profileId: profile?.id,
      cursor: null,
    },
  })

  return (
    <div className="px-0 sm:px-4">
      <Suspense fallback={<p className="px-2">Loading...</p>}>
        <ContentItems
          isAuthenticated={!!account}
          profile={profile}
          itemsResult={bookmarksResult}
        />
      </Suspense>
    </div>
  )
}
