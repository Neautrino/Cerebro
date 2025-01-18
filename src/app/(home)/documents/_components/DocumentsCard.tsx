import { FileIcon, Download, EyeIcon, Trash2Icon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Id } from "../../../../../convex/_generated/dataModel"
import { api } from "../../../../../convex/_generated/api"
import { useMutation, useQuery } from "convex/react"
import Link from "next/link"

interface Document {
    _id: Id<"documents">
    _creationTime: number
    content?: string
    tags?: string[]
    userId: string
    title: string
    fileId: Id<"_storage">
    updatedTime: number
}

interface DocumentsCardProps {
    doc: Document
}

function DocumentsCard({ doc }: DocumentsCardProps) {

    const file = useQuery(api.documents.getFile, { storageId: doc.fileId });
    const deleteDocument = useMutation(api.documents.deleteDocument);

    const getFileType = (contentType?: string) => {
        if (contentType === "application/pdf") return "PDF";
        if (contentType === "application/msword" ||
            contentType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") return "Word";
        if (contentType === "text/plain") return "Text";
        return "File";
    };

    const formatFileSize = (bytes?: number) => {
        if (!bytes) return '0 B';
        const units = ['B', 'KB', 'MB', 'GB'];
        let size = bytes;
        let unitIndex = 0;

        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }

        return `${Math.round(size)} ${units[unitIndex]}`;
    };

    const handleDelete = async () => {
        await deleteDocument({ id: doc._id });
    }

    return (
        <Card key={doc._id}>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 rounded bg-accent flex items-center justify-center">
                            <FileIcon className="h-5 w-5" />
                        </div>
                        <div>
                            <CardTitle className="text-xl">{doc.title}</CardTitle>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <span>{getFileType(file?.contentType)}</span>
                                <span>•</span>
                                <span>{formatFileSize(file?.size)}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="secondary" asChild>
                            <Link href={`/documents/${doc._id}`} className="flex items-center gap-2">
                                <EyeIcon className="w-4 h-4" />
                                View
                            </Link>
                        </Button>
                        <Button variant="destructive" onClick={handleDelete} asChild>
                            <div className="flex items-center gap-2">
                                <Trash2Icon className="w-4 h-4" />
                                Delete
                            </div>
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex items-center  justify-between mb-4 w-full">
                    <p className="text-muted-foreground mb-4 line-clamp-2  max-w-[80%]">{doc.content}</p>
                    <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                    </Button>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                        <Badge>{getFileType(file?.contentType)}</Badge>
                        {doc.tags?.map((tag) => (
                            <Badge key={tag} variant="secondary">{tag}</Badge>
                        ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                        Modified: {new Date(doc.updatedTime).toLocaleDateString()}
                    </span>
                </div>
            </CardContent>
        </Card>
    )
}

export default DocumentsCard