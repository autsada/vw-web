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
      className="p-2 sm:p-4 flex items-center cursor-pointer hover:bg-gray-50"
      onClick={
        profile.id === defaultId
          ? () => router.push(`/profile/${defaultId}`)
          : onRequestToSwitchProfile.bind(undefined, profile.id)
      }
    >
      <div className="relative">
        <Avatar profile={profile} width={50} height={50} withLink={false} />
        {defaultId === profile?.id && <Online />}
      </div>
      <div className="ml-5 flex-grow">
        <ProfileName profile={profile} withLink={false} />
        <div className="flex items-center gap-x-2 mt-1">
          <p className="font-light text-xs sm:text-sm text-textExtraLight">
            <span className="text-textRegular">{profile.followersCount}</span>{" "}
            Followers
          </p>
          <p className="font-light text-xs sm:text-sm text-textExtraLight">
            <span className="text-textRegular">{profile.followingCount}</span>{" "}
            Following
          </p>
          <p className="font-light text-xs sm:text-sm text-textExtraLight">
            <span className="text-textRegular">{profile.publishesCount}</span>{" "}
            Publishes
          </p>
        </div>
      </div>
    </div>
  )
}
