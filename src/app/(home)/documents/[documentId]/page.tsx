'use client'

import React, { useEffect, useState } from "react";
import { Id } from "../../../../../convex/_generated/dataModel";
import DocumentDetailSkeleton from "./_components/DocumentDetailSkeleton";
import DocumentDetailsPage from "./_components/DocumentDetailsPage";

export default function DocumentDetail({ params }: { params: Promise<{ documentId: Id<"documents"> }> }) {
    const [documentId, setDocumentId] = useState<Id<"documents"> | null>(null);

    useEffect(() => {
        params.then(data => {
            setDocumentId(data.documentId);
        });
    }, [params]);
    console.log(documentId);
    if (!documentId) {
        return <DocumentDetailSkeleton />;
    }

    return (
       <DocumentDetailsPage documentId={documentId} />
    );
}