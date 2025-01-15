'use client'

import { Card, Title, Text, Grid, Metric } from '@tremor/react'
import { GlobeAltIcon, UserGroupIcon, CalendarIcon, BuildingOfficeIcon, SparklesIcon } from '@heroicons/react/24/outline'

interface CompanyInfo {
  name: string
  punchline: string
  website: string
  industry: string
  location: string
  employees: string
  foundingYear: string
  companyType: string
  tagline: string
  specialties: string[]
}

interface Competitor {
  name: string
  description: string
  differences: string[]
}

interface AnalysisData {
  companyInfo: CompanyInfo
  competitors: Competitor[]
}

const InfoItem = ({ icon: Icon, label, value }: { icon: any, label: string, value: string }) => (
  <div className="flex items-start gap-2">
    <div className="p-1.5 bg-blue-50 rounded-lg">
      <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-500" />
    </div>
    <div>
      <Text className="font-medium text-gray-500 text-sm sm:text-base">{label}</Text>
      <Text className="text-gray-900 text-sm sm:text-base">{value}</Text>
    </div>
  </div>
)

export default function CompanyAnalysis({ data }: { data: AnalysisData }) {
  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* Company Introduction Block */}
      <Card className="p-4 sm:p-6 hover:shadow-lg transition-shadow duration-200">
        <Title className="text-xl sm:text-2xl mb-4 sm:mb-6">Company Introduction</Title>
        <div className="space-y-4 sm:space-y-6">
          <div className="border-b pb-4 sm:pb-6">
            <Text className="text-xl sm:text-2xl font-bold text-blue-900">{data.companyInfo.name}</Text>
            <Text className="text-base sm:text-lg text-gray-600 mt-2">{data.companyInfo.punchline}</Text>
          </div>

          <Grid numItems={1} numItemsSm={2} numItemsLg={3} className="gap-4 sm:gap-6">
            <InfoItem 
              icon={GlobeAltIcon}
              label="Website"
              value={
                <a href={data.companyInfo.website} target="_blank" rel="noopener noreferrer" 
                   className="text-blue-600 hover:underline">
                  {data.companyInfo.website}
                </a>
              }
            />
            <InfoItem 
              icon={BuildingOfficeIcon}
              label="Industry"
              value={data.companyInfo.industry}
            />
            <InfoItem 
              icon={GlobeAltIcon}
              label="Location"
              value={data.companyInfo.location}
            />
            <InfoItem 
              icon={UserGroupIcon}
              label="Employees"
              value={data.companyInfo.employees}
            />
            <InfoItem 
              icon={CalendarIcon}
              label="Founded"
              value={data.companyInfo.foundingYear}
            />
            <InfoItem 
              icon={BuildingOfficeIcon}
              label="Company Type"
              value={data.companyInfo.companyType}
            />
          </Grid>

          <div className="pt-4 border-t">
            <Text className="font-semibold mb-2 text-sm sm:text-base">Tagline</Text>
            <Text className="text-base sm:text-lg italic text-gray-600">"{data.companyInfo.tagline}"</Text>
          </div>

          <div>
            <Text className="font-semibold mb-2 text-sm sm:text-base">Specialties</Text>
            <div className="flex flex-wrap gap-2">
              {data.companyInfo.specialties.map((specialty, index) => (
                <span 
                  key={index} 
                  className="px-2 py-0.5 sm:px-3 sm:py-1 bg-blue-50 text-blue-700 rounded-full text-xs sm:text-sm font-medium hover:bg-blue-100 transition-colors duration-200"
                >
                  {specialty}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Competitor Analysis Block */}
      <Card className="p-4 sm:p-6 hover:shadow-lg transition-shadow duration-200">
        <Title className="text-xl sm:text-2xl mb-4 sm:mb-6">Competitor Analysis</Title>
        <div className="space-y-6 sm:space-y-8">
          {data.competitors.map((competitor, index) => (
            <div key={index} className={`${index !== 0 ? 'border-t pt-6 sm:pt-8' : ''}`}>
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="p-1.5 sm:p-2 bg-purple-50 rounded-lg">
                  <BuildingOfficeIcon className="h-3.5 w-3.5 sm:h-5 sm:w-5 text-purple-500" />
                </div>
                <Text className="text-lg sm:text-xl font-semibold text-purple-900">{competitor.name}</Text>
              </div>
              <Text className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">{competitor.description}</Text>
              <div className="bg-purple-50 rounded-lg p-3 sm:p-4">
                <Text className="font-semibold text-purple-900 mb-2 text-sm sm:text-base">Key Differences</Text>
                <ul className="space-y-2">
                  {competitor.differences.map((difference, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <SparklesIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-500 flex-shrink-0 mt-0.5" />
                      <Text className="text-sm sm:text-base text-gray-700">{difference}</Text>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
