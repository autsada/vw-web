import React from "react"
import Image from "next/image"

import ContentTabs from "./ContentTabs"
import ProfileName from "@/components/ProfileName"
import ManageFollow from "@/components/ManageFollow"
import FollowsLink from "./FollowsLink"
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

          <div className="relative ml-2 sm:ml-6 flex-grow flex">
            <div className="flex-grow">
              <ProfileName profile={profile} />
              {/* <h4 className="font-semibold text-lg sm:text-xl">
                {profile?.displayName}
              </h4>
              <p className="text-textLight">@{profile?.name}</p> */}
              <div className="mt-2 flex gap-x-2 sm:gap-x-4">
                <FollowsLink profile={profile} />
                <p className="text-sm sm:text-base font-light text-textLight">
                  <span className="text-textRegular">
                    {profile?.publishesCount}
                  </span>{" "}
                  Publishes
                </p>
              </div>
            </div>

            <div className="w-max flex items-center justify-end">
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
