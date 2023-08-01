"use server"

import { revalidatePath } from "next/cache"
import _ from "lodash"

import {
  updatePlaylistName,
  deletePlaylist,
  updatePlaylistDescription,
  removeAllWatchLater,
  removeWatchLater,
  addToNewPlaylist,
  addToWatchLater,
  updatePlaylists,
  deleteAllInPlaylist,
  removeFromPlaylist,
} from "@/graphql"
import { getAccount } from "@/lib/server"
import { DisplayedPlaylist } from "@/graphql/types"

export async function saveToWatchLater(publishId: string) {
  try {
    const data = await getAccount()
    const account = data?.account
    const idToken = data?.idToken
    const signature = data?.signature
    if (!account || !account?.defaultProfile || !idToken)
      throw new Error("Please sign in to proceed.")

    if (!publishId) throw new Error("Bad input")

    await addToWatchLater({
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
    revalidatePath(`/library`)
  } catch (error) {
    console.error(error)
  }
}

export async function saveToPlaylist(formData: FormData) {
  try {
    const data = await getAccount()
    const account = data?.account
    const idToken = data?.idToken
    const signature = data?.signature
    if (!account || !account?.defaultProfile || !idToken)
      throw new Error("Please sign in to proceed.")

    const publishId = formData.get("publish") as string
    if (!publishId) throw new Error("Bad input")

    // Get watch later values (old, new)
    const oldWL = formData.get("oldWL") as "on" | "off"
    const newWL = (formData.get("newWL") as "on" | "") || "off"

    if (oldWL !== newWL) {
      // Update watch later
      if (newWL === "on") {
        // Add to watch later
        await addToWatchLater({
          idToken,
          signature,
          input: {
            accountId: account.id,
            owner: account.owner,
            profileId: account.defaultProfile?.id,
            publishId,
          },
        })
      }
      if (newWL === "off") {
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
      }

      // Revalidate watch later page
      revalidatePath(`/library/WL`)
    }

    // Get playlists values (old, new)
    const oldPlaylists = JSON.parse(
      formData.get("playlists") as string
    ) as DisplayedPlaylist[]
    const newPlaylists = oldPlaylists.map((pl) => {
      const checked = formData.get(pl.list?.id || "")

      return {
        isInPlaylist: checked === "on" ? true : false,
        list: pl.list,
      }
    })
    // Check if playlists are changed
    const isPlaylistsEqual = _.isEqual(oldPlaylists, newPlaylists)

    // If the playlists are updated, get the ones that are updated and put them in a new array, so all the items in this array are the playlists to be updated.
    const updatedPlaylists: DisplayedPlaylist[] = []
    if (!isPlaylistsEqual) {
      newPlaylists.forEach((pl, index) => {
        if (!_.isEqual(oldPlaylists[index], pl)) {
          updatedPlaylists.push(pl)
        }
      })
    }

    if (updatedPlaylists.length > 0) {
      await updatePlaylists({
        idToken,
        signature,
        input: {
          accountId: account.id,
          owner: account.owner,
          profileId: account.defaultProfile?.id,
          publishId,
          playlists: updatedPlaylists.map((pl) => ({
            isInPlaylist: !!pl.isInPlaylist,
            playlistId: pl.list?.id || "",
          })),
        },
      })

      // Revalidate watch page
      revalidatePath(`/watch/[id]`)
    }
  } catch (error) {
    console.error(error)
  }
}

/**
 * Create a new playlist and add a publish to it
 */
export async function createNewPlaylist(formData: FormData) {
  try {
    const data = await getAccount()
    const account = data?.account
    const idToken = data?.idToken
    const signature = data?.signature
    if (!account || !account?.defaultProfile || !idToken)
      throw new Error("Please sign in to proceed.")

    const name = formData.get("name") as string
    const publishId = formData.get("publish") as string
    if (
      !name ||
      typeof name !== "string" ||
      !publishId ||
      typeof publishId !== "string"
    )
      throw new Error("Bad input")

    // Create a new playlist and add the publish to it
    await addToNewPlaylist({
      idToken,
      signature,
      input: {
        accountId: account.id,
        owner: account.owner,
        profileId: account.defaultProfile?.id,
        name,
        publishId,
      },
    })

    // Revalidate library page
    revalidatePath(`/`)
    revalidatePath(`/library`)
  } catch (error) {
    console.error(error)
  }
}

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
