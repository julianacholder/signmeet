import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// Individual job card skeleton for the list
export function JobListCardSkeleton() {
  return (
    <Card className="cursor-pointer">
      <CardContent className="p-4">
        {/* Avatar and Title */}
        <div className="flex items-start gap-3 mb-3">
          <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
          <div className="flex-1 min-w-0 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
        
        {/* Location */}
        <div className="flex items-center gap-2 mb-2">
          <Skeleton className="h-3 w-3 rounded-full" />
          <Skeleton className="h-3 w-24" />
        </div>

        {/* Badges */}
        <div className="flex gap-2 mb-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>

        {/* Salary and Date */}
        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <Skeleton className="h-3 w-3 rounded-full" />
            <Skeleton className="h-3 w-32" />
          </div>
          <div className="flex items-center gap-1">
            <Skeleton className="h-3 w-3 rounded-full" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Job details panel skeleton
export function JobDetailsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4 flex-1">
            <Skeleton className="h-16 w-16 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-7 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex items-center gap-2 mt-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </div>
          <Skeleton className="h-10 w-28 rounded" />
        </div>

        {/* Badges */}
        <div className="flex gap-2">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-32 rounded-full" />
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          {/* Job Description Section */}
          <div>
            <Skeleton className="h-6 w-40 mb-3" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>

          {/* Skills Section */}
          <div>
            <Skeleton className="h-6 w-32 mb-3" />
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-7 w-20 rounded-full" />
              <Skeleton className="h-7 w-24 rounded-full" />
              <Skeleton className="h-7 w-16 rounded-full" />
              <Skeleton className="h-7 w-28 rounded-full" />
              <Skeleton className="h-7 w-20 rounded-full" />
            </div>
          </div>

          {/* Qualifications Section */}
          <div>
            <Skeleton className="h-6 w-36 mb-3" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>

          {/* Responsibilities Section */}
          <div>
            <Skeleton className="h-6 w-40 mb-3" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>

          {/* Apply Button */}
          <Skeleton className="h-12 w-full rounded" />
        </div>
      </CardContent>
    </Card>
  );
}

// Full page skeleton layout
export function JobsPageSkeleton() {
  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <Skeleton className="h-9 w-80 mb-2" />
        <Skeleton className="h-5 w-96" />
      </div>

      {/* Search Section */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Search inputs */}
            <div className="flex gap-3">
              <Skeleton className="flex-1 h-10 rounded" />
              <Skeleton className="w-64 h-10 rounded" />
              <Skeleton className="w-32 h-10 rounded" />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-4 w-28" />
              </div>
              <Skeleton className="h-10 w-48 rounded" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Job List */}
        <div className="lg:col-span-1 space-y-3">
          <Skeleton className="h-5 w-32 mb-3" />
          <div className="space-y-3">
            <JobListCardSkeleton />
            <JobListCardSkeleton />
            <JobListCardSkeleton />
            <JobListCardSkeleton />
            <JobListCardSkeleton />
          </div>
        </div>

        {/* Job Details */}
        <div className="lg:col-span-2">
          <JobDetailsSkeleton />
        </div>
      </div>
    </div>
  );
}