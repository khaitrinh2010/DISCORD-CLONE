"use client";



import {ChannelType, MemberRole} from "@prisma/client";
import {ServerWithMembersWithProfiles} from "../../../types";
import ActionTooltip from "@/components/action-tooltiip";
import {Plus, Settings, Users} from "lucide-react";
import {useModal} from "../../../hooks/use-modal-store";

interface ServerSectionProps {
    label: string;
    role?: MemberRole;
    sectionType: "channels" | "members";
    channelType?: ChannelType;
    server?: ServerWithMembersWithProfiles
}
const ServerSection = ({label, role, sectionType, channelType, server} : ServerSectionProps) => {
    const {onOpen} = useModal();
    return (
        <div className="flex items-center justify-between py-2">
            <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
                {label}
            </p>

            {role !== MemberRole.GUEST && sectionType === "channels" && (
                <ActionTooltip label="Create Channel" side="top">
                    <button onClick={() => onOpen("createChannel",  { channelType })}>
                        <Plus className="w-4 h-4" />
                    </button>
                </ActionTooltip>
            )}

            {role === MemberRole.ADMIN && sectionType === "members" && (
                <ActionTooltip label="Manage People" side="top">
                    <button onClick={() => onOpen("members", { server })}>
                        <Settings className="w-4 h-4" />
                    </button>
                </ActionTooltip>
            )}
        </div>

    )
}

export default ServerSection;
