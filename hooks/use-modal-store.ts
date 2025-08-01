import {create} from "zustand/react";
import {Channel, ChannelType, Server} from "@prisma/client";

export type ModalType = "createServer" | "invite" | "editServer" | "members" | "createChannel" | "leaveServer" | "deleteServer" | "editChannel" | "deleteChannel" | "messageFile"

interface ModalData{
    server?: Server,
    channelType: ChannelType,
    channel: Channel,
    apiUrl?: string,
    query?: Record<string, any>,
}

interface ModalStore {
    type: ModalType | null;
    isOpen: boolean;
    data?: ModalData
    onOpen: (type: ModalType, data?: ModalData) => void;
    onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
    type: null,
    isOpen: false,
    data: {},
    onOpen: (type: ModalType, data = {}) => set({type, isOpen: true, data}),
    onClose: () => set({type: null, isOpen: false})
}))
