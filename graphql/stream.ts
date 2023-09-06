import { gql } from "graphql-request"

import { client } from "./client"
import type {
  QueryReturnType,
  QueryArgsType,
  MutationArgsType,
  MutationReturnType,
  RequestLiveStreamInput,
  GetLiveStreamPublishInput,
  FetchMyPublishesInput,
  GoLiveInput,
} from "./types"

/**
 * Fetch user's live stream publishes
 */
export const FETCH_MY_LIVE_STREAM_QUERY = gql`
  query FetchMyLiveStream($input: FetchMyPublishesInput!) {
    fetchMyLiveStream(input: $input) {
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        cursor
        node {
          id
          createdAt
          contentURI
          contentRef
          filename
          thumbnail
          thumbnailRef
          thumbnailType
          title
          description
          views
          commentsCount
          likesCount
          disLikesCount
          uploading
          deleting
          uploadError
          tipsCount
          visibility
          publishType
          tags
          streamType
          broadcastType
          # playback {
          #   id
          #   videoId
          #   thumbnail
          #   preview
          #   duration
          #   dash
          #   hls
          #   liveStatus
          # }
        }
      }
    }
  }
`
export async function fetchMyLiveStream({
  idToken,
  signature,
  input,
}: {
  idToken: string
  signature?: string
  input: FetchMyPublishesInput
}) {
  try {
    const data = await client
      .setHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
        "auth-wallet-signature": signature || "",
      })
      .request<
        QueryReturnType<"fetchMyLiveStream">,
        QueryArgsType<"fetchMyLiveStream">
      >(FETCH_MY_LIVE_STREAM_QUERY, {
        input,
      })

    return data?.fetchMyLiveStream
  } catch (error) {
    throw error
  }
}

export const GET_LIVE_PUBLISH_QUERY = gql`
  query GetLiveStreamPublish($input: GetLiveStreamPublishInput!) {
    getLiveStreamPublish(input: $input) {
      publish {
        id
        creatorId
        title
        description
        primaryCategory
        secondaryCategory
        visibility
        filename
        thumbnail
        thumbnailRef
        thumbnailType
        uploading
        deleting
        uploadError
        transcodeError
        publishType
        tags
        creator {
          isOwner
        }
        streamType
        broadcastType
        playback {
          id
          videoId
          thumbnail
          preview
          duration
          dash
          hls
        }
      }
      liveInput {
        result {
          uid
          rtmps {
            streamKey
            url
          }
        }
      }
    }
  }
`
export async function getLiveStreamPublish({
  idToken,
  signature,
  input,
}: {
  idToken: string
  signature?: string
  input: GetLiveStreamPublishInput
}) {
  try {
    const data = await client
      .setHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
        "auth-wallet-signature": signature || "",
      })
      .request<
        QueryReturnType<"getLiveStreamPublish">,
        QueryArgsType<"getLiveStreamPublish">
      >(GET_LIVE_PUBLISH_QUERY, { input })

    return data?.getLiveStreamPublish
  } catch (error) {
    return null
  }
}

/**
 * Request to start live stream
 */
export const START_STREAM_MUTATION = gql`
  mutation RequestLiveStream($input: RequestLiveStreamInput!) {
    requestLiveStream(input: $input) {
      id
    }
  }
`
export async function requestLiveStream({
  idToken,
  signature,
  input,
}: {
  idToken: string
  signature?: string
  input: RequestLiveStreamInput
}) {
  try {
    const data = await client
      .setHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
        "auth-wallet-signature": signature || "",
      })
      .request<
        MutationReturnType<"requestLiveStream">,
        MutationArgsType<"requestLiveStream">
      >(START_STREAM_MUTATION, {
        input,
      })

    return data?.requestLiveStream
  } catch (error) {
    return null
  }
}

/**
 * Request to start live stream
 */
export const GO_LIVE_MUTATION = gql`
  mutation GoLive($input: GoLiveInput!) {
    goLive(input: $input) {
      status
    }
  }
`
export async function goLive({
  idToken,
  signature,
  input,
}: {
  idToken: string
  signature?: string
  input: GoLiveInput
}) {
  try {
    const data = await client
      .setHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
        "auth-wallet-signature": signature || "",
      })
      .request<MutationReturnType<"goLive">, MutationArgsType<"goLive">>(
        GO_LIVE_MUTATION,
        {
          input,
        }
      )

    return data?.goLive
  } catch (error) {
    return null
  }
}
