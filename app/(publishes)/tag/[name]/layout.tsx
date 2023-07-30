import React from "react"
import type { Metadata, ResolvingMetadata } from "next"

type Props = {
  params: { name: string }
}

export async function generateMetadata(
  { params }: Props,
  parent?: ResolvingMetadata
): Promise<Metadata> {
  const tag = params.name

  return {
    title: `#${tag}`,
  }
}

export default function layout({
  children,
  params,
}: Props & { children: React.ReactNode }) {
  const tag = params.name

  return (
    <div className="px-2 sm:px-4 py-2 sm:ml-[100px]">
      <h6>#{tag}</h6>
      <>{children}</>
    </div>
  )
}
