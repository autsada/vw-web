import React, { useCallback } from "react"
import { useRouter } from "next/navigation"
import { BsEye, BsEyeSlash } from "react-icons/bs"
import {
  MdOutlineCheckBox,
  MdOutlineCheckBoxOutlineBlank,
} from "react-icons/md"

import ButtonLoader from "@/components/ButtonLoader"
import { formatDate, getPostExcerpt, secondsToHourFormat } from "@/lib/client"
import { useSubscribeToUpdates } from "@/hooks/useSubscribe"
import type { Publish } from "@/graphql/codegen/graphql"

interface Props {
  video: Publish
  isSelected: boolean
  selectItem: (id: string) => void
}

export default function VideoItem({ video, isSelected, selectItem }: Props) {
  const isDeleting = video.deleting

  const router = useRouter()
  // Subscribe to update on Firestore
  useSubscribeToUpdates(video?.id)

  const onClickItem = useCallback(
    (id: string) => {
      router.push(`/livestreaming/${id}`)
    },
    [router]
  )

  return (
    <tr
      className={`text-sm border-b border-neutral-800 ${
        isDeleting ? "opacity-30" : "opacity-100"
      }`}
    >
      <th className="w-[6%] sm:w-[5%]">
        {isSelected ? (
          <MdOutlineCheckBox
            size={25}
            className="text-white cursor-pointer"
            onClick={selectItem.bind(undefined, video.id)}
          />
        ) : (
          <MdOutlineCheckBoxOutlineBlank
            size={25}
            className="text-white cursor-pointer"
            onClick={selectItem.bind(undefined, video.id)}
          />
        )}
      </th>
      <th className="w-[24%] sm:w-[15%] lg:w-[12%] font-normal py-2 break-words">
        <div className="relative w-full h-full">
          {video.thumbnail || video.playback ? (
            <div className="w-full h-full bg-black">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  video.thumbnail && video.thumbnailType === "custom"
                    ? video.thumbnail
                    : video.playback?.thumbnail
                }
                alt={video.title || ""}
                className={`w-full h-full max-h-[64px] lg:max-h-[84px] ${
                  video.publishType === "Short"
                    ? "object-contain"
                    : "object-cover"
                }`}
              />
            </div>
          ) : (
            <button>
              <ButtonLoader loading color="#f97316" />
            </button>
          )}
          {video.playback && (
            <div className="absolute bottom-[1px] right-[2px] px-[2px] rounded-sm bg-white font-thin text-xs flex items-center justify-center">
              {secondsToHourFormat(video.playback?.duration)}
            </div>
          )}
        </div>
      </th>
      <th
        className="w-[40%] sm:w-[35%] lg:w-[33%] px-2 py-1 font-normal break-words cursor-pointer hover:text-blueBase hover:underline"
        onClick={isDeleting ? undefined : onClickItem.bind(undefined, video.id)}
      >
        {getPostExcerpt(video.title || "", 60)}
      </th>
      {isDeleting ? (
        <>
          <th className="text-error text-center">Deleting...</th>
          <th className="w-[15%] lg:w-[20%] font-normal py-2 break-words"></th>
          <th className="w-[28%] sm:w-[20%] lg:w-[10%] xl:w-[8%] font-normal py-2 break-words"></th>
          <th className="hidden sm:table-cell w-[10%] font-normal py-2 break-words"></th>
          <th className="hidden sm:table-cell w-[10%] font-normal py-2 break-words"></th>
        </>
      ) : (
        <>
          <th className="w-[15%] sm:w-[10%] font-normal py-2 break-words">
            <div className="flex flex-col sm:flex-row items-center justify-center">
              {video.visibility === "public" ? (
                <BsEye className="text-green-600" />
              ) : video.visibility === "private" ? (
                <BsEyeSlash className="text-red-600" />
              ) : null}{" "}
              <span
                className={`mt-2 sm:mt-0 sm:ml-2 ${
                  video.visibility === "draft"
                    ? "font-thin mt-0"
                    : "font-normal"
                }`}
              >
                {video.visibility}
              </span>
            </div>
          </th>
          <th className="w-[15%] lg:w-[20%] font-normal py-2 break-words">
            {formatDate(new Date(video.createdAt))}
          </th>
          <th className="hidden sm:table-cell w-[10%] font-normal py-2 break-words">
            {video.broadcastType}
          </th>
          <th className="hidden sm:table-cell w-[10%] font-normal py-2 break-words"></th>
        </>
      )}
    </tr>
  )
}
