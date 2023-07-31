import React, { Suspense } from "react"
import { redirect } from "next/navigation"

import Results from "./Results"
import {
  fetchMyPlaylists,
  fetchPublishesByQuery,
  getProfileById,
} from "@/graphql"
import { getAccount } from "@/lib/server"

type Props = {
  searchParams: { query?: string }
}

export default async function page({ searchParams }: Props) {
  const data = await getAccount()
  const account = data?.account
  const idToken = data?.idToken
  const signature = data?.signature

  // Get user profile
  const profile =
    !account || !idToken || !account.defaultProfile
      ? undefined
      : await getProfileById(account?.defaultProfile?.id)

  const query = searchParams.query

  if (typeof query === "undefined") {
    redirect("/results?query=")
  }

  const fetchResult = await fetchPublishesByQuery({
    requestorId: profile?.id,
    cursor: null,
    query,
    publishType: "all",
  })

  // Fetch user's playlists if user is authenticated
  const playlistsResult = !profile
    ? undefined
    : await fetchMyPlaylists({
        idToken: idToken!,
        signature,
        input: {
          accountId: account!.id,
          profileId: profile.id,
          owner: account!.owner,
          cursor: null,
        },
      })

  return (
    <Suspense
      fallback={<div className="w-full py-10 text-center">Loading...</div>}
    >
      <Results
        isAuthenticated={!!account}
        profile={profile}
        query={query}
        fetchResult={fetchResult}
        playlistsResult={playlistsResult}
      />
    </Suspense>
  )
}
