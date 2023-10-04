import { NextResponse } from "next/server"

import { fetchPreviewPlaylists } from "@/graphql"
import { getAccount } from "@/lib/server"

export async function POST(req: Request) {
  const data = await getAccount()
  const account = data?.account
  const idToken = data?.idToken
  const signature = data?.signature

  if (!account || !account?.defaultProfile || !idToken)
    return new NextResponse("Please sign in to proceed.", {
      status: 500,
    })

  const { cursor } = (await req.json()) as { cursor: string }

  // Fetch user's playlists
  const playlistsResult = await fetchPreviewPlaylists({
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
