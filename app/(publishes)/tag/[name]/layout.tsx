import React from "react"
import type { Metadata } from "next"

type Props = {
  params: { name: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
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
    <div className="py-2 sm:ml-[100px]">
      <div className="px-2 sm:px-4">
        <h6>#{tag}</h6>
      </div>

      <>{children}</>
    </div>
  )
}
