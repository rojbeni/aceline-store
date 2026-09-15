"use client"

import React, { createContext, useContext, useMemo } from "react"
import { getTranslation } from "@lib/util/translations"

type TranslationContextType = {
  locale: string | null
  t: (key: string) => string
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined)

export const TranslationProvider = ({
  locale,
  children,
}: {
  locale: string | null
  children: React.ReactNode
}) => {
  const contextValue = useMemo(() => {
    const t = (key: string) => {
      return getTranslation(locale, key)
    }
    return { locale, t }
  }, [locale])

  return (
    <TranslationContext.Provider value={contextValue}>
      {children}
    </TranslationContext.Provider>
  )
}

export const useTranslation = () => {
  const context = useContext(TranslationContext)
  if (context === undefined) {
    throw new Error("useTranslation must be used within a TranslationProvider")
  }
  return context
}
