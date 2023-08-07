"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface Props {
  profileId: string
}

export default function FollowTabs({ profileId }: Props) {
  const pathname = usePathname()

  return (
    <div className="w-full h-12 flex items-center border-b border-neutral-100">
      <Link href={`/profile/${profileId}/followers`} className="h-full w-1/2">
        <div className="h-full w-full flex items-center justify-center hover:bg-neutral-100">
          <div className="relative h-full w-max flex items-center justify-center font-semibold text-lg">
            Followers
            {pathname.endsWith("followers") && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-blueBase"></div>
            )}
          </div>
        </div>
      </Link>
      <Link href={`/profile/${profileId}/following`} className="h-full w-1/2">
        <div className="h-full w-full flex items-center justify-center hover:bg-neutral-100">
          <div className="relative h-full w-max flex items-center justify-center font-semibold text-lg">
            Following
            {pathname.endsWith("following") && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-blueBase"></div>
            )}
          </div>
        </div>
      </Link>
    </div>
  )
}
