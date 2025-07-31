import {NextRequest, NextResponse} from "next/server";
import {currentProfile} from "@/lib/current_profile";
import {db} from "@/lib/db";

export async function DELETE(req : NextRequest, { params } : { params : {memberId: string}}){
    try
    {
        const profile = await currentProfile()
        if (!profile) {
            return new Response("Unauthorized", {status: 401});
        }
        const {searchParams} = new URL(req.url);
        const serverId = searchParams.get("serverId");
        if (!serverId) {
            return new Response("Bad Request: Missing serverId", {status: 400});
        }
        if (!params.memberId) {
            return new Response("Bad Request: Missing [memberId]", {status: 400});
        }
        const server = await db.server.update({
            where: {
                id: serverId,
                profileId: profile.id,
            },
            data: {
                members: {
                    deleteMany: {
                        id: params.memberId,
                        profileId: {
                            not: profile.id
                        }
                    }
                }
            },
            include: {
                members: {
                    include: {
                        profile: true,
                    },
                    orderBy: {
                        role: 'asc'
                    }
                },
            },

        })
        return NextResponse.json(server)
    }
    catch (error) {
        console.error("Error deleting member:", error);
        return new Response("Internal Server Error", {status: 500});
    }
}

export async function PATCH(req : NextRequest, { params } : { params : {memberId: string}}){
    try{
        const profile = await currentProfile()
        if(!profile){
            return new Response("Unauthorized", { status: 401 });
        }
        const { role } = await req.json();
        const {searchParams} = new URL(req.url);
        const serverId = searchParams.get("serverId");
        if (!serverId){
            return new Response("Bad Request: Missing serverId", { status: 400 });
        }
        if(!params.memberId){
            return new Response("Bad Request: Missing [memberId]", { status: 400 });
        }
        const server = await db.server.update({
            where : {
                id : serverId,
                profileId : profile.id,
            },
            data : {
                members : {
                    update : {
                        where : {
                            id: params.memberId,
                            profileId: {
                                not: profile.id
                            }
                        },
                        data : {
                            role,
                        }
                    }
                }
            },
            include: {
                members: {
                    include: {
                        profile: true,
                    },
                    orderBy: {
                        role: 'asc'
                    }
                },
            },

        })
        return NextResponse.json(server)


    }
    catch(error){
        console.error("Error updating member role:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}
