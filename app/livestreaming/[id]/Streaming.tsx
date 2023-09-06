"use client"

import React, { useState, useCallback, useRef } from "react"

import StreamModal from "../StreamModal"
import WebCamLive, { Ref as WebCamLiveRef } from "./WebCamLive"
import PreviewModal from "./PreviewModal"
import Mask from "@/components/Mask"
import type {
  Maybe,
  Profile,
  Publish,
  CreateLiveInputResponse as LiveInput,
} from "@/graphql/codegen/graphql"

interface Props {
  profile: Profile
  publish: Maybe<Publish> | undefined
  liveInput?: Maybe<LiveInput> | undefined
}

export default function Streaming({ profile, publish, liveInput }: Props) {
  const [mode, setMode] = useState<"preview" | "edit" | undefined>("preview")
  const [streaming, setStreaming] = useState(false)
  const [cameraDevices, setCameraDevices] = useState<MediaDeviceInfo[]>([])
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([])
  const [loading, setLoading] = useState(false) // For use to set spinner before going live

  const webCamLiveRef = useRef<WebCamLiveRef>(null)

  const changeToEdit = useCallback(() => {
    setMode("edit")
  }, [])

  const goLive = useCallback(async () => {
    if (!publish?.id) return

    try {
      if (webCamLiveRef.current?.startStreaming) {
        setLoading(true)
        setMode(undefined)

        const result = await fetch(`/api/stream/live`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            publishId: publish.id,
          }),
        })
        const data = (await result.json()) as { status: string }
        if (data.status === "Ok") {
          setLoading(false)
          setStreaming(true)
          webCamLiveRef.current.startStreaming()
        }
      }
    } catch (error) {
      setLoading(false)
    }
  }, [publish?.id])

  const endEditStream = useCallback(() => {
    if (streaming) {
      setMode(undefined)
    } else {
      setMode("preview")
    }
  }, [streaming])

  if (!publish || !liveInput) return null

  return (
    <>
      <div className="relative z-[100] h-full w-full flex flex-col sm:flex-row">
        <div
          className={`${
            mode === "preview" ? "relative" : ""
          } h-full sm:flex-grow`}
        >
          <WebCamLive
            ref={webCamLiveRef}
            broadcastType={publish?.broadcastType}
            editStream={changeToEdit}
            streaming={streaming}
            loading={loading}
            setStreaming={setStreaming}
            setCameraDevices={setCameraDevices}
            setAudioDevices={setAudioDevices}
            streamKey={liveInput.result?.rtmps?.streamKey}
          />

          {mode === "edit" ? (
            <StreamModal
              modalName="Update stream"
              profileName={profile.name}
              publish={publish}
              closeModal={endEditStream}
            />
          ) : mode === "preview" ? (
            <PreviewModal
              profile={profile}
              publish={publish}
              changeToEdit={changeToEdit}
              goLive={goLive}
              cameraDevices={cameraDevices}
              audioDevices={audioDevices}
            />
          ) : null}
        </div>
        <div className="h-full w-full sm:w-[200px] md:w-[280px] lg:w-[320px] xl:w-[380px] bg-blue-600">
          Comments
        </div>
      </div>
      {streaming && <Mask />}
    </>
  )
}
