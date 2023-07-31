import React from "react"
import Link from "next/link"
import { BsDot } from "react-icons/bs"

import Avatar from "@/components/Avatar"
import ProfileName from "@/components/ProfileName"
import { calculateTimeElapsed, getPostExcerpt } from "@/lib/client"
import type { Publish } from "@/graphql/codegen/graphql"

interface Props {
  publish: Publish
}

export default function ReadingListItem({ publish }: Props) {
  return (
    <div className="relative w-full">
      <div className="w-full flex items-stretch gap-x-2">
        <Avatar
          profile={publish.creator}
          fontSize="text-sm"
          width={35}
          height={35}
        />
        <div className="text-left">
          <ProfileName profile={publish.creator} />
          <div className="flex items-center gap-x-2">
            <p className="font-light text-textLight text-xs sm:text-sm">
              {calculateTimeElapsed(publish.createdAt)}
            </p>
            <BsDot className="black" />
            <p className="font-light text-textLight text-xs sm:text-sm">
              {publish.blog?.readingTime}
            </p>
          </div>
        </div>
        <div className="flex-grow cursor-pointer">
          <Link href={`/read/${publish.id}`}>
            <div className="w-full h-full"></div>
          </Link>
        </div>
      </div>

      <div className="mt-2 w-full">
        <Link href={`/read/${publish.id}`}>
          <h5 className="text-base sm:text-lg lg:text-xl hover:text-textLight cursor-pointer">
            {getPostExcerpt(publish.title || "", 100)}
          </h5>
          {publish.blog?.excerpt && (
            <p className="mt-1">{getPostExcerpt(publish.blog.excerpt, 100)}</p>
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
    </div>
  )
}
