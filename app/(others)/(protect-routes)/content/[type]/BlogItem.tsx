import React, { useCallback } from "react"
import { useRouter } from "next/navigation"
import { BsEye, BsEyeSlash } from "react-icons/bs"
import {
  MdOutlineCheckBox,
  MdOutlineCheckBoxOutlineBlank,
} from "react-icons/md"

import { formatDate, getPostExcerpt } from "@/lib/client"
import { useSubscribeToUpdates } from "@/hooks/useSubscribe"
import type { Publish } from "@/graphql/codegen/graphql"

interface Props {
  blog: Publish
  isSelected: boolean
  selectItem: (id: string) => void
}

export default function BlogItem({ blog, isSelected, selectItem }: Props) {
  const isDeleting = blog.deleting

  const router = useRouter()
  // Subscribe to update on Firestore
  useSubscribeToUpdates(blog?.id)

  const onClickItem = useCallback(
    (id: string) => {
      router.push(`/upload/${id}`)
    },
    [router]
  )

  return (
    <tr
      className={`relative text-sm hover:bg-gray-50 ${
        isDeleting ? "opacity-30" : "opacity-100 cursor-pointer"
      }`}
    >
      <th className="w-[6%] lg:w-[3%]">
        {isSelected ? (
          <MdOutlineCheckBox
            size={25}
            onClick={selectItem.bind(undefined, blog.id)}
          />
        ) : (
          <MdOutlineCheckBoxOutlineBlank
            size={24}
            onClick={selectItem.bind(undefined, blog.id)}
          />
        )}
      </th>
      <th className="w-[30%] sm:w-[20%] lg:w-[15%] xl:w-[12%] font-normal py-2 break-words">
        <div className="w-full h-full flex items-center justify-center">
          {blog.thumbnail ? (
            <div className="w-full h-full bg-black">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={blog.thumbnail}
                alt={blog.title || blog.filename || ""}
                className="w-full h-[64px] sm:h-[50px] xl:h-[64px] object-cover"
              />
            </div>
          ) : (
            <p>-</p>
          )}
        </div>
      </th>
      <th
        className="w-[40%] sm:w-[40%] lg:w-[35%] xl:w-[35%] px-2 py-1 font-normal break-words"
        onClick={isDeleting ? undefined : onClickItem.bind(undefined, blog.id)}
      >
        {getPostExcerpt(blog.title || "", 60)}
      </th>
      {isDeleting ? (
        <>
          <th className="xl:col-span-7 text-error text-center">Deleting...</th>
          <th className="w-[30%] sm:w-[20%] lg:w-[10%] xl:w-[11%] font-normal py-2 break-words"></th>
          <th className="hidden lg:table-cell w-[20%] lg:w-[10%] xl:w-[7%] font-normal py-2 break-words"></th>
          <th className="hidden lg:table-cell w-[20%] lg:w-[10%] xl:w-[7%] font-normal py-2 break-words"></th>
          <th className="hidden xl:table-cell w-[20%] xl:w-[7%] font-normal py-2 break-words"></th>
          <th className="hidden lg:table-cell w-[20%] lg:w-[10%] xl:w-[7%] font-normal py-2 break-words"></th>
          <th className="hidden xl:table-cell xl:w-[7%] font-normal py-2 break-words"></th>
        </>
      ) : (
        <>
          <th className="hidden sm:table-cell sm:w-[20%] lg:w-[10%] xl:w-[7%] font-normal py-2 break-words">
            <div className="flex flex-col sm:flex-row items-center justify-center">
              {blog.visibility === "public" ? (
                <BsEye className="text-green-600" />
              ) : blog.visibility === "private" ? (
                <BsEyeSlash className="text-red-600" />
              ) : null}{" "}
              <span
                className={`mt-2 sm:mt-0 sm:ml-2 ${
                  blog.visibility === "draft" ? "font-thin mt-0" : "font-normal"
                }`}
              >
                {blog.visibility}
              </span>
            </div>
          </th>
          <th className="w-[30%] sm:w-[20%] lg:w-[10%] xl:w-[11%] font-normal py-2 break-words">
            {formatDate(new Date(blog.createdAt))}
          </th>
          <th className="hidden lg:table-cell w-[20%] lg:w-[10%] xl:w-[7%] font-normal py-2 break-words">
            {blog.views}
          </th>
          <th className="hidden lg:table-cell w-[20%] lg:w-[10%] xl:w-[7%] font-normal py-2 break-words">
            {blog.tipsCount}
          </th>
          <th className="hidden xl:table-cell w-[20%] xl:w-[7%] font-normal py-2 break-words">
            {blog.commentsCount}
          </th>
          <th className="hidden lg:table-cell w-[20%] lg:w-[10%] xl:w-[7%] font-normal py-2 break-words">
            {blog.likesCount}
          </th>
          {/* <th className="hidden xl:table-cell xl:w-[7%] font-normal py-2 break-words">
            {blog.disLikesCount}
          </th> */}
        </>
      )}
    </tr>
  )
}
