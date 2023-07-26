import { gql } from "graphql-request"

import { client } from "./client"
import type {
  QueryArgsType,
  QueryReturnType,
  MutationReturnType,
  MutationArgsType,
  FetchMyPlaylistsInput,
  CheckPublishPlaylistsInput,
  FetchPlaylistItemsInput,
  CreatePlayListInput,
  AddToPlaylistInput,
  UpdatePlaylistsInput,
  DeletePlaylistInput,
  UpdatePlaylistNameInput,
  UpdatePlaylistDescriptionInput,
  RemoveFromPlaylistInput,
} from "./types"

/**
 * Fetch a profile's playlists
 */
export const FETCH_MY_PLAYLISTS_QUERY = gql`
  query FetchMyPlaylists($input: FetchMyPlaylistsInput!) {
    fetchMyPlaylists(input: $input) {
      pageInfo {
        endCursor
        hasNextPage
        count
      }
      edges {
        cursor
        node {
          id
          name
          ownerId
          createdAt
        }
      }
    }
  }
`
export async function fetchMyPlaylists({
  idToken,
  signature,
  input,
}: {
  idToken: string
  signature?: string
  input: FetchMyPlaylistsInput
}) {
  try {
    const data = await client
      .setHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
        "auth-wallet-signature": signature || "",
      })
      .request<
        QueryReturnType<"fetchMyPlaylists">,
        QueryArgsType<"fetchMyPlaylists">
      >(FETCH_MY_PLAYLISTS_QUERY, {
        input,
      })

    return data?.fetchMyPlaylists
  } catch (error) {
    return null
  }
}

/**
 * Get a playlist item of a profile
 */
export const CHECK_PUBLISH_PLAYLISTS_QUERY = gql`
  query CheckPublishPlaylists($input: CheckPublishPlaylistsInput!) {
    checkPublishPlaylists(input: $input) {
      isInWatchLater
      publishId
      items {
        id
        playlist {
          id
          name
        }
      }
    }
  }
`
export async function checkPublishPlaylists({
  idToken,
  signature,
  input,
}: {
  idToken: string
  signature?: string
  input: CheckPublishPlaylistsInput
}) {
  try {
    const data = await client
      .setHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
        "auth-wallet-signature": signature || "",
      })
      .request<
        QueryReturnType<"checkPublishPlaylists">,
        QueryArgsType<"checkPublishPlaylists">
      >(CHECK_PUBLISH_PLAYLISTS_QUERY, {
        input,
      })

    return data?.checkPublishPlaylists
  } catch (error) {
    return null
  }
}

/**
 * Fetch user's playlists
 */
export const FETCH_PREVIEW_PLAYLISTS_QUERY = gql`
  query FetchPreviewPlaylists($input: FetchMyPlaylistsInput!) {
    fetchPreviewPlaylists(input: $input) {
      pageInfo {
        count
        endCursor
        hasNextPage
      }
      edges {
        cursor
        node {
          id
          name
          count
          lastItem {
            id
            title
            thumbnailType
            thumbnail
            publishType
            playback {
              thumbnail
            }
          }
        }
      }
    }
  }
`
export async function fetchPreviewPlaylists({
  idToken,
  signature,
  input,
}: {
  idToken: string
  signature?: string
  input: FetchMyPlaylistsInput
}) {
  try {
    const data = await client
      .setHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
        "auth-wallet-signature": signature || "",
      })
      .request<
        QueryReturnType<"fetchPreviewPlaylists">,
        QueryArgsType<"fetchPreviewPlaylists">
      >(FETCH_PREVIEW_PLAYLISTS_QUERY, {
        input,
      })

    return data?.fetchPreviewPlaylists
  } catch (error) {
    return null
  }
}

/**
 * Fetch content of a playlist
 */
