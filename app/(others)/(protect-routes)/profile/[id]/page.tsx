import React, { Suspense } from "react"
import { redirect } from "next/navigation"

import ProfileTemplate from "./ProfileTemplate"
import ContentItems from "@/app/(others)/[profile]/ContentItems"
import { getAccount } from "@/lib/server"
import {
  fetchMyPlaylists,
  fetchProfilePublishes,
  getProfileById,
} from "@/graphql"

export default async function ProfilePage({
  params,
}: {
  params: { id: string }
  children: React.ReactNode
}) {
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

  const profile = await getProfileById(params.id, account?.defaultProfile?.id)
  if (!profile) {
    redirect("/profile")
  }

  const publishesResult = await fetchProfilePublishes({
    creatorId: profile.id,
    requestorId: profile.id,
    orderBy: "latest",
    cursor: null,
    publishType: "all",
  })

  // Fetch user's playlists if user is authenticated
  const playlistsResult = await fetchMyPlaylists({
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
    <>
      <ProfileTemplate isAuthenticated={!!account} profile={profile} />

      <div className="mt-2">
        {!publishesResult || publishesResult.pageInfo?.count === 0 ? (
          <h6 className="text-textLight text-center">No content found</h6>
        ) : (
          <Suspense fallback={<p className="px-2">Loading...</p>}>
            <ContentItems
              creatorName={profile.name}
              creatorId={profile.id}
              isAuthenticated={!!account}
              profile={profile}
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
