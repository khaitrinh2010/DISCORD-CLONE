"use client";
import {Member, MemberRole, Profile, Server} from "@prisma/client";
import {ServerWithMembersWithProfiles} from "../../../types";
import {ShieldAlert, ShieldCheck} from "lucide-react";
import {useParams, useRouter} from "next/navigation";
import UserAvatar from "@/components/ui/user-avatar";
import {cn} from "@/lib/utils";

interface ServerMemberProps {
    member: Member & {profile: Profile},
    server: Server
}

const roleIconMap = {
    [MemberRole.ADMIN]: <ShieldAlert className="h-4 w-4 mr-2 text-rose-500" />,
    [MemberRole.MODERATOR]: <ShieldCheck className="h-4 w-4 mr-2 text-indigo-500" />,
    [MemberRole.GUEST]: null
}
const ServerMember = ({member, server} : ServerMemberProps) => {
    const params = useParams();
    const router = useRouter();
    const icon = roleIconMap[member.role];

    const onClick = () => {
        router.push(`/servers/${params.serverId}/conversations/${member.id}`);
    }
    return(
        <button
            onClick={onClick}
            className={cn(
                "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full",
                "hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
                params?.memberId === member.id && "bg-zinc-700/20 dark:bg-zinc-700"
            )}
        >
            <UserAvatar
                src={member.profile.imageUrl}
                className="h-8 w-8 md:h-8 md:w-8"
            />
            <p className={cn(
                "font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
                params?.memberId === member.id &&
                "text-primary dark:text-zinc-200 dark:group-hover:text-white"
            )}>
                {member.profile.name}
            </p>
            {icon}
        </button>

    )
}

export default ServerMember;
