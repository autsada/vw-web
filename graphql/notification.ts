import { gql } from "graphql-request"

import { client } from "./client"
import type {
  QueryArgsType,
  QueryReturnType,
  MutationReturnType,
  MutationArgsType,
  FetchNotificationsInput,
  GetUnReadNotificationsInput,
  UpdateNotificationsInput,
} from "./types"

/**
 * Fetch a profile's playlists
 */
export const FETCH_NOTIFICATIONS_QUERY = gql`
  query FetchMyNotifications($input: FetchNotificationsInput!) {
    fetchMyNotifications(input: $input) {
      pageInfo {
        count
        endCursor
        hasNextPage
      }
      edges {
        cursor
        node {
          id
          content
          status
          createdAt
        }
      }
    }
  }
`
export async function fetchNotifications({
  idToken,
  signature,
  input,
}: {
  idToken: string
  signature?: string
  input: FetchNotificationsInput
}) {
  try {
    const data = await client
      .setHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
        "auth-wallet-signature": signature || "",
      })
      .request<
        QueryReturnType<"fetchMyNotifications">,
        QueryArgsType<"fetchMyNotifications">
      >(FETCH_NOTIFICATIONS_QUERY, {
        input,
      })

    return data?.fetchMyNotifications
  } catch (error) {
    return null
  }
}

/**
 * Fetch unread notifications count
 */
export const GET_UNREAD_NOTIFICATIONS_QUERY = gql`
  query GetUnReadNotifications($input: GetUnReadNotificationsInput!) {
    getUnReadNotifications(input: $input) {
      unread
    }
  }
`
export async function getUnReadNotifications({
  idToken,
  signature,
  input,
}: {
  idToken: string
  signature?: string
  input: GetUnReadNotificationsInput
}) {
  try {
    const data = await client
      .setHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
        "auth-wallet-signature": signature || "",
      })
      .request<
        QueryReturnType<"getUnReadNotifications">,
        QueryArgsType<"getUnReadNotifications">
      >(GET_UNREAD_NOTIFICATIONS_QUERY, {
        input,
      })

    return data?.getUnReadNotifications
  } catch (error) {
    return null
  }
}

/**
 * Update notifications status
 */
export const UPDATE_NOTIFICATIONS_MUTATION = gql`
  mutation UpdateNotificationsStatus($input: UpdateNotificationsInput!) {
    updateNotificationsStatus(input: $input) {
      status
    }
  }
`
export async function updateNotificationsStatus({
  idToken,
  signature,
  input,
}: {
  idToken: string
  signature?: string
  input: UpdateNotificationsInput
}) {
  try {
    const data = await client
      .setHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
        "auth-wallet-signature": signature || "",
      })
      .request<
        MutationReturnType<"updateNotificationsStatus">,
        MutationArgsType<"updateNotificationsStatus">
      >(UPDATE_NOTIFICATIONS_MUTATION, {
        input,
      })

    return data?.updateNotificationsStatus
  } catch (error) {
    return null
  }
}
