import React, { useCallback } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"

import { contentCategories } from "@/lib/helpers"
import type { PublishCategory } from "@/graphql/types"

interface Props {
  category?: PublishCategory | "All" | "Live"
  onSelectTab: (c: PublishCategory | "All" | "Live") => void
  loading: boolean
}

export default function PublishTabs({ category, onSelectTab, loading }: Props) {
  return (
    <>
      <Tab
        text="All"
        selected={category}
        onSelectTab={onSelectTab}
        loading={loading}
      />
      {["Live", ...contentCategories].map((cat: any) => (
        <Tab
          key={cat}
          text={cat}
          selected={category}
          onSelectTab={onSelectTab}
          loading={loading}
        />
      ))}
    </>
  )
}

function Tab({
  text,
  onSelectTab,
  loading,
  selected,
}: {
  text: PublishCategory | "All" | "Live"
  onSelectTab: (c: PublishCategory | "All" | "Live") => void
  loading: boolean
  selected?: PublishCategory | "All" | "Live"
}) {
  return (
    <button
      type="button"
      className={`text-sm sm:text-base ${
        selected === text ? "btn-dark" : "btn-light"
      } px-5 h-8 rounded-full`}
      disabled={loading}
      onClick={onSelectTab.bind(undefined, text)}
    >
      {text}
    </button>
  )
}
