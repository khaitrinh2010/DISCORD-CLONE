"use client";

import {Channel, ChannelType, MemberRole, Server} from "@prisma/client";
import {Hash, Mic, Video} from "lucide-react";
import {useParams, useRouter} from "next/navigation";
import {cn} from "@/lib/utils";

interface ServerChannelProps {
    channel: Channel,
    role?: MemberRole;
    server?: Server;
}

const iconMap = {
    [ChannelType.TEXT]: Hash,
    [ChannelType.AUDIO]: Mic, // Replace with actual audio icon
    [ChannelType.VIDEO]: Video, // Replace with actual video icon
}

export const ServerChannel = ({channel, role, server} : ServerChannelProps) => {
    const params = useParams()
    const router = useRouter();
    const Icon = iconMap[channel.type];
    return (
        <button
            onClick={() => {}}
            className={cn(
                "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full",
                "hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1"
            )}
        >
            <Icon
                className="flex-shrink-0 w-5 h-5 text-zinc-500 dark:text-zinc-400"
            />
        </button>
    );
}
