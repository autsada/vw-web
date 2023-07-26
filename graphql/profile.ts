import { gql } from "graphql-request"

import { client } from "./client"
import type {
  QueryReturnType,
  QueryArgsType,
  MutationReturnType,
  MutationArgsType,
  CreateProfileInput,
  UpdateNameInput,
  UpdateImageInput,
  FollowInput,
  UpdatePreferencesInput,
} from "./types"

/**
 * @dev This function will query a profile by its id
 */
export const GET_PROFILE_BY_ID_QUERY = gql`
  query GetProfileById($input: QueryByIdInput!) {
    getProfileById(input: $input) {
      id
      name
      displayName
      image
      imageRef
      bannerImage
      bannerImageRef
      defaultColor
      accountId
      owner
      createdAt
      followersCount
      followingCount
      publishesCount
      isFollowing
      isOwner
      publishes {
        id
        thumbnail
        title
        createdAt
        views
        playback {
          id
          preview
          duration
          dash
          hls
        }
      }
    }
  }
`
export async function getProfileById(targetId: string, requestorId?: string) {
  try {
    const data = await client.request<
      QueryReturnType<"getProfileById">,
      QueryArgsType<"getProfileById">
    >(GET_PROFILE_BY_ID_QUERY, {
      input: { targetId, requestorId: requestorId || null },
    })

    return data?.getProfileById
  } catch (error) {
    throw error
  }
}

/**
 * @dev This function will query a profile by its name
 */
export const GET_PROFILE_BY_NAME_QUERY = gql`
  query GetProfileByName($input: QueryByNameInput!) {
    getProfileByName(input: $input) {
      id
      name
      displayName
      image
      imageRef
      bannerImage
      bannerImageRef
      defaultColor
      accountId
      owner
      createdAt
      followersCount
      followingCount
      publishesCount
      isFollowing
      isOwner
    }
  }
`
export async function getProfileByName(name: string, requestorId?: string) {
  try {
    const data = await client.request<
      QueryReturnType<"getProfileByName">,
      QueryArgsType<"getProfileByName">
    >(GET_PROFILE_BY_NAME_QUERY, {
      input: { name, requestorId: requestorId || null },
    })

    return data?.getProfileByName
  } catch (error) {
    throw error
  }
}

/**
 * Validate a profile name
 */
export const VALIDATE_NAME_MUTATION = gql`
  mutation ValidateName($name: String!) {
    validateName(name: $name)
  }
`
export async function validateProfileName(name: string) {
  try {
    const data = await client.request<
      MutationReturnType<"validateName">,
      MutationArgsType<"validateName">
    >(VALIDATE_NAME_MUTATION, { name })

    return data?.validateName
  } catch (error) {
    throw error
  }
}

/**
 * Create a profile
 */
export const CREATE_PROFILE_MUTATION = gql`
  mutation CreateProfile($input: CreateProfileInput!) {
    createProfile(input: $input) {
      id
      name
      displayName
      owner
      accountId
    }
  }
`
export async function createProfile({
  idToken,
  signature,
  input,
}: {
  idToken: string
  signature?: string
  input: CreateProfileInput
}) {
  try {
    const data = await client
      .setHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
        "auth-wallet-signature": signature || "",
      })
      .request<
        MutationReturnType<"createProfile">,
        MutationArgsType<"createProfile">
      >(CREATE_PROFILE_MUTATION, { input })

    return data?.createProfile
  } catch (error) {
    throw error
  }
}

/**
 * Update a profile name
 */
export const UPDATE_NAME_MUTATION = gql`
  mutation UpdateName($input: UpdateNameInput!) {
    updateName(input: $input) {
      status
    }
  }
`
export async function updateProfileName({
  idToken,
  signature,
  input,
}: {
  idToken: string
  signature?: string
  input: UpdateNameInput
}) {
  try {
    const data = await client
      .setHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
        "auth-wallet-signature": signature || "",
      })
      .request<
        MutationReturnType<"updateName">,
        MutationArgsType<"updateName">
      >(UPDATE_NAME_MUTATION, {
        input,
      })

    return data?.updateName
  } catch (error) {
    throw error
  }
}

/**
 * Update a profile display name
 */
