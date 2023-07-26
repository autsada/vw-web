import { gql } from "graphql-request"

import { client } from "./client"
import type {
  QueryReturnType,
  QueryArgsType,
  MutationReturnType,
  MutationArgsType,
  QueryByIdInput,
  FetchMyPublishesInput,
  FetchPublishesInput,
  FetchPublishesByCatInput,
  FetchSuggestedPublishesInput,
  FetchPublishesByProfileInput,
  FetchPublishesByTagInput,
  FetchPublishesByQueryStringInput,
  CreateDraftVideoInput,
  CreateDraftBlogInput,
  UpdateVideoInput,
  UpdateBlogInput,
  LikePublishInput,
  DeletePublishInput,
  SendTipsInput,
} from "./types"

/**
 * Get an uploaded publish for use in the upload action
 */
export const GET_UPLOADED_PUBLISH_QUERY = gql`
  query GetPublishById($input: QueryByIdInput!) {
    getPublishById(input: $input) {
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
      playback {
        id
        videoId
        thumbnail
        preview
        duration
        dash
        hls
      }
      blog {
        createdAt
        updatedAt
        content
        publishId
        readingTime
        excerpt
      }
    }
  }
`
export async function getUploadedPublish({
  idToken,
  signature,
  input,
}: {
  idToken: string
  signature?: string
  input: QueryByIdInput
}) {
  try {
    const data = await client
      .setHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
        "auth-wallet-signature": signature || "",
      })
      .request<
        QueryReturnType<"getPublishById">,
        QueryArgsType<"getPublishById">
      >(GET_UPLOADED_PUBLISH_QUERY, { input })

    return data?.getPublishById
  } catch (error) {
    throw error
  }
}

/**
 * Fetch all uploaded publishes for a profile
 */
export const FETCH_MY_PUBLISHES_QUERY = gql`
  query FetchMyPublishes($input: FetchMyPublishesInput!) {
    fetchMyPublishes(input: $input) {
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
          playback {
            id
            thumbnail
            duration
          }
          blog {
            createdAt
            updatedAt
            content
            publishId
            readingTime
            excerpt
          }
        }
      }
    }
  }
`
export async function fetchMyPublishes({
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
        QueryReturnType<"fetchMyPublishes">,
        QueryArgsType<"fetchMyPublishes">
      >(FETCH_MY_PUBLISHES_QUERY, {
        input,
      })

    return data?.fetchMyPublishes
  } catch (error) {
    throw error
  }
}

/**
 * Fetch publishes
 */
export const FETCH_PUBLISHES_QUERY = gql`
  query FetchPublishes($input: FetchPublishesInput!) {
    fetchPublishes(input: $input) {
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        cursor
        node {
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
          tags
          liked
          disLiked
          likesCount
          commentsCount
          bookmarked
          creator {
            id
            name
            displayName
            image
            followersCount
            isFollowing
            defaultColor
            isOwner
          }
          playback {
            id
            videoId
            duration
            hls
            dash
            thumbnail
          }
          blog {
            createdAt
            updatedAt
            content
            htmlContent
            publishId
            readingTime
            excerpt
          }
        }
      }
    }
  }
`
export async function fetchPublishes(input: FetchPublishesInput) {
  try {
    const data = await client.request<
      QueryReturnType<"fetchPublishes">,
      QueryArgsType<"fetchPublishes">
    >(FETCH_PUBLISHES_QUERY, {
      input,
    })

    return data?.fetchPublishes
  } catch (error) {
    throw error
  }
}

/**
 * Fetch videos by category
 */
export const FETCH_VIDEOS_BY_CAT_QUERY = gql`
  query FetchVideosByCategory($input: FetchPublishesByCatInput!) {
    fetchVideosByCategory(input: $input) {
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        cursor
        node {
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
          tags
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
          }
        }
      }
    }
  }
`
export async function fetchVideosByCategory(input: FetchPublishesByCatInput) {
  try {
    const data = await client.request<
      QueryReturnType<"fetchVideosByCategory">,
      QueryArgsType<"fetchVideosByCategory">
    >(FETCH_VIDEOS_BY_CAT_QUERY, { input })

    return data?.fetchVideosByCategory
  } catch (error) {
    throw error
  }
}

/**
 * Get a publish for watch page
 */
