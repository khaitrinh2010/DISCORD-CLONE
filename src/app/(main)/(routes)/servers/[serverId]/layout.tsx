import { currentProfile } from "@/lib/current_profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { ServerSidebar } from "@/components/folder/server-sidebar";

export default async function ServerIdLayout({
                                                 children,
                                                 params,
                                             }: {
    children: React.ReactNode;
    params: { serverId: string };
}) {
    const profile = await currentProfile();

    if (!profile) {
        return redirect("/sign-in");
    }

    const server = await db.server.findUnique({
        where: {
            id: params.serverId,
            members: {
                some: {
                    profileId: profile.id,
                },
            },
        },
    });

    if (!server) {
        return redirect("/");
    }

    return (
        <div className="h-full w-full flex">
            <div className="flex h-full w-60 z-20 flex-col">
                <ServerSidebar serverId={params.serverId} />
            </div>
            <main className="h-full flex-1 overflow-y-auto ml-10">
                {children}
            </main>
        </div>
    );

}
