import React, { useState, useCallback } from "react"
import Image from "next/image"
import { BsMicFill, BsCameraVideo } from "react-icons/bs"
import { IoCaretDownSharp } from "react-icons/io5"

import ShareModal from "@/components/ShareModal"
import type {
  Maybe,
  Profile,
  Publish,
  CreateLiveInputResult as LiveInput,
} from "@/graphql/codegen/graphql"
import { BASE_URL } from "@/lib/constants"

interface Props {
  profile: Profile
  publish: Maybe<Publish> | undefined
  liveInput?: LiveInput
  changeToEdit: () => void
  goLive: () => void
  cameraDevices: MediaDeviceInfo[]
  audioDevices: MediaDeviceInfo[]
}

export default function PreviewModal({
  profile,
  publish,
  changeToEdit,
  goLive,
  cameraDevices,
  audioDevices,
}: Props) {
  const thumbnail = publish?.thumbnail ?? profile?.image
  const tags = !publish?.tags ? [] : publish.tags.split(" | ")

  const [shareModalVisible, setShareModalVisible] = useState(false)

  const openShareModal = useCallback(() => {
    setShareModalVisible(true)
  }, [])

  const closeShareModal = useCallback(() => {
    setShareModalVisible(false)
  }, [])

  const onStartShare = useCallback(async () => {
    if (typeof window === "undefined" || !publish) return

    const shareData = {
      title: publish.title || "",
      text: publish.title || "",
      url: `${BASE_URL}/watch/${publish.id}`,
    }

    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData)
      } catch (error) {
        console.error(error)
      }
    } else {
      openShareModal()
    }
  }, [publish, openShareModal])

  return (
    <>
      <div className="absolute z-10 inset-0 flex items-center justify-center">
        <div className="absolute inset-0 z-10 bg-black opacity-60"></div>
        <div className="relative z-20 w-[90%] md:w-[80%] lg:w-[70%] xl:w-[60%] h-[100%] bg-white rounded-md flex flex-col">
          <div className="w-full h-[50px] px-5 flex items-center justify-between border-b border-neutral-100">
            <h6>Stream preview</h6>
          </div>
          <div className="flex-grow flex flex-col overflow-y-auto">
            <div className="relative min-h-[250px] h-[250px] w-full">
              {thumbnail && (
                <Image
                  src={thumbnail}
                  alt={publish?.title!}
                  fill
                  style={{ objectFit: "cover" }}
                />
              )}
            </div>
            <div className="flex-grow flex p-5">
              <div className="flex-grow">
                <div className="mb-2">
                  <p className="text-sm text-textExtraLight">Title</p>
                  <p className="text-textRegular">{publish?.title}</p>
                </div>
                {publish?.description && (
                  <div className="mb-2">
                    <p className="text-sm text-textExtraLight">Description</p>
                    <p className="text-textRegular">{publish?.description}</p>
                  </div>
                )}
                <div className="mb-2">
                  <p className="text-sm text-textExtraLight">
                    Primary category
                  </p>
                  <p className="text-textRegular">{publish?.primaryCategory}</p>
                </div>
                {publish?.secondaryCategory && (
                  <div className="mb-2">
                    <p className="text-sm text-textExtraLight">
                      Secondary category
                    </p>
                    <p className="text-textRegular">
                      {publish?.secondaryCategory}
                    </p>
                  </div>
                )}
                {tags.length > 0 && (
                  <div className="mb-2">
                    <p className="text-sm text-textExtraLight">Tags</p>
                    <div className="flex gap-x-2">
                      {tags.map((tag) => (
                        <p key={tag} className="text-textRegular">
                          #{tag}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
                <div className="mb-2">
                  <p className="text-sm text-textExtraLight">Visibility</p>
                  <p className="text-textRegular">
                    {publish?.visibility === "public" ? "Public" : "Private"}
                  </p>
                </div>
                <div className="mb-2">
                  <p className="text-sm text-textExtraLight">Broadcast type</p>
                  <p className="text-textRegular">
                    {publish?.broadcastType === "webcam"
                      ? "Webcam"
                      : "External software"}
                  </p>
                </div>
                <div className="mb-2 w-full">
                  <div className="relative flex items-center gap-x-2 py-1 text-textRegular">
                    <BsCameraVideo size={18} />
                    <select
                      className="relative z-10 w-full bg-transparent appearance-none outline-none focus:outline-none cursor-pointer text-sm"
                      defaultValue={cameraDevices[0]?.label}
                    >
                      {cameraDevices.map((cam) => (
                        <option key={cam.deviceId} value={cam.label}>
                          {cam.label}
                        </option>
                      ))}
                    </select>
                    <div className="absolute z-0 top-0 right-2 h-full flex flex-col justify-center">
                      <IoCaretDownSharp />
                    </div>
                  </div>
                  <div className="relative flex items-center gap-x-2 py-4 text-textRegular">
                    <BsMicFill size={18} />
                    <select
                      className="relative z-10 w-full bg-transparent appearance-none outline-none focus:outline-none cursor-pointer text-sm"
                      defaultValue={audioDevices[0]?.label}
                    >
                      {audioDevices.map((aud) => (
                        <option key={aud.deviceId} value={aud.label}>
                          {aud.label}
                        </option>
                      ))}
                    </select>
                    <div className="absolute z-0 top-0 right-2 h-full flex flex-col justify-center">
                      <IoCaretDownSharp />
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-max">
                <button className="btn-light px-5 h-8" onClick={changeToEdit}>
                  EDIT
                </button>
              </div>
            </div>
          </div>
          <div className="w-full h-[50px] py-2 px-5 border-t border-neutral-100 flex items-center justify-end gap-x-10">
            <button
              type="submit"
              className="btn-dark mx-0 w-[80px] h-8 text-sm"
              onClick={onStartShare}
            >
              SHARE
            </button>
            <button
              type="submit"
              className="btn-blue mx-0 w-[80px] h-8 text-sm"
              onClick={goLive}
            >
              GO LIVE
            </button>
          </div>
        </div>
      </div>

      {shareModalVisible && (
        <ShareModal
          closeModal={closeShareModal}
          title={publish?.title || ""}
          shareUrl={`${BASE_URL}/watch/${publish?.id}`}
        />
      )}
    </>
  )
}
