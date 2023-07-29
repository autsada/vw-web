import React from "react"

import { contentCategories } from "@/lib/helpers"
import type { PublishCategory } from "@/graphql/types"

interface Props {
  category?: PublishCategory | "All"
  onSelectTab: (c: PublishCategory | "All") => void
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
      {contentCategories.map((cat) => (
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
  text: PublishCategory | "All"
  onSelectTab: (c: PublishCategory | "All") => void
  loading: boolean
  selected?: PublishCategory | "All"
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
