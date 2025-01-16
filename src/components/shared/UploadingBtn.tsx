import React from "react";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

export default function UploadingBtn({
  isLoading,
  children,
  loadingText
} : {
  isLoading: boolean,
  children: React.ReactNode,
  loadingText: string
}) {
    return (
        <Button type="submit" className="w-full">
              {isLoading ? (
                <span className='flex items-center justify-center gap-4'><Loader2 className="animate-spin h-5 w-5" /> {loadingText}</span>
              ) : children}
            </Button>
    )
}