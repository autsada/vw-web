import React, { useCallback, useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { IoSettingsOutline, IoSettings } from "react-icons/io5"
import { MdOutlineVideoLibrary, MdVideoLibrary } from "react-icons/md"
import { BsCollectionPlay, BsCollectionPlayFill } from "react-icons/bs"
import { useDisconnect } from "wagmi"

import ActiveLink from "./ActiveLink"
import Backdrop from "../Backdrop"
import Avatar from "../Avatar"
import ButtonLoader from "../ButtonLoader"
import ProfileItem from "./ProfileItem"
import Mask from "../Mask"
import { firebaseAuth } from "@/firebase/config"
import type { Maybe, Profile } from "@/graphql/codegen/graphql"

interface Props {
  profile: Maybe<Profile> | undefined
  profiles: Profile[] // All user's profiles
  isOpen: boolean
  closeDrawer: () => void
}

export default function RightDrawer({
  profile,
  profiles,
  isOpen = false,
  closeDrawer,
}: Props) {
  const nonActiveProfiles = profiles.filter((p) => p.id !== profile?.id)
  const [loading, setLoading] = useState(false)
  const [isProfilesExpanded, setIsProfilesExpanded] = useState(false)
  const [switchLoading, setSwitchLoading] = useState(false)

  const router = useRouter()
  const { disconnect } = useDisconnect()

  // Disable body scroll when modal openned
  useEffect(() => {
    const els = document?.getElementsByTagName("body")
    if (isOpen) {
      if (els[0]) {
        els[0].style.overflow = "hidden"
      }
    } else {
      if (els[0]) {
        els[0].style.overflow = "auto"
      }
    }
  }, [isOpen])

  // Reset profiles expanded state when the modal is close
  useEffect(() => {
    if (!isOpen) {
      setIsProfilesExpanded(false)
    }
  }, [isOpen])

  const signOut = useCallback(async () => {
    try {
      setLoading(true)
      await firebaseAuth.signOut()
      if (disconnect) disconnect()
      // Reload data
      router.refresh()
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }, [disconnect, router])

  const viewProfiles = useCallback(() => {
    setIsProfilesExpanded(true)
  }, [])

  const unViewProfiles = useCallback(() => {
    setIsProfilesExpanded(false)
  }, [])

  const switchProfile = useCallback(
    async (profileId: string) => {
      try {
        setSwitchLoading(true)
        const result = await fetch(`/api/profile/switch`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ profileId }),
        })

        const data = await result.json()
        if (data?.status === "Ok") {
          // Reload data
          router.refresh()
          setSwitchLoading(false)
          closeDrawer()
        }
      } catch (error) {
        setSwitchLoading(false)
      }
    },
    [closeDrawer, router]
  )

  return (
    <>
      <div
        className={`fixed z-50 pb-20 ${
          isOpen ? "top-0 bottom-0 right-0" : "top-0 bottom-0 -right-[100%]"
        } w-[300px] bg-white transition-all duration-300 overflow-y-auto`}
      >
        <div className="relative w-full px-2 sm:px-5 flex items-center justify-center">
          <div
            className={`absolute ${
              !isProfilesExpanded ? "right-2" : "left-2"
            } top-1 px-2`}
          >
            <button
              type="button"
              className="text-xl text-textExtraLight"
              onClick={!isProfilesExpanded ? closeDrawer : unViewProfiles}
            >
              {!isProfilesExpanded ? <>&#10005;</> : <>&#10094;</>}
            </button>
          </div>

          <div className="w-full py-8 px-5 flex items-center">
            {!isProfilesExpanded && (
              <>
                <div className="w-[60px]">
                  <Avatar profile={profile} width={60} height={60} />
                </div>
                <div className="w-full ml-4">
                  {profile ? (
                    <>
                      <h6>{profile?.displayName}</h6>
                      <p className="text-textLight">@{profile?.name}</p>
                    </>
                  ) : (
                    <div className="font-light text-center px-2 py-1 rounded-md hover:bg-neutral-100">
                      <Link href="/settings/profiles">
                        <span className="font-semibold text-textRegular cursor-pointer">
                          Create
                        </span>{" "}
                        a profile to get started.
                      </Link>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {isProfilesExpanded ? (
          <div className="px-5 flex flex-col gap-y-2 overflow-y-auto">
            <div className="relative">
              {profile && (
                <ProfileItem
                  key={profile.id}
                  profile={profile}
                  defaultId={profile?.id || ""}
                  switchProfile={switchProfile}
                />
              )}
              {nonActiveProfiles.length > 0 &&
                nonActiveProfiles.map((p) => (
                  <ProfileItem
                    key={p.id}
                    profile={p}
                    defaultId={profile?.id || ""}
                    switchProfile={switchProfile}
                  />
                ))}
              {switchLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white opacity-60">
                  <ButtonLoader loading color="#2096F3" />
                </div>
              )}
            </div>

            <div className="mt-2">
              <Link href="/settings/profiles">
                <p className="font-light text-textLight hover:text-textExtraLight cursor-pointer">
                  View all profiles
                </p>
              </Link>
            </div>
          </div>
        ) : (
          <>
            {profiles?.length > 1 && (
              <div className="relative px-5">
                <div
                  className="px-5 flex items-center justify-between cursor-pointer py-2 hover:bg-gray-100 rounded-md"
                  onClick={viewProfiles}
                >
                  <p className="font-light">Switch profile</p>
                  <p className="font-light text-textLight">&#10095;</p>
                </div>
              </div>
            )}

            <div className="w-full px-5 mt-5">
              <ActiveLink
                name="Profile"
                href={profile ? `/profile/${profile.id}` : "/profile"}
                ActiveIcon={MdVideoLibrary}
                InActiveIcon={MdOutlineVideoLibrary}
              />
            </div>
            <div className="w-full px-5 mt-5">
              <ActiveLink
                name="Uploads"
                href="/upload/publishes"
                ActiveIcon={BsCollectionPlayFill}
                InActiveIcon={BsCollectionPlay}
              />
            </div>
            <div className="w-full px-5 mt-5">
              <ActiveLink
                name="Settings"
                href="/settings"
                ActiveIcon={IoSettings}
                InActiveIcon={IoSettingsOutline}
              />
            </div>

            <div className="mt-10">
              <button
                type="button"
                className="text-lg text-orangeDark"
                disabled={loading}
                onClick={signOut}
              >
                {loading ? (
                  <ButtonLoader loading color="#ff8138" />
                ) : (
                  "Sign out"
                )}
              </button>
            </div>
          </>
        )}
      </div>
      <Backdrop visible={isOpen} onClick={closeDrawer} />

      {(switchLoading || loading) && <Mask />}
    </>
  )
}
