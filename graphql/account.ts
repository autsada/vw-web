import { gql } from "graphql-request"

import { client } from "./client"
import type {
  QueryReturnType,
  QueryArgsType,
  MutationReturnType,
  MutationArgsType,
  CacheSessionInput,
} from "./types"

/**
 * @dev This function will query a logged-in user's account from the database.
 * @param idToken {string} an id token from the auth system
 * @param signature {string} a signature signed by a wallet
 */
export const GET_ACCOUNT_QUERY = gql`
  query GetMyAccount($input: GetMyAccountInput!) {
    getMyAccount(input: $input) {
      id
      owner
      type
      createdAt
      profiles {
        id
        name
        displayName
        owner
        image
        imageRef
        bannerImage
        bannerImageRef
        defaultColor
        followersCount
        followingCount
        publishesCount
        watchPreferences
        readPreferences
      }
      defaultProfile {
        id
        name
        displayName
        owner
        image
        imageRef
        bannerImage
        bannerImageRef
        defaultColor
        followersCount
        followingCount
        publishesCount
        watchPreferences
        readPreferences
      }
    }
  }
`
export async function getMyAccount(idToken: string, signature?: string) {
  try {
    const data = await client
      .setHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
        "auth-wallet-signature": signature || "",
      })
      .request<QueryReturnType<"getMyAccount">, QueryArgsType<"getMyAccount">>(
        GET_ACCOUNT_QUERY,
        { input: { accountType: signature ? "WALLET" : "TRADITIONAL" } }
      )
    return data?.getMyAccount
  } catch (error) {
    return null
  }
}

/**
 * @dev This function will query a balance by address
 */
export const GET_BALANCE_QUERY = gql`
  query Query($address: String!) {
    getBalance(address: $address)
  }
`
export async function getBalance(address: string) {
  try {
    const data = await client.request<
      QueryReturnType<"getBalance">,
      QueryArgsType<"getBalance">
    >(GET_BALANCE_QUERY, {
      address,
    })

    return data?.getBalance
  } catch (error) {
    return null
  }
}

/**
 * @param idToken {string} an id token from the auth system
 * @param signature {string} a signature signed by a wallet
 */
export const CREATE_ACCOUNT_MUTATION = gql`
  mutation CreateAccount($input: GetMyAccountInput!) {
    createAccount(input: $input) {
      id
      owner
      authUid
      type
      profiles {
        id
        name
        displayName
        owner
        image
        imageRef
        bannerImage
        bannerImageRef
        defaultColor
        followersCount
        followingCount
        publishesCount
        watchPreferences
        readPreferences
      }
      defaultProfile {
        id
        name
        displayName
        owner
        image
        imageRef
        bannerImage
        bannerImageRef
        defaultColor
        followersCount
        followingCount
        publishesCount
        watchPreferences
        readPreferences
      }
    }
  }
`
export async function createAccount(idToken: string, signature?: string) {
  try {
    const data = await client
      .setHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
        "auth-wallet-signature": signature || "",
      })
      .request<
        MutationReturnType<"createAccount">,
        MutationArgsType<"createAccount">
      >(CREATE_ACCOUNT_MUTATION, {
        input: { accountType: signature ? "WALLET" : "TRADITIONAL" },
      })

    return data?.createAccount
  } catch (error) {
    throw error
  }
}

/**
 * Cache user session
 */
export const CACHE_SESSION_MUTATION = gql`
  mutation CacheSession($input: CacheSessionInput!) {
    cacheSession(input: $input) {
      status
    }
  }
`
export async function cacheLoggedInSession({
  idToken,
  signature,
  input,
}: {
  idToken: string
  signature?: string
  input: CacheSessionInput
}) {
  try {
    const data = await client
      .setHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
        "auth-wallet-signature": signature || "",
      })
      .request<
        MutationReturnType<"cacheSession">,
        MutationArgsType<"cacheSession">
      >(CACHE_SESSION_MUTATION, { input })

    return data?.cacheSession
  } catch (error) {
    throw error
  }
}
