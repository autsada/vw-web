import React from "react"

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="px-4 py-2">{children}</div>
}
