import {currentProfile} from "@/lib/current_profile";
import {redirect} from "next/navigation";
import {db} from "@/lib/db";
import {ChatInput} from "@/components/chat/chat-input";
import ChatHeader from "@/components/chat/chat-header";
import {ChatMessages} from "@/components/chat/chat-messages";


interface ChannelIdPageProps {
    params : {
        serverId: string;
        channelId: string;
    }
}
const ChannelIdPage = async ({ params } : ChannelIdPageProps) => {
    const profile = await currentProfile();
    if (!profile) {
        return redirect("/sign-in");
    }
    const channel = await db.channel.findUnique({
        where : {
            id: params.channelId,
        }
    })

    const member = await db.member.findFirst({
        where: {
            serverId: params.serverId,
            profileId: profile.id,
        },
    })

    if (!member || !channel) {
        return redirect("/");
    }
    return (
        <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
            <ChatHeader name={channel.name} serverId={channel.serverId} type="channel"/>
            <ChatMessages member={member} name={channel.name} type="channel" apiUrl="/api/messages"
                          socketUrl="/api/socket/messages" socketQuery={{channelId: channel.id, serverId: channel.serverId}} paramKey="channelId" paramValue={channel.id} chatId={channel.id}/>
            <ChatInput name={channel.name} type="channel" apiUrl="/api/socket/messages" query={{channelId: channel.id, serverId: channel.serverId}}/>
        </div>
    );
}

export default ChannelIdPage;
