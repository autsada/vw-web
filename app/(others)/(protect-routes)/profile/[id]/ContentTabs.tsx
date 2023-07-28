"use client"

import React from "react"
import { useParams } from "next/navigation"

import LinkTab from "@/components/LinkTab"
import { publishTypes } from "@/lib/helpers"
import type { Profile } from "@/graphql/codegen/graphql"

interface Props {
  profile: Profile
}

export default function ContentTabs({ profile }: Props) {
  const isOwner = profile.isOwner
  const params = useParams()
  const tab = params?.tab

  return (
    <div className="flex gap-x-1 sm:gap-x-4">
      <LinkTab href={`/@${profile.name}`} name="HOME" isActive={!tab} />
      {publishTypes.map((t) =>
        t === "ads" && !isOwner ? null : (
          <LinkTab
            key={t}
            href={`/@${profile.name}/${t.toLowerCase()}`}
            name={t.toUpperCase()}
            isActive={tab === t.toLowerCase()}
          />
        )
      )}
    </div>
  )
}
