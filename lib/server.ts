import { cookies } from "next/headers"

import { createAccount, getMyAccount } from "@/graphql"
import type { Account } from "@/graphql/codegen/graphql"

export async function getAccount() {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get("dtoken")

    if (!token || !token.value) return null
    const idToken = token.value

    const signedMessage = cookieStore.get("dsignature")
    const signature = signedMessage?.value

    let account = await getMyAccount(idToken, signature)

    // If no account found, create a new account
    if (!account) {
      account = (await createAccount(idToken, signature)) as Account
    }

    return { account, idToken, signature }
  } catch (error) {
    return null
  }
}
