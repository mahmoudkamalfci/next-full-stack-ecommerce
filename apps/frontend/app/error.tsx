'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service or console
    console.error("Application error:", error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] py-16 text-center px-4">
      <h2 className="text-3xl font-bold mb-4 text-red-600">Oops! Something went wrong</h2>
      <p className="text-gray-600 mb-8 max-w-md">
        {error.message || "We encountered an unexpected error while trying to load this page."}
      </p>
      <button
        onClick={() => reset()}
        className="px-6 py-3 bg-black text-white rounded-md font-medium hover:bg-gray-800 transition-colors"
      >
        Try again
      </button>
    </div>
  )
}
