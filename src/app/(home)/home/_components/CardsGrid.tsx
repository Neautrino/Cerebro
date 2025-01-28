'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Video, Link2, Twitter, FileIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { api } from '../../../../../convex/_generated/api';
import NotesSkeleton from '../../notes/_components/NotesSkeleton';
import { useQuery } from 'convex/react';
import { useSearch } from './SearchContext';
import Illustration from '@/components/shared/Illustration';

const getIcon = (type: string): React.ReactNode => {
    switch (type) {
        case 'note': return <FileText className="h-5 w-5" />;
        case 'document': return <FileIcon className="h-5 w-5" />;
        case 'video': return <Video className="h-5 w-5" />;
        case 'link': return <Link2 className="h-5 w-5" />;
        case 'tweet': return <Twitter className="h-5 w-5" />;
        default: return <FileText className="h-5 w-5" />;
    }
}

function CardsGrid() {
    const { searchResults } = useSearch();
    
    const allRecords = useQuery(api.search.getRecentRecords, { numRecords: 50 });
    
    const displayRecords = searchResults ?? allRecords;

    return (
        <div className="grid gap-6 md:grid-cols-2 mt-6 h-full">
            {displayRecords === undefined || displayRecords === null ? (
                Array.from({ length: 4 }).map((_, index) => (
                    <NotesSkeleton key={index} />
                ))
            ) : displayRecords.length > 0 ? (
                displayRecords.map((item) => (
                    <Card key={item.data._id} className="hover:bg-accent/50 transition-colors cursor-pointer">
                        <CardHeader>
                            <div className="flex items-center space-x-4">
                                <div className="h-10 w-10 rounded bg-accent flex items-center justify-center">
                                    {getIcon(item.type)}
                                </div>
                                <div>
                                    <CardTitle className="text-xl line-clamp-1">{item.data.title}</CardTitle>
                                    <p className="text-sm text-muted-foreground">
                                        Added: {new Date(item.data.updatedTime).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground mb-4">
                                {item.data.content?.slice(0, 100)}...
                            </p>
                            <div className="flex flex-wrap gap-2">
                                <Badge variant="secondary">{item.type}</Badge>
                                {item.data.tags?.map((tag) => (
                                    <Badge key={tag} variant="outline">{tag}</Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))
            ) : (
                // <div className="flex flex-col col-span-2 items-center justify-center h-full w-full">
                //     <h2 className="text-2xl font-bold">No results found</h2>
                //     <p className="text-muted-foreground">Try searching for something else</p>
                // </div>
                <Illustration
                    title="No results found"
                    description="Try searching for something else"
                    link="/posts_not_found.svg"
                    type='post'
                />
            )}
        </div>
    )
}

export default CardsGrid