import { Skeleton } from '@/components/ui/skeleton';

export default function NotesSkeleton() {
    return (
        <div className="w-full flex flex-col border rounded-lg">
          <div className="p-6 pb-0">
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="p-6 flex-1 overflow-hidden flex flex-col justify-between">
            <Skeleton className="h-2 w-full mb-4" />
            <Skeleton className="h-2 w-full mb-4" />
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-12" />
            </div>
            <div className="flex justify-between items-center mt-4">
              <Skeleton className="h-2 w-1/2" />
              <Skeleton className="h-6 w-16" />
            </div>
          </div>
        </div>
    )
}