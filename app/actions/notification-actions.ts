"use server"

import { updateNotificationsStatus } from "@/graphql"
import { getAccount } from "@/lib/server"

export async function updateNotificationReadStatus(ids: string[]) {
  try {
    const data = await getAccount()
    const account = data?.account
    const idToken = data?.idToken
    const signature = data?.signature
    const profile = account?.defaultProfile

    if (idToken && profile && ids.length > 0) {
      await updateNotificationsStatus({
        idToken,
        signature,
        input: {
          accountId: account.id,
          profileId: profile.id,
          owner: account.owner,
          ids,
        },
      })
    }
  } catch (error) {
    console.error(error)
  }
}
