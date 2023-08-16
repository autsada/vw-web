import React from "react"
import LiveSideBar from "./LiveSideBar"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen pt-[70px] bg-black text-white">
      <div className="hidden w-[100px] fixed top-[70px] bottom-0 bg-neutral-900 py-5 px-2 sm:block overflow-y-auto">
        <LiveSideBar />
      </div>
      <div className="sm:ml-[100px]">{children}</div>
    </div>
  )
}
