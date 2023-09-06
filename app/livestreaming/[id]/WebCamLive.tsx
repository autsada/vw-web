"use client"

import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react"
import { BsMicMuteFill, BsMicFill } from "react-icons/bs"
import { useRouter } from "next/navigation"

import ConfirmModal from "@/components/ConfirmModal"
import Mask from "@/components/Mask"
import PageLoaderWithInfo from "@/components/PageLoaderWithInfo"
import type { Maybe } from "@/graphql/codegen/graphql"
import type { BroadcastType } from "@/graphql/types"

interface Props {
  broadcastType: Maybe<BroadcastType> | undefined
  editStream: () => void
  streaming: boolean
  loading: boolean
  setStreaming: React.Dispatch<React.SetStateAction<boolean>>
  setCameraDevices: React.Dispatch<React.SetStateAction<MediaDeviceInfo[]>>
  setAudioDevices: React.Dispatch<React.SetStateAction<MediaDeviceInfo[]>>
  streamKey: string
}

export interface Ref {
  startStreaming: () => void
}

const getRecorderSettings = () => {
  if (MediaRecorder.isTypeSupported("video/mp4")) {
    return {
      format: "mp4",
      video: "h264",
      audio: "aac",
    }
  } else {
    return {
      format: "webm",
      audio: "opus",
      video: MediaRecorder.isTypeSupported("video/webm;codecs=h264")
        ? "h264"
        : "vp8",
    }
  }
}

const getRecorderMimeType = () => {
  const settings = getRecorderSettings()
  const codecs =
    settings.format === "webm"
      ? `;codecs="${settings.video}, ${settings.audio}"`
      : ""
  return `video/${settings.format}${codecs}`
}

