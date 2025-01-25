'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { Doc } from '../../../../../convex/_generated/dataModel';

type SearchResult = 
  | { type: "note"; data: Doc<"notes">; score?: number }
  | { type: "document"; data: Doc<"documents">; score?: number }
  | { type: "link"; data: Doc<"links">; score?: number }
  | { type: "tweet"; data: Doc<"tweets">; score?: number };

interface SearchContextType {
  searchResults: SearchResult[] | null;
  setSearchResults: (results: SearchResult[] | null) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [searchResults, setSearchResults] = useState<SearchResult[] | null>(null);

  return (
    <SearchContext.Provider value={{ searchResults, setSearchResults }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
} 