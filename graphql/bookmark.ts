import { gql } from "graphql-request"

import { client } from "./client"
import type {
  QueryReturnType,
  QueryArgsType,
  MutationReturnType,
  MutationArgsType,
  FetchBookmarkInput,
  BookmarkPostInput,
  RemoveAllBookmarksInput,
} from "./types"

/**
 * Fetch preview bookmarks
 */
export const FETCH_PREVIEW_BOOKMARKS_QUERY = gql`
  query FetchPreviewBookmarks($input: FetchBookmarkInput!) {
    fetchPreviewBookmarks(input: $input) {
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
  }
`
export async function fetchPreviewBookmarks({
  idToken,
  signature,
  input,
}: {
  idToken: string
  signature?: string
  input: FetchBookmarkInput
}) {
  try {
    const data = await client
      .setHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
        "auth-wallet-signature": signature || "",
      })
      .request<
        QueryReturnType<"fetchPreviewBookmarks">,
        QueryArgsType<"fetchPreviewBookmarks">
      >(FETCH_PREVIEW_BOOKMARKS_QUERY, {
        input,
      })

    return data?.fetchPreviewBookmarks
  } catch (error) {
    throw error
  }
}

/**
 * Fetch bookmarks
 */
export const FETCH_BOOKMARKS_QUERY = gql`
  query FetchBookmarks($input: FetchBookmarkInput!) {
    fetchBookmarks(input: $input) {
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
  }
`
export async function fetchBookmarks({
  idToken,
  signature,
  input,
}: {
  idToken: string
  signature?: string
  input: FetchBookmarkInput
}) {
  try {
    const data = await client
      .setHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
        "auth-wallet-signature": signature || "",
      })
      .request<
        QueryReturnType<"fetchBookmarks">,
        QueryArgsType<"fetchBookmarks">
      >(FETCH_BOOKMARKS_QUERY, {
        input,
      })

    return data?.fetchBookmarks
  } catch (error) {
    throw error
  }
}

/**
 * Bookmark a post
 */
export const BOOKMARK_MUTATION = gql`
  mutation BookmarkPost($input: BookmarkPostInput!) {
    bookmarkPost(input: $input) {
      status
    }
  }
`
export async function bookmark({
  idToken,
  signature,
  input,
}: {
  idToken: string
  signature?: string
  input: BookmarkPostInput
}) {
  try {
    const data = await client
      .setHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
        "auth-wallet-signature": signature || "",
      })
      .request<
        MutationReturnType<"bookmarkPost">,
        MutationArgsType<"bookmarkPost">
      >(BOOKMARK_MUTATION, {
        input,
      })

    return data?.bookmarkPost
  } catch (error) {
    throw error
  }
}

/**
 * Remove a bookmark
 */
export const REMOVE_BOOKMARK_MUTATION = gql`
  mutation RemoveBookmark($input: BookmarkPostInput!) {
    removeBookmark(input: $input) {
      status
    }
  }
`
export async function removeBookmark({
  idToken,
  signature,
  input,
}: {
  idToken: string
  signature?: string
  input: BookmarkPostInput
}) {
  try {
    const data = await client
      .setHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
        "auth-wallet-signature": signature || "",
      })
      .request<
        MutationReturnType<"removeBookmark">,
        MutationArgsType<"removeBookmark">
      >(REMOVE_BOOKMARK_MUTATION, {
        input,
      })

    return data?.removeBookmark
  } catch (error) {
    throw error
  }
}

/**
 * Remove all bookmarks
 */
export const REMOVE_BOOKMARKS_MUTATION = gql`
  mutation RemoveAllBookmarks($input: RemoveAllBookmarksInput!) {
    removeAllBookmarks(input: $input) {
      status
    }
  }
`
export async function removeAllBookmarks({
  idToken,
  signature,
  input,
}: {
  idToken: string
  signature?: string
  input: RemoveAllBookmarksInput
}) {
  try {
    const data = await client
      .setHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
        "auth-wallet-signature": signature || "",
      })
      .request<
        MutationReturnType<"removeAllBookmarks">,
        MutationArgsType<"removeAllBookmarks">
      >(REMOVE_BOOKMARKS_MUTATION, {
        input,
      })

    return data?.removeAllBookmarks
  } catch (error) {
    throw error
  }
}
