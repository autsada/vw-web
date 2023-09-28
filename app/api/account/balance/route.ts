import { NextResponse } from "next/server"

import { getBalance } from "@/graphql"
import { getAccount } from "@/lib/server"

export async function GET(req: Request) {
  const data = await getAccount()

  const account = data?.account

  if (!account) {
    return NextResponse.json({ balance: 0 })
  }

  const balance = await getBalance(account.owner)

  return NextResponse.json({ balance, address: account.owner })
}
