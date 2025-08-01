// components/providers/modal-provider.tsx
"use client";

import { useEffect, useState } from "react";
import { useModal } from "../../../hooks/use-modal-store";
import { CreateServerModal } from "@/components/modals/create-server-modal";
import {InviteModal} from "@/components/modals/InviteModal";
import {EditServerModal} from "@/components/modals/edit-server-modal";
import {MembersModal} from "@/components/modals/MembersModal";
import {CreateChannelModal} from "@/components/modals/create-channel-modal";
import {LeaveServerModal} from "@/components/modals/leave-server-modal";
import {DeleteServerModal} from "@/components/modals/delete-server-modal";
import {DeleteChannelModal} from "@/components/modals/delete-channel-modal";
import {EditChannelModal} from "@/components/modals/edit-channel-modal";
import {MessageFileModal} from "@/components/modals/message-file-modal";

export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);
    const { isOpen, type } = useModal();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return (
        <>
            {isOpen && type === "createServer" && <CreateServerModal />}
            <InviteModal />
            <EditServerModal />
            <MembersModal />
            <CreateChannelModal />
            <LeaveServerModal />
            <DeleteServerModal />
            <DeleteChannelModal />
            <EditChannelModal />
            <MessageFileModal />
        </>
    );
};
