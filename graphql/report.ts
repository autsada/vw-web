import { gql } from "graphql-request"

import { client } from "./client"
import type {
  MutationArgsType,
  MutationReturnType,
  ReportPublishInput,
} from "./types"

/**
 * Report
 */
export const REPORT_PUBLISH_MUTATION = gql`
  mutation ReportPublish($input: ReportPublishInput!) {
    reportPublish(input: $input) {
      status
    }
  }
`
export async function report({
  idToken,
  signature,
  input,
}: {
  idToken: string
  signature?: string
  input: ReportPublishInput
}) {
  try {
    const data = await client
      .setHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
        "auth-wallet-signature": signature || "",
      })
      .request<
        MutationReturnType<"reportPublish">,
        MutationArgsType<"reportPublish">
      >(REPORT_PUBLISH_MUTATION, {
        input,
      })

    return data?.reportPublish
  } catch (error) {
    throw error
  }
}
