/**
 * Script to fetch jobs from JSearch API (RapidAPI) and save to Supabase
 * Run with: npx tsx scripts/fetch-jobs.ts
 * Or: npm run fetch-jobs
 * 
 * Make sure you have a .env file with:
 * - NEXT_PUBLIC_SUPABASE_URL (or SUPABASE_URL)
 * - NEXT_PUBLIC_SUPABASE_ANON_KEY (or SUPABASE_ANON_KEY)
 * - SUPABASE_SERVICE_ROLE_KEY (optional, but recommended)
 * - RAPIDAPI_KEY (get from https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch)
 */

// Load environment variables from .env file
import * as dotenv from 'dotenv';
import path from 'path';

// Forcefully loading .env.local from the root folder
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

import { supabase } from '../lib/supabase-client';
import { validateAndNormalizeUrl } from '../lib/utils';
import { JOB_KEYWORDS } from './JOB_KEYWORDS';

/**
 * Script to fetch jobs from JSearch API (RapidAPI) and save to Supabase
 * Run with: npx tsx scripts/fetch-jobs.ts
 * Or: npm run fetch-jobs
 * 
 * Make sure you have a .env file with:
 * - NEXT_PUBLIC_SUPABASE_URL (or SUPABASE_URL)
 * - NEXT_PUBLIC_SUPABASE_ANON_KEY (or SUPABASE_ANON_KEY)
 * - SUPABASE_SERVICE_ROLE_KEY (optional, but recommended)
 * - RAPIDAPI_KEY (get from https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch)
 */

interface JSearchJob {
  job_id: string;
  job_title: string;
  employer_name?: string;
  employer_logo?: string;
  employer_website?: string;
  job_publisher?: string;
  job_employment_type?: string;
  job_apply_link?: string;
  job_description?: string;
  job_city?: string;
  job_state?: string;
  job_country?: string;
  job_posted_at_datetime_utc?: string;
  job_offer_expiration_datetime_utc?: string;
  job_min_salary?: number;
  job_max_salary?: number;
  job_salary_currency?: string;
  job_salary_period?: string;
  job_required_experience?: {
    no_experience_required?: boolean;
    required_experience_in_months?: number;
    experience_mentioned?: boolean;
    experience_preferred?: boolean;
  };
  job_required_skills?: string[];
  job_required_education?: {
    postgraduate_degree?: boolean;
    professional_certification?: boolean;
    high_school?: boolean;
    associates_degree?: boolean;
    bachelors_degree?: boolean;
    degree_mentioned?: boolean;
    degree_preferred?: boolean;
    professional_certification_mentioned?: boolean;
  };
  job_benefits?: string[];
}

interface JSearchResponse {
  status: string;
  request_id: string;
  parameters: {
    query: string;
    page: number;
    num_pages: number;
  };
  data: JSearchJob[];
}

/**
 * Process and save a single job to Supabase using upsert
 */
