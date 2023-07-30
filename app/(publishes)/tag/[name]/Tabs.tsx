"use client"

import React from "react"
import { useParams } from "next/navigation"

import LinkTab from "@/components/LinkTab"
import { publishTypes } from "@/lib/helpers"

interface Props {
  tag: string
}

export default function Tabs({ tag }: Props) {
  const params = useParams() as { name: string; type: string }

  return (
    <div className="flex gap-x-1 sm:gap-x-4">
      <LinkTab href={`/tag/${tag}`} name="ALL" isActive={!params.type} />
      {publishTypes.map((k) =>
        k.toLowerCase() === "ads" ? null : (
          <LinkTab
            key={k}
            href={`/tag/${tag}/${k.toLowerCase()}`}
            name={k.toUpperCase()}
            isActive={params.type === k.toLowerCase()}
          />
        )
      )}
    </div>
  )
}
