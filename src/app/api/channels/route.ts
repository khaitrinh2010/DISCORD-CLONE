import {NextRequest, NextResponse} from "next/server";
import {currentProfile} from "@/lib/current_profile";
import {db} from "@/lib/db";
import {MemberRole} from "@prisma/client";

export async function POST(req: NextRequest){
    const profile = await currentProfile();
    if (!profile) {
        return new Response("Unauthorized", { status: 401 });
    }
    try{
        const {name, type} = await req.json();
        const {searchParams} = new URL(req.url);
        const serverId = searchParams.get("serverId");
        if (!serverId) {
            return new Response("Bad Request: Missing serverId", { status: 400 });
        }

        const server = await db.server.update({
            where: {
                id: serverId,
                members : {
                    some: {
                        profileId: profile.id,
                        role: {
                            in: [MemberRole.ADMIN, MemberRole.MODERATOR]
                        }
                    }
                }
            },
            data: {
                channels: {
                    create: {
                        profileId: profile.id,
                        name,
                        type,
                    },
                },
            }
        })
        return NextResponse.json(server)
    }
    catch(error){
        console.error("Error creating channel:", error);
        return new Response("Internal Server Error", { status: 500 });
    }

}
