"use client";

import { useState, useEffect } from "react";
import JobCard from "@/components/JobCard";
import { Job } from "@/data/jobs";
import { supabase } from "@/lib/supabase";

interface Company {
  name: string;
  jobCount: number;
  locations: string[];
  jobs: Job[];
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [showCompanyModal, setShowCompanyModal] = useState(false);

  // Fetch companies data
  useEffect(() => {
    async function fetchCompanies() {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from("jobs")
          .select("*")
          .order("created_at", { ascending: false });

        if (fetchError) {
          throw fetchError;
        }

        // Group jobs by company
        const companyMap = new Map<string, Company>();

        (data || []).forEach((job: Job) => {
          if (!companyMap.has(job.company)) {
            companyMap.set(job.company, {
              name: job.company,
              jobCount: 0,
              locations: [],
              jobs: []
            });
          }

          const company = companyMap.get(job.company)!;
          company.jobCount++;
          company.jobs.push(job);

          if (!company.locations.includes(job.location)) {
            company.locations.push(job.location);
          }
        });

        setCompanies(Array.from(companyMap.values()));
      } catch (err) {
        console.error("Error fetching companies:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCompanies();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header/Navigation */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <a href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">J</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                JobBoard PK
              </h1>
            </a>
            <nav className="hidden md:flex space-x-8">
              <a href="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Browse Jobs</a>
              <a href="/companies" className="text-blue-600 font-semibold">Companies</a>
              <a href="/about" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">About</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-5xl lg:text-7xl font-extrabold mb-6 animate-fade-in">
              Top Companies Hiring in
              <span className="block text-yellow-300">Pakistan</span>
            </h1>
            <p className="text-xl lg:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Discover amazing opportunities at Pakistan&apos;s leading companies. From tech giants to innovative startups, find your next career move.
            </p>
            <div className="flex justify-center space-x-4">
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-6 py-3">
                <span className="text-lg font-semibold">🏢 {companies.length}+ Companies</span>
              </div>
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-6 py-3">
                <span className="text-lg font-semibold">💼 {companies.reduce((acc, company) => acc + company.jobCount, 0)}+ Open Positions</span>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-12 fill-current text-white">
            <path d="M0,32L48,37.3C96,43,192,53,288,58.7C384,64,480,64,576,58.7C672,53,768,43,864,48C960,53,1056,75,1152,80C1248,85,1344,75,1392,69.3L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
          </svg>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-2xl shadow-2xl p-16 text-center">
            <div className="flex justify-center items-center mb-6">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Loading Companies</h3>
            <p className="text-gray-600">Finding Pakistan's top employers...</p>
          </div>
        )}

        {/* Companies Grid */}
        {!loading && companies.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {companies.map((company, index) => (
              <div
                key={company.name}
                className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 cursor-pointer group animate-fade-in"
                style={{animationDelay: `${index * 0.1}s`}}
                onClick={() => {
                  setSelectedCompany(company);
                  setShowCompanyModal(true);
                }}
              >
                <div className="p-8">
                  {/* Company Avatar */}
                  <div className="flex items-center justify-center mb-6">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                      <span className="text-white font-bold text-2xl">
                        {company.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Company Name */}
                  <h3 className="text-xl font-bold text-gray-900 text-center mb-4 group-hover:text-blue-600 transition-colors">
                    {company.name}
                  </h3>

                  {/* Job Count */}
                  <div className="text-center mb-4">
                    <div className="inline-flex items-center bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 px-4 py-2 rounded-full">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="font-semibold">{company.jobCount} {company.jobCount === 1 ? 'Job' : 'Jobs'} Available</span>
                    </div>
                  </div>

                  {/* Locations */}
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">Locations:</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {company.locations.map((location) => (
                        <span
                          key={location}
                          className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-medium"
                        >
                          {location}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Hover Effect */}
                <div className="px-8 pb-6">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-xl opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    <p className="text-center font-semibold">View All Jobs →</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && companies.length === 0 && (
          <div className="bg-white rounded-2xl shadow-2xl p-16 text-center">
            <div className="mb-6">
              <svg className="mx-auto h-20 w-20 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No Companies Available</h3>
            <p className="text-gray-600">We're working on adding more companies to our platform.</p>
          </div>
        )}
      </main>

      {/* Company Modal */}
      {showCompanyModal && selectedCompany && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-fade-in">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center">
                    <span className="text-white font-bold text-2xl">
                      {selectedCompany.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold">{selectedCompany.name}</h2>
                    <p className="text-blue-100 mt-1">
                      {selectedCompany.jobCount} {selectedCompany.jobCount === 1 ? 'Position' : 'Positions'} Available
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowCompanyModal(false)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-8 max-h-[60vh] overflow-y-auto">
              {/* Company Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-2xl text-center">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-blue-900">{selectedCompany.jobCount}</h3>
                  <p className="text-blue-700">Open Positions</p>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-2xl text-center">
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-purple-900">{selectedCompany.locations.length}</h3>
                  <p className="text-purple-700">Locations</p>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-2xl text-center">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-green-900">Active</h3>
                  <p className="text-green-700">Hiring Status</p>
                </div>
              </div>

              {/* Locations */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Locations</h3>
                <div className="flex flex-wrap gap-3">
                  {selectedCompany.locations.map((location) => (
                    <div key={location} className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full font-medium">
                      📍 {location}
                    </div>
                  ))}
                </div>
              </div>

              {/* Jobs List */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Available Positions</h3>
                <div className="space-y-4">
                  {selectedCompany.jobs.map((job) => (
                    <div key={job.id} className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-900 mb-2">{job.title}</h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                            <span className="flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {job.location}
                            </span>
                            {job.employment_type && (
                              <span className="flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {job.employment_type}
                              </span>
                            )}
                            {job.category && (
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                                {job.category}
                              </span>
                            )}
                          </div>
                          {job.description && (
                            <p className="text-gray-700 text-sm line-clamp-2">{job.description}</p>
                          )}
                        </div>
                        <a
                          href={job.apply_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 ml-4"
                        >
                          Apply Now
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">J</span>
                </div>
                <h3 className="text-2xl font-bold">JobBoard PK</h3>
              </div>
              <p className="text-gray-300 mb-4 max-w-md">
                Connecting Pakistan's top talent with leading companies. Find your dream job or discover the perfect candidate.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.749.097.118.112.221.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001.012.017z"/></svg>
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="/" className="text-gray-400 hover:text-white transition-colors">Browse Jobs</a></li>
                <li><a href="/companies" className="text-gray-400 hover:text-white transition-colors">Companies</a></li>
                <li><a href="/about" className="text-gray-400 hover:text-white transition-colors">About</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center">
            <p className="text-gray-400 mb-2">
              © 2024 JobBoard PK. All rights reserved.
            </p>
            <p className="text-yellow-400 font-semibold text-lg">
              MADE BY NOUMAN SAJID
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}