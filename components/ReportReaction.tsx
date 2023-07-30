import React, { useState, useCallback } from "react"
import { AiOutlineFlag, AiFillFlag } from "react-icons/ai"

import Reaction from "./Reaction"
import ReportModal from "./ReportModal"

interface Props {
  title?: string
  publishId: string
  withDescription?: boolean
  verticalLayout?: boolean
  buttonWidth?: string // h-[40px]
  buttonHeight?: string // h-[40px]
}

export default function ReportReaction({
  title,
  publishId,
  withDescription = true,
  verticalLayout,
  buttonWidth,
  buttonHeight,
}: Props) {
  const [reportModalVisible, setReportModalVisible] = useState(false)

  const openReportModal = useCallback(() => {
    setReportModalVisible(true)
  }, [])

  const closeReportModal = useCallback(() => {
    setReportModalVisible(false)
  }, [])

  return (
    <>
      <Reaction
        IconOutline={AiOutlineFlag}
        IconFill={AiFillFlag}
        description="Report"
        withDescription={withDescription}
        isActive={false}
        width={buttonWidth}
        height={buttonHeight}
        onClick={openReportModal}
        verticalLayout={verticalLayout}
      />

      {reportModalVisible && publishId && (
        <ReportModal
          title={title}
          publishId={publishId}
          closeModal={closeReportModal}
        />
      )}
    </>
  )
}
