"use client"

import React, { useCallback, useState, useEffect } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import MainNav from "./MainNav"
import AuthModal from "../auth/AuthModal"
import LeftDrawer from "./LeftDrawer"
import RightDrawer from "./RightDrawer"
import BottomTabs from "./BottomTabs"
import NotificationsModal from "./NotificationsModal"
import { useAuthContext } from "@/context/AuthContext"
import { useIdTokenChanged } from "@/hooks/useIdTokenChanged"
import type {
  Account,
  Maybe,
  GetUnReadNotificationsResponse,
} from "@/graphql/codegen/graphql"

interface Props {
  account: Account | null
  isAuthenticated: boolean // True when account is not null
  unReadCount: Maybe<GetUnReadNotificationsResponse> | undefined
}

export default function AppLayoutClient({
  account,
  isAuthenticated,
  unReadCount,
}: Props) {
  const [leftDrawerVisible, setLeftDrawerVisible] = useState(false)
  const [rightDrawerVisible, setRightDrawerVisible] = useState(false)
  const [notificationsModalVisible, setNotificationsModalVisible] =
    useState(false)

  const { visible: authModalVisible, offVisible, headerText } = useAuthContext()

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { idToken } = useIdTokenChanged()

  // When idToken changed, refresh the route
  useEffect(() => {
    router.refresh()

    if (!idToken) {
      // Close right drawer when user signed out
      setRightDrawerVisible(false)
    }
  }, [idToken, router])

  // Close auth modal when user is authenticated (account not null)
  useEffect(() => {
    if (isAuthenticated && authModalVisible) {
      offVisible()
    }
  }, [isAuthenticated, authModalVisible, offVisible])

  // Close drawers when navigate finished
  useEffect(() => {
    const url = pathname + searchParams.toString()

    // You can now use the current URL
    if (url) {
      setLeftDrawerVisible(false)
      setRightDrawerVisible(false)
    }
  }, [pathname, searchParams])

  const openLeftDrawer = useCallback(() => {
    setLeftDrawerVisible(true)
  }, [])

  const closeLeftDrawer = useCallback(() => {
    setLeftDrawerVisible(false)
  }, [])

  const openRightDrawer = useCallback(() => {
    setRightDrawerVisible(true)
  }, [])

  const closeRightDrawer = useCallback(() => {
    setRightDrawerVisible(false)
  }, [])

  const openNotificationsModal = useCallback(() => {
    setNotificationsModalVisible(true)
  }, [])

  const closeNotificationsModal = useCallback(() => {
    setNotificationsModalVisible(false)
  }, [])

  return (
    <>
      <div className="fixed z-20 top-0 left-0 right-0">
        <MainNav
          isAuthenticated={isAuthenticated}
          account={account}
          openLeftDrawer={openLeftDrawer}
          openRightDrawer={openRightDrawer}
          unReadCount={unReadCount}
          openNotificationsModal={openNotificationsModal}
        />
      </div>

      <LeftDrawer
        isAuthenticated={!!account}
        isOpen={leftDrawerVisible}
        closeDrawer={closeLeftDrawer}
      />

      <RightDrawer
        profile={account?.defaultProfile}
        profiles={account?.profiles || []}
        isOpen={rightDrawerVisible}
        closeDrawer={closeRightDrawer}
      />

      <AuthModal
        visible={authModalVisible}
        closeModal={offVisible}
        headerText={headerText}
      />

      {/* Toast */}
      <ToastContainer
        position="bottom-left"
        autoClose={1000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={false}
        icon={false}
      />

      <div className="sm:hidden fixed z-20 bottom-0 left-0 right-0">
        <BottomTabs isAuthenticated={isAuthenticated} />
      </div>

      <NotificationsModal
        modalVisible={notificationsModalVisible}
        profile={account?.defaultProfile}
        closeModal={closeNotificationsModal}
      />
    </>
  )
}
