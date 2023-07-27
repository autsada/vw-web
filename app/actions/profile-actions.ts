"use server"

import { revalidatePath } from "next/cache"

import {
  createProfile,
  updateProfileDisplayName,
  updateProfileImage,
  updateProfileBannerImage,
  follow,
  updateWatchPreferences,
  updateReadPreferences,
} from "@/graphql"
import { getAccount } from "@/lib/server"
import type { PublishCategory } from "@/graphql/types"

export async function createNewProfile(name: string) {
  try {
    const data = await getAccount()
    const account = data?.account
    const idToken = data?.idToken
    const signature = data?.signature
    const profile = account?.defaultProfile
    if (!account || !profile || !idToken)
      throw new Error("Please sign in to proceed.")

    if (!name) throw new Error("Bad input")

    await createProfile({
      idToken,
      signature,
      input: {
        accountId: account.id,
        owner: account.owner,
        name,
      },
    })
  } catch (error) {
    console.error(error)
  }
}

export async function updateDisplayName(name: string) {
  try {
    const data = await getAccount()
    const account = data?.account
    const idToken = data?.idToken
    const signature = data?.signature
    const profile = account?.defaultProfile
    if (!account || !profile || !idToken)
      throw new Error("Please sign in to proceed.")

    if (!name) throw new Error("Bad input")

    await updateProfileDisplayName({
      idToken,
      signature,
      input: {
        accountId: account.id,
        owner: account.owner,
        profileId: profile.id,
        newName: name,
      },
    })

    // Revalidate page
    revalidatePath(`/settings`)
  } catch (error) {
    console.error(error)
  }
}

export async function updateImage(imageUrl: string, imageRef: string) {
  try {
    const data = await getAccount()
    const account = data?.account
    const idToken = data?.idToken
    const signature = data?.signature
    const profile = account?.defaultProfile

    if (!account || !profile || !idToken)
      throw new Error("Please sign in to proceed.")

    if (!imageUrl || !imageRef) throw new Error("Bad input")

    await updateProfileImage({
      idToken,
      signature,
      input: {
        accountId: account.id,
        owner: account.owner,
        profileId: profile.id,
        image: imageUrl,
        imageRef,
      },
    })

    // Revalidate page
    revalidatePath(`/settings`)
  } catch (error) {
    console.error(error)
  }
}

export async function updateBannerImage(imageUrl: string, imageRef: string) {
  try {
    const data = await getAccount()
    const account = data?.account
    const idToken = data?.idToken
    const signature = data?.signature
    const profile = account?.defaultProfile

    if (!account || !profile || !idToken)
      throw new Error("Please sign in to proceed.")

    if (!imageUrl || !imageRef) throw new Error("Bad input")

    await updateProfileBannerImage({
      idToken,
      signature,
      input: {
        accountId: account.id,
        owner: account.owner,
        profileId: profile.id,
        image: imageUrl,
        imageRef,
      },
    })

    // Revalidate page
    revalidatePath(`/settings`)
  } catch (error) {
    console.error(error)
  }
}

export async function updateUserWatchPreferences(
  preferences: PublishCategory[]
) {
  try {
    const data = await getAccount()
    const account = data?.account
    const idToken = data?.idToken
    const signature = data?.signature
    const profile = account?.defaultProfile
    if (!account || !profile || !idToken)
      throw new Error("Please sign in to proceed.")

    if (!preferences) throw new Error("Bad input")

    await updateWatchPreferences({
      idToken,
      signature,
      input: {
        accountId: account.id,
        owner: account.owner,
        profileId: profile.id,
        preferences,
      },
    })

    // Revalidate page
    revalidatePath(`/settings/preferences`)
  } catch (error) {
    console.error(error)
  }
}

export async function updateUserReadPreferences(
  preferences: PublishCategory[]
) {
  try {
    const data = await getAccount()
    const account = data?.account
    const idToken = data?.idToken
    const signature = data?.signature
    const profile = account?.defaultProfile
    if (!account || !profile || !idToken)
      throw new Error("Please sign in to proceed.")

    if (!preferences) throw new Error("Bad input")

    await updateReadPreferences({
      idToken,
      signature,
      input: {
        accountId: account.id,
        owner: account.owner,
        profileId: profile.id,
        preferences,
      },
    })

    // Revalidate page
    revalidatePath(`/settings/preferences`)
  } catch (error) {
    console.error(error)
  }
}

/**
 * @param followerId An id of the profile that user wants to follow
 */
export async function followProfile(followerId: string) {
  try {
    const data = await getAccount()
    const account = data?.account
    const idToken = data?.idToken
    const signature = data?.signature
    if (!account || !account?.defaultProfile || !idToken)
      throw new Error("Please sign in to proceed.")

    if (!followerId) throw new Error("Bad input")

    await follow({
      idToken,
      signature,
      input: {
        accountId: account.id,
        owner: account.owner,
        profileId: account.defaultProfile?.id,
        followerId,
      },
    })

    // Revalidate
    revalidatePath(`/[profile]`)
    revalidatePath(`/watch/[id]`)
  } catch (error) {
    console.error(error)
  }
}