async function processJob(
  job: JSearchJob,
  category: string,
  stats: { savedCount: number; skippedCount: number; errors: string[] }
): Promise<void> {
  try {
    // Validate and normalize URL first
    const normalizedUrl = validateAndNormalizeUrl(job.job_apply_link || '');

    if (!normalizedUrl) {
      console.warn(
        `⚠️  Skipping job "${job.job_title}": Invalid or relative URL: ${job.job_apply_link}`
      );
      stats.skippedCount++;
      return;
    }

    // Prepare location string
    const location = [job.job_city, job.job_state, job.job_country]
      .filter(Boolean)
      .join(', ') || 'Pakistan';

    // Prepare company name
    const company = job.employer_name || 'Unknown Company';

    // Use upsert to insert or update job (based on apply_url unique constraint)
    const { error: upsertError } = await supabase
      .from('jobs')
      .upsert(
        {
          title: job.job_title,
          company: company,
          location: location,
          apply_url: normalizedUrl, // This is the unique key for upsert
          job_id: job.job_id,
          category: category, // Add category from keyword
          description: job.job_description || null,
          employment_type: job.job_employment_type || null,
        },
        {
          onConflict: 'apply_url', // Use apply_url as the conflict resolution key
        }
      );

    if (upsertError) {
      const errorMsg = `Error saving job ${job.job_id}: ${upsertError.message}`;
      stats.errors.push(errorMsg);
      console.error(`  ✗ ${errorMsg}`);
    } else {
      stats.savedCount++;
      console.log(`  ✓ Saved/Updated: ${job.job_title} at ${company} (${location}) - Category: ${category}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorMsg = `Error processing job ${job.job_id}: ${errorMessage}`;
    stats.errors.push(errorMsg);
    console.error(`  ✗ ${errorMsg}`);
  }
}

/**
 * Fetch jobs for a specific keyword from JSearch API (RapidAPI) for Pakistan
 */
async function fetchJobsForKeyword(
  keyword: string,
  rapidApiKey: string,
  page: number = 1
): Promise<JSearchJob[]> {
  const query = keyword;
  const url = 'https://jsearch.p.rapidapi.com/search';
  
  const params = new URLSearchParams({
    query: query,
    page: page.toString(),
    num_pages: '1',
  });

  console.log(`\n🔍 Searching for: "${query}" (page ${page})`);

  const response = await fetch(`${url}?${params.toString()}`, {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': rapidApiKey,
      'X-RapidAPI-Host': 'jsearch.p.rapidapi.com',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`JSearch API Error: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const data: JSearchResponse = await response.json();

  if (!data.data || data.data.length === 0) {
    if (page === 1) {
      console.log(`  No jobs found for ${keyword}`);
    }
    return [];
  }

  console.log(`  Found ${data.data.length} jobs for ${keyword} (page ${page})`);
  return data.data;
}

/**
 * Delay function to avoid rate limiting
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchJobsFromJSearch() {
  // Test Supabase connection first
  console.log('Testing Supabase connection...');
  const { data: testData, error: testError } = await supabase
    .from('jobs')
    .select('id')
    .limit(1);

  if (testError) {
    throw new Error(
      `Failed to connect to Supabase: ${testError.message}\n` +
      `Make sure:\n` +
      `1. Your Supabase URL and keys are correct in .env file\n` +
      `2. The 'jobs' table exists in your Supabase database\n` +
      `3. You have the correct permissions (use service role key for inserts)`
    );
  }
  console.log('✓ Supabase connection successful\n');

  const rapidApiKey = process.env.RAPIDAPI_KEY;

  if (!rapidApiKey) {
    throw new Error(
      'RapidAPI key is not set.\n' +
      'Please add RAPIDAPI_KEY to your .env file\n' +
      'Get your key from: https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch'
    );
  }

  console.log(`📋 Fetching jobs from JSearch API (RapidAPI) for ${JOB_KEYWORDS.length} keywords...`);
  console.log(`Keywords: ${JOB_KEYWORDS.join(', ')}\n`);
  console.log(`Country: Pakistan\n`);

  // Statistics across all keywords
  const totalStats = {
    savedCount: 0,
    skippedCount: 0,
    errors: [] as string[],
    totalFound: 0,
  };

  // Process each keyword
  for (let i = 0; i < JOB_KEYWORDS.length; i++) {
    const keyword = JOB_KEYWORDS[i];
    
    try {
      // Fetch jobs for this keyword (fetch first page, can extend to multiple pages)
      const jobs = await fetchJobsForKeyword(keyword, rapidApiKey, 1);
      totalStats.totalFound += jobs.length;

      if (jobs.length > 0) {
        console.log(`  Processing ${jobs.length} jobs for "${keyword}"...`);
        
        // Process each job with the category/keyword
        for (const job of jobs) {
          await processJob(job, keyword, totalStats);
        }
      }

      // Add delay between keywords to avoid rate limiting (except for last keyword)
      if (i < JOB_KEYWORDS.length - 1) {
        console.log(`  Waiting 1 second before next keyword...`);
        await delay(1000);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorMsg = `Error fetching jobs for keyword "${keyword}": ${errorMessage}`;
      totalStats.errors.push(errorMsg);
      console.error(`  ✗ ${errorMsg}`);
    }
  }

  // Print summary
  console.log('\n' + '='.repeat(50));
  console.log('=== FINAL SUMMARY ===');
  console.log('='.repeat(50));
  console.log(`Keywords processed: ${JOB_KEYWORDS.length}`);
  console.log(`Total jobs found: ${totalStats.totalFound}`);
  console.log(`✅ Saved/Updated: ${totalStats.savedCount}`);
  console.log(`⏭️  Skipped (invalid URLs): ${totalStats.skippedCount}`);
  if (totalStats.errors.length > 0) {
    console.log(`❌ Errors: ${totalStats.errors.length}`);
    totalStats.errors.forEach((err) => console.error(`  - ${err}`));
  }
  console.log('='.repeat(50));
}

// Run the script
fetchJobsFromJSearch()
  .then(() => {
    console.log('\nScript completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\nScript failed:', error);
    process.exit(1);
  });
