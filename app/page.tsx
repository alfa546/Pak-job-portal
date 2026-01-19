"use client";

import { useState, useEffect } from "react";
import JobCard from "@/components/JobCard";
import SearchBar from "@/components/SearchBar";
import { Job } from "@/data/jobs";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [jobTitleQuery, setJobTitleQuery] = useState("");
  const [cityQuery, setCityQuery] = useState("");

  // Fetch and filter jobs from Supabase
  useEffect(() => {
    async function fetchJobs() {
      try {
        setLoading(true);
        setError(null);

        let query = supabase
          .from("jobs")
          .select("*")
          .order("created_at", { ascending: false });

        // Apply title filter if provided (case-insensitive)
        if (jobTitleQuery.trim()) {
          query = query.ilike("title", `%${jobTitleQuery.trim()}%`);
        }

        // Apply location filter if provided (case-insensitive)
        if (cityQuery.trim()) {
          query = query.ilike("location", `%${cityQuery.trim()}%`);
        }

        const { data, error: fetchError } = await query;

        if (fetchError) {
          throw fetchError;
        }

        setJobs(data || []);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch jobs. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    }

    // Debounce search queries to avoid too many API calls
    const timeoutId = setTimeout(() => {
      fetchJobs();
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [jobTitleQuery, cityQuery]);

  // Use jobs directly since filtering is done server-side
  const filteredJobs = jobs;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-5xl lg:text-7xl font-extrabold mb-6 animate-fade-in">
              Find Your Dream Job in
              <span className="block text-yellow-300">Pakistan</span>
            </h1>
            <p className="text-xl lg:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Discover thousands of job opportunities across Pakistan. From IT to healthcare, find the perfect career match today.
            </p>
            <div className="flex justify-center space-x-4">
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-6 py-3">
                <span className="text-lg font-semibold">🚀 {filteredJobs.length}+ Jobs Available</span>
              </div>
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-6 py-3">
                <span className="text-lg font-semibold">🏢 Top Companies</span>
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

      {/* Header/Navigation */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">J</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                JobBoard PK
              </h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#jobs" className="text-blue-600 font-semibold">Browse Jobs</a>
              <a href="/companies" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Companies</a>
              <a href="/about" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">About</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" id="jobs">
        {/* Search Section */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-12 transform hover:scale-105 transition-transform duration-300">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Search Your Perfect Job</h2>
            <p className="text-gray-600">Use our advanced filters to find jobs that match your skills and location</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Job Title or Keywords
              </label>
              <SearchBar
                onSearch={setJobTitleQuery}
                placeholder="e.g., Software Engineer, Graphic Designer..."
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700  items-center">
                <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                City or Location
              </label>
              <SearchBar
                onSearch={setCityQuery}
                placeholder="e.g., Karachi, Lahore, Islamabad..."
              />
            </div>
          </div>
        </div>

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
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Finding Your Perfect Job</h3>
            <p className="text-gray-600">Searching through thousands of opportunities...</p>
            <div className="mt-6 flex justify-center space-x-2">
              <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-purple-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl shadow-xl p-8 mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-red-100 rounded-full p-3">
                <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-bold text-red-900 text-center mb-2">Oops! Something went wrong</h3>
            <p className="text-red-800 text-center mb-4">{error}</p>
            <div className="text-center">
              <button
                onClick={() => window.location.reload()}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Results Count */}
        {!loading && !error && (
          <div className="mb-8 text-center">
            <div className="inline-flex items-center bg-white rounded-full shadow-lg px-6 py-3">
              <svg className="w-6 h-6 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-800 font-semibold">
                Found <span className="text-blue-600 font-bold text-xl">{filteredJobs.length}</span>{" "}
                {filteredJobs.length === 1 ? "amazing job" : "amazing jobs"} for you!
              </p>
            </div>
          </div>
        )}

        {/* Job Cards Grid */}
        {!loading && !error && filteredJobs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredJobs.map((job, index) => (
              <div key={job.id} className="animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                <JobCard job={job} />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredJobs.length === 0 && (
          <div className="bg-white rounded-2xl shadow-2xl p-16 text-center">
            <div className="mb-6">
              <svg className="mx-auto h-20 w-20 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {jobs.length === 0
                ? "No jobs available right now"
                : "No jobs match your search"}
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {jobs.length === 0
                ? "We&apos;re constantly updating our job listings. Check back soon for new opportunities!"
                : "Try adjusting your search terms or location to find more results."}
            </p>
            {jobs.length > 0 && (
              <button
                onClick={() => {
                  setJobTitleQuery('');
                  setCityQuery('');
                }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </main>

      {/* About Section */}
      <section className="bg-gradient-to-br from-white via-blue-50 to-purple-50 py-20" id="about">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6">
              About
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                JobBoard PK
              </span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-8"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Side - Mission & Vision */}
            <div className="space-y-8">
              <div className="bg-white rounded-3xl shadow-xl p-8 transform hover:scale-105 transition-transform duration-300">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mr-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Our Mission</h3>
                </div>
                <p className="text-gray-700 text-lg leading-relaxed">
                  <strong>JobBoard PK</strong> ka main kaam hai Pakistan mein <strong>newly jobs find karna</strong> or logo ke liye job search ko <strong>asan aur convenient</strong> banana. Hum chahte hain ke har Pakistani ko woh job mile jo uske skills or passion ke mutabiq ho.
                </p>
              </div>

              <div className="bg-white rounded-3xl shadow-xl p-8 transform hover:scale-105 transition-transform duration-300">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center mr-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Our Vision</h3>
                </div>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Humara vision hai ke Pakistan ka <strong>har shaks job market mein apni place banaye</strong>. Whether you're a fresh graduate, experienced professional, or career changer - <strong>JobBoard PK aapki career ki journey ko easy or successful banata hai</strong>.
                </p>
              </div>
            </div>

            {/* Right Side - Motivational Content */}
            <div className="space-y-8">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white">
                <h3 className="text-3xl font-bold mb-6">🚀 Your Career Journey Starts Here!</h3>
                <div className="space-y-4 text-lg">
                  <p className="flex items-start">
                    <span className="text-yellow-300 mr-3 text-2xl">✨</span>
                    <strong>Believe in yourself</strong> - Har success story ek dream se start hoti hai
                  </p>
                  <p className="flex items-start">
                    <span className="text-yellow-300 mr-3 text-2xl">🎯</span>
                    <strong>Stay focused</strong> - Apne goals par focus karein, success automatically follow karega
                  </p>
                  <p className="flex items-start">
                    <span className="text-yellow-300 mr-3 text-2xl">💪</span>
                    <strong>Never give up</strong> - Har rejection ek step hai success ki taraf
                  </p>
                  <p className="flex items-start">
                    <span className="text-yellow-300 mr-3 text-2xl">🌟</span>
                    <strong>Keep learning</strong> - Skills update karte rahein, opportunities khud aayengi
                  </p>
                  <p className="flex items-start">
                    <span className="text-yellow-300 mr-3 text-2xl">🤝</span>
                    <strong>Network smartly</strong> - Sahiyon connections se career boost milta hai
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Why Choose JobBoard PK?</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-blue-50 p-4 rounded-xl">
                    <div className="text-2xl mb-2">🎯</div>
                    <strong>Latest Jobs</strong><br/>
                    Daily updated job listings
                  </div>
                  <div className="bg-purple-50 p-4 rounded-xl">
                    <div className="text-2xl mb-2">🏢</div>
                    <strong>Top Companies</strong><br/>
                    Pakistan&apos;s best employers
                  </div>
                  <div className="bg-green-50 p-4 rounded-xl">
                    <div className="text-2xl mb-2">📍</div>
                    <strong>All Locations</strong><br/>
                    Lahore, Karachi, Islamabad & more
                  </div>
                  <div className="bg-orange-50 p-4 rounded-xl">
                    <div className="text-2xl mb-2">⚡</div>
                    <strong>Easy Apply</strong><br/>
                    One-click job applications
                  </div>
                </div>
              </div>

              {/* Powered By Section */}
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-3xl p-8 text-center text-white shadow-xl">
                <h3 className="text-2xl font-bold mb-4">🚀 Powered by Nouman Sajid</h3>
                <p className="text-lg mb-4">
                  Dedicated to empowering Pakistan&apos;s job seekers with cutting-edge technology and user-friendly solutions.
                </p>
                <div className="flex justify-center space-x-4">
                  <div className="bg-white bg-opacity-20 px-4 py-2 rounded-full">
                    <span className="font-semibold">💻 Full Stack Developer</span>
                  </div>
                  <div className="bg-white bg-opacity-20 px-4 py-2 rounded-full">
                    <span className="font-semibold">🎨 UI/UX Expert</span>
                  </div>
                  <div className="bg-white bg-opacity-20 px-4 py-2 rounded-full">
                    <span className="font-semibold">🚀 Tech Innovator</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-3xl p-12 text-white">
              <h3 className="text-3xl lg:text-4xl font-bold mb-6">
                Ready to Find Your Dream Job? 🎯
              </h3>
              <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
                Start your career journey today! Browse thousands of job opportunities and take the first step towards your dream career.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/"
                  className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-105"
                >
                  Browse Jobs Now →
                </a>
                <a
                  href="#companies"
                  className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-105"
                >
                  Explore Companies →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

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
                Connecting Pakistan&apos;s top talent with leading companies. Find your dream job or discover the perfect candidate.
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
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
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
              © 2026 JobBoard PK. All rights reserved.
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
