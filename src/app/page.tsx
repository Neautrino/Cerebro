'use client'

import { SignInButton, UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/theme-toggle"
import { Authenticated, Unauthenticated, useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function Home() {

  const documents = useQuery(api.documents.getDocuments);
  const createDocument = useMutation(api.documents.createDocuments);
  return (
    <main>
      <Unauthenticated>
        <SignInButton />
      </Unauthenticated>
      <Authenticated>
        <UserButton />
        <button onClick={() => createDocument({title: "Hello World!", content: "This is a test"})}>
          Create Document
        </button>

        <ul>
          {documents?.map((document) => (
            <li key={document._id}>{document.title}</li>
          ))}
        </ul>
      </Authenticated>
    </main>
  );
}
