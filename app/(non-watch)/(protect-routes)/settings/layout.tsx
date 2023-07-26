import React from "react"
import RouteLinks from "./RouteLinks"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="md:fixed md:z-20 md:left-[100px] md:top-[70px] md:bottom-0 sm:py-5">
        <div className="md:h-full flex flex-row md:flex-col gap-x-2 sm:gap-x-0 sm:gap-y-4 w-full md:w-[200px] border-t border-b md:border-l md:border-r md:border-neutral-300 rounded-none md:rounded-lg md:px-4 md:py-5">
          <RouteLinks />
        </div>
      </div>
      <div className="p-2 md:px-6 md:py-5">
        <div className="ml-0 md:ml-[200px] pb-20 sm:pb-0">{children}</div>
      </div>
    </>
  )
}
