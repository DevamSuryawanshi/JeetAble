'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import BackButton from '@/components/BackButton'
import VoiceAssistant from '@/components/VoiceAssistant'
import { useAccessibility } from '@/components/AccessibilityProvider'
import { JobModel } from '@/models/JobModel'

export default function JobPortal() {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const [selectedJob, setSelectedJob] = useState<JobModel | null>(null)
  const [jobs, setJobs] = useState<JobModel[]>([])
  const [loading, setLoading] = useState(true)
  const { speak } = useAccessibility()

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/jobs-portal')
      const data = await response.json()
      
      if (data.success) {
        setJobs(data.data)
        speak(`Found ${data.data.length} accessible job opportunities`)
      }
    } catch (error) {
      console.error('Error fetching jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  const filters = [
    'Remote Work',
    'Wheelchair Accessible',
    'Flexible Hours',
    'ASL Interpreter Available',
    'Screen Reader Compatible',
    'Visual Accommodations',
    'Assistive Technology Support'
  ]

  const toggleFilter = (filter: string) => {
    setSelectedFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    )
  }

  const filteredJobs = jobs.filter(job => 
    selectedFilters.length === 0 || 
    selectedFilters.some(filter => job.description.toLowerCase().includes(filter.toLowerCase()))
  )

  const handleJobClick = (job: JobModel) => {
    setSelectedJob(job)
    speak(`Opening job details for ${job.title} at ${job.company}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-4 py-8" role="main">
        <div className="mb-6">
          <BackButton />
        </div>
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Accessible Job Portal
          </h1>
          <p className="text-xl text-gray-600">
            Find disability-friendly employment opportunities
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-4">🔍 Accessibility Filters</h2>
              <div className="space-y-3">
                {filters.map((filter) => (
                  <label key={filter} className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedFilters.includes(filter)}
                      onChange={() => toggleFilter(filter)}
                      className="mr-3 h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-300 rounded"
                      aria-describedby={`filter-${filter}`}
                    />
                    <span className="text-sm text-gray-700">{filter}</span>
                  </label>
                ))}
              </div>
              
              <button
                onClick={() => setSelectedFilters([])}
                className="mt-4 w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 focus:outline-none focus-visible transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Job Listings */}
          <div className="lg:col-span-3">
            <div className="mb-4 flex justify-between items-center">
              <p className="text-gray-600">
                {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} found
              </p>
              <button
                onClick={() => speak(`Found ${filteredJobs.length} accessible job opportunities`)}
                className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 focus:outline-none focus-visible transition-colors"
              >
                🔊 Announce Results
              </button>
            </div>

            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer focus:outline-none focus-visible"
                  onClick={() => handleJobClick(job)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleJobClick(job)
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`View details for ${job.title} at ${job.company}`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                      <p className="text-lg text-primary-600">{job.company}</p>
                    </div>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      Full-time
                    </span>
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-gray-600 mb-2">📍 {job.location}</p>
                    <p className="text-gray-600 mb-2">💰 {job.salaryRange}</p>
                  </div>

                  <div className="mb-3">
                    <p className="text-gray-800 line-clamp-2">{job.description}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                      ♿ Accessible Workplace
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {filteredJobs.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No jobs match your selected filters.</p>
                <button
                  onClick={() => setSelectedFilters([])}
                  className="mt-4 bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 focus:outline-none focus-visible transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Job Details Modal */}
        {selectedJob && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">{selectedJob.title}</h2>
                <button
                  onClick={() => setSelectedJob(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl focus:outline-none focus-visible"
                  aria-label="Close job details"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg text-primary-600">{selectedJob.company}</h3>
                  <p className="text-gray-600">📍 {selectedJob.location}</p>
                  <p className="text-gray-600">💰 {selectedJob.salary}</p>
                  <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mt-2">
                    {selectedJob.type}
                  </span>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Job Description</h4>
                  <p className="text-gray-700">{selectedJob.description}</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">♿ Accessibility Features</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.accessibility.map((feature, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button className="flex-1 bg-primary-500 text-white py-3 px-4 rounded-lg hover:bg-primary-600 focus:outline-none focus-visible transition-colors">
                    📄 Apply Now
                  </button>
                  <button className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-300 focus:outline-none focus-visible transition-colors">
                    💾 Save Job
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Upload Resume Section */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">📄 Upload Your Resume</h2>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <div className="mb-4">
              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="text-lg text-gray-600 mb-2">Upload your resume (PDF or Video)</p>
            <p className="text-sm text-gray-500 mb-4">Support for traditional PDF resumes and video introductions</p>
            <button className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 focus:outline-none focus-visible transition-colors">
              Choose File
            </button>
          </div>
        </div>
      </main>

      <VoiceAssistant />
    </div>
  )
}