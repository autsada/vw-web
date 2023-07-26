import React from "react"

import Avatar from "../Avatar"
import Online from "../Online"
import type { Profile } from "@/graphql/codegen/graphql"

interface Props {
  item: Profile
  defaultId: string
  switchProfile: (address: string, profileId: string) => void
}

export default function ProfileItem({ item, defaultId, switchProfile }: Props) {
  return (
    <div
      className="p-2 flex items-center cursor-pointer rounded-lg hover:bg-gray-50"
      onClick={switchProfile.bind(undefined, item.owner, item.id)}
    >
      <div className="relative">
        <Avatar profile={item} width={50} height={50} />
        {defaultId === item?.id && <Online />}
      </div>
      <div className="ml-5 flex-grow">
        <p className="text-sm">{item?.displayName}</p>
        <p className="text-sm text-textExtraLight">@{item?.name}</p>
        <div className="flex items-center mt-1">
          <p className="text-sm font-thin text-textExtraLight">
            <span className="font-light text-textRegular">
              {item.followersCount}
            </span>{" "}
            Followers
          </p>
          <p className="text-sm font-thin text-textExtraLight ml-2">
            <span className="font-light text-textRegular">
              {item.publishesCount}
            </span>{" "}
            Publishes
          </p>
        </div>
      </div>
    </div>
  )
}