export const FETCH_PLAYLIST_ITEMS_QUERY = gql`
  query FetchPlaylistItems($input: FetchPlaylistItemsInput!) {
    fetchPlaylistItems(input: $input) {
      playlistName
      playlistDescription
      pageInfo {
        count
        endCursor
        hasNextPage
      }
      edges {
        cursor
        node {
          id
          createdAt
          playlist {
            name
          }
          publishId
          publish {
            id
            title
            createdAt
            views
            visibility
            thumbnailType
            thumbnail
            primaryCategory
            secondaryCategory
            publishType
            creator {
              id
              name
              displayName
              image
              defaultColor
            }
            playback {
              id
              videoId
              duration
              hls
              dash
              thumbnail
              preview
            }
          }
        }
      }
    }
  }
`
export async function fetchPlaylistItems({
  idToken,
  signature,
  input,
}: {
  idToken: string
  signature?: string
  input: FetchPlaylistItemsInput
}) {
  try {
    const data = await client
      .setHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
        "auth-wallet-signature": signature || "",
      })
      .request<
        QueryReturnType<"fetchPlaylistItems">,
        QueryArgsType<"fetchPlaylistItems">
      >(FETCH_PLAYLIST_ITEMS_QUERY, {
        input,
      })

    return data?.fetchPlaylistItems
  } catch (error) {
    return null
  }
}

/**
 * Add a publish to non existing playlist, so a new playlist will be created
 */
export const ADD_TO_NEW_PLAYLIST_MUTATION = gql`
  mutation AddToNewPlaylist($input: CreatePlayListInput!) {
    addToNewPlaylist(input: $input) {
      status
    }
  }
`
export async function addToNewPlaylist({
  idToken,
  signature,
  input,
}: {
  idToken: string
  signature?: string
  input: CreatePlayListInput
}) {
  try {
    const data = await client
      .setHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
        "auth-wallet-signature": signature || "",
      })
      .request<
        MutationReturnType<"addToNewPlaylist">,
        MutationArgsType<"addToNewPlaylist">
      >(ADD_TO_NEW_PLAYLIST_MUTATION, {
        input,
      })

    return data?.addToNewPlaylist
  } catch (error) {
    console.error(error)
  }
}

/**
 * Add a publish to existing playlist
 */
export const ADD_TO_PLAYLIST_MUTATION = gql`
  mutation AddToPlaylist($input: AddToPlayListInput!) {
    addToPlaylist(input: $input) {
      status
    }
  }
`
export async function addToPlaylist({
  idToken,
  signature,
  input,
}: {
  idToken: string
  signature?: string
  input: AddToPlaylistInput
}) {
  try {
    const data = await client
      .setHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
        "auth-wallet-signature": signature || "",
      })
      .request<
        MutationReturnType<"addToPlaylist">,
        MutationArgsType<"addToPlaylist">
      >(ADD_TO_PLAYLIST_MUTATION, {
        input,
      })

    return data?.addToPlaylist
  } catch (error) {
    console.error(error)
  }
}

/**
 * Update many playlists
 */
export const UPDATE_PLAYLISTS_MUTATION = gql`
  mutation UpdatePlaylists($input: UpdatePlaylistsInput!) {
    updatePlaylists(input: $input) {
      status
    }
  }
`
export async function updatePlaylists({
  idToken,
  signature,
  input,
}: {
  idToken: string
  signature?: string
  input: UpdatePlaylistsInput
}) {
  try {
    const data = await client
      .setHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
        "auth-wallet-signature": signature || "",
      })
      .request<
        MutationReturnType<"updatePlaylists">,
        MutationArgsType<"updatePlaylists">
      >(UPDATE_PLAYLISTS_MUTATION, {
        input,
      })

    return data?.updatePlaylists
  } catch (error) {
    console.error(error)
  }
}

/**
 * Delete a playlist and its content
 */
