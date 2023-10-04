import { NextResponse } from "next/server"

import { fetchPlaylistItems } from "@/graphql"
import { getAccount } from "@/lib/server"
import type { PlaylistOrderBy } from "@/graphql/types"

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await getAccount()
    const account = data?.account
    const idToken = data?.idToken
    const signature = data?.signature
    if (!account || !account?.defaultProfile || !idToken)
      return new NextResponse("Please sign in to proceed.", {
        status: 500,
      })

    const { cursor, sortBy } = (await req.json()) as {
      cursor?: string
      sortBy?: PlaylistOrderBy
    }

    // Fetch items from user's watch later list
    const watchLaterResult = await fetchPlaylistItems({
      idToken: idToken!,
      signature,
      input: {
        accountId: account!.id,
        profileId: account?.defaultProfile?.id,
        owner: account!.owner,
        playlistId: params.id,
        cursor,
        orderBy: sortBy,
      },
    })

    return NextResponse.json({ result: watchLaterResult })
  } catch (error) {
    console.error(error)
  }
}
