import React, { useState } from "react"

import ModalWrapper from "@/components/ModalWrapper"
import CommentDetails from "./CommentDetails"
import CommentsHeader from "@/components/CommentsHeader"
import CloseButton from "@/components/CloseButton"
import Mask from "@/components/Mask"
import type {
  Maybe,
  Profile,
  Comment,
  PageInfo,
  CommentEdge,
} from "@/graphql/codegen/graphql"
import type { CommentsOrderBy } from "@/graphql/types"

interface Props {
  isAuthenticated: boolean
  profile: Maybe<Profile> | undefined
  commentsCount: number
  closeModal: () => void
  publishId: string
  pageInfo: PageInfo | undefined
  setPageInfo: React.Dispatch<React.SetStateAction<PageInfo | undefined>>
  edges: CommentEdge[]
  setEdges: React.Dispatch<React.SetStateAction<CommentEdge[]>>
  subCommentsVisible: boolean
  subCommentsEdges: CommentEdge[]
  subCommentsPageInfo: PageInfo | undefined
  fetchSubComments: (parentCommentId: string, cursor?: string) => Promise<void>
  reloadSubComments: (stateHandling?: "combine" | "no-combine") => void
  subCommentsLoading: boolean
  openSubComments: (c: Comment) => void
  activeComment: Comment | undefined
  closeSubComments: () => void
  modalTop?: number
  loading?: boolean
  reloadComments?: (
    publishId: string,
    orderBy?: CommentsOrderBy,
    stateHandling?: "combine" | "no-combine"
  ) => void
  openReportModal: (c: Comment) => void
}

export default function CommentsModal({
  isAuthenticated,
  profile,
  commentsCount,
  closeModal,
  publishId,
  pageInfo,
  setPageInfo,
  edges,
  setEdges,
  subCommentsVisible,
  subCommentsEdges,
  subCommentsPageInfo,
  fetchSubComments,
  reloadSubComments,
  subCommentsLoading,
  openSubComments,
  activeComment,
  closeSubComments,
  modalTop,
  loading,
  reloadComments,
  openReportModal,
}: Props) {
  const [sortBy, setSortBy] = useState<CommentsOrderBy>("counts")

  return (
    <ModalWrapper visible>
      {/* 310px is from 270 for video player height plus 70 for navbar height */}
      <div
        className={`fixed bottom-0 w-[100%] text-left bg-white rounded-tl-xl rounded-tr-xl overflow-hidden`}
        style={{ top: modalTop || "20%" }}
      >
        <div className="p-4 flex items-center justify-between border-b border-neutral-100">
          <CommentsHeader
            subCommentsVisible={subCommentsVisible}
            commentsCount={commentsCount}
            publishId={publishId}
            closeSubComments={closeSubComments}
            pageInfo={pageInfo}
            setPageInfo={setPageInfo}
            setEdges={setEdges}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
          <div>
            <CloseButton onClick={closeModal} />
          </div>
        </div>
        <CommentDetails
          isAuthenticated={isAuthenticated}
          profile={profile}
          publishId={publishId}
          pageInfo={pageInfo}
          setPageInfo={setPageInfo}
          edges={edges}
          setEdges={setEdges}
          subCommentsVisible={subCommentsVisible}
          subCommentsEdges={subCommentsEdges}
          subCommentsPageInfo={subCommentsPageInfo}
          fetchSubComments={fetchSubComments}
          reloadSubComments={reloadSubComments}
          subCommentsLoading={subCommentsLoading}
          openSubComments={openSubComments}
          activeComment={activeComment}
          fetchCommentsSortBy={sortBy}
          reloadComments={reloadComments}
          openReportModal={openReportModal}
        />
      </div>

      {loading && <Mask />}
    </ModalWrapper>
  )
}
