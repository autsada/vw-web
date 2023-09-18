import { NextResponse } from "next/server"

import { createAccount } from "@/graphql"
import { getAccount } from "@/lib/server"
import type { Account } from "@/graphql/codegen/graphql"

export async function POST(req: Request) {
  let data = await getAccount()
  const idToken = data?.idToken
  const signature = data?.signature

  while (!data?.idToken) {
    data = await getAccount()
  }

  let account = data?.account

  if (!account) {
    // Create a new account
    account = (await createAccount(idToken!, signature)) as Account
  }

  return NextResponse.json({ account })
}
