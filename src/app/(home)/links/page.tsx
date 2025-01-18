'use client'

import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import AddLinksButton from './_components/AddLinkButton';
import LinksCard from './_components/LinksCard';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import LinksSkeleton from './_components/LinksSkeleton';
import Image from 'next/image';

export default function LinksPage() {

  const links = useQuery(api.links.getLinks);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Links</h2>
          <p className="text-muted-foreground">Collect and organize useful links</p>
        </div>
        <AddLinksButton />
      </div>

      <div className="relative w-full max-w-sm">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search links..." className="pl-8" />
      </div>

      <div className="grid gap-4">
        { links === undefined &&  Array.from({ length: 2 }).map((_, index) => (
                <LinksSkeleton key={index} />
              ))}
        {links && links.length > 0 ? ( links.map((link) => (
          <LinksCard key={link._id} link={link} />
        ))): (
          <div className="flex flex-col col-span-full mt-20 items-center justify-center gap-4">
            <Image
              src="/links_not_found.svg"
              width={200}
              height={200}
              alt="No notes found"
            />
            <p className="text-muted-foreground text-lg">
              No Links found. Create a new Link to get started.
            </p>
            <AddLinksButton />
          </div>
        )}
      </div>
    </div>
  );
}