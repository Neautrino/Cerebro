import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

function LinksSkeleton() {
    return (
        <Card className="w-full flex flex-col">
          <CardHeader>
            <div className=" w-full flex items-center justify-between mb-2">
                <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-6 w-1/12" />
            </div>
              <Skeleton className="h-2 w-1/3 mb-2" />
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden flex flex-col justify-between">
            <Skeleton className="h-2 w-full mb-4" />
            <Skeleton className="h-2 w-full mb-4" />
            <div className="flex justify-between">
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-12" />
            </div>
              <Skeleton className="h-2 w-1/5" />
            </div>
          </CardContent>
        </Card>
    )
}

export default LinksSkeleton