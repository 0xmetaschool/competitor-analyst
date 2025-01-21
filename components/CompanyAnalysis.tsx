import { Card, Title, Text, Grid } from '@tremor/react'
import { BuildingOfficeIcon, GlobeAltIcon, UserGroupIcon, CalendarIcon, SparklesIcon } from '@heroicons/react/24/outline'

interface CompanyBasic {
  name: string
  website: string
  industry: string
  location: string
  employees: string
  foundingYear: string
  companyType: string
}

interface CompanyDetails {
  punchline: string
  tagline: string
  specialties: string[]
}

interface Competitor {
  name: string
  description: string
  industry: string
  location: string
  employees: string
  foundingYear: string
  companyType: string
  differences: string[]
}

interface AnalysisData {
  companyInfo: CompanyBasic
  detailsData: {
    companyDetails: CompanyDetails
  }
  competitors: Competitor[]
}

export default function CompanyAnalysis({ data }: { data: AnalysisData }) {
  const { companyInfo, detailsData, competitors } = data

  return (
    <div className="space-y-8 sm:space-y-12">
      {/* Company Overview */}
      <Card className="p-6 sm:p-8 hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-lg border border-gray-100">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8">
          <div>
            <Title className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{companyInfo.name}</Title>
            <Text className="text-gray-600">{detailsData.companyDetails.tagline}</Text>
          </div>
          <a
            href={`https://${companyInfo.website}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 sm:mt-0 inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <GlobeAltIcon className="h-5 w-5" />
            <span>{companyInfo.website}</span>
          </a>
        </div>

        <Grid numItems={1} numItemsSm={2} numItemsLg={3} className="gap-6">
          <InfoCard
            icon={BuildingOfficeIcon}
            label="Industry"
            value={companyInfo.industry}
          />
          <InfoCard
            icon={GlobeAltIcon}
            label="Location"
            value={companyInfo.location}
          />
          <InfoCard
            icon={UserGroupIcon}
            label="Employees"
            value={companyInfo.employees}
          />
          <InfoCard
            icon={CalendarIcon}
            label="Founded"
            value={companyInfo.foundingYear}
          />
          <InfoCard
            icon={BuildingOfficeIcon}
            label="Company Type"
            value={companyInfo.companyType}
          />
        </Grid>
      </Card>

      {/* Company Details */}
      <Card className="p-6 sm:p-8 hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-lg border border-gray-100">
        <Title className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Company Details</Title>
        <div className="space-y-6">
          <div>
            <Text className="text-gray-500 mb-2">Punchline</Text>
            <Text className="text-lg text-gray-900">{detailsData.companyDetails.punchline}</Text>
          </div>
          <div>
            <Text className="text-gray-500 mb-3">Specialties</Text>
            <div className="flex flex-wrap gap-2">
              {detailsData.companyDetails.specialties.map((specialty, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors"
                >
                  {specialty}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Competitor Analysis */}
      <div className="space-y-6">
        <Title className="text-xl sm:text-2xl font-bold text-gray-900 px-2">Competitor Analysis</Title>
        {competitors.map((competitor, index) => (
          <Card
            key={index}
            className="p-6 sm:p-8 hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-lg border border-gray-100"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
              <div>
                <Title className="text-xl font-bold text-gray-900 mb-2">{competitor.name}</Title>
                <Text className="text-gray-600">{competitor.description}</Text>
              </div>
            </div>

            <Grid numItems={1} numItemsSm={2} className="gap-6 mb-6">
              <InfoCard
                icon={BuildingOfficeIcon}
                label="Industry"
                value={competitor.industry}
              />
              <InfoCard
                icon={GlobeAltIcon}
                label="Location"
                value={competitor.location}
              />
              <InfoCard
                icon={UserGroupIcon}
                label="Employees"
                value={competitor.employees}
              />
              <InfoCard
                icon={CalendarIcon}
                label="Founded"
                value={competitor.foundingYear}
              />
            </Grid>

            <div>
              <Text className="text-gray-500 mb-4">Key Differences</Text>
              <div className="space-y-3">
                {competitor.differences.map((difference, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <SparklesIcon className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <Text className="text-gray-700">{difference}</Text>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

function InfoCard({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-white rounded-lg">
          <Icon className="h-5 w-5 text-blue-500" />
        </div>
        <Text className="font-medium text-gray-900">{label}</Text>
      </div>
      <Text className="text-gray-600 pl-11">{value}</Text>
    </div>
  )
}
