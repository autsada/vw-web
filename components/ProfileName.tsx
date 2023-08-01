"use client"

import React from "react"
import Link from "next/link"

import { getPostExcerpt } from "@/lib/client"
import type { Profile } from "@/graphql/codegen/graphql"

interface Props {
  profile: Profile
  fontSize?: "sm" | "base" | "lg"
  withLink?: boolean
}

export default function ProfileName({
  profile,
  fontSize = "base",
  withLink = true,
}: Props) {
  return !withLink ? (
    <div className="flex items-center">
      <h6
        className={
          fontSize === "sm"
            ? "text-xs sm:text-sm"
            : fontSize === "base"
            ? "text-sm sm:text-base"
            : "text-base sm:text-lg"
        }
      >
        {getPostExcerpt(profile?.displayName || "", 15)}
      </h6>
      <p
        className={`font-light text-textLight ${
          fontSize === "sm"
            ? "text-xs"
            : fontSize === "base"
            ? "text-base"
            : "text-lg"
        }`}
      >
        @{getPostExcerpt(profile?.name || "", 15)}
      </p>
    </div>
  ) : (
    <Link href={`/@${profile.name}`}>
      <div className="flex items-center">
        <h6
          className={
            fontSize === "sm"
              ? "text-xs sm:text-sm"
              : fontSize === "base"
              ? "text-sm sm:text-base"
              : "text-base sm:text-lg"
          }
        >
          {getPostExcerpt(profile?.displayName || "", 15)}
        </h6>
        <p
          className={`font-light text-textLight ${
            fontSize === "sm"
              ? "text-xs"
              : fontSize === "base"
              ? "text-base"
              : "text-lg"
          }`}
        >
          @{getPostExcerpt(profile?.name || "", 15)}
        </p>
      </div>
    </Link>
  )
}
