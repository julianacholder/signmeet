// app/api/jobs/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') || 'software engineer';
  const location = searchParams.get('location') || 'United States';
  const remoteOnly = searchParams.get('remote') === 'true';
  const page = searchParams.get('page') || '1';

  // Check if API key exists
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
    // Build the search query
    const searchQuery = location.toLowerCase() === 'remote' || remoteOnly
      ? `${query} remote`
      : `${query} in ${location}`;

    const response = await fetch(
      `https://jsearch.p.rapidapi.com/search?` +
      `query=${encodeURIComponent(searchQuery)}&` +
      `page=${page}&` +
      `num_pages=1&` +
      `date_posted=all&` +
      `remote_jobs_only=${remoteOnly}`,
      options
    );

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();

    // Transform the data to match your existing format
    const jobs = data.data?.map((job: any) => ({
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
    })) || [];

    return NextResponse.json({
      success: true,
      jobs,
      total: data.data?.length || 0
    });

  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch jobs',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}