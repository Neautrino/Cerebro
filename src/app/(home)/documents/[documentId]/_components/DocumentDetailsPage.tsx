'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Save, Link as LinkIcon, Calendar, Tag, CircleChevronLeft } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { useQuery } from 'convex/react';
import ChatPanel from './ChatPanel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DeleteBtn from '@/components/shared/DeleteBtn';
import { Id } from '../../../../../../convex/_generated/dataModel';
import { api } from '../../../../../../convex/_generated/api';
import DocumentDetailSkeleton from './DocumentDetailSkeleton';

export default function DocumentDetailsPage({ documentId }: { documentId: Id<"documents"> }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState<string | null>('');

    const router = useRouter();
    const document = useQuery(api.documents.getDocumentById, documentId ? { id: documentId } : "skip");

    useEffect(() => {
        if (document) {
            setTitle(document.title);
            setContent(document.content || '');
        }
    }, [document]);

    if (!document) {
        return (
            <DocumentDetailSkeleton />
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center space-x-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.back()}
                    className="hover:bg-accent"
                >
                    <CircleChevronLeft className="h-6 w-6" />
                </Button>
                <div className="space-y-4 flex-1 pl-2">
                    <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="border-0 focus-visible:ring-0 px-0 focus-visible:ring-offset-0 focus-visible:outline-none bg-transparent"
                        style={{ fontSize: '2.25rem', fontWeight: 'bold' }}
                    />
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            Last edited: {new Date(document.updatedTime).toLocaleString()}
                        </div>
                        <div className="flex items-center gap-2">
                            <Tag className="h-4 w-4" />
                            <Badge variant="secondary">Projects</Badge>
                            <Badge variant="secondary">Ideas</Badge>
                        </div>
                    </div>
                </div>
                <div className="space-x-2">
                    <Button variant="outline">
                        <LinkIcon className="h-4 w-4 mr-2" />
                        Connect
                    </Button>
                    <Button>
                        <Save className="h-4 w-4 mr-2" />
                        Save
                    </Button>
                    <DeleteBtn />
                </div>
            </div>

            <Card className="p-4">
                <Textarea
                    value={content || ''}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Start writing your note..."
                    className="min-h-[200px] border-none focus-visible:ring-0 bg-transparent px-0 focus-visible:ring-offset-0 focus-visible:outline-none"
                />
            </Card>
            <Tabs defaultValue="document" className="w-full">
                <TabsList>
                    <TabsTrigger value="document">Document</TabsTrigger>
                    <TabsTrigger value="chat">AI Chat</TabsTrigger>
                </TabsList>
                <TabsContent value="document">
                    <div className='flex-1 bg-gray-900 rounded-lg'>
                        {document?.fileUrl && (
                            <iframe src={document.fileUrl} className="w-full h-[500px] rounded-lg" />
                        )}
                    </div>
                </TabsContent>
                <TabsContent value="chat">
                    <ChatPanel documentId={documentId!} />
                </TabsContent>
            </Tabs>
        </div>
    );
}