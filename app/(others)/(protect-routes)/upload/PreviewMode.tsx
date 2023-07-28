import React from "react"
import parse from "html-react-parser"

import Avatar from "@/components/Avatar"
import ProfileName from "@/components/ProfileName"
import PreviewReactions from "./PreviewReactions"
import { formatDate } from "@/lib/client"
import type { Profile } from "@/graphql/codegen/graphql"

interface Props {
  profile: Profile
  title?: string
  hashTags?: string[]
  imageUrl?: string
  imageName?: string
  content: string
}

export default function PreviewMode({
  profile,
  title,
  hashTags,
  imageUrl,
  imageName,
  content,
}: Props) {
  return (
    <div className="h-max min-h-full w-full md:w-[650px] lg:w-[700px] xl:w-[750px] mx-auto">
      {imageUrl && (
        <div className="mb-2 sm:mb-3 md:mb-4 lg:mb-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={imageName || ""}
            className="w-full h-[200px] md:h-[300px] lg:h-[320px] xl:h-[350px] object-cover"
          />
        </div>
      )}

      <div className="px-2 py-2">
        <div className="flex items-start justify-between h-[50px] gap-x-4">
          <Avatar profile={profile} withLink={false} />
          <div className="relative flex-grow h-full">
            <ProfileName profile={profile} withLink={false} />
            <p className="text-sm">
              {profile.followersCount || 0}{" "}
              <span className="text-textExtraLight">Followers</span>
            </p>
          </div>
          <button
            type="button"
            className="btn-orange mx-0 text-sm sm:text-base w-[100px] sm:w-[110px] rounded-full"
          >
            Follow
          </button>
        </div>

        <div className="mb-2 py-4 w-full overflow-x-auto scrollbar-hide">
          <PreviewReactions />
        </div>

        <div className="w-full">
          <p className="mb-2 italic font-light text-textLight text-sm">
            Posted on {formatDate(new Date())}
          </p>
          <div className="mb-4">
            <h1 className="mb-1 text-3xl md:text-4xl xl:text-5xl xl:leading-[3.5rem]">
              {title}
            </h1>
            {hashTags && hashTags.length > 0 && (
              <div className="w-max flex items-center gap-4 cursor-pointer">
                {hashTags.map((tag) => (
                  <p key={tag} className="font-light text-textLight">
                    #{tag}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>

        <article className="mt-10 pb-20 prose md:prose-lg lg:prose-xl prose-a:text-blue-500 prose-blockquote:font-light prose-blockquote:italic prose-p:text-base md:prose-p:text-lg xl:prose-p:text-xl">
          {parse(content)}
        </article>
      </div>
    </div>
  )
}