const WebCamLive = forwardRef<Ref, Props>(function WebCamLive(
  {
    broadcastType,
    editStream,
    streaming,
    loading,
    setStreaming,
    setCameraDevices,
    setAudioDevices,
    streamKey,
  },
  ref
) {
  const [mute, setMute] = useState(false)
  const [connected, setConnected] = useState(false)
  const [liveDuration, setLiveDuration] = useState("00:00:00")
  const [willStop, setWillStop] = useState(false)
  const [stoping, setStoping] = useState(false)
  const [stopingInfo, setStopingInfo] = useState("")
  const [stopingError, setStopingError] = useState("")

  const inputStreamRef = useRef<MediaStream>()
  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder>()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wsRef = useRef<WebSocket>()
  const requestAnimationRef = useRef<number>()
  const startTimeRef = useRef(0)
  const router = useRouter()

  const toggleMute = useCallback(() => {
    if (inputStreamRef.current) {
      if (mute) {
        inputStreamRef.current.getAudioTracks().forEach((track) => {
          track.enabled = true
        })
      } else {
        inputStreamRef.current.getAudioTracks().forEach((track) => {
          track.enabled = false
        })
      }
    }
    setMute(!mute)
  }, [mute])

  const updateCanvas = useCallback(() => {
    if (videoRef.current?.ended || videoRef.current?.paused) return

    const ctx = canvasRef.current?.getContext("2d")

    if (ctx && videoRef.current && canvasRef.current) {
      ctx.drawImage(
        videoRef.current,
        0,
        0,
        videoRef.current.clientWidth,
        videoRef.current.clientHeight
      )

      // ctx.fillStyle = "#FB3C4E"
      // ctx.fillRect(10, 10, 60, 30)
      // const date = new Date()
      // const dateText = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
      // ctx.fillText(`${dateText}`, 10, 50, canvasRef.current.width - 20)
    }

    requestAnimationRef.current = requestAnimationFrame(updateCanvas)
  }, [])

  // Enable camera on load
  useEffect(() => {
    const constraints = {
      video: true,
      audio: true,
    }

    const enableCamera = async () => {
      try {
        if (!streamKey) {
          throw Error("Something not right")
        }

        if (videoRef.current) {
          if (
            !navigator.mediaDevices ||
            !navigator.mediaDevices.enumerateDevices
          ) {
            if (typeof window !== "undefined") {
              window.alert("The browser does not support media devices.")
            }
          } else {
            // Get video and audio input devices
            const devices = (
              await navigator.mediaDevices.enumerateDevices()
            ).filter(
              (dv) => dv.kind === "audioinput" || dv.kind === "videoinput"
            )
            setCameraDevices(devices.filter((dv) => dv.kind === "videoinput"))
            setAudioDevices(devices.filter((dv) => dv.kind === "audioinput"))

            inputStreamRef.current = await navigator.mediaDevices.getUserMedia(
              constraints
            )
            videoRef.current.srcObject = inputStreamRef.current
            await videoRef.current.play()

            // We need to set the canvas height/width to match the video element.
            if (canvasRef.current) {
              canvasRef.current.height = videoRef.current.clientHeight
              canvasRef.current.width = videoRef.current.clientWidth

              requestAnimationRef.current = requestAnimationFrame(updateCanvas)
            }
          }
        } else {
          window?.alert("Something not right")
        }
      } catch (error) {
        window?.alert("Error accessing webcam:")
      }
    }

    enableCamera()
  }, [updateCanvas, setCameraDevices, setAudioDevices, streamKey])

  useEffect(() => {
    return () => {
      if (requestAnimationRef.current) {
        cancelAnimationFrame(requestAnimationRef.current)
      }
    }
  }, [])

  // Stop camera
  const disableCamera = useCallback(() => {
    if (inputStreamRef.current) {
      inputStreamRef.current.getTracks().forEach((track) => track.stop())
    }
  }, [])

  // Stop camera if broadcast type is not Webcam or when the commponent unmount
  useEffect(() => {
    if (!broadcastType || broadcastType !== "webcam") {
      disableCamera()
    }

    return () => {
      disableCamera()
    }
  }, [broadcastType, disableCamera])

  const stopStreaming = useCallback(async () => {
    try {
      setStoping(true)
      setStopingInfo("Processing...")
      setStopingError("")

      if (mediaRecorderRef.current) {
        if (mediaRecorderRef.current.state === "recording") {
          mediaRecorderRef.current.stop()
          setStreaming(false)
        }
      }
      router.push("/livestreaming/manage")
    } catch (error) {
      setStoping(false)
      setStopingError("Cound not stop, please try again.")
      setStopingInfo("")
    }
  }, [setStreaming, router])

  const updateLiveDuration = useCallback(() => {
    const currentTime = new Date().getTime()
    const elapsedTime = currentTime - startTimeRef.current

    // Calculate hours, minutes, and seconds
    const hours = Math.floor(elapsedTime / 3600000)
    const minutes = Math.floor((elapsedTime % 3600000) / 60000)
    const seconds = Math.floor((elapsedTime % 60000) / 1000)

    // Format the duration as HH:MM:SS
    const formattedDuration = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
    setLiveDuration(formattedDuration)
  }, [])

  const startStreaming = useCallback(() => {
    if (!streamKey) return

    const settings = getRecorderSettings()
    const wsUrl = new URL(`${process.env.NEXT_PUBLIC_LIVE_BASE_URL}/rtmp`)
    wsUrl.searchParams.set("video", settings.video)
    wsUrl.searchParams.set("audio", settings.audio)
    wsUrl.searchParams.set("key", streamKey)

    wsRef.current = new WebSocket(wsUrl)

    if (wsRef.current && inputStreamRef.current && canvasRef.current) {
      wsRef.current.addEventListener("open", function open() {
        setConnected(true)
      })
      wsRef.current.addEventListener("close", () => {
        setConnected(false)
        stopStreaming()
      })

      const videoStream = canvasRef.current.captureStream(30) // 30 FPS

      // Let's do some extra work to get audio to join the party.
      // https://hacks.mozilla.org/2016/04/record-almost-everything-in-the-browser-with-mediarecorder/
      const audioStream = new MediaStream()
      const audioTracks = inputStreamRef.current.getAudioTracks()
      audioTracks.forEach(function (track) {
        audioStream.addTrack(track)
      })

      const outputStream = new MediaStream()
      const stream = [audioStream, videoStream]
      stream.forEach(function (s) {
        s.getTracks().forEach(function (t) {
          outputStream.addTrack(t)
        })
      })

      mediaRecorderRef.current = new MediaRecorder(outputStream, {
        mimeType: getRecorderMimeType(),
        videoBitsPerSecond: 3000000,
        audioBitsPerSecond: 64000,
      })

      mediaRecorderRef.current.addEventListener("dataavailable", (e) => {
        updateLiveDuration()
        wsRef.current?.send(e.data)
      })

      mediaRecorderRef.current.addEventListener("stop", () => {
        stopStreaming()
        wsRef.current?.close()
      })

      startTimeRef.current = new Date().getTime()
      mediaRecorderRef.current.start(1000)
    }
  }, [streamKey, stopStreaming, updateLiveDuration])

  // Expose the `startStreaming` function through the ref
  useImperativeHandle(ref, () => ({
    startStreaming,
  }))

  const requestStop = useCallback(() => {
    setWillStop(true)
  }, [])

  const cancelStop = useCallback(() => {
    setWillStop(false)
  }, [])

  return (
    <>
      <div className="w-full h-full max-h-screen flex flex-col items-stretch">
        <div className="w-full flex-grow relative">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted={true} // Muted to remove echo sound
            className="absolute z-0 w-full h-full object-fill invisible"
          />
          <canvas ref={canvasRef} className="absolute z-10"></canvas>
          {streaming && (
            <div className="absolute z-20 top-2 left-2 flex">
              <div className="w-[60px] h-[30px] flex items-center justify-center bg-error text-white rounded-tl-[4px] rounded-bl-[4px] text-sm">
                LIVE
              </div>
              <div className="w-[80px] h-[30px] pl-2 flex items-center bg-black text-white rounded-tr-[4px] rounded-br-[4px] text-sm">
                {liveDuration}
              </div>
            </div>
          )}
        </div>
        <div className="h-[60px] min-h-[60px] w-full px-10 flex items-center justify-between bg-neutral-600">
          <button className="btn-cancel px-5 mx-0" onClick={requestStop}>
            END STREAM
          </button>
          <div onClick={toggleMute}>
            {mute ? (
              <BsMicMuteFill size={24} className="cursor-pointer" />
            ) : (
              <BsMicFill size={24} className="cursor-pointer" />
            )}
          </div>
          <button className="btn-light px-5 mx-0" onClick={editStream}>
            EDIT
          </button>
        </div>
      </div>

      {willStop && (
        <ConfirmModal
          onConfirm={stopStreaming}
          onCancel={cancelStop}
          confirmText="END"
          cancelText="Continue live"
          useRedBgForConfirm
          loading={stoping}
          info={stopingInfo}
          error={stopingError}
        >
          <div className="text-textRegular">
            <h6>End stream</h6>
            <p className="mt-2">
              This will stop your stream immediately and you will no longer be
              live.
            </p>
          </div>
        </ConfirmModal>
      )}

      {/* Show spinner while preparing to go live */}
      <PageLoaderWithInfo loading={loading} loaderColor="#a3a3a3">
        <div className="w-full h-full flex items-center justify-center">
          <h6>Going live...</h6>
        </div>
      </PageLoaderWithInfo>

      {/* Prevent user interaction while loading */}
      {stoping && <Mask />}
    </>
  )
})

export default WebCamLive
