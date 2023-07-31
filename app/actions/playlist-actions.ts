"use server"

import { revalidatePath } from "next/cache"

import { removeFromPlaylist, deleteAllInPlaylist } from "@/graphql"
import { getAccount } from "@/lib/server"

export async function removeItemFromPlaylist(
  publishId: string,
  playlistId: string
) {
  try {
    const data = await getAccount()
    const account = data?.account
    const idToken = data?.idToken
    const signature = data?.signature
    if (!account || !account?.defaultProfile || !idToken)
      throw new Error("Please sign in to proceed.")

    if (!publishId || !playlistId) return

    // Remove from watch later
    await removeFromPlaylist({
      idToken,
      signature,
      input: {
        accountId: account.id,
        owner: account.owner,
        profileId: account.defaultProfile?.id,
        playlistId,
        publishId,
      },
    })

    // Revalidate page
    revalidatePath(`/library`)
    revalidatePath(`/library/[id]`)
  } catch (error) {
    console.error(error)
  }
}

export async function removeAllItemsInPlaylist(playlistId: string) {
  try {
    const data = await getAccount()
    const account = data?.account
    const idToken = data?.idToken
    const signature = data?.signature
    if (!account || !account?.defaultProfile || !idToken)
      throw new Error("Please sign in to proceed.")

    if (!playlistId) return

    // Remove from watch later
    await deleteAllInPlaylist({
      idToken,
      signature,
      input: {
        accountId: account.id,
        owner: account.owner,
        profileId: account.defaultProfile?.id,
        playlistId,
      },
    })

    // Revalidate page
    revalidatePath(`/library`)
    revalidatePath(`/library/[id]`)
  } catch (error) {
    console.error(error)
  }
}
