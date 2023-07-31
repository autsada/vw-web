"use server"

import { revalidatePath } from "next/cache"

import {
  updatePlaylistName,
  deletePlaylist,
  updatePlaylistDescription,
  removeAllWatchLater,
  removeWatchLater,
} from "@/graphql"
import { getAccount } from "@/lib/server"

export async function updatePLName(playlistId: string, name: string) {
  try {
    const data = await getAccount()
    const account = data?.account
    const idToken = data?.idToken
    const signature = data?.signature
    if (!account || !account?.defaultProfile || !idToken)
      throw new Error("Please sign in to proceed.")

    if (!playlistId || !name) throw new Error("Bad input")

    await updatePlaylistName({
      idToken,
      signature,
      input: {
        accountId: account.id,
        owner: account.owner,
        profileId: account.defaultProfile?.id,
        playlistId,
        name,
      },
    })

    // Revalidate page
    revalidatePath(`/library`)
    revalidatePath(`/library/[id]`)
  } catch (error) {
    console.error(error)
  }
}

export async function updatePLDescription(
  playlistId: string,
  description: string
) {
  try {
    const data = await getAccount()
    const account = data?.account
    const idToken = data?.idToken
    const signature = data?.signature
    if (!account || !account?.defaultProfile || !idToken)
      throw new Error("Please sign in to proceed.")

    if (!playlistId || !description) throw new Error("Bad input")

    await updatePlaylistDescription({
      idToken,
      signature,
      input: {
        accountId: account.id,
        owner: account.owner,
        profileId: account.defaultProfile?.id,
        playlistId,
        description,
      },
    })

    // Revalidate page
    revalidatePath(`/library`)
    revalidatePath(`/library/[id]`)
  } catch (error) {
    console.error(error)
  }
}

export async function deletePL(playlistId: string) {
  try {
    const data = await getAccount()
    const account = data?.account
    const idToken = data?.idToken
    const signature = data?.signature
    if (!account || !account?.defaultProfile || !idToken)
      throw new Error("Please sign in to proceed.")

    if (!playlistId) throw new Error("Bad input")

    await deletePlaylist({
      idToken,
      signature,
      input: {
        accountId: account.id,
        owner: account.owner,
        profileId: account.defaultProfile?.id,
        playlistId,
      },
    })

    // Revalidate watch later page
    revalidatePath(`/library`)
  } catch (error) {
    console.error(error)
  }
}

export async function removeFromWatchLater(publishId: string) {
  try {
    const data = await getAccount()
    const account = data?.account
    const idToken = data?.idToken
    const signature = data?.signature
    if (!account || !account?.defaultProfile || !idToken)
      throw new Error("Please sign in to proceed.")

    if (!publishId) throw new Error("Bad input")

    // Remove from watch later
    await removeWatchLater({
      idToken,
      signature,
      input: {
        accountId: account.id,
        owner: account.owner,
        profileId: account.defaultProfile?.id,
        publishId,
      },
    })

    // Revalidate watch later page
    revalidatePath(`/library/WL`)
  } catch (error) {
    console.error(error)
  }
}

export async function removeAllWL() {
  try {
    const data = await getAccount()
    const account = data?.account
    const idToken = data?.idToken
    const signature = data?.signature
    if (!account || !account?.defaultProfile || !idToken)
      throw new Error("Please sign in to proceed.")

    // Remove from watch later
    await removeAllWatchLater({
      idToken,
      signature,
      input: {
        accountId: account.id,
        owner: account.owner,
        profileId: account.defaultProfile?.id,
      },
    })

    // Revalidate watch later page
    revalidatePath(`/library/WL`)
  } catch (error) {
    console.error(error)
  }
}
