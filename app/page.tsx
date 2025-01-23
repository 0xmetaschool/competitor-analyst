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
  const [loadingStep, setLoadingStep] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setShowResults(false)

    try {
      // Step 1: Get basic company info
      setLoadingStep('Getting company information...')
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
      setLoadingStep('Analyzing company details...')
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
      setLoadingStep('Identifying competitors...')
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
      setLoadingStep('Analyzing competitors...')
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
          name: competitorInfo.competitor.name,
          description: competitorInfo.competitor.description,
          industry: competitorInfo.competitor.industry,
          location: competitorInfo.competitor.location,
          employees: competitorInfo.competitor.employees,
          foundingYear: competitorInfo.competitor.foundingYear,
          companyType: competitorInfo.competitor.companyType,
          differences: differencesData.differences.differencesList
        }
      })

      const competitors = await Promise.all(competitorPromises)

      // Show the analysis component with all the data
      setAnalysisData({
        company: {
          ...companyInfo,
          ...detailsData.companyDetails
        },
        competitors
      })
      setShowResults(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setIsLoading(false)
      setLoadingStep(null)
    }
  }

  return (
    <main className="container fade-in">
      <div className="flex flex-col items-center justify-center min-h-screen py-12">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Competitor Analysis Tool
        </h1>
        
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
          <div className="input-container flex items-center">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 mr-2" />
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="Enter company domain..."
              className="flex-1"
              disabled={isLoading}
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading || !domain}
            className="w-full flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <div className="loading-spinner mr-2" />
                {loadingStep}
              </>
            ) : (
              'Analyze Competitors'
            )}
          </button>
        </form>

        {error && (
          <div className="text-red-500 mt-4">
            {error}
          </div>
        )}

        {showResults && analysisData && (
          <div className="w-full max-w-4xl mt-8">
            <CompanyAnalysis data={analysisData} />
          </div>
        )}
      </div>
    </main>
  )
}
