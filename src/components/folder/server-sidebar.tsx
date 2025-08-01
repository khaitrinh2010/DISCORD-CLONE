import {redirect} from "next/navigation";
import {currentProfile} from "@/lib/current_profile";
import {db} from "@/lib/db";
import {channel} from "node:diagnostics_channel";
import {ChannelType, MemberRole} from "@prisma/client";
import {ServerHeader} from "@/components/folder/server-header";
import {ChevronDown, Hash, Mic, ShieldAlert, ShieldCheck, Video} from "lucide-react";
import {ScrollArea} from "@/components/ui/scroll-area";
import ServerSearch from "@/components/folder/server-search";
import {Separator} from "@/components/ui/separator";
import ServerSection from "@/components/folder/server-section";
import {ServerChannel} from "@/components/folder/server-channel";
import ServerMember from "@/components/folder/server-member";

interface ServerSidebarProps {
    serverId: string;
}

const roleIconMap = {
    [MemberRole.ADMIN]: <ShieldAlert className="h-4 w-4 mr-2 text-rose-500" />,
    [MemberRole.MODERATOR]: <ShieldCheck className="h-4 w-4 mr-2 text-indigo-500" />,
    [MemberRole.GUEST]: null
}

const iconMap = {
    [ChannelType.TEXT]: <Hash className="h-4 w-4" />,
    [ChannelType.AUDIO]: <Mic className="h-4 w-4" />,
    [ChannelType.VIDEO]: <Video className="h-4 w-4" />,
}
export const ServerSidebar = async ({serverId}: ServerSidebarProps) => {
    const profile = await currentProfile();
    if (!profile) {
        return redirect("/");
    }
    const server = await db.server.findUnique({
        where: {
            id: serverId,
        },
        include: {
            channels: {
                orderBy: {
                    createdAt: "asc",
                }
            },
            members: {
                include: {
                    profile: true
                },
                orderBy: {
                    role: "asc"
                }
            }
        }
    });
    if(!server){
        return redirect("/");
    }
    const textChannels = server?.channels.filter(channel =>channel.type === ChannelType.TEXT) || [];
    const audioChannels = server?.channels.filter(channel =>channel.type === ChannelType.AUDIO) || [];
    const videoChannels = server?.channels.filter(channel =>channel.type === ChannelType.VIDEO) || [];
    const members = server?.members.filter(member => member.profileId !== profile.id) || [];

    const role = server.members.find(member => member.profileId === profile.id)?.role;
    console.log("Number of members:", members.length);

    return (
        <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
            <ServerHeader server={server} role={role}/>
            <ScrollArea className="flex-1 px-3">
                <div className="mt-2">
                    <ServerSearch data = {
                        [
                            {
                                label: "Text Channels",
                                type: "channel",
                                data: textChannels.map(channel => ({
                                    id: channel.id,
                                    name: channel.name,
                                    icon: iconMap[channel.type]
                                }))
                            },
                            {
                                label: "Audio Channels",
                                type: "channel",
                                data: audioChannels.map(channel => ({
                                    id: channel.id,
                                    name: channel.name,
                                    icon: iconMap[channel.type]
                                }))
                            },
                            {
                                label: "Video Channels",
                                type: "channel",
                                data: videoChannels.map(channel => ({
                                    id: channel.id,
                                    name: channel.name,
                                    icon: iconMap[channel.type]
                                }))
                            },
                            {
                                label: "Members",
                                type: "member",
                                data: members.map(member => ({
                                    id: member.id,
                                    name: member.profile.name,
                                    icon: roleIconMap[member.role]
                                }))
                            }
                        ]
                    } />
                </div>
                <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />
                {!!textChannels?.length && (
                    <div className="mb-2">
                        <ServerSection label="Text Channel" server={server} role={role} sectionType="channels" channelType={ChannelType.TEXT}/>
                        {textChannels.map(channel => (
                            <ServerChannel key={channel.id} channel={channel} server={server} role={role} />
                        ))}
                    </div>
                )}
                {!!audioChannels?.length && (
                    <div className="mb-2">
                        <ServerSection label="Voice Channel" server={server} role={role} sectionType="channels" channelType={ChannelType.AUDIO}/>
                        {audioChannels.map(channel => (
                            <ServerChannel key={channel.id} channel={channel} server={server} role={role} />
                        ))}
                    </div>
                )}
                {!!videoChannels?.length && (
                    <div className="mb-2">
                        <ServerSection label="Video Channel" server={server} role={role} sectionType="channels" channelType={ChannelType.VIDEO}/>
                        {videoChannels.map(channel => (
                            <ServerChannel key={channel.id} channel={channel} server={server} role={role} />
                        ))}
                    </div>
                )}
                {!!members?.length && (
                    <div className="mb-2">
                        <ServerSection label="Members" server={server} role={role} sectionType="members"/>
                        {members.map(member => (
                            <ServerMember key={member.id} member={member} server={server} />
                        ))}
                    </div>
                )}

            </ScrollArea>

        </div>
    )
}
