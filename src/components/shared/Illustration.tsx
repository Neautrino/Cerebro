import AddDocumentsBtn from '@/app/(home)/documents/_components/AddDocumentsBtn'
import AddNotesBtn from '@/app/(home)/notes/_components/AddNotesBtn'
import Image from 'next/image'
import React from 'react'

function Illustration({ link, title, description, type }: { link: string, title: string, description: string, type: string }) {
  return (
    <div className="flex flex-col col-span-full mt-20 items-center justify-center gap-4">
          <Image
            src={link}
            width={200}
            height={200}
            alt="No notes found"
          />
          <p className="text-muted-foreground text-lg">
            No notes found. Create a new note to get started.
          </p>
          {type==="note" && <AddNotesBtn />}
          {/* {type==="link" && <AddLinksBtn />} */}
          {type==="document" && <AddDocumentsBtn />}
          {/* {type==="video" && <AddVideosBtn />} */}
          
        </div>
  )
}

export default Illustration