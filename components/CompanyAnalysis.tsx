import { Card, Title, Text, Grid } from '@tremor/react'
import { BuildingOfficeIcon, GlobeAltIcon, UserGroupIcon, CalendarIcon, SparklesIcon } from '@heroicons/react/24/outline'

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
  company: {
    name: string
    website: string
    industry: string
    location: string
    employees: string
    foundingYear: string
    companyType: string
    punchline: string
    tagline: string
    specialties: string[]
  }
  competitors: Competitor[]
}

export default function CompanyAnalysis({ data }: { data: AnalysisData }) {
  const { company, competitors } = data

  return (
    <div className="space-y-8 sm:space-y-12 fade-in">
      {/* Company Overview */}
      <Card className="card">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8">
          <div>
            <Title className="text-2xl sm:text-3xl font-bold text-light mb-2">{company.name}</Title>
            <Text className="text-gray-400">{company.tagline}</Text>
          </div>
          <a
            href={`https://${company.website}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 sm:mt-0 inline-flex items-center gap-2 text-primary hover:opacity-80 transition-colors"
          >
            <GlobeAltIcon className="h-5 w-5" />
            <span>{company.website}</span>
          </a>
        </div>

        <Grid numItems={1} numItemsSm={2} numItemsLg={3} className="gap-6">
          <InfoCard
            icon={BuildingOfficeIcon}
            label="Industry"
            value={company.industry}
          />
          <InfoCard
            icon={GlobeAltIcon}
            label="Location"
            value={company.location}
          />
          <InfoCard
            icon={UserGroupIcon}
            label="Employees"
            value={company.employees}
          />
          <InfoCard
            icon={CalendarIcon}
            label="Founded"
            value={company.foundingYear}
          />
          <InfoCard
            icon={BuildingOfficeIcon}
            label="Company Type"
            value={company.companyType}
          />
        </Grid>
      </Card>

      {/* Company Details */}
      <Card className="card">
        <Title className="text-xl sm:text-2xl font-bold text-light mb-6">Company Details</Title>
        <div className="space-y-6">
          <div>
            <Text className="text-gray-400 mb-2">Punchline</Text>
            <Text className="text-lg text-light">{company.punchline}</Text>
          </div>
          <div>
            <Text className="text-gray-400 mb-3">Specialties</Text>
            <div className="flex flex-wrap gap-2">
              {company.specialties.map((specialty, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                >
                  {specialty}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Competitors Analysis */}
      <div className="space-y-6">
        <Title className="text-2xl font-bold text-light">Competitor Analysis</Title>
        <div className="grid grid-cols-1 gap-6">
          {competitors.map((competitor, index) => (
            <Card key={index} className="card">
              <Title className="text-xl font-bold text-light mb-4">{competitor.name}</Title>
              <Text className="text-gray-400 mb-6">{competitor.description}</Text>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <div>
                  <Text className="text-gray-400">Industry</Text>
                  <Text className="text-light">{competitor.industry}</Text>
                </div>
                <div>
                  <Text className="text-gray-400">Location</Text>
                  <Text className="text-light">{competitor.location}</Text>
                </div>
                <div>
                  <Text className="text-gray-400">Employees</Text>
                  <Text className="text-light">{competitor.employees}</Text>
                </div>
              </div>

              <div>
                <Text className="text-gray-400 mb-3">Key Differences</Text>
                <ul className="space-y-2">
                  {competitor.differences.map((difference, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <SparklesIcon className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <Text className="text-light">{difference}</Text>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

function InfoCard({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
      <div className="flex items-center gap-3 mb-2">
        <Icon className="h-5 w-5 text-primary" />
        <Text className="text-gray-400">{label}</Text>
      </div>
      <Text className="text-light font-medium">{value}</Text>
    </div>
  )
}
