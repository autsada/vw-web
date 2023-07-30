import React from "react"
import Link from "next/link"
import { HiDotsVertical } from "react-icons/hi"
import { BsDot } from "react-icons/bs"

import Avatar from "@/components/Avatar"
import ProfileName from "@/components/ProfileName"
import { calculateTimeElapsed, getPostExcerpt } from "@/lib/client"
import type { Publish } from "@/graphql/codegen/graphql"

interface Props {
  publish: Publish | null | undefined
  onOpenActions: (p: Publish) => void
  setPOS: (posX: number, posY: number, screenHeight: number) => void
}

export default function BlogItem({ publish, onOpenActions, setPOS }: Props) {
  const thumbnail = publish?.thumbnail

  function onClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (!publish) return
    onOpenActions(publish)
    setPOS(e.clientX, e.clientY, window?.innerHeight)
  }

  if (!publish) return null

  return (
    <div className="relative w-full md:w-full lg:max-w-[380px] bg-white cursor-pointer">
      <Link href={`/read/${publish.id}`}>
        <div className="relative h-[240px] sm:h-[300px] md:h-[180px] lg:h-[220px] xl:h-[200px] bg-neutral-900 hover:bg-neutral-800 rounded-none sm:rounded-xl overflow-hidden">
          <h6 className="text-base sm:text-lg px-2 py-1 text-white">
            {getPostExcerpt(publish.title || "", 60)}
          </h6>
          <div className="w-full h-full px-2 py-1 flex gap-x-2">
            <div className="flex-grow">
              {publish.blog?.excerpt && (
                <p className="mt-1 font-light text-sm text-textExtraLight">
                  {getPostExcerpt(publish.blog.excerpt, 200)}
                </p>
              )}
            </div>
            {thumbnail && ( // eslint-disable-next-line @next/next/no-img-element
              <img
                src={thumbnail || ""}
                alt={publish.title || ""}
                className="h-[60px] w-[60px] object-cover"
              />
            )}
          </div>

          <div className="absolute bottom-2 right-2 px-[2px] rounded-sm bg-black text-white font-semibold italic text-xs flex items-center justify-center">
            BLOGS
          </div>
        </div>
      </Link>

      <div className="flex items-start py-4 gap-x-2">
        <Avatar profile={publish.creator} />
        <div className="w-full text-left mr-8">
          <ProfileName profile={publish.creator} />
          <Link href={`/read/${publish.id}`}>
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

      <div
        className="absolute top-[250px] sm:top-[310px] md:top-[190px] lg:top-[230px] xl:top-[210px] right-0 py-2 px-1"
        onClick={onClick}
      >
        <HiDotsVertical />
      </div>
    </div>
  )
}
