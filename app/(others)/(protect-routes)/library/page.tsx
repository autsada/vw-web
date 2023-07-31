import React from "react"
import { redirect } from "next/navigation"

import WatchLater from "./WatchLater"
import ReadingList from "./ReadingList"
import Playlists from "./Playlists"
import { getAccount } from "@/lib/server"
import {
  fetchMyPlaylists,
  fetchPreviewBookmarks,
  fetchPreviewPlaylists,
  fetchPreviewWatchLater,
} from "@/graphql"
import type { Publish } from "@/graphql/codegen/graphql"

export const revalidate = 60 // revalidate this page every 60 seconds

export default async function Library() {
  const data = await getAccount()
  const account = data?.account
  const idToken = data?.idToken
  const signature = data?.signature

  if (!data || !account || !idToken) {
    redirect("/")
  }

  if (!account?.defaultProfile) {
    redirect("/station")
  }

  const profile = account.defaultProfile

  // Fetch preview watch later.
  const watchLaterResponse = await fetchPreviewWatchLater({
    idToken,
    signature,
    input: {
      accountId: account.id,
      owner: account.owner,
      profileId: account.defaultProfile.id,
    },
  })
  const items: Publish[] = []
  if (watchLaterResponse) {
    watchLaterResponse.edges.forEach((edge) => {
      if (edge?.node?.publish) {
        items.push(edge.node.publish)
      }
    })
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

  // Get preview playlists
  const previewPlaylists = await fetchPreviewPlaylists({
    idToken: idToken!,
    signature,
    input: {
      accountId: account!.id,
      profileId: profile.id,
      owner: account!.owner,
      cursor: null,
    },
  })

  // Get preview bookmarks
  const previewBookmarks = await fetchPreviewBookmarks({
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
      <div className="px-4 py-2 grid grid-cols-1 divide-y divide-neutral-200">
        <WatchLater
          isAuthenticated={!!account}
          profile={profile}
          items={items}
          itemsCount={watchLaterResponse?.pageInfo?.count || 0}
          playlistsResult={playlistsResult}
        />
        <Playlists
          isAuthenticated={!!account}
          itemsCount={playlistsResult?.pageInfo?.count || 0}
          playlistsResult={previewPlaylists}
        />
        <ReadingList bookmarksResult={previewBookmarks} />
      </div>
    </>
  )
}
