import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

import {db} from "@/lib/db";
import {currentProfile} from "@/lib/current_profile";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const profile = await currentProfile();
        const { content, fileUrl, fileType } = body;
        const channelId = req.nextUrl.searchParams.get("channelId");
        const serverId = req.nextUrl.searchParams.get("serverId");
        if (!content || !channelId || !serverId) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }
        console.log("File type is ", fileType);

        const server = await db.server.findFirst({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: profile?.id,
                    }
                }
            },
            include: {
                members: true,
            }
        })

        if (!server) {
            return NextResponse.json({ error: "Server not found" }, { status: 401 });
        }
        const channel = await db.channel.findFirst({
            where: {
                id: channelId,
                serverId: server.id,
            },
        })

        if (!channel) {
            return NextResponse.json({ error: "Channel not found" }, { status: 404 });
        }

        const member = server.members?.find(m => m.profileId === profile?.id);

        if (!member) {
            return NextResponse.json({ error: "You are not a member of this server" }, { status: 403 });
        }


        const message = await db.message.create({
            data : {
                fileType,
                content,
                fileUrl,
                channelId,
                memberId: member.id,
            },
            include: {
                member: {
                    include: {
                        profile: true,
                    },
                },
            },
        })
        const channelKey = `chat:${channelId}:messages`;
        // Send message to your Socket.IO server (e.g. on port 3001)
        const response = await axios.post(`${process.env.NEXT_PUBLIC_SOCKET_URL}/api/emit`, {
            event: channelKey,
            data: message
        });
        return NextResponse.json(message, { status: 200 });
    } catch (err) {
        console.error("[POST /api/socket/messages]", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
