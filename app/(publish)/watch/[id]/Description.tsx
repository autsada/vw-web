"use client"

import React from "react"

import { useExpandContent } from "@/hooks/useExpandContent"
import { formatDate } from "@/lib/client"

interface Props {
  createdAt: string
  description?: string | null
  showLen?: number
}

export default function Description({
  createdAt,
  description,
  showLen = 200,
}: Props) {
  const { displayedContent, expandContent, shrinkContent } = useExpandContent(
    description || "",
    showLen
  )

  if (!description) return null

  return (
    <div className="w-full my-1 py-1 px-2 sm:py-2 sm:px-4 bg-gray-100 rounded-md">
      <p className="font-semibold text-sm">{formatDate(new Date(createdAt))}</p>
      <p className="font-light text-sm text-textLight whitespace-pre-wrap">
        {displayedContent}{" "}
        {description.length > displayedContent.length && (
          <span
            className="ml-1 font-semibold cursor-pointer"
            onClick={expandContent}
          >
            Show more
          </span>
        )}
      </p>
      {description.length > showLen &&
        description.length === displayedContent.length && (
          <p
            className="mt-2 text-sm font-semibold cursor-pointer"
            onClick={shrinkContent}
          >
            Show less
          </p>
        )}
    </div>
  )
}
