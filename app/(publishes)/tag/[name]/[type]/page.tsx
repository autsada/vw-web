import React, { Suspense } from "react"

import Results from "../Results"
import { getAccount } from "@/lib/server"
import {
  getProfileById,
  fetchPublishesByTag,
  fetchMyPlaylists,
} from "@/graphql"
import { QueryPublishType } from "@/graphql/types"

type Props = {
  params: { name: string; type: string }
}

export default async function page({ params }: Props) {
  const data = await getAccount()
  const account = data?.account
  const idToken = data?.idToken
  const signature = data?.signature

  // Get user profile
  const profile =
    !account || !idToken || !account.defaultProfile
      ? undefined
      : await getProfileById(account?.defaultProfile?.id)

  const tag = params.name
  const publishType = params.type as QueryPublishType
  const fetchResult = await fetchPublishesByTag({
    requestorId: profile?.id,
    cursor: null,
    tag,
    publishType,
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
        tag={tag}
        publishType={publishType}
        fetchResult={fetchResult}
        playlistsResult={playlistsResult}
      />
    </Suspense>
  )
}
