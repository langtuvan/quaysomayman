'use client'
import { LoadingScreen, ProcessingScreen } from '@/components/LoadingScreen'
import { createContext, useContext, useState } from 'react'

type LoadingContextType = {
  isLoading: boolean
  setLoading: (value: boolean) => void
  isProcessing: boolean
  setProcessing: (value: boolean) => void
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

export default function LoadingProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const setLoading = (value: boolean) => {
    setIsLoading(value)
  }

  const setProcessing = (value: boolean) => {
    setIsProcessing(value)
  }
  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        setLoading,
        isProcessing,
        setProcessing,
      }}
    >
      {isLoading && <LoadingScreen />}
      {isProcessing && <ProcessingScreen />}
      {children}
    </LoadingContext.Provider>
  )
}

export const useLoading = () => {
  const context = useContext(LoadingContext)
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider')
  }
  return context
}
