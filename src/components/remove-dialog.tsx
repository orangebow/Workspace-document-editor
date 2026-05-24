"use client";

import{
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {toast} from "sonner";

import { Id } from "../../convex/_generated/dataModel";
import { api } from "../../convex/_generated/api";
import { useMutation } from "convex/react";
import { useState } from "react";
import { useRouter } from "next/router";


interface RemoveDialogProps{
    documentId: Id<"documents">
    children: React.ReactNode;
};



export const RemoveDialog =({documentId, children}: RemoveDialogProps)=>{
    
   // const router = useRouter(); // Not working properly so commented out.
    const remove = useMutation(api.documents.removeById);
    const [isRemoving, setIsRemoving] = useState(false);
    
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {children}
            </AlertDialogTrigger>
            <AlertDialogContent onClick={(e)=>e.stopPropagation()}>
            <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle> 
            <AlertDialogDescription>
                This action cannot be undone. 
                This will permanently delete your document. 
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel onClick={(e)=>e.stopPropagation()}>
                    Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                disabled = {isRemoving}
                onClick={(e)=>{
                    e.stopPropagation();
                    setIsRemoving(true);
                    remove({id: documentId})
                    .catch(()=>toast.error("something went wrong"))
                    .then(()=>{
                        toast.success("Document removed successfully");
                        //router.push("/"); // Not Working Properly so commented Out.
                    })
                    .finally(()=>setIsRemoving(false));
                }}
                >
                    
                    Delete</AlertDialogAction>
            </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};



