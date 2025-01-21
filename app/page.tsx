'use client'

import { useState } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import CompanyAnalysis from '../components/CompanyAnalysis'

export default function Home() {
  const [domain, setDomain] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showResults, setShowResults] = useState(false)
  const [analysisData, setAnalysisData] = useState(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setShowResults(false)

    try {
      // Step 1: Get basic company info
      const basicResponse = await fetch('/api/company-basic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain })
      })

      if (!basicResponse.ok) {
        throw new Error('Failed to get company basic info')
      }

      const basicData = await basicResponse.json()
      const companyInfo = basicData.companyBasic

      // Step 2: Get company details
      const detailsResponse = await fetch('/api/company-details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyBasic: companyInfo })
      })

      if (!detailsResponse.ok) {
        throw new Error('Failed to get company details')
      }

      const detailsData = await detailsResponse.json()

      // Step 3: Get competitor names
      const competitorsResponse = await fetch('/api/competitor-names', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyInfo: { ...companyInfo, ...detailsData.companyDetails } })
      })

      if (!competitorsResponse.ok) {
        throw new Error('Failed to get competitor names')
      }

      const competitorsData = await competitorsResponse.json()

      // Step 4: Get competitor info and differences
      const competitorPromises = competitorsData.competitors.map(async (competitor: { name: string }) => {
        // Get competitor info
        const competitorInfoResponse = await fetch('/api/competitor-info', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            companyInfo: { ...companyInfo, ...detailsData.companyDetails },
            competitorName: competitor.name
          })
        })

        if (!competitorInfoResponse.ok) {
          throw new Error(`Failed to get info for competitor: ${competitor.name}`)
        }

        const competitorInfo = await competitorInfoResponse.json()

        // Get differences
        const differencesResponse = await fetch('/api/competitor-differences', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            companyInfo: { ...companyInfo, ...detailsData.companyDetails },
            competitorInfo: competitorInfo.competitor
          })
        })

        if (!differencesResponse.ok) {
          throw new Error(`Failed to get differences for competitor: ${competitor.name}`)
        }

        const differencesData = await differencesResponse.json()

        return {
          ...competitorInfo.competitor,
          differences: differencesData.differences.differencesList
        }
      })

      const competitors = await Promise.all(competitorPromises)

      // Show the analysis component with all the data
      setAnalysisData({ companyInfo, detailsData, competitors })
      setShowResults(true)

    } catch (err) {
      console.error('Error:', err)
      setError(err instanceof Error ? err.message : 'Failed to complete analysis')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Competitor Analysis Tool
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Enter a company's domain to get detailed insights about their competitors
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 backdrop-blur-lg bg-opacity-90">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    placeholder="Enter company domain (e.g., apple.com)"
                    className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base placeholder-gray-400 transition-all duration-200"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading || !domain}
                  className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl disabled:hover:shadow-lg flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    'Analyze Company'
                  )}
                </button>
              </div>
              {error && (
                <div className="mt-4 p-4 bg-red-50 rounded-xl text-red-600 text-center">
                  {error}
                </div>
              )}
            </form>
          </div>
        </div>

        {showResults && analysisData && (
          <div className="animate-fade-in">
            <CompanyAnalysis data={analysisData} />
          </div>
        )}
      </div>
    </main>
  )
}
