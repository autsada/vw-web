import { getAccount } from "@/lib/server"
import { fetchPublishes, fetchMyPlaylists, getProfileById } from "@/graphql"

export default async function Home() {
  const data = await getAccount()
  const account = data?.account
  const idToken = data?.idToken
  const signature = data?.signature

  // Query profile by id
  const profile =
    !account || !idToken || !account.defaultProfile
      ? undefined
      : await getProfileById(account?.defaultProfile?.id)

  // Fetch videos
  const videosResult = await fetchPublishes({
    requestorId: profile?.id,
    cursor: null,
    publishType: "videos",
  })

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
    <div className="mt-[40px] py-2 sm:px-4 sm:ml-[100px]">
      <div className="h-screen flex items-center justify-center">Home</div>
      {/* <Videos
        profile={profile || undefined}
        isAuthenticated={!!account}
        videosResult={videosResult}
        shortsResult={shortsResult}
        playlistsResult={playlistsResult || undefined}
      /> */}
    </div>
  )
}