export const GET_WATCHING_PUBLISH_QUERY = gql`
  query GetPublishById($input: QueryByIdInput!) {
    getPublishById(input: $input) {
      id
      title
      description
      createdAt
      primaryCategory
      secondaryCategory
      publishType
      creatorId
      thumbnail
      thumbnailType
      views
      tags
      creator {
        id
        name
        displayName
        image
        followersCount
        isFollowing
        defaultColor
        isOwner
      }
      playback {
        id
        videoId
        duration
        hls
        dash
        thumbnail
      }
      liked
      disLiked
      likesCount
      commentsCount
      bookmarked
      lastComment {
        id
        creator {
          id
          name
          displayName
          image
        }
        content
        liked
        disLiked
        likesCount
        commentType
      }
      blog {
        createdAt
        updatedAt
        content
        htmlContent
        publishId
        readingTime
        excerpt
      }
    }
  }
`
export async function getWatchingPublish(input: QueryByIdInput) {
  try {
    const data = await client.request<
      QueryReturnType<"getPublishById">,
      QueryArgsType<"getPublishById">
    >(GET_WATCHING_PUBLISH_QUERY, {
      input,
    })

    return data?.getPublishById
  } catch (error) {
    throw error
  }
}

/**
 * Fetch suggested videos
 */
export const FETCH_SUGGESTED_VIDEOS_QUERY = gql`
  query FetchSuggestedVideos($input: FetchSuggestedPublishesInput!) {
    fetchSuggestedVideos(input: $input) {
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        cursor
        node {
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
          tags
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
          }
        }
      }
    }
  }
`

export async function fetchSuggestedVideos(
  input: FetchSuggestedPublishesInput
) {
  try {
    const data = await client.request<
      QueryReturnType<"fetchSuggestedVideos">,
      QueryArgsType<"fetchSuggestedVideos">
    >(FETCH_SUGGESTED_VIDEOS_QUERY, {
      input,
    })

    return data?.fetchSuggestedVideos
  } catch (error) {
    throw error
  }
}

/**
 * Fetch suggested blogs
 */
export const FETCH_SUGGESTED_BLOGS_QUERY = gql`
  query FetchSuggestedBlogs($input: FetchSuggestedPublishesInput!) {
    fetchSuggestedBlogs(input: $input) {
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        cursor
        node {
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
          tags
          creator {
            id
            name
            displayName
            image
            defaultColor
          }
          blog {
            createdAt
            updatedAt
            content
            publishId
            readingTime
            excerpt
          }
        }
      }
    }
  }
`
export async function fetchSuggestedBlogs(input: FetchSuggestedPublishesInput) {
  try {
    const data = await client.request<
      QueryReturnType<"fetchSuggestedBlogs">,
      QueryArgsType<"fetchSuggestedBlogs">
    >(FETCH_SUGGESTED_BLOGS_QUERY, {
      input,
    })

    return data?.fetchSuggestedBlogs
  } catch (error) {
    throw error
  }
}

/**
 * Fetch all public publishes of a profile
 */
export const FETCH_PROFILE_PUBLISHES_QUERY = gql`
  query FetchProfilePublishes($input: FetchPublishesByProfileInput!) {
    fetchProfilePublishes(input: $input) {
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
          title
          views
          thumbnailType
          thumbnail
          publishType
          commentsCount
          playback {
            id
            duration
            hls
            dash
            preview
          }
          blog {
            createdAt
            updatedAt
            content
            publishId
            readingTime
            excerpt
          }
        }
      }
    }
  }
`
export async function fetchProfilePublishes(
  input: FetchPublishesByProfileInput
) {
  try {
    const data = await client
      .setHeaders({
        "Content-Type": "application/json",
      })
      .request<
        QueryReturnType<"fetchProfilePublishes">,
        QueryArgsType<"fetchProfilePublishes">
      >(FETCH_PROFILE_PUBLISHES_QUERY, {
        input,
      })

    return data?.fetchProfilePublishes
  } catch (error) {
    throw error
  }
}

/**
 * Get short video by id
 */
export const GET_SHORT_QUERY = gql`
  query GetShort($input: QueryByIdInput!) {
    getShort(input: $input) {
      id
      title
      description
      createdAt
      publishType
    }
  }
`
export async function getShort(input: QueryByIdInput) {
  try {
    const data = await client
      .setHeaders({
        "Content-Type": "application/json",
      })
      .request<QueryReturnType<"getShort">, QueryArgsType<"getShort">>(
        GET_SHORT_QUERY,
        {
          input,
        }
      )

    return data?.getShort
  } catch (error) {
    throw error
  }
}

