import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useModal } from "../../../hooks/use-modal-store";
import { useState } from "react";
import {Label} from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import qs from "query-string"
import {
    Check,
    Copy,
    RefreshCw,
    ShieldAlert,
    ShieldCheck,
    MoreVertical,
    ShieldQuestion,
    Shield,
    Gavel, Loader2
} from "lucide-react";
import {useOrigin} from "../../../hooks/use-origin";
import axios from "axios";
import {ServerWithMembersWithProfiles} from "../../../types";
import {ScrollArea} from "@/components/ui/scroll-area";
import UserAvatar from "@/components/ui/user-avatar";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuPortal,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger
} from "@/components/ui/dropdown-menu";
import {MemberRole} from "@prisma/client";
import {useRouter} from "next/navigation";

const roleIconMap = {
    "GUEST": null,
    "MODERATOR": <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
    "ADMIN": <ShieldAlert className="h-4 w-4 text-rose-500"/>
}

export const MembersModal = () => {
    const router = useRouter();
    const {onOpen, isOpen, onClose, type, data } = useModal();
    const {server} = data as {server: ServerWithMembersWithProfiles} || {};
    const isModalOpen = isOpen && type === "members";
    const [loadingId, setLoadingId] = useState<string | null>("");

    const onKick = async (memberId: string) => {
        try{
            setLoadingId(memberId);
            const url = qs.stringifyUrl({
                url: `/api/members/${memberId}`,
                query: { serverId: server?.id }
            })
            const response = await axios.delete(url);
            router.refresh();
            onOpen("members", { server: response.data });
        }
        catch(error){
            console.error("Error kicking member:", error);
        }
        finally {
            setLoadingId("");
        }
    }
    const onRoleChange = async (memberId: string, role: MemberRole) => {
        try{
            console.log("Clicking on role change", memberId, role);
            setLoadingId(memberId);
            const url = qs.stringifyUrl({
                url: `/api/members/${memberId}`,
                query: { serverId: server?.id }
            })
            const response = await axios.patch(url, { role });
            router.refresh();
            onOpen("members", { server: response.data });
        }
        catch(error){
            console.error("Error updating member role:", error);
        }
        finally {
            setLoadingId("");
        }
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Manage Members
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        {server?.members.length} members.
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="mt-8 max-h-[420px] pr-6">
                    {
                        server?.members.map((member) => (
                            <div key={member.id} className="flex items-center gap-x-2 mb-6">
                                <UserAvatar src={member.profile.imageUrl}/>
                                <div className="text-xs font-semibold flex items-center gap-x-1">
                                    {member.profile.name}
                                    {roleIconMap[member.role] || null}
                                    <p className="text-xs text-zinc-500">
                                        {member.profile.email}
                                    </p>
                                </div>
                                {server.profileId !== member.profileId && loadingId !== member.id && (
                                    <div className="ml-auto">
                                        <DropdownMenu className="right-2">
                                            <DropdownMenuTrigger>
                                                <MoreVertical className="h-4 w-4 text-zinc-500" />
                                            </DropdownMenuTrigger>

                                            <DropdownMenuContent side="left">
                                                <DropdownMenuSub>
                                                    <DropdownMenuSubTrigger className="flex items-center">
                                                        <ShieldQuestion className="w-4 h-4 mr-2" />
                                                        <span>Role</span>
                                                    </DropdownMenuSubTrigger>
                                                    <DropdownMenuPortal>
                                                        <DropdownMenuSubContent>
                                                            <DropdownMenuItem onClick={() => onRoleChange(member.id, "GUEST")}>
                                                                <Shield className="h-4 w-4 mr-2" />
                                                                Guest
                                                                {member.role === "GUEST" && <Check className="ml-auto h-4 w-4 text-indigo-500" />}
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem asChild>
                                                                <button
                                                                    onClick={() => onRoleChange(member.id, "MODERATOR")}
                                                                    className="flex items-center w-full text-sm px-2 py-1.5 text-left hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md"
                                                                >
                                                                    <ShieldCheck className="h-4 w-4 mr-2" />
                                                                    Moderator
                                                                    {member.role === "MODERATOR" && (
                                                                        <Check className="ml-auto h-4 w-4 text-indigo-500" />
                                                                    )}
                                                                </button>
                                                            </DropdownMenuItem>
                                                        </DropdownMenuSubContent>
                                                    </DropdownMenuPortal>
                                                </DropdownMenuSub>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => onKick(member.id)}>
                                                    <Gavel className="w-4 h-4 mr-2" />
                                                    Kick
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                )}
                                {loadingId === member.id && (
                                    <Loader2 className="animate-spin text-zinc-500 ml-auto h-4 w-4" />
                                )}

                            </div>
                        ))
                    }
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
};
