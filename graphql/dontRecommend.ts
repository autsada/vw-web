import { gql } from "graphql-request"

import { client } from "./client"
import type {
  QueryReturnType,
  QueryArgsType,
  MutationArgsType,
  MutationReturnType,
  FetchDontRecommendsInput,
  DontRecommendInput,
} from "./types"

/**
 * Fetch user's dont-recommended list
 */
export const FETCH_DONT_RECOMMEND_QUERY = gql`
  query FetchDontRecommends($input: FetchDontRecommendsInput!) {
    fetchDontRecommends(input: $input) {
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        cursor
        node {
          requestorId
          targetId
          createdAt
          target {
            id
            name
            image
          }
        }
      }
    }
  }
`
export async function fetchDontRecommends({
  idToken,
  signature,
  input,
}: {
  idToken: string
  signature?: string
  input: FetchDontRecommendsInput
}) {
  try {
    const data = await client
      .setHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
        "auth-wallet-signature": signature || "",
      })
      .request<
        QueryReturnType<"fetchDontRecommends">,
        QueryArgsType<"fetchDontRecommends">
      >(FETCH_DONT_RECOMMEND_QUERY, {
        input,
      })

    return data?.fetchDontRecommends
  } catch (error) {
    throw error
  }
}

/**
 * Don't recommend a profile
 */
export const DONT_RECOMMEND_MUTATION = gql`
  mutation DontRecommend($input: DontRecommendInput!) {
    dontRecommend(input: $input) {
      status
    }
  }
`
export async function dontRecommend({
  idToken,
  signature,
  input,
}: {
  idToken: string
  signature?: string
  input: DontRecommendInput
}) {
  try {
    const data = await client
      .setHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
        "auth-wallet-signature": signature || "",
      })
      .request<
        MutationReturnType<"dontRecommend">,
        MutationArgsType<"dontRecommend">
      >(DONT_RECOMMEND_MUTATION, {
        input,
      })

    return data?.dontRecommend
  } catch (error) {
    throw error
  }
}

/**
 * Remove don't-recommended profile from the list
 */
export const REMOVE_DONT_RECOMMEND_MUTATION = gql`
  mutation RemoveDontRecommend($input: DontRecommendInput!) {
    removeDontRecommend(input: $input) {
      status
    }
  }
`
export async function undoDontRecommended({
  idToken,
  signature,
  input,
}: {
  idToken: string
  signature?: string
  input: DontRecommendInput
}) {
  try {
    const data = await client
      .setHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
        "auth-wallet-signature": signature || "",
      })
      .request<
        MutationReturnType<"removeDontRecommend">,
        MutationArgsType<"removeDontRecommend">
      >(REMOVE_DONT_RECOMMEND_MUTATION, {
        input,
      })

    return data?.removeDontRecommend
  } catch (error) {
    throw error
  }
}