/**
 * Fetch publishes by tag
 */
export const FETCH_BY_TAG_QUERY = gql`
  query FetchPublishesByTag($input: FetchPublishesByTagInput!) {
    fetchPublishesByTag(input: $input) {
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        cursor
        node {
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
          tags
          bookmarked
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
          }
          blog {
            createdAt
            updatedAt
            content
            publishId
            readingTime
            excerpt
          }
        }
      }
    }
  }
`
export async function fetchPublishesByTag(input: FetchPublishesByTagInput) {
  try {
    const data = await client.request<
      QueryReturnType<"fetchPublishesByTag">,
      QueryArgsType<"fetchPublishesByTag">
    >(FETCH_BY_TAG_QUERY, { input })

    return data?.fetchPublishesByTag
  } catch (error) {
    throw error
  }
}

/**
 * Fetch publishes by query
 */
export const FETCH_BY__QUERY = gql`
  query FetchPublishesByQuery($input: FetchPublishesByQueryStringInput!) {
    fetchPublishesByQueryString(input: $input) {
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        cursor
        node {
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
          tags
          bookmarked
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
          }
          blog {
            createdAt
            updatedAt
            content
            publishId
            readingTime
            excerpt
          }
        }
      }
    }
  }
`
export async function fetchPublishesByQuery(
  input: FetchPublishesByQueryStringInput
) {
  try {
    const data = await client.request<
      QueryReturnType<"fetchPublishesByQueryString">,
      QueryArgsType<"fetchPublishesByQueryString">
    >(FETCH_BY__QUERY, { input })

    return data?.fetchPublishesByQueryString
  } catch (error) {
    throw error
  }
}

/**
 * Create draft video
 */
export const CREATE_DRAFT_VIDEO_MUTATION = gql`
  mutation CreateDraftVideo($input: CreateDraftVideoInput!) {
    createDraftVideo(input: $input) {
      id
    }
  }
`
export async function createDraftVideo({
  idToken,
  signature,
  input,
}: {
  idToken: string
  signature?: string
  input: CreateDraftVideoInput
}) {
  try {
    const data = await client
      .setHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
        "auth-wallet-signature": signature || "",
      })
      .request<
        MutationReturnType<"createDraftVideo">,
        MutationArgsType<"createDraftVideo">
      >(CREATE_DRAFT_VIDEO_MUTATION, {
        input,
      })

    return data?.createDraftVideo
  } catch (error) {
    throw error
  }
}

/**
 * Create draft blog
 */
export const CREATE_DRAFT_BLOG_MUTATION = gql`
  mutation CreateDraftBlog($input: CreateDraftBlogInput!) {
    createDraftBlog(input: $input) {
      id
    }
  }
`
export async function createDraftBlog({
  idToken,
  signature,
  input,
}: {
  idToken: string
  signature?: string
  input: CreateDraftBlogInput
}) {
  try {
    const data = await client
      .setHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
        "auth-wallet-signature": signature || "",
      })
      .request<
        MutationReturnType<"createDraftBlog">,
        MutationArgsType<"createDraftBlog">
      >(CREATE_DRAFT_BLOG_MUTATION, {
        input,
      })

    return data?.createDraftBlog
  } catch (error) {
    throw error
  }
}

/**
 * Update video
 */
export const UPDATE_VIDEO_MUTATION = gql`
  mutation UpdateVideo($input: UpdateVideoInput!) {
    updateVideo(input: $input) {
      id
    }
  }
`
export async function updateVideo({
  idToken,
  signature,
  input,
}: {
  idToken: string
  signature?: string
  input: UpdateVideoInput
}) {
  try {
    const data = await client
      .setHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
        "auth-wallet-signature": signature || "",
      })
      .request<
        MutationReturnType<"updateVideo">,
        MutationArgsType<"updateVideo">
      >(UPDATE_VIDEO_MUTATION, {
        input,
      })

    return data?.updateVideo
  } catch (error) {
    throw error
  }
}

/**
 * Update blog
 */
