import React, { useState, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { AiOutlineLike, AiOutlineShareAlt, AiOutlineFlag } from "react-icons/ai"
import { BsBookmarkFill, BsBookmark, BsDot } from "react-icons/bs"
import { MdOutlineComment } from "react-icons/md"

import Avatar from "@/components/Avatar"
import ProfileName from "@/components/ProfileName"
import { calculateTimeElapsed, getPostExcerpt } from "@/lib/client"
import type { Publish } from "@/graphql/codegen/graphql"

interface Props {
  publish: Publish
  bookmarkHandler: (publishId: string, callback: () => void) => void
  onShare: (publish: Publish) => Promise<void>
  onReport: (publish: Publish) => void
}

export default function BlogItem({
  publish,
  bookmarkHandler,
  onShare,
  onReport,
}: Props) {
  const [optimisticBookmarked, setOptimisticBookmarked] = useState(
    !!publish.bookmarked
  )

  const bookmarkCallback = useCallback(() => {
    setOptimisticBookmarked((prev) => !prev)
  }, [])

  return (
    <div className="relative w-full py-4">
      <div className="w-full flex items-stretch gap-x-2">
        <Avatar profile={publish.creator} />
        <div className="text-left">
          <ProfileName profile={publish.creator} />
          <div className="flex items-center gap-x-2">
            <p className="font-light text-textLight text-xs sm:text-base">
              {calculateTimeElapsed(publish.createdAt)}
            </p>
            <BsDot className="black" />
            <p className="font-light text-textLight text-xs sm:text-base">
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

      <div className="mt-2 w-full grid grid-cols-6">
        <div className="col-span-6 sm:col-span-4">
          <Link href={`/read/${publish.id}`}>
            <h5 className="text-lg sm:text-xl lg:text-2xl hover:text-blueBase cursor-pointer">
              {publish.title || ""}
            </h5>
            {publish.blog?.excerpt && (
              <p className="mt-1 sm:text-[17px] lg:text-[18px]">
                {getPostExcerpt(publish.blog.excerpt, 150)}
              </p>
            )}
          </Link>
          {publish.tags && publish.tags.split(" ").length > 0 && (
            <div className="mt-1 flex items-center flex-wrap">
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
        <div className="hidden sm:flex sm:col-span-2 justify-end cursor-pointer">
          {publish.thumbnail && (
            <Link href={`/read/${publish.id}`}>
              <div className="relative w-[80px] h-[60px]">
                <Image
                  src={publish.thumbnail}
                  alt={publish.filename || publish.title || ""}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
            </Link>
          )}
        </div>
      </div>

      <div className="mt-2 py-1 flex items-center gap-x-4 lg:gap-x-5">
        <Link href={`/read/${publish.id}`}>
          <div className="h-full flex items-center gap-x-4 lg:gap-x-5">
            <div className="relative h-full flex items-center justify-center gap-x-2 cursor-pointer">
              <div className="h-full flex items-center justify-center">
                <AiOutlineLike size={22} className="text-2xl" />
              </div>
              <div className="h-full text-xs sm:text-sm flex items-center justify-center">
                {publish.likesCount}
              </div>
            </div>
            <div className="relative h-full flex items-center justify-center gap-x-2 cursor-pointer">
              <div className="h-full flex items-center justify-center">
                <MdOutlineComment size={20} className="text-2xl" />
              </div>
              <div className="h-full text-xs sm:text-sm flex items-center justify-center">
                {publish.commentsCount}
              </div>
            </div>
          </div>
        </Link>
        <div className="h-full px-2 flex items-center gap-x-4 lg:gap-x-5">
          <div
            className="relative h-full flex items-center justify-center cursor-pointer"
            onClick={bookmarkHandler.bind(
              undefined,
              publish.id,
              bookmarkCallback
            )}
          >
            {optimisticBookmarked ? (
              <BsBookmarkFill size={16} className="text-2xl" />
            ) : (
              <BsBookmark size={17} className="text-2xl" />
            )}
          </div>
          <div
            className="relative h-full flex items-center justify-center cursor-pointer"
            onClick={onShare.bind(undefined, publish)}
          >
            <AiOutlineShareAlt size={22} className="text-2xl" />
          </div>
          <div
            className="relative h-full flex items-center justify-center cursor-pointer"
            onClick={onReport.bind(undefined, publish)}
          >
            <AiOutlineFlag size={23} className="text-2xl" />
          </div>
        </div>
      </div>
    </div>
  )
}
