import React, { useState, useCallback } from "react"
import { AiOutlineFlag, AiFillFlag } from "react-icons/ai"

import Reaction from "./Reaction"
import ReportModal from "./ReportModal"

interface Props {
  title?: string
  publishId: string
  withDescription?: boolean
}

export default function ReportReaction({
  title,
  publishId,
  withDescription = true,
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
        onClick={openReportModal}
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
