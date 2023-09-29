import Shorts from "./Shorts"
import {
  fetchMyPlaylists,
  fetchPublishes,
  getShort,
  getProfileById,
} from "@/graphql"
import { Maybe, Publish } from "@/graphql/codegen/graphql"
import { getAccount } from "@/lib/server"
import { notFound, redirect } from "next/navigation"

type Props = {
  searchParams: { id?: string }
}

export default async function Page({ searchParams }: Props) {
  const data = await getAccount()
  const account = data?.account
  const idToken = data?.idToken
  const signature = data?.signature

  // Get user profile
  const profile =
    !account || !idToken || !account.defaultProfile
      ? undefined
      : await getProfileById(account?.defaultProfile?.id)

  const publishId = searchParams.id

  let short: Maybe<Publish> | undefined = undefined
  if (publishId) {
    short = await getShort({
      requestorId: profile?.id,
      targetId: publishId,
    })
  }

  if (typeof publishId === "string" && !publishId) {
    // For the case that user enter "/shorts?id="
    redirect("/shorts")
  }

  if (publishId && !short) {
    notFound()
  }

  if (short && short.publishType !== "Short") {
    redirect(`/watch/${short.id}`)
  }

  // Fetch short videos
  const shortsResult = await fetchPublishes({
    requestorId: profile?.id,
    cursor: null,
    publishType: "shorts",
  })

  // Fetch user's playlists if user is authenticated
  const playlistsResult = !profile
    ? undefined
    : await fetchMyPlaylists({
        idToken: idToken!,
        signature,
        input: {
          accountId: account!.id,
          profileId: profile.id,
          owner: account!.owner,
          cursor: null,
        },
      })

  return (
    <div className="sm:ml-[100px]">
      <Shorts
        isAuthenticated={!!account}
        account={account}
        profile={profile}
        fetchResult={shortsResult}
        playlistsResult={playlistsResult}
        initialId={searchParams.id}
      />
    </div>
  )
}
