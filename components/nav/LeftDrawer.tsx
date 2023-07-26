import React, { useEffect, useCallback } from "react"
import {
  RiHome4Fill,
  RiHome4Line,
  RiVideoFill,
  RiVideoLine,
} from "react-icons/ri"
import { AiOutlineRead, AiFillRead } from "react-icons/ai"
import { MdOutlineVideoLibrary, MdVideoLibrary } from "react-icons/md"

import Logo from "./Logo"
import ActiveLink from "./ActiveLink"
import Backdrop from "../Backdrop"
import UploadBtn from "@/components/UploadBtn"
import { useAuthContext } from "@/context/AuthContext"
import { SIGN_IN_HEADER } from "@/lib/constants"

interface Props {
  isOpen: boolean
  closeDrawer: () => void
  isAuthenticated: boolean
}

export default function LeftDrawer({
  isOpen = false,
  closeDrawer,
  isAuthenticated,
}: Props) {
  const { onVisible: openAuthModal } = useAuthContext()

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

  const onClickUpload = useCallback(() => {
    openAuthModal(SIGN_IN_HEADER)
    closeDrawer()
  }, [openAuthModal, closeDrawer])

  return (
    <>
      <div
        className={`fixed z-50 ${
          isOpen ? "top-0 bottom-0 left-0" : "top-0 bottom-0 -left-[100%]"
        } w-[260px] bg-white transition-all duration-300 overflow-y-auto pb-10`}
      >
        <div className="w-full px-5 flex items-center justify-between">
          <div className="w-[80px]">
            <Logo />
          </div>

          <div className="px-2">
            <button
              type="button"
              className="text-xl text-textLight"
              onClick={closeDrawer}
            >
              &#10005;
            </button>
          </div>
        </div>
        <div className="w-full px-5 mt-5">
          <ActiveLink
            name="Home"
            href="/"
            ActiveIcon={RiHome4Fill}
            InActiveIcon={RiHome4Line}
          />
        </div>
        <div className="w-full px-5 mt-5">
          <ActiveLink
            name="Shorts"
            href="/shorts"
            ActiveIcon={RiVideoFill}
            InActiveIcon={RiVideoLine}
          />
        </div>
        <div className="w-full px-5 mt-5">
          <ActiveLink
            name="Blogs"
            href="/blogs"
            ActiveIcon={AiFillRead}
            InActiveIcon={AiOutlineRead}
          />
        </div>
        <div className="w-full px-5 mt-5">
          <ActiveLink
            name="Library"
            href="/library"
            ActiveIcon={MdVideoLibrary}
            InActiveIcon={MdOutlineVideoLibrary}
          />
        </div>
        <div className="mt-5 py-5 flex sm:hidden items-center justify-center">
          <UploadBtn
            isAuthenticated={isAuthenticated}
            onClick={onClickUpload}
            color="#2096F3"
            size={40}
          />
        </div>
      </div>
      <Backdrop visible={isOpen} onClick={closeDrawer} />
    </>
  )
}
