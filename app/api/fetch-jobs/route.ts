import { NextRequest, NextResponse } from 'next/server';
import { supabaseForInserts } from '@/lib/supabase-admin';
import { validateAndNormalizeUrl } from '@/lib/utils';

interface AdzunaJob {
  id: string;
  title: string;
  company?: {
    display_name?: string;
  };
  location?: {
    display_name?: string;
    area?: string[];
  };
  redirect_url: string;
  description?: string;
  category?: {
    label?: string;
    tag?: string;
  };
  created?: string;
  salary_min?: number;
  salary_max?: number;
}

interface AdzunaResponse {
  results: AdzunaJob[];
  count: number;
}

// Job keywords to search for in Pakistan
const JOB_KEYWORDS = [
  'Medical',
  'Teaching',
  'Accounting',
  'Sales',
  'Driver',
  'Construction',
  'Engineering',
  'Nursing',
];

/**
 * Process and save a single job to Supabase using upsert
 */
async function processJob(
  job: AdzunaJob,
  category: string,
  stats: { savedCount: number; skippedCount: number; errors: string[] }
): Promise<void> {
  try {
    // Validate and normalize the apply URL
    const normalizedUrl = validateAndNormalizeUrl(job.redirect_url);

    if (!normalizedUrl) {
      stats.skippedCount++;
      stats.errors.push(`Skipped job "${job.title}": Invalid or relative URL: ${job.redirect_url}`);
      return;
    }

    // Prepare location string
    const location = job.location?.display_name || 
                     job.location?.area?.join(', ') || 
                     'Pakistan';

    // Prepare company name
    const company = job.company?.display_name || 'Unknown Company';

    // Use upsert to insert or update job (based on apply_url unique constraint)
    const { error: upsertError } = await supabaseForInserts
      .from('jobs')
      .upsert(
        {
          title: job.title,
          company: company,
          location: location,
          apply_url: normalizedUrl, // This is the unique key for upsert
          job_id: job.id,
          category: category, // Add category from keyword
          description: job.description || null,
          employment_type: null, // Adzuna doesn't provide this directly
        },
        {
          onConflict: 'apply_url', // Use apply_url as the conflict resolution key
        }
      );

    if (upsertError) {
      stats.errors.push(`Error saving job ${job.id}: ${upsertError.message}`);
    } else {
      stats.savedCount++;
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    stats.errors.push(`Error processing job ${job.id}: ${errorMessage}`);
  }
}

/**
 * Fetch jobs for a specific keyword from Adzuna API for Pakistan
 */
async function fetchJobsForKeyword(
  keyword: string,
  adzunaAppId: string,
  adzunaAppKey: string,
  page: number = 1
): Promise<AdzunaJob[]> {
  const country = 'pk'; // Pakistan country code
  const url = `https://api.adzuna.com/v1/api/jobs/${country}/search/${page}`;
  
  const params = new URLSearchParams({
    app_id: adzunaAppId,
    app_key: adzunaAppKey,
    what: keyword,
    results_per_page: '50',
    content_type: 'application/json',
  });

  const response = await fetch(`${url}?${params.toString()}`);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Adzuna API Error: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const data: AdzunaResponse = await response.json();
  return data.results || [];
}

/**
 * Delay function to avoid rate limiting
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function GET(request: NextRequest) {
  try {
    const adzunaAppId = process.env.ADZUNA_APP_ID;
    const adzunaAppKey = process.env.ADZUNA_APP_KEY;

    if (!adzunaAppId || !adzunaAppKey) {
      return NextResponse.json(
        { 
          error: 'Adzuna API credentials are not configured',
          message: 'Please add ADZUNA_APP_ID and ADZUNA_APP_KEY to your environment variables. Get credentials from: https://developer.adzuna.com'
        },
        { status: 500 }
      );
    }

    // Statistics across all keywords
    const totalStats = {
      savedCount: 0,
      skippedCount: 0,
      errors: [] as string[],
      totalFound: 0,
      keywordsProcessed: 0,
    };

    // Process each keyword
    for (let i = 0; i < JOB_KEYWORDS.length; i++) {
      const keyword = JOB_KEYWORDS[i];

      try {
        // Fetch jobs for this keyword (fetch first page)
        const jobs = await fetchJobsForKeyword(keyword, adzunaAppId, adzunaAppKey, 1);
        totalStats.totalFound += jobs.length;
        totalStats.keywordsProcessed++;

        // Process each job with the category/keyword
        for (const job of jobs) {
          await processJob(job, keyword, totalStats);
        }

        // Add delay between keywords to avoid rate limiting (except for last keyword)
        if (i < JOB_KEYWORDS.length - 1) {
          await delay(1000);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        totalStats.errors.push(`Error fetching jobs for keyword "${keyword}": ${errorMessage}`);
      }
    }

    return NextResponse.json({
      message: 'Jobs processed successfully',
      keywordsProcessed: totalStats.keywordsProcessed,
      totalKeywords: JOB_KEYWORDS.length,
      totalFound: totalStats.totalFound,
      saved: totalStats.savedCount,
      skipped: totalStats.skippedCount,
      errors: totalStats.errors.length > 0 ? totalStats.errors : undefined,
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
