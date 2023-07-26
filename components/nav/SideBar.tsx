"use client"

import React from "react"
import {
  RiHome4Fill,
  RiHome4Line,
  RiVideoFill,
  RiVideoLine,
} from "react-icons/ri"
import { AiOutlineRead, AiFillRead } from "react-icons/ai"
import { MdOutlineVideoLibrary, MdVideoLibrary } from "react-icons/md"

import ActiveLink from "./ActiveLink"

interface Props {
  isAuthenticated: boolean
}

export default function SideBar({ isAuthenticated }: Props) {
  return (
    <>
      <div className="mb-3">
        <ActiveLink
          name="Home"
          href="/"
          ActiveIcon={RiHome4Fill}
          InActiveIcon={RiHome4Line}
          isVertical={true}
        />
      </div>
      <div className="mb-3">
        <ActiveLink
          name="Shorts"
          href="/shorts"
          ActiveIcon={RiVideoFill}
          InActiveIcon={RiVideoLine}
          isVertical={true}
        />
      </div>
      <div className="mb-3">
        <ActiveLink
          name="Blogs"
          href="/blogs"
          ActiveIcon={AiFillRead}
          InActiveIcon={AiOutlineRead}
          isVertical={true}
        />
      </div>
      <div className="mb-3">
        <ActiveLink
          name="Library"
          href="/library"
          ActiveIcon={MdVideoLibrary}
          InActiveIcon={MdOutlineVideoLibrary}
          isVertical={true}
          requiredAuth={!isAuthenticated}
          requiredAuthText="Sign in to view/create your library."
        />
      </div>
    </>
  )
}
