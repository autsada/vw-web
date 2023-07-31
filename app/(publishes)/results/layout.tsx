import React from "react"

export default function layout({ children }: { children: React.ReactNode }) {
  return <div className="py-2 sm:ml-[100px]">{children}</div>
}
