'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { Search, MapPin, Briefcase, DollarSign, Clock, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { JobsPageSkeleton, JobListCardSkeleton, JobDetailsSkeleton } from '@components/skeletons/JobsPageSkeleton';

export default function JobsPage() {
  const { user } = useAuth();
  const [jobListings, setJobListings] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(true); // Start with true for initial load
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [employmentType, setEmploymentType] = useState('all');
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [initialLoad, setInitialLoad] = useState(true); // Track if it's the first load

  useEffect(() => {
    if (user) {
      fetchJobs();
    }
  }, [user, remoteOnly, employmentType]);

  const fetchJobs = async () => {
    setJobsLoading(true);
    try {
      // If no search criteria, fetch diverse jobs
      if (!searchQuery && !location) {
        const response = await fetch('/api/jobs/diverse');
        const data = await response.json();
        
        if (data.success) {
          let filteredJobs = data.jobs;
          
          // Filter by employment type if specified
          if (employmentType !== 'all') {
            filteredJobs = filteredJobs.filter((job: any) => 
              job.courseType.toLowerCase() === employmentType.toLowerCase()
            );
          }
          
          setJobListings(filteredJobs);
          if (filteredJobs.length > 0 && !selectedJob) {
            setSelectedJob(filteredJobs[0]);
          }
        }
        setJobsLoading(false);
        setInitialLoad(false);
        return;
      }

      // Regular search with user criteria
      const params = new URLSearchParams({
        query: searchQuery,
        location: location,
        remote: remoteOnly.toString()
      });

      const response = await fetch(`/api/jobs?${params}`);
      const data = await response.json();
      
      if (data.success) {
        let filteredJobs = data.jobs;
        
        // Filter by employment type
        if (employmentType !== 'all') {
          filteredJobs = filteredJobs.filter((job: any) => 
            job.courseType.toLowerCase() === employmentType.toLowerCase()
          );
        }
        
        setJobListings(filteredJobs);
        if (filteredJobs.length > 0 && !selectedJob) {
          setSelectedJob(filteredJobs[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setJobsLoading(false);
      setInitialLoad(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs();
  };

  // Show full page skeleton on initial load
  if (initialLoad && jobsLoading) {
    return <JobsPageSkeleton />;
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Find Your Next Opportunity</h1>
        <p className="text-muted-foreground">
          Discover jobs from top companies that value diversity and inclusion
        </p>
      </div>

      {/* Search Section */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Job title, keywords, or company"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="w-64 relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="City, state, or zip code"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button type="submit" disabled={jobsLoading} className="px-8">
                {jobsLoading ? 'Searching...' : 'Search Jobs'}
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remote-filter"
                  checked={remoteOnly}
                  onChange={(e) => setRemoteOnly(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="remote-filter" className="text-sm cursor-pointer">
                  Remote jobs only
                </label>
              </div>

              <Select value={employmentType} onValueChange={setEmploymentType}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Employment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="fulltime">Full-time</SelectItem>
                  <SelectItem value="parttime">Part-time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Results Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Job List */}
        <div className="lg:col-span-1 space-y-3">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-muted-foreground">
              {jobsLoading ? 'Searching...' : `${jobListings.length} jobs found`}
            </p>
          </div>

          {jobsLoading ? (
            <div className="space-y-3">
              <JobListCardSkeleton />
              <JobListCardSkeleton />
              <JobListCardSkeleton />
              <JobListCardSkeleton />
              <JobListCardSkeleton />
            </div>
          ) : jobListings.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">
                  No jobs found matching your criteria.
                </p>
                <Button 
                  variant="link" 
                  onClick={() => {
                    setSearchQuery('');
                    setLocation('');
                    setRemoteOnly(false);
                    setEmploymentType('all');
                    fetchJobs();
                  }}
                  className="mt-2"
                >
                  Reset filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto pr-2 pl-3 pt-2">
              {jobListings.map((job: any) => (
                <Card
                  key={job.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedJob?.id === job.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedJob(job)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <Avatar className="h-10 w-10">
                        {job.companyLogo ? (
                          <AvatarImage src={job.companyLogo} alt={job.instructorName} />
                        ) : null}
                        <AvatarFallback>
                          {job.instructorName?.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm truncate">
                          {job.courseTitle}
                        </h3>
                        <p className="text-sm text-muted-foreground truncate">
                          {job.instructorName}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">{job.location}</span>
                    </div>

                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="secondary" className="text-xs">
                        {job.courseType}
                      </Badge>
                      {job.isRemote && (
                        <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                          Remote
                        </Badge>
                      )}
                    </div>

                    {job.salary && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                        <DollarSign className="h-3 w-3" />
                        <span>{job.salary}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                      <Clock className="h-3 w-3" />
                      <span>Posted {job.date}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Job Details */}
        <div className="lg:col-span-2">
          {jobsLoading ? (
            <JobDetailsSkeleton />
          ) : selectedJob ? (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                      {selectedJob.companyLogo ? (
                        <AvatarImage src={selectedJob.companyLogo} alt={selectedJob.instructorName} />
                      ) : null}
                      <AvatarFallback className="text-xl">
                        {selectedJob.instructorName?.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-2xl mb-1">
                        {selectedJob.courseTitle}
                      </CardTitle>
                      <CardDescription className="text-base">
                        {selectedJob.instructorName}
                      </CardDescription>
                      <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{selectedJob.location}</span>
                      </div>
                    </div>
                  </div>
                  <Button onClick={() => window.open(selectedJob.applyLink, '_blank')}>
                    Apply Now
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </div>

                <div className="flex gap-2 mt-4">
                  <Badge>{selectedJob.courseType}</Badge>
                  {selectedJob.isRemote && (
                    <Badge className="bg-green-100 text-green-700">Remote</Badge>
                  )}
                  {selectedJob.salary && (
                    <Badge variant="outline">{selectedJob.salary}</Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-6">
                  {/* Job Description */}
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Job Description</h3>
                    <div 
                      className="prose prose-sm max-w-none text-muted-foreground"
                      dangerouslySetInnerHTML={{ 
                        __html: selectedJob.description?.replace(/\n/g, '<br>') || 'No description available.' 
                      }}
                    />
                  </div>

                  {/* Required Skills */}
                  {selectedJob.requiredSkills?.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-lg mb-3">Required Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedJob.requiredSkills.map((skill: string, index: number) => (
                          <Badge key={index} variant="outline">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Qualifications */}
                  {selectedJob.highlights?.Qualifications && (
                    <div>
                      <h3 className="font-semibold text-lg mb-3">Qualifications</h3>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        {selectedJob.highlights.Qualifications.map((qual: string, index: number) => (
                          <li key={index}>{qual}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Responsibilities */}
                  {selectedJob.highlights?.Responsibilities && (
                    <div>
                      <h3 className="font-semibold text-lg mb-3">Responsibilities</h3>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        {selectedJob.highlights.Responsibilities.map((resp: string, index: number) => (
                          <li key={index}>{resp}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Benefits */}
                  {selectedJob.highlights?.Benefits && (
                    <div>
                      <h3 className="font-semibold text-lg mb-3">Benefits</h3>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        {selectedJob.highlights.Benefits.map((benefit: string, index: number) => (
                          <li key={index}>{benefit}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <Button 
                    onClick={() => window.open(selectedJob.applyLink, '_blank')}
                    className="w-full"
                    size="lg"
                  >
                    Apply for this position
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Briefcase className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Select a job from the list to view details
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}