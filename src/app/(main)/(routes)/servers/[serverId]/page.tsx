import {currentProfile} from "@/lib/current_profile";
import {redirect} from "next/navigation";
import {db} from "@/lib/db";

interface ServerIdPageProps {
    params: {
        serverId: string;
    };
}
const ServerIdPage = async ({ params } : ServerIdPageProps) => {
    const profile = await currentProfile();
    if (!profile){
        return redirect("/sign-in");
    }
    const server = await db.server.findFirst({
        where: {
            id: params.serverId,
            members: {
                some: {
                    profileId: profile.id,
                },
            },
        },
        include: {
            channels: {
                where: {
                    name: "general",
                },
                orderBy: {
                    createdAt: "asc",
                },
            },
        },
    });

    const initialChannel = server?.channels[0];
    if (initialChannel?.name !== "general") {
        return null;
    }
    return redirect(`/servers/${params.serverId}/channels/${initialChannel.id}`);
}
export default ServerIdPage;
