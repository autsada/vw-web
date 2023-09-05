"use client"

import React from "react"
import {
  RiFileListFill,
  RiFileListLine,
  RiSignalWifiFill,
  RiSignalWifiLine,
} from "react-icons/ri"

import ActiveLink from "@/components/nav/ActiveLink"

interface Props {}

export default function LiveSideBar() {
  return (
    <>
      <div className="mb-3">
        <ActiveLink
          name="Stream"
          href="/livestreaming"
          ActiveIcon={RiSignalWifiFill}
          InActiveIcon={RiSignalWifiLine}
          isVertical={true}
          isDarkMode
        />
      </div>
      <div className="mb-3">
        <ActiveLink
          name="Manage"
          href="/livestreaming/manage"
          ActiveIcon={RiFileListFill}
          InActiveIcon={RiFileListLine}
          isVertical={true}
          isDarkMode
        />
      </div>
    </>
  )
}
