import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function JobCardSkeleton() {
  return (
    <div className="grid grid-cols-4 gap-4 px-4 py-4 border rounded-lg items-center">
      {/* Company Info */}
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
      
      {/* Job Type Badge */}
      <div>
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      
      {/* Job Title */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-24" />
      </div>
      
      {/* Action Button */}
      <div>
        <Skeleton className="h-9 w-24 rounded" />
      </div>
    </div>
  );
}

export function JobsSectionSkeleton({ count = 3 }: { count?: number }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Skeleton className="h-7 w-24" /> {/* "Find Jobs" title */}
          <Skeleton className="h-5 w-16" /> {/* "See All" button */}
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Table Header */}
        <div className="grid grid-cols-4 gap-4 px-4 py-3 bg-muted rounded-lg mb-3">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-20" />
        </div>

        {/* Job Cards */}
        <div className="space-y-3">
          {Array.from({ length: count }).map((_, i) => (
            <JobCardSkeleton key={i} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

