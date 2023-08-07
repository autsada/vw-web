import React from "react"
import Link from "next/link"
import Image from "next/image"
import { BsDot } from "react-icons/bs"

import { calculateTimeElapsed, getPostExcerpt } from "@/lib/client"
import { DEFAULT_BLOG_COVER_URL } from "@/lib/constants"
import type { Publish } from "@/graphql/codegen/graphql"

interface Props {
  publish: Publish | null | undefined
}

export default function BlogItem({ publish }: Props) {
  const thumbnail = publish?.thumbnail || DEFAULT_BLOG_COVER_URL

  if (!publish) return null

  return (
    <div className="w-full sm:w-[220px] cursor-pointer flex sm:flex-col gap-x-2 sm:gap-x-0 sm:gap-y-2">
      <Link href={`/read/${publish.id}`}>
        <div className="relative w-[180px] sm:w-full h-[100px] sm:h-[120px] bg-neutral-700 hover:bg-neutral-800 rounded-none sm:rounded-xl overflow-hidden">
          <div className="relative h-[60%] min-h-[60%]">
            {thumbnail && (
              <Image
                src={thumbnail || ""}
                alt={publish.title || ""}
                fill
                style={{ objectFit: "cover" }}
              />
            )}
          </div>
          <div className="px-2">
            {publish.blog?.excerpt && (
              <p className="mt-1 font-light text-xs text-white">
                {getPostExcerpt(publish.blog.excerpt, 60)}
              </p>
            )}
          </div>

          <div className="absolute bottom-2 right-2 px-[2px] rounded-sm bg-white text-xs flex items-center justify-center">
            BLOGS
          </div>
        </div>
      </Link>

      <div className="flex-grow text-left mr-4">
        <Link href={`/watch/${publish.id}`}>
          <h6 className="text-sm sm:text-base">
            {getPostExcerpt(publish.title || "", 40)}
          </h6>
        </Link>
        <Link href={`/watch/${publish.id}`}>
          <div className="flex items-center gap-x-[2px]">
            <p className="font-light text-textLight text-sm sm:text-base">
              {publish.blog?.readingTime}
            </p>
            <BsDot className="black" />
            <p className="font-light text-textLight text-sm sm:text-base">
              {calculateTimeElapsed(publish.createdAt)}
            </p>
          </div>
        </Link>
      </div>
    </div>
  )
}
