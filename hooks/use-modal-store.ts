import {create} from "zustand/react";
import {Server} from "@prisma/client";

export type ModalType = "createServer" | "invite" | "editServer" | "members"

interface ModalData{
    server?: Server
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
