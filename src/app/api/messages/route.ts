import {NextRequest} from "next/server";
import {Message} from "@prisma/client";
import {db} from "@/lib/db";
const MESSAGES_BATCH = 10
export async function GET(req: NextRequest){
    try {
        const { searchParams } = req.nextUrl;
        const channelId = searchParams.get("channelId");
        const cursor = searchParams.get("cursor");
        if (!channelId) {
            return new Response("Channel ID is required", { status: 400 });
        }
        let messages: Message[] = []
        if (cursor) {
            messages = await db.message.findMany({
                // take: MESSAGES_BATCH,
                // skip: 1, // Skip the cursor message
                // cursor: {
                //     id: cursor,
                // },
                where: {
                    channelId,
                },
                include: {
                    member: {
                        include: {
                            profile: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
            });
        }
        else{
            messages = await db.message.findMany({
                take: MESSAGES_BATCH,
                where: {
                    channelId,
                },
                include: {
                    member: {
                        include: {
                            profile: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
            });
        }

        let nextCursor: string | null = null;
        if (messages.length === MESSAGES_BATCH) {
            nextCursor = messages[messages.length - 1].id;
        }
        return new Response(JSON.stringify({
            items: messages,
            nextCursor,
        }));


    }
    catch (error) {
        console.error("Error fetching messages:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}
