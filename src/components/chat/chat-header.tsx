import {Hash, Menu} from "lucide-react";
import {MobileToggle} from "@/components/ui/mobile-toggle";
import UserAvatar from "@/components/ui/user-avatar";
import {SocketIndicator} from "@/components/ui/socket-indicator";
interface ChatHeaderProps {
    serverId: string,
    name: string,
    type: "channel" | "conversation";
    imageUrl?: string;
}
const ChatHeader= ({serverId, name, type, imageUrl} : ChatHeaderProps) => {
    return (
        <div className="text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2">
            <MobileToggle serverId={serverId} />
            {type === "channel" && (
                <Hash className="mr-2 w-5 h-5 text-zinc-500 dark:text-zinc-400" />
            )}
            {type === "conversation" && (
                <UserAvatar src={imageUrl} className="mr-2 w-8 h-8" />
            )}
            <p className="font-semibold text-md text-black dark:text-white">
                {name}
            </p>
            <div className="ml-auto flex items-center">
                <SocketIndicator />
            </div>
        </div>
    );
}

export default ChatHeader;
