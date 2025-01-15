import React from "react";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

export default function DialogButton({isLoading} : {isLoading: boolean}) {
    return (
        <Button type="submit" className="w-full">
              {isLoading ? (
                <span className='flex items-center justify-center gap-4'><Loader2 className="animate-spin h-5 w-5" /> Creating...</span>
              ) : 'Create Entry'}
            </Button>
    )
}