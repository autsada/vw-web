import React, { useState, useEffect } from "react"
import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  InstapaperIcon,
  InstapaperShareButton,
  LineIcon,
  LineShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  RedditIcon,
  RedditShareButton,
  TelegramIcon,
  TelegramShareButton,
  TumblrIcon,
  TumblrShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share"

import ModalWrapper from "@/components/ModalWrapper"
import CloseButton from "@/components/CloseButton"

interface Props {
  title: string
  closeModal: () => void
  shareUrl: string
}

export default function ShareModal({ title, closeModal, shareUrl }: Props) {
  const [copiedVisible, setCopiedVisible] = useState(false)
  const [copyError, setCopyError] = useState("")
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>()

  // Clear timeout when unmount
  useEffect(() => {
    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [timeoutId])

  async function copyUrl() {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopiedVisible(true)
      const id = setTimeout(() => {
        setCopiedVisible(false)
        clearTimeout(id)
      }, 500)
      setTimeoutId(id)
    } catch (error) {
      setCopyError(
        "Sorry, unable to copy. Please try again or manually copy the url."
      )
    }
  }

  return (
    <ModalWrapper visible>
      <div className="fixed z-10 inset-0" onClick={closeModal}></div>
      <div className="relative z-20 py-5 w-[600px] max-w-[90%] text-center bg-white rounded-xl overflow-hidden">
        <div className="px-4 sm:px-10 flex items-center justify-between gap-x-5">
          <p className="text-lg">Share via</p>
          <div>
            <CloseButton onClick={closeModal} />
          </div>
        </div>

        <div className="w-full px-4 sm:px-10 my-4 h-[100px] flex items-center gap-x-5 overflow-x-auto scrollbar-hide">
          <FacebookShareButton
            url={shareUrl}
            quote={title}
            windowWidth={660}
            windowHeight={460}
          >
            <FacebookIcon size={60} round />
          </FacebookShareButton>

          <TwitterShareButton
            url={shareUrl}
            title={title}
            windowWidth={660}
            windowHeight={460}
          >
            <TwitterIcon size={60} round />
          </TwitterShareButton>

          <WhatsappShareButton
            url={shareUrl}
            title={title}
            separator=":: "
            windowWidth={660}
            windowHeight={460}
          >
            <WhatsappIcon size={60} round />
          </WhatsappShareButton>

          <LineShareButton
            url={shareUrl}
            title={title}
            windowWidth={660}
            windowHeight={460}
          >
            <LineIcon size={60} round />
          </LineShareButton>

          <EmailShareButton
            url={shareUrl}
            subject={title}
            body="body"
            windowWidth={660}
            windowHeight={460}
          >
            <EmailIcon size={60} round />
          </EmailShareButton>

          <TelegramShareButton
            url={shareUrl}
            title={title}
            windowWidth={660}
            windowHeight={460}
          >
            <TelegramIcon size={60} round />
          </TelegramShareButton>

          <LinkedinShareButton
            url={shareUrl}
            windowWidth={660}
            windowHeight={460}
          >
            <LinkedinIcon size={60} round />
          </LinkedinShareButton>

          <RedditShareButton
            url={shareUrl}
            title={title}
            windowWidth={660}
            windowHeight={460}
          >
            <RedditIcon size={60} round />
          </RedditShareButton>

          <InstapaperShareButton
            url={shareUrl}
            title={title}
            windowWidth={660}
            windowHeight={460}
          >
            <InstapaperIcon size={60} round />
          </InstapaperShareButton>

          <TumblrShareButton
            url={shareUrl}
            title={title}
            windowWidth={660}
            windowHeight={460}
          >
            <TumblrIcon size={60} round />
          </TumblrShareButton>
        </div>

        <div className="px-4 py-5 sm:px-10">
          <div className="px-4 flex items-center justify-between gap-x-4 h-[60px] border border-neutral-200 rounded-xl">
            <div className="flex-grow overflow-hidden bg-red-200">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="block w-full text-left whitespace-nowrap"
              ></input>
            </div>
            <div className="relative">
              <button
                className="btn-blue w-[80px] rounded-full"
                onClick={copyUrl}
              >
                Copy
              </button>

              {copiedVisible && (
                <div className="absolute -top-8 right-0 flex items-center justify-center bg-black text-white rounded-lg font-light text-sm px-2 py-1">
                  copied
                </div>
              )}
            </div>
          </div>
          <p className="error text-right mt-1">
            {copyError ? copyError : <>&nbsp;</>}
          </p>
        </div>
      </div>
    </ModalWrapper>
  )
}
