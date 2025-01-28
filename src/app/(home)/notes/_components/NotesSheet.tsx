import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { EyeIcon } from "lucide-react"
import { Id } from "../../../../../convex/_generated/dataModel"
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

interface Note {
    _id: Id<"notes">;
    _creationTime: number;
    tags?: string[] | undefined;
    embedding?: number[] | undefined;
    userId: string;
    title: string;
    content: string;
    updatedTime: number;
}

function NotesSheet({ note }: { note: Note }) {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="secondary" >
                    <EyeIcon className="w-4 h-4" />
                    View
                </Button>
            </SheetTrigger>
            <SheetContent className={cn("w-[45%] max-w-[1000px] flex flex-col")}>
                <SheetHeader>
                    <SheetTitle className="text-2xl font-bold">{note.title}</SheetTitle>
                    <div className="flex flex-wrap gap-2">
                        {note.tags?.map((tag) => (
                            <Badge key={tag} variant="secondary">{tag}</Badge>
                        ))}
                    </div>
                </SheetHeader>
                <div className="flex-1 mt-4 overflow-y-auto">
                    <Textarea className="whitespace-pre-wrap h-full" value={note.content} readOnly />
                </div>
            </SheetContent>
        </Sheet>
    )
}

export default NotesSheet