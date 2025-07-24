import { NextResponse, NextRequest } from "next/server";
import {currentProfile} from "@/lib/current_profile";
import {db} from "@/lib/db";
export async function PATCH(req: Request, {params} : {params: {serverId: string}}){
    try{
        const profile = await currentProfile();
        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const {name, imageUrl} = await req.json();
        if(!params.serverId){
            return new NextResponse("Server ID is required", { status: 400 });
        }
        const server = await db.server.update({
            where: {
                id: params.serverId,
                profileId: profile.id
            },
            data: {
                name,
                imageUrl
            },
        })
        return NextResponse.json(server);
    }
    catch (error) {
        console.error("Error updating server:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
