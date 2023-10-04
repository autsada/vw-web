import React, { Suspense } from "react"
import { redirect } from "next/navigation"

import PlaylistName from "../WL/PlaylistName"
import ContentItems from "./ContentItems"
import { getAccount } from "@/lib/server"
import { fetchMyPlaylists, fetchPlaylistItems, getProfileById } from "@/graphql"

export default async function Playlist({ params }: { params: { id: string } }) {
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

  const playlistId = params.id
  // Fetch content of the playlist
  const itemsResult = await fetchPlaylistItems({
    idToken: idToken!,
    signature,
    input: {
      accountId: account!.id,
      profileId: profile.id,
      owner: account!.owner,
      playlistId,
      cursor: null,
      orderBy: "newest",
    },
  })

  if (!itemsResult) {
    redirect("/library")
  }

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
    <div className="px-0 sm:px-4">
      {!itemsResult || itemsResult.edges?.length === 0 ? (
        <div className="py-6">
          <PlaylistName
            playlistId={playlistId}
            isAuthenticated={!!account}
            name={itemsResult?.playlistName || ""}
            description={itemsResult?.playlistDescription || ""}
            itemsCount={itemsResult?.pageInfo.count || 0}
            isFullWidth={false}
          />
        </div>
      ) : (
        <Suspense fallback={<p className="px-2">Loading...</p>}>
          <ContentItems
            isAuthenticated={!!account}
            profile={profile}
            playlistId={playlistId}
            itemsResult={itemsResult}
            playlistsResult={playlistsResult}
          />
        </Suspense>
      )}
    </div>
  )
}
