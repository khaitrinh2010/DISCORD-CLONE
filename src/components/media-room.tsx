"use client"

import {useEffect, useState} from "react";
import {LiveKitRoom, VideoConference} from "@livekit/components-react";
import "@livekit/components-styles";
import {useUser} from "@clerk/nextjs";
import {Channel} from "@prisma/client";
import {Loader2} from "lucide-react";

interface MediaRoomProps {
    chatId: string;
    video: boolean;
    audio: boolean;
}

export const MediaRoom = ({ chatId, video, audio }: MediaRoomProps) => {
    const { user } = useUser();
    const [token, setToken] = useState("");
    useEffect(() => {
        if(!user?.lastName || !user?.firstName) {
            console.error("User metadata is not set properly");
            return;
        }
        const name = `${user.firstName} ${user.lastName}`;
        (async () => {
            try{
                const response = await fetch(`/api/livekit/?room=${chatId}&username=${name}`)
                const data = await response.json();
                setToken(data.token);
            }
            catch (error) {
                console.error("Error fetching LiveKit token:", error);
            }
        })()
    }, [user?.lastName, user?.firstName, chatId]);

    if (token === "" || !token) {
        return (
            <div className="flex flex-col flex-1 justify-center items-center">
                <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
                <p className="text-xs text-zinc-500 dark:text-zinc-400"> Loading ... </p>
            </div>
        );
    }
    console.log("LiveKit token:", token);

    return (
        <LiveKitRoom
            data-lk-theme="default"
            serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL || ""}
            token={token}
            video={video}
            audio={audio}
            connect={true}
        >
            <VideoConference/>
        </LiveKitRoom>
    );
};
