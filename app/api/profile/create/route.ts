import { NextResponse } from "next/server"
import { createProfile } from "@/graphql"
import { getAccount } from "@/lib/server"

export async function POST(req: Request) {
  try {
    const data = await getAccount()
    const account = data?.account
    const idToken = data?.idToken
    const signature = data?.signature
    if (!account || !idToken) throw new Error("Please sign in to proceed.")

    const { name } = (await req.json()) as {
      name: string
    }
    if (!name) throw new Error("Name is required")

    const result = await createProfile({
      idToken,
      signature,
      input: {
        accountId: account.id,
        owner: account.owner,
        name,
      },
    })

    return NextResponse.json(result)
  } catch (error) {
    throw error
  }
}
