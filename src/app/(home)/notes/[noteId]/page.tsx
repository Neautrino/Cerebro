'use client'

import React, { useEffect, useState } from "react";
import NoteDetailsPage from "@/components/notes/(noteDetails)/NoteDetailsPage";
import { Id } from "../../../../../convex/_generated/dataModel";
import NotePageSkeleton from "@/components/notes/(noteDetails)/NotePageSkeleton";

export default function NotePage({ params }: { params: Promise<{ noteId: Id<"notes"> }> }) {
    const [noteId, setNoteId] = useState<Id<"notes"> | null>(null);

    useEffect(() => {
        params.then(data => {
            setNoteId(data.noteId);
        });
    }, [params]);

    if (!noteId) {
        return <NotePageSkeleton />;
    }

    return (
       <NoteDetailsPage noteId={noteId} />
    );
}