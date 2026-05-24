import { Liveblocks } from "@liveblocks/node";
import { ConvexHttpClient } from "convex/browser";
import { auth, currentUser } from "@clerk/nextjs/server";
import { api } from "../../../../convex/_generated/api";


const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const liveblocks = new Liveblocks({
    secret: process.env.LIVEBLOCK_SECRET_KEY!,
});


export async function POST(req: Request) {
    const { sessionClaims } = await auth();

    // Access orgId from Clerk's auth() if available, or fallback to custom sessionClaims structure
    // based on observed logs where orgId is in sessionClaims.o.id
    const orgId = (await auth()).orgId || (sessionClaims?.o as any)?.id;

    console.log("Request to Liveblocks Auth", {
        sessionClaims,
        orgId,
        room: (await req.clone().json()).room
    });

    if (!sessionClaims) {
        return new Response("Unauthorized", { status: 401 });
    }

    const user = await currentUser();

    if (!user) {
        return new Response("Unauthorized", { status: 401 });
    }

    const { room } = await req.json();

    // Debugging secret key presence (DO NOT LOG THE KEY ITSELF)
    if (!process.env.LIVEBLOCK_SECRET_KEY) {
        console.error("LIVEBLOCK_SECRET_KEY is missing in environment variables");
        return new Response("Configuration Error: Missing Secret Key", { status: 500 });
    }

    const document = await convex.query(api.documents.getById, { id: room });
    console.log("Document found:", !!document);

    if (!document) {
        return new Response("Unauthorized", { status: 401 });
    }

    const isOwner = document.ownerId === user.id;
    const isOrganizationMember =
        !!(document.organizationId && document.organizationId === orgId); // Use orgId directly

    // Detailed logging for debugging 401s
    if (!isOwner && !isOrganizationMember) {
        console.log("Unauthorized Access Attempt:", {
            userId: user.id,
            docOwnerId: document.ownerId,
            docOrgId: document.organizationId,
            userOrgId: orgId,
            isOwner,
            isMember: isOrganizationMember
        });
        return new Response("Unauthorized", { status: 401 });
    }

    //creating unique color with each username: 
    const name = user.fullName ?? user.primaryEmailAddress?.emailAddress ?? "Anonymous";
    const nameToNumber = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const hue = Math.abs(nameToNumber) % 360;
    const color = `hsl(${hue},80%,60%)`;
    //Finished creating the color masterpiece

    const session = liveblocks.prepareSession(user.id, {
        userInfo: {
            name: user.fullName ?? user.primaryEmailAddress?.emailAddress ?? "Anonymous",
            avatar: user.imageUrl,
            color,
        },
    });

    session.allow(room, session.FULL_ACCESS);

    const { body, status } = await session.authorize();
    console.log("Liveblocks authorization successful", { status });

    return new Response(body, { status });



};