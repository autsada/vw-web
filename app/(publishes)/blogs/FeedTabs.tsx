import React from "react"
import Link from "next/link"

type FeedType = "For you" | "Latest" | "Popular"
interface Props {
  feed?: string
}

export default function FeedTabs({ feed }: Props) {
  return (
    <div className="flex items-center">
      <div className="flex items-center gap-x-5 lg:w-[60%] lg:border-r border-neutral-200">
        <Tab text="For you" selected={!feed} />
        <Tab text="Latest" selected={feed === "latest"} />
        <Tab text="Popular" selected={feed === "popular"} />
      </div>
      <div className="hidden lg:block text-lg font-semibold px-5 lg:w-[40%]">
        Popular
      </div>
    </div>
  )
}

function Tab({ text, selected }: { text: FeedType; selected: boolean }) {
  return (
    <Link
      href={
        text.toLowerCase() === "latest"
          ? "/blogs?feed=latest"
          : text.toLowerCase() === "popular"
          ? "/blogs?feed=popular"
          : "/blogs"
      }
      className={text.toLowerCase() === "popular" ? "lg:hidden" : ""}
    >
      <div
        className={`mx-0 h-8 text-lg cursor-pointer border-b-[2px] ${
          selected
            ? "font-semibold border-gray-600"
            : "text-textLight border-white"
        }`}
      >
        {text}
      </div>
    </Link>
  )
}
