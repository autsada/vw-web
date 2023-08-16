"use client"

import React from "react"
import {
  RiFileListFill,
  RiFileListLine,
  RiSignalWifiFill,
  RiSignalWifiLine,
} from "react-icons/ri"
import { BsWebcamFill, BsWebcam } from "react-icons/bs"

import ActiveLink from "@/components/nav/ActiveLink"

interface Props {}

export default function LiveSideBar() {
  return (
    <>
      <div className="mb-3">
        <ActiveLink
          name="Stream"
          href="/live/stream"
          ActiveIcon={RiSignalWifiFill}
          InActiveIcon={RiSignalWifiLine}
          isVertical={true}
          isDarkMode
        />
      </div>
      <div className="mb-3">
        <ActiveLink
          name="Webcam"
          href="/live/webcam"
          ActiveIcon={BsWebcamFill}
          InActiveIcon={BsWebcam}
          isVertical={true}
          isDarkMode
        />
      </div>
      <div className="mb-3">
        <ActiveLink
          name="Manage"
          href="/live/manage"
          ActiveIcon={RiFileListFill}
          InActiveIcon={RiFileListLine}
          isVertical={true}
          isDarkMode
        />
      </div>
    </>
  )
}
