// components/providers/modal-provider.tsx
"use client";

import { useEffect, useState } from "react";
import { useModal } from "../../../hooks/use-modal-store";
import { CreateServerModal } from "@/components/modals/create-server-modal";
import {InviteModal} from "@/components/modals/InviteModal";
import {EditServerModal} from "@/components/modals/edit-server-modal";
import {MembersModal} from "@/components/modals/MembersModal";
import {CreateChannelModal} from "@/components/modals/create-channel-modal";

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
        </>
    );
};
