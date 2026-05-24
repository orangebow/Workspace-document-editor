import { Id } from "../../../../convex/_generated/dataModel";
import {Editor} from "./editor";  
import { Navbar } from "./navbar";
import { Room } from "./room";
import {Toolbar} from "./toolbar";

import {Document} from "./document";
import {auth} from "@clerk/nextjs/server";

import { preloadQuery } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";
import { ConvexError } from "convex/values";



interface DocumentIdPageProps {
  params: Promise<{ documentId: Id<"documents"> }>;
};

const DocumentIdPage = async ({ params }: DocumentIdPageProps) => {
  
const { documentId } = await params;

const {getToken} = await auth();
const token = await getToken({template:"convex"}) ?? undefined;

//console.log("userId: ", (await auth()).userId);

if(!token){
  
  throw new Error("Unauthorized");
}


const preloadedDocument = await preloadQuery(
api.documents.getById,
{id: documentId},
{token}
);

  if(!preloadedDocument){
    throw new Error("Document not found");
  }

 return <Document preloadedDocument={preloadedDocument}/>;

  
};

export default DocumentIdPage;