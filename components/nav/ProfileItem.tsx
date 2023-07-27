import React from "react"

import Avatar from "../Avatar"
import Online from "../Online"
import type { Profile } from "@/graphql/codegen/graphql"

interface Props {
  profile: Profile
  defaultId: string
  switchProfile: (profileId: string) => void
}

export default function ProfileItem({
  profile,
  defaultId,
  switchProfile,
}: Props) {
  return (
    <div
      className="p-2 flex items-center cursor-pointer rounded-lg hover:bg-gray-50"
      onClick={switchProfile.bind(undefined, profile.id)}
    >
      <div className="relative">
        <Avatar profile={profile} width={50} height={50} withLink={false} />
        {defaultId === profile?.id && <Online />}
      </div>
      <div className="ml-5 flex-grow">
        <p className="text-sm">{profile?.displayName}</p>
        <p className="text-sm text-textExtraLight">@{profile?.name}</p>
        <div className="flex items-center mt-1">
          <p className="text-xs font-thin text-textExtraLight">
            <span className="font-light text-textRegular">
              {profile.followersCount}
            </span>{" "}
            Followers
          </p>
          <p className="text-xs font-thin text-textExtraLight ml-2">
            <span className="font-light text-textRegular">
              {profile.publishesCount}
            </span>{" "}
            Publishes
          </p>
        </div>
      </div>
    </div>
  )
}