export const UPDATE_BLOG_MUTATION = gql`
  mutation UpdateBlog($input: UpdateBlogInput!) {
    updateBlog(input: $input) {
      status
    }
  }
`
export async function updateBlog({
  idToken,
  signature,
  input,
}: {
  idToken: string
  signature?: string
  input: UpdateBlogInput
}) {
  try {
    const data = await client
      .setHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
        "auth-wallet-signature": signature || "",
      })
      .request<
        MutationReturnType<"updateBlog">,
        MutationArgsType<"updateBlog">
      >(UPDATE_BLOG_MUTATION, {
        input,
      })

    return data?.updateBlog
  } catch (error) {
    throw error
  }
}

/**
 * Like / Undo like publish
 */
export const LIKE_PUBLISH_MUTATION = gql`
  mutation LikePublish($input: LikePublishInput!) {
    likePublish(input: $input) {
      status
    }
  }
`
export async function like({
  idToken,
  signature,
  input,
}: {
  idToken: string
  signature?: string
  input: LikePublishInput
}) {
  try {
    const data = await client
      .setHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
        "auth-wallet-signature": signature || "",
      })
      .request<
        MutationReturnType<"likePublish">,
        MutationArgsType<"likePublish">
      >(LIKE_PUBLISH_MUTATION, {
        input,
      })

    return data?.likePublish
  } catch (error) {
    throw error
  }
}

/**
 * DisLike / Undo disLike publish
 */
export const DISLIKE_PUBLISH_MUTATION = gql`
  mutation DisLikePublish($input: LikePublishInput!) {
    disLikePublish(input: $input) {
      status
    }
  }
`
export async function disLike({
  idToken,
  signature,
  input,
}: {
  idToken: string
  signature?: string
  input: LikePublishInput
}) {
  try {
    const data = await client
      .setHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
        "auth-wallet-signature": signature || "",
      })
      .request<
        MutationReturnType<"disLikePublish">,
        MutationArgsType<"disLikePublish">
      >(DISLIKE_PUBLISH_MUTATION, {
        input,
      })

    return data?.disLikePublish
  } catch (error) {
    throw error
  }
}

/**
 * Count views
 */
export const COUNT_VIEW_MUTATION = gql`
  mutation CountViews($publishId: String!) {
    countViews(publishId: $publishId) {
      status
    }
  }
`
export async function countViews(publishId: string) {
  try {
    const data = await client
      .setHeaders({
        "Content-Type": "application/json",
      })
      .request<
        MutationReturnType<"countViews">,
        MutationArgsType<"countViews">
      >(COUNT_VIEW_MUTATION, {
        publishId,
      })

    return data?.countViews
  } catch (error) {
    throw error
  }
}

/**
 * Delete publish
 */
export const DELETE_PUBLISH_MUTATION = gql`
  mutation DeletePublish($input: DeletePublishInput!) {
    deletePublish(input: $input) {
      status
    }
  }
`
export async function deletePublish({
  idToken,
  signature,
  input,
}: {
  idToken: string
  signature?: string
  input: DeletePublishInput
}) {
  try {
    const data = await client
      .setHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
        "auth-wallet-signature": signature || "",
      })
      .request<
        MutationReturnType<"deletePublish">,
        MutationArgsType<"deletePublish">
      >(DELETE_PUBLISH_MUTATION, {
        input,
      })

    return data?.deletePublish
  } catch (error) {
    throw error
  }
}

/**
 * Calculate tips (convert USD to ETH)
 */
export const CALCULATE_TIPS_MUTATION = gql`
  mutation CalculateTips($qty: Int!) {
    calculateTips(qty: $qty) {
      tips
    }
  }
`
export async function CalculateTips(qty: number) {
  try {
    const data = await client.request<
      MutationReturnType<"calculateTips">,
      MutationArgsType<"calculateTips">
    >(CALCULATE_TIPS_MUTATION, {
      qty,
    })

    return data?.calculateTips
  } catch (error) {
    throw error
  }
}

/**
 * Send tips
 */
export const SEND_TIPS_MUTATION = gql`
  mutation SendTips($input: SendTipsInput!) {
    sendTips(input: $input) {
      amount
      fee
      from
      to
    }
  }
`
export async function sendTips(input: SendTipsInput) {
  try {
    const data = await client.request<
      MutationReturnType<"sendTips">,
      MutationArgsType<"sendTips">
    >(SEND_TIPS_MUTATION, {
      input,
    })

    return data?.sendTips
  } catch (error) {
    throw error
  }
}
