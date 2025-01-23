'use client';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import AddDocumentsBtn from "./_components/AddDocumentsBtn";
import DocumentsCard from './_components/DocumentsCard';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import Illustration from '@/components/shared/Illustration';

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

      <div className="grid gap-4">
        {documents === undefined && Array.from({ length: 6 }).map((_, index) => (
          // <DocumentsSkeleton key={index} />
          <div key={index} className="h-48 bg-gray-200 animate-pulse rounded-md">lOADING...</div>
        ))}
        {documents && documents.length > 0 ? (documents.map((doc) => (
          <DocumentsCard doc={doc} key={doc._id} />
        ))) : (
          <Illustration link="/documents_not_found.svg" title="No documents found" description="Create a new document to get started." type="document" />
        )}
      </div>
    </div>
  );
}