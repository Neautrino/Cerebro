'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Globe, Trash2Icon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Id } from '../../../../../convex/_generated/dataModel';
import { useMutation } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';

interface LinkProps {
    _id: Id<'links'>;
    userId: string;
    title: string;
    content: string;
    url: string;
    tags?: string[];
    _creationTime: number;
}

function LinksCard({ link }: { link: LinkProps }) {

    const deleteLink = useMutation(api.links.deleteLink);

    function handleDelete() {
        deleteLink({ id: link._id });
    }
    return (
        <Card key={link._id}>
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <div className='flex items-center justify-between gap-4'>
                            <CardTitle className="text-xl">{link.title}</CardTitle>
                            <Button variant="ghost" size="icon" asChild>
                                <a href={link.url} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="h-4 w-4" />
                                </a>
                            </Button>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                            <Globe className="h-4 w-4 mr-1" />
                            <span className="truncate max-w-[300px]">{link.url}</span>
                        </div>
                    </div>
                    <Button variant="destructive" size="icon" onClick={() => handleDelete()}>
                        <Trash2Icon className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground mb-4">{link.content}</p>
                <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                        {link.tags?.map((tag: string) => (
                            <Badge key={tag} variant="secondary">{tag}</Badge>
                        ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                        Added: {new Date(link._creationTime).toLocaleDateString()}
                    </span>
                </div>
            </CardContent>
        </Card>
    )
}

export default LinksCard;