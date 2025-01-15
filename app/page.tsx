'use client'

import { useState } from 'react'
import CompanyAnalysis from '../components/CompanyAnalysis'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

export default function Home() {
  const [domain, setDomain] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [analysisData, setAnalysisData] = useState(null)
  const [error, setError] = useState('')

  const handleAnalyze = async () => {
    if (!domain) return
    setError('')
    setIsLoading(true)
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ domain }),
      })

      if (!response.ok) {
        throw new Error('Failed to analyze company')
      }

      const data = await response.json()
      setAnalysisData(data)
    } catch (error) {
      console.error('Error analyzing domain:', error)
      setError('Failed to analyze company. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <main className="p-4 sm:p-8 max-w-6xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-blue-900 tracking-tight">
            Competitor Analysis AI
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Enter a company domain to get detailed insights about the company and its competitors
          </p>
        </div>
        
        <div className="mb-8 sm:mb-12">
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-4 sm:p-6">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="Enter company domain (e.g., apple.com)"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base placeholder-gray-500"
                />
              </div>
              <button
                onClick={handleAnalyze}
                disabled={isLoading || !domain}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-md hover:shadow-lg min-w-[120px] flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                    <span>Analyzing...</span>
                  </>
                ) : (
                  'Analyze'
                )}
              </button>
            </div>
            {error && (
              <div className="mt-4 text-red-500 text-center">
                {error}
              </div>
            )}
          </div>
        </div>

        {isLoading && (
          <div className="text-center bg-white rounded-xl shadow-lg p-6 sm:p-8 max-w-2xl mx-auto mb-8">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-4 text-lg text-gray-600">Analyzing company data...</p>
            <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
          </div>
        )}

        {analysisData && <CompanyAnalysis data={analysisData} />}
      </main>
    </div>
  )
}
