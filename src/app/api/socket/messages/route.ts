import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const content = body.content;
        const channelId = req.nextUrl.searchParams.get("channelId");
        const serverId = req.nextUrl.searchParams.get("serverId");

        if (!content || !channelId || !serverId) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        // Send message to your Socket.IO server (e.g. on port 3001)
        const response = await axios.post(`${process.env.NEXT_PUBLIC_SOCKET_URL}/api/emit`, {
            event: "message:new",
            data: {
                content,
                channelId,
                serverId,
                timestamp: new Date().toISOString(),
            },
        });
        console.log("[POST /api/socket/messages] Message sent:", response.data);

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("[POST /api/socket/messages]", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
