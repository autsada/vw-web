"use client"

import React from "react"
import Link from "next/link"

import type { Maybe, Profile } from "@/graphql/codegen/graphql"

interface Props {
  profile: Maybe<Profile> | undefined
}

export default function FollowsLink({ profile }: Props) {
  const isOwner = profile?.isOwner
  const followersCount = profile?.followersCount
  const followingCount = profile?.followingCount

  return (
    <>
      {isOwner ? (
        <Link href={`/profile/${profile.id}/followers`}>
          <p className="text-sm sm:text-base font-light text-textLight border-b border-white hover:border-neutral-400">
            <span className="text-textRegular">{followersCount}</span> Followers
          </p>
        </Link>
      ) : (
        <p className="text-sm sm:text-base font-light text-textLight">
          <span className="text-textRegular">{followersCount}</span> Followers
        </p>
      )}

      {isOwner && (
        <Link href={`/profile/${profile.id}/following`}>
          <p className="text-sm sm:text-base font-light text-textLight  border-b border-white hover:border-neutral-400">
            <span className="text-textRegular">{followingCount}</span> Following
          </p>
        </Link>
      )}
    </>
  )
}
