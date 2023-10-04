import { NextResponse } from "next/server"

import { sendTips } from "@/graphql"
import { getAccount } from "@/lib/server"
import { redirect } from "next/navigation"

export async function POST(req: Request) {
  try {
    const data = await getAccount()
    const account = data?.account
    const idToken = data?.idToken

    if (!account || !idToken)
      return new NextResponse("Please sign in to proceed.", {
        status: 500,
      })

    const profile = account.defaultProfile

    if (!profile) {
      return redirect("/settings/profiles")
    }

    const { publishId, receiverId, qty } = (await req.json()) as {
      publishId: string
      receiverId: string
      qty: number
    }

    const result = await sendTips({
      accountId: account.id,
      owner: account.owner,
      profileId: profile.id,
      publishId,
      receiverId,
      qty,
    })

    return NextResponse.json(result)
  } catch (error) {
    throw error
  }
}
