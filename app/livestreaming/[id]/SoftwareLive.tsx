import React, { useState, useCallback, useRef } from "react"
import { BsEyeSlash, BsEye } from "react-icons/bs"

import ButtonLoader from "@/components/ButtonLoader"

interface Props {
  editStream: () => void
  loading: boolean
  streamKey: string
  streamURL: string
}

export default function SoftwareLive({
  editStream,
  loading,
  streamKey,
  streamURL,
}: Props) {
  const [keyVisible, setKeyVisible] = useState<"password" | "text">("password")
  const [isKeyCopied, setIsKeyCopied] = useState(false)
  const [isUrlCopied, setIsUrlCopied] = useState(false)

  const streamKeyRef = useRef<HTMLInputElement>(null)
  const streamUrlRef = useRef<HTMLInputElement>(null)

  const toggleStreamKeyVisibility = useCallback(() => {
    if (keyVisible === "password") {
      setKeyVisible("text")
    } else {
      setKeyVisible("password")
    }
  }, [keyVisible])

  const copyStreamKey = useCallback(() => {
    if (streamKeyRef?.current) {
      const key = streamKeyRef.current.value
      navigator?.clipboard?.writeText(key)
      setIsKeyCopied(true)
      const timeoutId = setTimeout(() => {
        setIsKeyCopied(false)
        clearTimeout(timeoutId)
      }, 1000)
    }
  }, [])

  const copyStreamURL = useCallback(() => {
    if (streamUrlRef?.current) {
      const key = streamUrlRef.current.value
      navigator?.clipboard?.writeText(key)
      setIsUrlCopied(true)
      const timeoutId = setTimeout(() => {
        setIsUrlCopied(false)
        clearTimeout(timeoutId)
      }, 1000)
    }
  }, [])

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-grow flex flex-col items-center justify-center">
        {loading && <ButtonLoader loading />}
        <p className="text-white mt-5">Connect stream software to go live</p>
      </div>
      <div className="p-5 flex gap-x-2 lg:gap-x-5 xl:gap-x-10 bg-neutral-800">
        <div className="flex-grow">
          <div className="mb-5">
            <p className="text-sm text-textExtraLight">Stream key</p>
            <div className="h-[40px] w-full flex items-center justify-between gap-x-5">
              {/* <p className="text-xs">{streamKey}</p> */}
              <div className="relative w-full flex items-center border-b border-neutral-500">
                <input
                  ref={streamKeyRef}
                  type={keyVisible}
                  disabled
                  value={streamKey}
                  className="relative z-10 block w-full mr-5 text-xs bg-transparent text-neutral-200"
                />
                {isKeyCopied ? (
                  <div className="absolute z-20 w-full h-full flex items-center">
                    <div className="px-1 bg-neutral-200 text-textRegular text-sm rounded-sm">
                      Stream key copied
                    </div>
                  </div>
                ) : null}
                <div
                  className="absolute z-20 h-full right-0 cursor-pointer"
                  onClick={toggleStreamKeyVisibility}
                >
                  {keyVisible === "password" ? <BsEyeSlash /> : <BsEye />}
                </div>
              </div>
              <div className="h-full flex gap-x-5">
                <button className="btn-light bg-transparent hover:bg-transparent border border-neutral-400 mx-0 h-full px-4 text-xs text-neutral-200">
                  RESET
                </button>
                <button
                  className="btn-light bg-transparent hover:bg-transparent border border-neutral-400 mx-0 h-full px-4 text-xs text-neutral-200"
                  onClick={copyStreamKey}
                >
                  COPY
                </button>
              </div>
            </div>
          </div>
          <div className="mb-5">
            <p className="text-sm text-textExtraLight">Stream URL</p>
            <div className="h-[40px] w-full flex items-center justify-between">
              {/* <p className="text-sm">{streamURL}</p> */}
              <div className="relative w-full flex items-center">
                <input
                  ref={streamUrlRef}
                  type="text"
                  disabled
                  value={streamURL}
                  className="block w-full text-sm bg-transparent text-neutral-200"
                />
                {isUrlCopied ? (
                  <div className="absolute z-20 w-full h-full flex items-center">
                    <div className="px-1 bg-neutral-200 text-textRegular text-sm rounded-sm">
                      Stream URL copied
                    </div>
                  </div>
                ) : null}
              </div>
              <button
                className="btn-light bg-transparent hover:bg-transparent border border-neutral-400 mx-0 h-full px-4 text-xs text-neutral-200"
                onClick={copyStreamURL}
              >
                COPY
              </button>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end">
          <button className="btn-light px-5 mx-0" onClick={editStream}>
            EDIT
          </button>
        </div>
      </div>
    </div>
  )
}
