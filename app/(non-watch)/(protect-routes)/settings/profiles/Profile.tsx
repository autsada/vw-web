import React from "react"
import { useRouter } from "next/navigation"

import Avatar from "@/components/Avatar"
import Online from "@/components/Online"
import ProfileName from "@/components/ProfileName"
import type { Profile } from "@/graphql/codegen/graphql"

interface Props {
  profile: Profile
  defaultId: string
  onRequestToSwitchProfile: (id: string) => void
}

export default function Profile({
  profile,
  defaultId,
  onRequestToSwitchProfile,
}: Props) {
  const router = useRouter()

  return (
    <div
      className="py-2 px-2 sm:px-4 flex items-center cursor-pointer rounded-lg hover:bg-gray-50"
      onClick={
        profile.id === defaultId
          ? () => router.push(`/profile/${defaultId}`)
          : onRequestToSwitchProfile.bind(undefined, profile.id)
      }
    >
      <div className="relative">
        <Avatar profile={profile} width={50} height={50} />
        {defaultId === profile?.id && <Online />}
      </div>
      <div className="ml-5 flex-grow">
        <ProfileName profile={profile} />
        <div className="flex items-center gap-x-2 mt-1">
          <p className="font-light text-sm sm:text-base text-textExtraLight">
            <span className="text-textRegular">{profile.followersCount}</span>{" "}
            Followers
          </p>
          <p className="font-light text-sm sm:text-base text-textExtraLight">
            <span className="text-textRegular">{profile.followingCount}</span>{" "}
            Following
          </p>
          <p className="font-light text-sm sm:text-base text-textExtraLight">
            <span className="text-textRegular">{profile.publishesCount}</span>{" "}
            Publishes
          </p>
        </div>
      </div>
    </div>
  )
}
