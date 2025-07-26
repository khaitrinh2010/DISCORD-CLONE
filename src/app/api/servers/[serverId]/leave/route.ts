import {NextRequest, NextResponse} from 'next/server';
import {db} from '@/lib/db';
import {currentProfile} from '@/lib/current_profile';

export async function PATCH(req: NextRequest, {params}: {params: {serverId: string}}) {
    try{
        const profile = await currentProfile();
        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        if(!params.serverId){
            return new NextResponse("Server ID is required", { status: 400 });
        }
        const server = await db.server.update({
            where: {
                id: params.serverId,
                profileId: {
                    not : profile.id, // Ensure the server belongs to a different profile
                },
                members: {
                    some: {
                        profileId: profile.id,
                    }
                }
            },
            data: {
                members: {
                    deleteMany: {
                        profileId: profile.id,
                    },
                },
            },
        })
        return NextResponse.json(server);
    }
    catch (er) {
        console.error("Error leaving server:", er);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
