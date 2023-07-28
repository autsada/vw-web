import { NextResponse } from "next/server"

import { fetchMyPlaylists } from "@/graphql"
import { getAccount } from "@/lib/server"

export async function POST(req: Request) {
  const data = await getAccount()
  const account = data?.account
  const idToken = data?.idToken
  const signature = data?.signature

  if (!account || !account?.defaultProfile || !idToken)
    throw new Error("Please sign in to proceed.")

  const { cursor } = (await req.json()) as { cursor: string }

  // Fetch user's playlists
  const playlistsResult = await fetchMyPlaylists({
    idToken: idToken!,
    signature,
    input: {
      accountId: account!.id,
      profileId: account?.defaultProfile?.id,
      owner: account!.owner,
      cursor,
    },
  })

  return NextResponse.json({ result: playlistsResult })
}
