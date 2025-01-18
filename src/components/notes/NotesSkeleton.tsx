import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from '@/components/ui/skeleton';

export default function NotesSkeleton() {
    return (
        <Card className=" w-full flex flex-col">
          <CardHeader>
            <Skeleton className="h-4 w-3/4" />
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden flex flex-col justify-between">
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
          </CardContent>
        </Card>
    )
}