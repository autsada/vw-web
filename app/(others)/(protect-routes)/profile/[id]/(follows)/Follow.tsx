import React from "react"

import Avatar from "@/components/Avatar"
import ProfileName from "@/components/ProfileName"
import ManageFollow from "@/components/ManageFollow"
import type { Profile } from "@/graphql/codegen/graphql"

interface Props {
  isAuthenticated: boolean
  follow: Profile
}

export default function Follow({ isAuthenticated, follow }: Props) {
  if (!follow) return null

  return (
    <div className="flex gap-x-5 px-2 py-4 cursor-pointer hover:bg-neutral-100">
      <div>
        <Avatar profile={follow} />
      </div>
      <div className="flex-grow">
        <ProfileName profile={follow} />
      </div>
      <div>
        <ManageFollow
          isAuthenticated={isAuthenticated}
          follow={follow}
          ownerHref={`/profile/${follow.id}`}
          ownerLinkText="Edit"
        />
      </div>
    </div>
  )
}
