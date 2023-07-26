import React from "react"

interface Props {
  progress: number
  width?: number
  height?: number
  bgColor?: string
  progressColor?: string
  barRadius?: number
  zIndex?: number
}

export default function ProgressBar({
  progress,
  width = 150,
  height = 4,
  bgColor = "#f3f4f6",
  progressColor = "#3b82f6",
  barRadius = 8,
  zIndex = 50,
}: Props) {
  return (
    <div className="absolute left-0 right-0 bottom-2 flex justify-center">
      <div className="mx-auto" style={{ width: `${width}px`, zIndex }}>
        {!!progress && (
          <div
            className="w-full min-w-full mx-auto rounded-lg"
            style={{ height: `${height}px`, backgroundColor: bgColor }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: "100%",
                borderRadius: `${barRadius}px`,
                backgroundColor: progressColor,
              }}
            ></div>
          </div>
        )}
      </div>
    </div>
  )
}
