import { gql } from "graphql-request"

import { client } from "./client"
import type {
  QueryReturnType,
  QueryArgsType,
  MutationArgsType,
  MutationReturnType,
  FetchWatchLaterInput,
  AddToWatchLaterInput,
  RemoveFromWatchLaterInput,
  RemoveAllWatchLaterInput,
} from "./types"

/**
 * Fetch watch later videos for preview
 */
export const FETCH_PREVIEW_WATCH_LATER_QUERY = gql`
  query FetchPreviewWatchLater($input: FetchWatchLaterInput!) {
    fetchPreviewWatchLater(input: $input) {
      pageInfo {
        endCursor
        hasNextPage
        count
      }
      edges {
        cursor
        node {
          id
          createdAt
          profileId
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
export async function fetchPreviewWatchLater({
  idToken,
  signature,
  input,
}: {
  idToken: string
  signature?: string
  input: FetchWatchLaterInput
}) {
  try {
    const data = await client
      .setHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
        "auth-wallet-signature": signature || "",
      })
      .request<
        QueryReturnType<"fetchPreviewWatchLater">,
        QueryArgsType<"fetchPreviewWatchLater">
      >(FETCH_PREVIEW_WATCH_LATER_QUERY, {
        input,
      })

    return data?.fetchPreviewWatchLater
  } catch (error) {
    throw error
  }
}

/**
 * Fetch watch later videos of a profile
 */
export const FETCH_WATCH_LATER_QUERY = gql`
  query FetchWatchLater($input: FetchWatchLaterInput!) {
    fetchWatchLater(input: $input) {
      pageInfo {
        endCursor
        hasNextPage
        count
      }
      edges {
        cursor
        node {
          id
          createdAt
          profileId
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
export async function fetchWatchLater({
  idToken,
  signature,
  input,
}: {
  idToken: string
  signature?: string
  input: FetchWatchLaterInput
}) {
  try {
    const data = await client
      .setHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
        "auth-wallet-signature": signature || "",
      })
      .request<
        QueryReturnType<"fetchWatchLater">,
        QueryArgsType<"fetchWatchLater">
      >(FETCH_WATCH_LATER_QUERY, {
        input,
      })

    return data?.fetchWatchLater
  } catch (error) {
    throw error
  }
}

/**
 * Add a publish to watch later
 */
export const ADD_TO_WATCH_LATER_MUTATION = gql`
  mutation AddToWatchLater($input: AddToWatchLaterInput!) {
    addToWatchLater(input: $input) {
      status
    }
  }
`
export async function addToWatchLater({
  idToken,
  signature,
  input,
}: {
  idToken: string
  signature?: string
  input: AddToWatchLaterInput
}) {
  try {
    const data = await client
      .setHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
        "auth-wallet-signature": signature || "",
      })
      .request<
        MutationReturnType<"addToWatchLater">,
        MutationArgsType<"addToWatchLater">
      >(ADD_TO_WATCH_LATER_MUTATION, {
        input,
      })

    return data?.addToWatchLater
  } catch (error) {
    throw error
  }
}

/**
 * Remove a publish from watch later
 */
export const REMOVE_FROM_WATCH_LATER_MUTATION = gql`
  mutation RemoveFromWatchLater($input: RemoveFromWatchLaterInput!) {
    removeFromWatchLater(input: $input) {
      status
    }
  }
`
export async function removeWatchLater({
  idToken,
  signature,
  input,
}: {
  idToken: string
  signature?: string
  input: RemoveFromWatchLaterInput
}) {
  try {
    const data = await client
      .setHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
        "auth-wallet-signature": signature || "",
      })
      .request<
        MutationReturnType<"removeFromWatchLater">,
        MutationArgsType<"removeFromWatchLater">
      >(REMOVE_FROM_WATCH_LATER_MUTATION, {
        input,
      })

    return data?.removeFromWatchLater
  } catch (error) {
    throw error
  }
}

/**
 * Remove all items from watch later
 */
export const REMOVE_ALL_WATCH_LATER_MUTATION = gql`
  mutation RemoveAllWatchLater($input: RemoveAllWatchLaterInput!) {
    removeAllWatchLater(input: $input) {
      status
    }
  }
`
export async function removeAllWatchLater({
  idToken,
  signature,
  input,
}: {
  idToken: string
  signature?: string
  input: RemoveAllWatchLaterInput
}) {
  try {
    const data = await client
      .setHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
        "auth-wallet-signature": signature || "",
      })
      .request<
        MutationReturnType<"removeAllWatchLater">,
        MutationArgsType<"removeAllWatchLater">
      >(REMOVE_ALL_WATCH_LATER_MUTATION, {
        input,
      })

    return data?.removeAllWatchLater
  } catch (error) {
    throw error
  }
}
