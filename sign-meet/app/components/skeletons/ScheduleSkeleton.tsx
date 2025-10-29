import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// Individual interview card skeleton
export function InterviewCardSkeleton() {
  return (
    <Card className="border-l-4 border-l-gray-200 gap-2 py-6">
      <CardHeader className="gap-0 pb-4">
        <Skeleton className="h-5 w-3/4" />
      </CardHeader>
      <CardContent className="space-y-3 px-4 pb-3">
        {/* Date and Time */}
        <div className="flex items-center gap-5">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-6 w-24" />
        </div>
        
        {/* Interviewer/Candidate info */}
        <Skeleton className="h-4 w-48" />
        
        {/* Type badge and buttons */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-7 w-40 rounded-sm" />
          
          <div className="flex gap-2">
            <Skeleton className="h-9 w-28 rounded" />
            <Skeleton className="h-9 w-20 rounded" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Calendar section skeleton
export function CalendarSectionSkeleton() {
  return (
    <div className="w-96 space-y-6">
      {/* Connect Calendar Card */}
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-10 w-full rounded" />
        </CardContent>
      </Card>

      {/* Calendar Card */}
      <Card>
        <CardContent className="p-4">
          {/* Calendar header */}
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-6 w-32" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-8 rounded" />
              <Skeleton className="h-8 w-8 rounded" />
            </div>
          </div>

          {/* Calendar grid */}
          <div className="space-y-2">
            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {Array.from({ length: 7 }).map((_, i) => (
                <Skeleton key={i} className="h-6 w-full" />
              ))}
            </div>

            {/* Calendar dates */}
            {Array.from({ length: 5 }).map((_, weekIndex) => (
              <div key={weekIndex} className="grid grid-cols-7 gap-1">
                {Array.from({ length: 7 }).map((_, dayIndex) => (
                  <Skeleton 
                    key={dayIndex} 
                    className="h-10 w-full rounded-md" 
                  />
                ))}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Full schedule page skeleton
export function SchedulePageSkeleton() {
  return (
    <div className="p-4">
      <div className="flex gap-8">
        {/* Left Section - Interview List */}
        <div className="flex-1 p-2">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-10 w-32 rounded" />
          </div>

          {/* Interview Cards */}
          <div className="space-y-4">
            <InterviewCardSkeleton />
            <div className="border-b border-gray-200 my-4"></div>
            <InterviewCardSkeleton />
            <div className="border-b border-gray-200 my-4"></div>
            <InterviewCardSkeleton />
          </div>
        </div>

        {/* Right Section - Calendar */}
        <CalendarSectionSkeleton />
      </div>
    </div>
  );
}

// Empty state skeleton (when loading for first time)
export function EmptyStateLoadingSkeleton() {
  return (
    <div className="p-4">
      <div className="flex gap-8">
        {/* Left Section */}
        <div className="flex-1 p-2">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-10 w-32 rounded" />
          </div>

          {/* Loading state card */}
          <Card className="border-dashed border-2">
            <CardContent className="py-16 px-8">
              <div className="max-w-2xl mx-auto text-center space-y-6">
                {/* Icon skeleton */}
                <div className="flex justify-center">
                  <Skeleton className="h-32 w-32 rounded-full" />
                </div>

                {/* Title skeleton */}
                <div className="space-y-3">
                  <Skeleton className="h-8 w-3/4 mx-auto" />
                  <Skeleton className="h-5 w-full mx-auto" />
                  <Skeleton className="h-5 w-5/6 mx-auto" />
                </div>

                {/* Features list skeleton */}
                <div className="space-y-3 max-w-md mx-auto">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Skeleton className="h-5 w-5 rounded-full flex-shrink-0" />
                      <Skeleton className="h-4 flex-1" />
                    </div>
                  ))}
                </div>

                {/* Button skeleton */}
                <Skeleton className="h-12 w-64 mx-auto rounded" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Section - Calendar */}
        <CalendarSectionSkeleton />
      </div>
    </div>
  );
}