"use client"

import React, { createContext, useContext, useState, useCallback } from "react"

interface AuthContextState {
  visible: boolean
  onVisible: (header?: string) => void
  offVisible: () => void
  headerText: string
}

const AuthContext = createContext<AuthContextState | undefined>(undefined)

export default function AuthContextProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [authModalVisible, setAuthModalVisible] = useState(false)
  const [headerText, setHeaderText] = useState("")

  const onVisible = useCallback((header?: string) => {
    setAuthModalVisible(true)
    setHeaderText(header || "")
  }, [])

  const offVisible = useCallback(() => {
    setAuthModalVisible(false)
  }, [])

  return (
    <AuthContext.Provider
      value={{ visible: authModalVisible, onVisible, offVisible, headerText }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const context = useContext(AuthContext)

  if (context === undefined)
    throw new Error("useAuthContext must be used within ContextProvider.")

  return context
}
