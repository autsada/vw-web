import React from "react"
import Image from "next/image"

import ContentTabs from "./ContentTabs"
import ManageFollow from "@/app/(publish)/watch/[id]/ManageFollow"
import type { Profile } from "@/graphql/codegen/graphql"

interface Props {
  isAuthenticated: boolean
  profile: Profile
}

export default function ProfileTemplate({ isAuthenticated, profile }: Props) {
  const profileColor = profile?.defaultColor
  const bgColor = profileColor || "#ff8138"

  return (
    <>
      {profile?.bannerImage && (
        <div className="relative w-full h-[120px] sm:h-[160px] md:h-[200px]">
          <Image
            src={profile.bannerImage}
            alt={profile?.displayName}
            fill
            style={{ objectFit: "cover" }}
          />
        </div>
      )}

      <div className="mt-2">
        <div className="relative flex mt-5">
          <div className="relative flex items-center justify-center w-[70px] h-[70px] sm:w-[100px] sm:h-[100px] rounded-full overflow-hidden cursor-pointer">
            {!profile || !profile.image ? (
              !profile ? (
                <div className="w-full h-full flex items-center justify-center bg-blue-500 text-white text-xs">
                  VW
                </div>
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center text-white"
                  style={{ backgroundColor: bgColor }}
                >
                  {profile.displayName.slice(0, 1).toUpperCase()}
                </div>
              )
            ) : (
              <Image
                src={profile.image}
                alt={profile.displayName}
                fill
                style={{ objectFit: "cover" }}
              />
            )}
          </div>

          <div className="relative ml-2 sm:ml-6 flex-grow">
            <h4 className="font-semibold text-lg sm:text-xl">
              {profile?.displayName}
            </h4>
            <p className="text-textLight">@{profile?.name}</p>
            <div className="mt-2 flex gap-x-2 sm:gap-x-4">
              <p className="text-sm sm:text-base font-light text-textExtraLight">
                <span className="text-textRegular">
                  {profile?.followersCount}
                </span>{" "}
                Followers
              </p>
              {profile?.isOwner && (
                <p className="text-sm sm:text-base font-light text-textExtraLight">
                  <span className="text-textRegular">
                    {profile?.followingCount}
                  </span>{" "}
                  Following
                </p>
              )}
              <p className="text-sm sm:text-base font-light text-textExtraLight">
                <span className="text-textRegular">
                  {profile?.publishesCount}
                </span>{" "}
                Publishes
              </p>
            </div>

            <div className="absolute inset-0 pr-0 sm:pr-5 lg:pr-10 flex items-start sm:items-center justify-end">
              <ManageFollow
                isAuthenticated={isAuthenticated}
                follow={profile}
                ownerHref="/settings"
                ownerLinkText="Edit"
              />
            </div>
          </div>
        </div>

        <div className="mt-4 py-2">
          <ContentTabs profile={profile} />
        </div>
      </div>
    </>
  )
}