export const UPDATE_DISPLAY_NAME_MUTATION = gql`
  mutation UpdateDisplayName($input: UpdateNameInput!) {
    updateDisplayName(input: $input) {
      status
    }
  }
`
export async function updateProfileDisplayName({
  idToken,
  signature,
  input,
}: {
  idToken: string
  signature?: string
  input: UpdateNameInput
}) {
  try {
    const data = await client
      .setHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
        "auth-wallet-signature": signature || "",
      })
      .request<
        MutationReturnType<"updateDisplayName">,
        MutationArgsType<"updateDisplayName">
      >(UPDATE_DISPLAY_NAME_MUTATION, {
        input,
      })

    return data?.updateDisplayName
  } catch (error) {
    throw error
  }
}

/**
 * Update a profile image
 */
export const UPDATE_PROFILE_IMAGE_MUTATION = gql`
  mutation UpdateProfileImage($input: UpdateImageInput!) {
    updateProfileImage(input: $input) {
      status
    }
  }
`
export async function updateProfileImage({
  idToken,
  signature,
  input,
}: {
  idToken: string
  signature?: string
  input: UpdateImageInput
}) {
  try {
    const data = await client
      .setHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
        "auth-wallet-signature": signature || "",
      })
      .request<
        MutationReturnType<"updateProfileImage">,
        MutationArgsType<"updateProfileImage">
      >(UPDATE_PROFILE_IMAGE_MUTATION, {
        input,
      })

    return data?.updateProfileImage
  } catch (error) {
    throw error
  }
}

/**
 * Update a profile banner image
 */
export const UPDATE_BANNER_IMAGE_MUTATION = gql`
  mutation UpdateBannerImage($input: UpdateImageInput!) {
    updateBannerImage(input: $input) {
      status
    }
  }
`
export async function updateProfileBannerImage({
  idToken,
  signature,
  input,
}: {
  idToken: string
  signature?: string
  input: UpdateImageInput
}) {
  try {
    const data = await client
      .setHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
        "auth-wallet-signature": signature || "",
      })
      .request<
        MutationReturnType<"updateBannerImage">,
        MutationArgsType<"updateBannerImage">
      >(UPDATE_BANNER_IMAGE_MUTATION, {
        input,
      })

    return data?.updateBannerImage
  } catch (error) {
    throw error
  }
}

/**
 * Follow/unFollow a profile
 */
export const FOLLOW_MUTATION = gql`
  mutation Follow($input: FollowInput!) {
    follow(input: $input) {
      status
    }
  }
`
export async function follow({
  idToken,
  signature,
  input,
}: {
  idToken: string
  signature?: string
  input: FollowInput
}) {
  try {
    const data = await client
      .setHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
        "auth-wallet-signature": signature || "",
      })
      .request<MutationReturnType<"follow">, MutationArgsType<"follow">>(
        FOLLOW_MUTATION,
        {
          input,
        }
      )

    return data?.follow
  } catch (error) {
    throw error
  }
}

/**
 * Update a profile's watch preferences
 */
export const UPDATE_WATCH_PREFERENCES_MUTATION = gql`
  mutation UpdateWatchPreferences($input: UpdatePreferencesInput!) {
    updateWatchPreferences(input: $input) {
      status
    }
  }
`
export async function updateWatchPreferences({
  idToken,
  signature,
  input,
}: {
  idToken: string
  signature?: string
  input: UpdatePreferencesInput
}) {
  try {
    const data = await client
      .setHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
        "auth-wallet-signature": signature || "",
      })
      .request<
        MutationReturnType<"updateWatchPreferences">,
        MutationArgsType<"updateWatchPreferences">
      >(UPDATE_WATCH_PREFERENCES_MUTATION, {
        input,
      })

    return data?.updateWatchPreferences
  } catch (error) {
    throw error
  }
}

/**
 * Update a profile's read preferences
 */
export const UPDATE_READ_PREFERENCES_MUTATION = gql`
  mutation UpdateReadPreferences($input: UpdatePreferencesInput!) {
    updateReadPreferences(input: $input) {
      status
    }
  }
`
export async function updateReadPreferences({
  idToken,
  signature,
  input,
}: {
  idToken: string
  signature?: string
  input: UpdatePreferencesInput
}) {
  try {
    const data = await client
      .setHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
        "auth-wallet-signature": signature || "",
      })
      .request<
        MutationReturnType<"updateReadPreferences">,
        MutationArgsType<"updateReadPreferences">
      >(UPDATE_READ_PREFERENCES_MUTATION, {
        input,
      })

    return data?.updateReadPreferences
  } catch (error) {
    throw error
  }
}
