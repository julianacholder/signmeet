// app/api/jobs/diverse/route.ts - WITH CACHING
import { NextResponse } from 'next/server';

// In-memory cache (resets on server restart)
let cachedJobs: any = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

/**
 * Fetches diverse jobs with caching
 * - First load: Takes 2-4 seconds (fetches from API)
 * - Subsequent loads within 1 hour: Instant! (returns cache)
 */
export async function GET(request: Request) {
  // Check if we have valid cached data
  const now = Date.now();
  if (cachedJobs && (now - cacheTimestamp) < CACHE_DURATION) {
    console.log('✅ Returning cached jobs (instant!)');
    return NextResponse.json({
      success: true,
      jobs: cachedJobs,
      total: cachedJobs.length,
      cached: true,
      cacheAge: Math.floor((now - cacheTimestamp) / 1000) + 's'
    });
  }

  // Cache expired or doesn't exist - fetch fresh data
  console.log('🔄 Fetching fresh jobs from API...');

  if (!process.env.RAPIDAPI_KEY) {
    return NextResponse.json(
      { error: 'API key not configured' },
      { status: 500 }
    );
  }

  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
      'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
    }
  };

  try {
    const searches = [
      { query: 'remote customer service', location: '' },
      { query: 'data entry', location: 'Rwanda' },
      { query: 'software developer', location: 'Kenya' },
      { query: 'marketing', location: 'South Africa' },
      { query: 'accountant', location: 'United Kingdom' },
      { query: 'graphic designer remote', location: '' },
      { query: 'teacher', location: 'Canada' },
      { query: 'nurse', location: 'United States' },
    ];

    const selectedSearches = searches
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    const allJobs = [];

    for (const search of selectedSearches) {
      const searchQuery = search.location 
        ? `${search.query} in ${search.location}`
        : search.query;

      try {
        const response = await fetch(
          `https://jsearch.p.rapidapi.com/search?` +
          `query=${encodeURIComponent(searchQuery)}&` +
          `page=1&` +
          `num_pages=1`,
          options
        );

        if (!response.ok) continue;

        const data = await response.json();
        const jobsFromSearch = data.data?.slice(0, 2) || [];
        
        const transformedJobs = jobsFromSearch.map((job: any) => ({
          id: job.job_id,
          instructorName: job.employer_name,
          companyLogo: job.employer_logo,
          date: new Date(job.job_posted_at_timestamp * 1000).toLocaleDateString('en-US', {
            month: 'numeric',
            day: 'numeric',
            year: 'numeric'
          }),
          courseType: job.job_employment_type || 'FULLTIME',
          courseTitle: job.job_title,
          description: job.job_description,
          location: job.job_city 
            ? `${job.job_city}, ${job.job_state || job.job_country}` 
            : job.job_country || 'Remote',
          applyLink: job.job_apply_link,
          isRemote: job.job_is_remote,
          salary: job.job_min_salary && job.job_max_salary
            ? `${job.job_min_salary.toLocaleString()}-${job.job_max_salary.toLocaleString()} ${job.job_salary_currency || 'USD'}`
            : null,
          requiredSkills: job.job_required_skills || [],
          highlights: job.job_highlights || {},
          searchSource: search.location || 'Remote',
        }));

        allJobs.push(...transformedJobs);
      } catch (err) {
        console.error(`Error fetching jobs for ${search.query}:`, err);
        continue;
      }
    }

    const shuffledJobs = allJobs.sort(() => Math.random() - 0.5);

    // Update cache
    cachedJobs = shuffledJobs;
    cacheTimestamp = Date.now();

    console.log(`✅ Cached ${shuffledJobs.length} jobs for 1 hour`);

    return NextResponse.json({
      success: true,
      jobs: shuffledJobs,
      total: shuffledJobs.length,
      cached: false,
      sources: selectedSearches.map(s => s.location || 'Remote')
    });

  } catch (error) {
    console.error('Error fetching diverse jobs:', error);
    
    // If we have old cached data, return it even if expired
    if (cachedJobs) {
      console.log('⚠️ Returning stale cache due to error');
      return NextResponse.json({
        success: true,
        jobs: cachedJobs,
        total: cachedJobs.length,
        cached: true,
        stale: true
      });
    }

    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch diverse jobs',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}