export const DELETE_PLAYLIST_MUTATION = gql`
  mutation DeletePlaylist($input: DeletePlaylistInput!) {
    deletePlaylist(input: $input) {
      status
    }
  }
`
export async function deletePlaylist({
  idToken,
  signature,
  input,
}: {
  idToken: string
  signature?: string
  input: DeletePlaylistInput
}) {
  try {
    const data = await client
      .setHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
        "auth-wallet-signature": signature || "",
      })
      .request<
        MutationReturnType<"deletePlaylist">,
        MutationArgsType<"deletePlaylist">
      >(DELETE_PLAYLIST_MUTATION, {
        input,
      })

    return data?.deletePlaylist
  } catch (error) {
    console.error(error)
  }
}

/**
 * Update playlist's name
 */
export const UPDATE_PLAYLIST_NAME_MUTATION = gql`
  mutation UpdatePlaylistName($input: UpdatePlaylistNameInput!) {
    updatePlaylistName(input: $input) {
      status
    }
  }
`
export async function updatePlaylistName({
  idToken,
  signature,
  input,
}: {
  idToken: string
  signature?: string
  input: UpdatePlaylistNameInput
}) {
  try {
    const data = await client
      .setHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
        "auth-wallet-signature": signature || "",
      })
      .request<
        MutationReturnType<"updatePlaylistName">,
        MutationArgsType<"updatePlaylistName">
      >(UPDATE_PLAYLIST_NAME_MUTATION, {
        input,
      })

    return data?.updatePlaylistName
  } catch (error) {
    console.error(error)
  }
}

/**
 * Update playlist's description
 */
export const UPDATE_PLAYLIST_DESCRIPTION_MUTATION = gql`
  mutation UpdatePlaylistDescription($input: UpdatePlaylistDescriptionInput!) {
    updatePlaylistDescription(input: $input) {
      status
    }
  }
`
export async function updatePlaylistDescription({
  idToken,
  signature,
  input,
}: {
  idToken: string
  signature?: string
  input: UpdatePlaylistDescriptionInput
}) {
  try {
    const data = await client
      .setHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
        "auth-wallet-signature": signature || "",
      })
      .request<
        MutationReturnType<"updatePlaylistDescription">,
        MutationArgsType<"updatePlaylistDescription">
      >(UPDATE_PLAYLIST_DESCRIPTION_MUTATION, {
        input,
      })

    return data?.updatePlaylistDescription
  } catch (error) {
    console.error(error)
  }
}

/**
 * Remove an item from a playlist
 */
export const REMOVE_FROM_PLAYLIST_MUTATION = gql`
  mutation RemoveFromPlaylist($input: RemoveFromPlaylistInput!) {
    removeFromPlaylist(input: $input) {
      status
    }
  }
`
export async function removeFromPlaylist({
  idToken,
  signature,
  input,
}: {
  idToken: string
  signature?: string
  input: RemoveFromPlaylistInput
}) {
  try {
    const data = await client
      .setHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
        "auth-wallet-signature": signature || "",
      })
      .request<
        MutationReturnType<"removeFromPlaylist">,
        MutationArgsType<"removeFromPlaylist">
      >(REMOVE_FROM_PLAYLIST_MUTATION, {
        input,
      })

    return data?.removeFromPlaylist
  } catch (error) {
    console.error(error)
  }
}

/**
 * Delete all items in a playlist (not delete the playlist itself)
 */
export const DELETE_ALL_PLAYLIST_ITEMS_MUTATION = gql`
  mutation DeleteAllPlaylistItems($input: DeletePlaylistInput!) {
    deleteAllPlaylistItems(input: $input) {
      status
    }
  }
`
export async function deleteAllInPlaylist({
  idToken,
  signature,
  input,
}: {
  idToken: string
  signature?: string
  input: DeletePlaylistInput
}) {
  try {
    const data = await client
      .setHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
        "auth-wallet-signature": signature || "",
      })
      .request<
        MutationReturnType<"deleteAllPlaylistItems">,
        MutationArgsType<"deleteAllPlaylistItems">
      >(DELETE_ALL_PLAYLIST_ITEMS_MUTATION, {
        input,
      })

    return data?.deleteAllPlaylistItems
  } catch (error) {
    console.error(error)
  }
}
