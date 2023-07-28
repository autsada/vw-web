import React, { Suspense } from "react"
import { notFound } from "next/navigation"

import ContentItems from "./ContentItems"
import { getAccount } from "@/lib/server"
import {
  getProfileByName,
  fetchProfilePublishes,
  fetchMyPlaylists,
} from "@/graphql"

export default async function Page({
  params,
}: {
  params: { profile: string; tab: string }
}) {
  const data = await getAccount()
  const account = data?.account
  const idToken = data?.idToken
  const signature = data?.signature
  const name = params.profile?.replace("%40", "")

  // Query profile by name
  const creator = await getProfileByName(name, account?.defaultProfile?.id)

  if (!creator) {
    notFound()
  }

  // Query publishes uploaded by the profile
  const requestor =
    !account || !account.defaultProfile ? undefined : account.defaultProfile
  const publishesResult = await fetchProfilePublishes({
    creatorId: creator.id,
    requestorId: requestor?.id,
    orderBy: "latest",
    cursor: null,
    publishType: "all",
  })

  // Fetch user's playlists if user is authenticated
  const playlistsResult = !requestor
    ? undefined
    : await fetchMyPlaylists({
        idToken: idToken!,
        signature,
        input: {
          accountId: account!.id,
          profileId: requestor?.id,
          owner: account!.owner,
          cursor: null,
        },
      })

  return (
    <>
      <div className="mt-2">
        {!publishesResult || publishesResult.pageInfo?.count === 0 ? (
          <h6 className="text-textLight text-center">No results found.</h6>
        ) : (
          <Suspense fallback={<p className="px-2">Loading...</p>}>
            <ContentItems
              creatorName={name}
              creatorId={creator.id}
              isAuthenticated={!!account}
              profile={requestor}
              itemsResult={publishesResult}
              playlistsResult={playlistsResult}
              tab="all"
            />
          </Suspense>
        )}
      </div>
    </>
  )
}
