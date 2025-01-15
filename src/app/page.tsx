'use client'

// import { SignInButton, UserButton } from "@clerk/nextjs";
// import { ThemeToggle } from "@/components/theme-toggle"
// import { Authenticated, Unauthenticated, useMutation, useQuery } from "convex/react";
// import { api } from "../../convex/_generated/api";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";

export default function Home() {

  // const documents = useQuery(api.documents.getDocuments);
  // const createDocument = useMutation(api.documents.createDocuments);
  return (
    <main className="bg-background">
      <Hero />
      <Features />
    </main>
  );
}
