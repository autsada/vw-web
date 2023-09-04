"use client"

import React from "react"
import { useParams } from "next/navigation"

import LinkTab from "@/components/LinkTab"
import { publishTypes } from "@/lib/helpers"
import type { Profile } from "@/graphql/codegen/graphql"

interface Props {
  profile: Profile
}

export default function PublishTabs({ profile }: Props) {
  const isOwner = profile?.isOwner
  const params = useParams()
  const tab = params?.type

  return (
    <>
      <h5 className="mb-4">Your {!tab ? "content" : tab}</h5>
      <div className="flex gap-x-4">
        {publishTypes.map((k) =>
          k === "ads" && !isOwner ? null : (
            <LinkTab
              key={k}
              href={k === "videos" ? `/content` : `/content/${k}`}
              name={k.toUpperCase()}
              isActive={!tab ? k === "videos" : tab === k}
            />
          )
        )}
      </div>
    </>
  )
}
