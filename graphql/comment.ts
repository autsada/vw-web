import { gql } from "graphql-request"

import { client } from "./client"
import type {
  QueryReturnType,
  QueryArgsType,
  MutationReturnType,
  MutationArgsType,
  FetchCommentsByPublishIdInput,
  FetchSubCommentsInput,
  CommentPublishInput,
  LikeCommentInput,
  DeleteCommentInput,
} from "./types"

/**
 * Fetch comments by publish id
 */
export const FETCH_COMMENTS_BY_PUBLISH_ID_QUERY = gql`
  query FetchCommentsByPublishId($input: FetchCommentsByPublishIdInput!) {
    fetchCommentsByPublishId(input: $input) {
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
          createdAt
          updatedAt
          publishId
          creator {
            id
            name
            image
            displayName
            defaultColor
          }
          liked
          likesCount
          disLiked
          commentType
          commentsCount
          contentBlog
          htmlContentBlog
        }
      }
    }
  }
`
export async function fetchComments(input: FetchCommentsByPublishIdInput) {
  try {
    const data = await client
      .setHeaders({
        "Content-Type": "application/json",
      })
      .request<
        QueryReturnType<"fetchCommentsByPublishId">,
        QueryArgsType<"fetchCommentsByPublishId">
      >(FETCH_COMMENTS_BY_PUBLISH_ID_QUERY, {
        input,
      })

    return data?.fetchCommentsByPublishId
  } catch (error) {
    throw error
  }
}

/**
 * Fetch sub comments by comment id
 */
export const FETCH_SUB_COMMENTS_QUERY = gql`
  query FetchSubComments($input: FetchSubCommentsInput!) {
    fetchSubComments(input: $input) {
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
          createdAt
          updatedAt
          publishId
          creator {
            id
            name
            image
            displayName
            defaultColor
          }
          liked
          likesCount
          disLiked
          commentType
          contentBlog
          htmlContentBlog
        }
      }
    }
  }
`
export async function fetchSubComments(input: FetchSubCommentsInput) {
  try {
    const data = await client
      .setHeaders({
        "Content-Type": "application/json",
      })
      .request<
        QueryReturnType<"fetchSubComments">,
        QueryArgsType<"fetchSubComments">
      >(FETCH_SUB_COMMENTS_QUERY, {
        input,
      })

    return data?.fetchSubComments
  } catch (error) {
    throw error
  }
}

/**
 * Comment on publish / comment
 */
export const COMMENT_MUTATION = gql`
  mutation Comment($input: CommentPublishInput!) {
    comment(input: $input) {
      status
    }
  }
`
export async function commentPublish({
  idToken,
  signature,
  input,
}: {
  idToken: string
  signature?: string
  input: CommentPublishInput
}) {
  try {
    const data = await client
      .setHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
        "auth-wallet-signature": signature || "",
      })
      .request<MutationReturnType<"comment">, MutationArgsType<"comment">>(
        COMMENT_MUTATION,
        {
          input,
        }
      )

    return data?.comment
  } catch (error) {
    throw error
  }
}

/**
 * Like / Undo like comment
 */
export const LIKE_COMMENT_MUTATION = gql`
  mutation LikeComment($input: LikeCommentInput!) {
    likeComment(input: $input) {
      status
    }
  }
`
export async function likeComment({
  idToken,
  signature,
  input,
}: {
  idToken: string
  signature?: string
  input: LikeCommentInput
}) {
  try {
    const data = await client
      .setHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
        "auth-wallet-signature": signature || "",
      })
      .request<
        MutationReturnType<"likeComment">,
        MutationArgsType<"likeComment">
      >(LIKE_COMMENT_MUTATION, {
        input,
      })

    return data?.likeComment
  } catch (error) {
    throw error
  }
}

/**
 * Dislike / Undo dislike comment
 */
export const DISLIKE_COMMENT_MUTATION = gql`
  mutation DisLikeComment($input: LikeCommentInput!) {
    disLikeComment(input: $input) {
      status
    }
  }
`
export async function disLikeComment({
  idToken,
  signature,
  input,
}: {
  idToken: string
  signature?: string
  input: LikeCommentInput
}) {
  try {
    const data = await client
      .setHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
        "auth-wallet-signature": signature || "",
      })
      .request<
        MutationReturnType<"disLikeComment">,
        MutationArgsType<"disLikeComment">
      >(DISLIKE_COMMENT_MUTATION, {
        input,
      })

    return data?.disLikeComment
  } catch (error) {
    throw error
  }
}

/**
 * Delete comment
 */
export const DELETE_COMMENT_MUTATION = gql`
  mutation DeleteComment($input: DeleteCommentInput!) {
    deleteComment(input: $input) {
      status
    }
  }
`
export async function deleteComment({
  idToken,
  signature,
  input,
}: {
  idToken: string
  signature?: string
  input: DeleteCommentInput
}) {
  try {
    const data = await client
      .setHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
        "auth-wallet-signature": signature || "",
      })
      .request<
        MutationReturnType<"deleteComment">,
        MutationArgsType<"deleteComment">
      >(DELETE_COMMENT_MUTATION, {
        input,
      })

    return data?.deleteComment
  } catch (error) {
    throw error
  }
}
