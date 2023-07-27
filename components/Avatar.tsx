import React from "react"
import Link from "next/link"
import Image from "next/image"

import type { Maybe, Profile } from "@/graphql/codegen/graphql"

interface Props {
  profile: Maybe<Profile> | undefined
  width?: number
  height?: number
  fontSize?:
    | "text-sm"
    | "text-base"
    | "text-lg"
    | "text-xl"
    | "text-2xl"
    | "text-4xl"
    | "text-6xl"
  withLink?: boolean
}

export default function Avatar({
  profile,
  width = 40,
  height = 40,
  fontSize = "text-base",
  withLink = true,
}: Props) {
  const profileColor = profile?.defaultColor
  const bgColor = profileColor || "#f97316"

  return withLink ? (
    <Link href={`/@${profile?.name}`}>
      <div
        className={`flex items-center justify-center rounded-full overflow-hidden cursor-pointer`}
        style={{
          width,
          height,
        }}
      >
        {!profile || !profile.image ? (
          !profile ? (
            <div className="w-full h-full flex items-center justify-center bg-blueBase text-white text-xs">
              VW
            </div>
          ) : (
            <div
              className={`w-full h-full flex items-center justify-center text-white ${fontSize}`}
              style={{ backgroundColor: bgColor }}
            >
              {profile.displayName
                ? profile.displayName.slice(0, 1).toUpperCase()
                : "A"}
            </div>
          )
        ) : (
          <div style={{ width, height, position: "relative" }}>
            <Image
              src={profile.image}
              alt={profile.displayName || ""}
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
        )}
      </div>
    </Link>
  ) : (
    <div
      className={`flex items-center justify-center rounded-full overflow-hidden cursor-pointer`}
      style={{
        width,
        height,
      }}
    >
      {!profile || !profile.image ? (
        !profile ? (
          <div className="w-full h-full flex items-center justify-center bg-blueBase text-white text-xs">
            VW
          </div>
        ) : (
          <div
            className={`w-full h-full flex items-center justify-center text-white ${fontSize}`}
            style={{ backgroundColor: bgColor }}
          >
            {profile.displayName
              ? profile.displayName.slice(0, 1).toUpperCase()
              : "A"}
          </div>
        )
      ) : (
        <div style={{ width, height, position: "relative" }}>
          <Image
            src={profile.image}
            alt={profile.displayName || ""}
            fill
            style={{ objectFit: "cover" }}
          />
        </div>
      )}
    </div>
  )
}
