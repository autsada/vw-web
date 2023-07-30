import React from "react"
import Link from "next/link"
import { BsDot } from "react-icons/bs"

import { calculateTimeElapsed, getPostExcerpt } from "@/lib/client"
import type { Publish } from "@/graphql/codegen/graphql"

interface Props {
  publish: Publish
}

export default function SidePanelItem({ publish }: Props) {
  return (
    <div className="relative w-full py-4">
      <Link href={`/read/${publish.id}`}>
        <h5 className="text-lg hover:text-blueBase cursor-pointer">
          {getPostExcerpt(publish.title || "", 100)}
        </h5>
        <div className="flex items-center gap-x-2">
          <p className="font-light text-textLight text-xs sm:text-sm">
            {calculateTimeElapsed(publish.createdAt)}
          </p>
          <BsDot className="black" />
          <p className="font-light text-textLight text-xs sm:text-sm">
            {publish.blog?.readingTime}
          </p>
        </div>
        {publish.blog?.excerpt && (
          <p className="mt-1">{getPostExcerpt(publish.blog.excerpt, 150)}</p>
        )}
      </Link>
      {publish.tags && publish.tags.split(" ").length > 0 && (
        <div className="mt-1 flex items-center gap-x-4">
          {publish.tags.split(" | ").map((tag) => (
            <Link key={tag} href={`/tag/${tag}`}>
              <div className="text-textLight text-sm px-2 py-1 rounded-full cursor-pointer hover:bg-neutral-100">
                #{tag}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
