import { NextResponse } from "next/server"

import { validateProfileName } from "@/graphql"

export async function POST(req: Request) {
  const { name } = (await req.json()) as { name: string }
  const valid = await validateProfileName(name)

  return NextResponse.json({ valid })
}
