import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { JobsSectionSkeleton } from './JobsSkeleton';

export function DashboardSkeleton() {
  return (
    <div className="p-8 pr-5">
      <div className="flex gap-8">
        {/* Left Column */}
        <div className="flex-1">
          {/* Welcome Section */}
          <div className="mb-8 mt-20 text-center">
            <Skeleton className="h-9 w-64 mx-auto mb-2" />
            <Skeleton className="h-4 w-96 mx-auto" />
            <Skeleton className="h-4 w-80 mx-auto mt-1" />
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-y-6 mb-8 max-w-3xs mx-auto">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <Skeleton className="h-20 w-20 rounded-3xl" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
          
          {/* Jobs Section Skeleton */}
          <JobsSectionSkeleton count={3} />
        </div>

        {/* Right Column */}
        <div className="w-90 flex flex-col gap-4">
          {/* Calendar Skeleton */}
          <Card>
            <CardContent className="p-4">
              <Skeleton className="h-80 w-full" />
            </CardContent>
          </Card>

          {/* Upcoming Interviews Skeleton */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <Skeleton className="h-6 w-40 mb-3" />
              {[1, 2].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-32" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

