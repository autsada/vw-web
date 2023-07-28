import React from "react"
import Link from "next/link"
import { BsDot } from "react-icons/bs"

import { calculateTimeElapsed, getPostExcerpt } from "@/lib/client"
import type { Publish } from "@/graphql/codegen/graphql"

interface Props {
  publish: Publish | null | undefined
}

export default function BlogItem({ publish }: Props) {
  const thumbnail = publish?.thumbnail

  if (!publish) return null

  return (
    <div className="w-full sm:w-[220px] cursor-pointer flex sm:flex-col gap-x-2 sm:gap-x-0 sm:gap-y-2">
      <Link href={`/read/${publish.id}`}>
        <div className="relative w-[180px] sm:w-full h-[100px] sm:h-[120px] bg-neutral-100 hover:bg-neutral-200 rounded-lg overflow-hidden">
          <div className="w-full h-full px-2 flex items-center">
            <div className="flex-grow h-full">
              {publish.blog?.excerpt && (
                <p className="mt-1 text-sm">
                  {getPostExcerpt(publish.blog.excerpt, 120)}
                </p>
              )}
            </div>
            {thumbnail && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={thumbnail || ""}
                alt={publish.title || ""}
                className="h-[30px] w-[30px] object-cover"
              />
            )}
          </div>

          <div className="absolute bottom-2 right-2 px-[2px] rounded-sm bg-black text-white font-semibold italic text-xs flex items-center justify-center">
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
            <p className="text-textLight text-sm sm:text-base">
              {publish.blog?.readingTime}
            </p>
            <BsDot className="black" />
            <p className="text-textLight text-sm sm:text-base">
              {calculateTimeElapsed(publish.createdAt)}
            </p>
          </div>
        </Link>
      </div>
    </div>
  )
}
