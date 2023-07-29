import React from "react"
import Link from "next/link"

interface Props {
  tags: string
}

export default function Tags({ tags }: Props) {
  return (
    <div className="mt-1 flex items-center gap-x-4">
      {tags.split(" | ").map((tag) => (
        <Link key={tag} href={`/tag/${tag}`}>
          <div className="text-textLight px-2 py-1 rounded-full cursor-pointer hover:bg-neutral-100">
            #{tag}
          </div>
        </Link>
      ))}
    </div>
  )
}
