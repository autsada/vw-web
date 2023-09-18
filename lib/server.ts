import { cookies } from "next/headers"

import { getMyAccount } from "@/graphql"

export async function getAccount() {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get("dtoken")

    if (!token || !token.value) return null
    const idToken = token.value

    const signedMessage = cookieStore.get("dsignature")
    const signature = signedMessage?.value

    let account = await getMyAccount(idToken, signature)

    return { account, idToken, signature }
  } catch (error) {
    return null
  }
}
