'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, FileIcon, Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import AddDocumentsBtn from "./_components/AddDocumentsBtn";
import DocumentsCard from './_components/DocumentsCard';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';

export default function DocumentsPage() {

  const documents = useQuery(api.documents.getDocuments);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Documents</h2>
          <p className="text-muted-foreground">Manage and organize your documents</p>
        </div>
        <AddDocumentsBtn />
      </div>

      <div className="relative w-full max-w-sm">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search documents..." className="pl-8" />
      </div>

      <div className="grid gap-4">
        {documents?.map((doc) => (
          <DocumentsCard doc={doc} key={doc._id} />
        ))}
      </div>
    </div>
  );
}