import {NextRequest, NextResponse} from "next/server";
import {currentProfile} from "@/lib/current_profile";
import {db} from "@/lib/db";
import {MemberRole} from "@prisma/client";

export async function DELETE(req: NextRequest, { params } : { params : {channelId : string}}) {
    const {channeld} = params;
    const profile = await currentProfile();
    if (!profile) {
        return new Response("Unauthorized", { status: 401 });
    }
    try {
        const {searchParams} = new URL(req.url);
        const serverId = searchParams.get("serverId");
        if (!serverId) {
            return new Response("Bad Request: Missing serverId", { status: 400 });
        }

        const server = await db.server.update({
            where: {
                id: serverId,
                members: {
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
                    delete: {
                        id: channeld,
                        name: {
                            not: "general"
                        }
                    }
                }
            },
            include: {
                channels: true
            }
        })

        return NextResponse.json(server);
    } catch (error) {
        console.error("Error deleting channel:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}

export async function PATCH(req: NextRequest, { params } : { params : {channelId : string}}) {
    const {channeld} = params;
    const profile = await currentProfile();
    if (!profile) {
        return new Response("Unauthorized", { status: 401 });
    }
    try {
        const {searchParams} = new URL(req.url);
        const serverId = searchParams.get("serverId");
        if (!serverId) {
            return new Response("Bad Request: Missing serverId", { status: 400 });
        }
        const {name, type} = await req.json();

        if(name === "general"){
            return new Response("Bad Request: Cannot rename 'general' channel", { status: 400 });
        }

        const server = await db.server.update({
            where: {
                id: serverId,
                members: {
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
                    update: {
                        where: {
                            id: channeld,
                            name: {
                                not: "general"
                            }
                        },
                        data: {
                            name,
                            type
                        }
                    }
                }
            },
            include: {
                channels: true
            }
        })

        return NextResponse.json(server);
    } catch (error) {
        console.error("Error deleting channel:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}

