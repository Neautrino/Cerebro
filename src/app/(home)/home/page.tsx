'use client';

import SearchBar from './_components/SearchBar';
import CardsGrid from './_components/CardsGrid';
import { SearchProvider } from './_components/SearchContext';

export default function KnowledgeBasePage() {

  return (
    <SearchProvider>
      <div className="space-y-8">
        <div className="flex gap-4 justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Knowledge Base</h2>
            <p className="text-muted-foreground">All your knowledge in one place</p>
          </div>
          <SearchBar />
        </div>

        {/* <Tabs defaultValue="browse">
          <TabsList>
            <TabsTrigger value="browse">Browse</TabsTrigger>
            <TabsTrigger value="ai">Ask AI</TabsTrigger>
          </TabsList> */}

          {/* <TabsContent value="browse" className="space-y-6"> */}
            <CardsGrid />
          {/* </TabsContent> */}

          {/* <TabsContent value="ai" className="space-y-6">
            <ChatPanel />
          </TabsContent>
        </Tabs> */}
      </div>
    </SearchProvider>
  );
}