import {currentProfile} from "@/lib/current_profile";
import {redirect} from "next/navigation";
import {db} from "@/lib/db";
import {NavigationAction} from "@/components/navigation/navigation-action";
import {Separator} from "@/components/ui/separator";
import {ScrollArea} from "@/components/ui/scroll-area";
import NaviagtionItem from "@/components/navigation/naviagtion-item";
import {ModeToggle} from "@/components/mode-toggle";
import {UserButton} from "@clerk/nextjs";

export const NavigationSidebar = async () => {
    const profile = await currentProfile()
    if(!profile){
        return redirect('/');
    }

    const servers = await db.server.findMany({
        where: {
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    })
    console.log("Server Sidebar rendered")

    return (
        <div className="space-y-4 flex flex-col items-center h-full text-primary w-full dark:bg-[#1E1F22] py-3">
            <NavigationAction/>
            <Separator />
            <ScrollArea className="flex-1 w-full">
                {servers.map((server) => {
                    return (
                        <div key={server.id} className="mb-4">
                            <NaviagtionItem
                                id={server.id}
                                name={server.name}
                                imageUrl={server.imageUrl}/>
                        </div>
                    );
                })}
            </ScrollArea>
            <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
                <UserButton afterSignOutUrl="/"  />
                <ModeToggle/>
            </div>
        </div>
    )
}
