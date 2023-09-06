import React, { useCallback, useState, useRef } from "react"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { RxHamburgerMenu } from "react-icons/rx"
import { IoSearchOutline, IoCloseOutline } from "react-icons/io5"

import Logo from "./Logo"
import Avatar from "../Avatar"
import UploadBtn from "./UploadBtn"
import { useAuthContext } from "@/context/AuthContext"
import { SIGN_IN_HEADER } from "@/lib/constants"
import type {
  Account,
  GetUnReadNotificationsResponse,
  Maybe,
} from "@/graphql/codegen/graphql"
import Notification from "./Notification"

interface Props {
  isAuthenticated: boolean
  account: Account | null
  openLeftDrawer: () => void
  openRightDrawer: () => void
  unReadCount: Maybe<GetUnReadNotificationsResponse> | undefined
  openNotificationsModal: () => void
  openStartUploadModal: () => void
}

export default function MainNav({
  isAuthenticated,
  account,
  openLeftDrawer,
  openRightDrawer,
  unReadCount,
  openNotificationsModal,
  openStartUploadModal,
}: Props) {
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get("query")
  const [query, setQuery] = useState(searchQuery || "")

  const router = useRouter()
  const pathname = usePathname()
  const isWatchPage = pathname.startsWith("/watch")
  const { onVisible: openAuthModal } = useAuthContext()
  const searchBoxRef = useRef<HTMLInputElement>(null)

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }, [])

  const onEnter = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        if (query) {
          router.push(`/results?query=${query.replaceAll(" ", "+")}`)
        }
      }
    },
    [query, router]
  )

  const onClickSearchIcon = useCallback(() => {
    if (searchBoxRef) {
      if (!query) {
        searchBoxRef.current?.focus()
      } else {
        router.push(`/results?query=${query.replaceAll(" ", "+")}`)
      }
    }
  }, [query, router])

  const clearQuery = useCallback(() => {
    if (query) {
      setQuery("")
      if (searchBoxRef) {
        searchBoxRef.current?.focus()
      }
    }
  }, [query])

  const onStartUpload = useCallback(() => {
    if (!isAuthenticated) {
      openAuthModal('"Sign in to upload content."')
    } else {
      openStartUploadModal()
    }
  }, [isAuthenticated, openStartUploadModal, openAuthModal])

  return (
    <div
      className={`h-[70px] px-2 flex items-center justify-between ${
        isWatchPage ? "bg-neutral-900" : "bg-white"
      }`}
    >
      {isWatchPage && (
        <div className="hidden sm:flex h-full w-[50px] items-center">
          <div
            className={`cursor-pointer p-2 rounded-full ${
              isWatchPage ? "hover:bg-gray-600" : "hover:bg-gray-100"
            }`}
          >
            <RxHamburgerMenu
              size={28}
              className="text-white"
              onClick={openLeftDrawer}
            />
          </div>
        </div>
      )}
      <div className="h-full w-[100px] ml-2 flex items-center justify-start">
        <Link href="/">
          <Logo theme={isWatchPage ? "dark" : "light"} />
        </Link>
      </div>

      <div className="h-full flex-grow flex items-center justify-center">
        <div
          className={`relative h-[50px] w-full sm:max-w-[300px] md:max-w-[400px] lg:max-w-[500px] xl:max-w-[600px] flex items-center md:border ${
            isWatchPage ? "md:border-neutral-500" : "md:border-neutral-200"
          } md:rounded-full overflow-hidden`}
        >
          <div className="w-full">
            <input
              ref={searchBoxRef}
              type="text"
              className={`block w-full h-full max-w-full pl-5 bg-transparent ${
                isWatchPage ? "text-white" : ""
              }`}
              value={query}
              onChange={onChange}
              onKeyDown={onEnter}
            />
          </div>
          {query && (
            <div className="absolute h-full top-0 bottom-0 right-[50px] flex items-center justify-center">
              <IoCloseOutline
                size={28}
                className={`cursor-pointer ${
                  isWatchPage
                    ? "text-white hover:text-textExtraLight"
                    : "text-textExtraLight hover:text-textRegular"
                }`}
                onClick={clearQuery}
              />
            </div>
          )}
          <div
            className={`h-full w-[60px] flex items-center justify-center cursor-pointer ${
              isWatchPage
                ? "md:border-none md:border-neutral-200 hover:bg-neutral-800"
                : "md:border-l md:border-neutral-200 hover:bg-neutral-100"
            }`}
            onClick={onClickSearchIcon}
          >
            <IoSearchOutline
              size={24}
              className={`cursor-pointer ${
                isWatchPage ? "text-white" : "text-textExtraLight"
              }`}
            />
          </div>
        </div>
      </div>

      <div className={`hidden sm:block sm:mr-6`}>
        <UploadBtn
          onClick={onStartUpload}
          color={isWatchPage ? "#FF904D" : "#2096F3"}
          size={30}
        />
      </div>

      {isAuthenticated && (
        <div className={`mr-3 sm:mr-6`}>
          <Notification
            profile={account?.defaultProfile}
            isWatchPage={isWatchPage}
            onClick={openNotificationsModal}
            unReadCount={unReadCount}
          />
        </div>
      )}
      <div className="h-full w-max flex items-center justify-end pr-2">
        {account ? (
          <div onClick={openRightDrawer}>
            <Avatar profile={account?.defaultProfile} withLink={false} />
          </div>
        ) : (
          <button
            type="button"
            className={`${
              isWatchPage ? "btn-light" : "btn-dark"
            } mx-0 h-8 w-[80px] rounded-full text-sm`}
            onClick={openAuthModal.bind(undefined, SIGN_IN_HEADER)}
          >
            Sign in
          </button>
        )}
      </div>
    </div>
  )
}
