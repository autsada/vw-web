import React from "react"

interface Props {
  sectionName: string
}

export default function SectionHeader({ sectionName }: Props) {
  return (
    <h6 className="text-lg">
      Settings <>&gt;</> <span className="text-lg">{sectionName}</span>
    </h6>
  )
}
