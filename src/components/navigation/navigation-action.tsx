"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import ActionTooltip from "../action-tooltiip";
import { CreateServerModal } from "@/components/modals/create-server-modal";
import {useRouter} from "next/navigation";
import {useModal} from "../../../hooks/use-modal-store";

export const NavigationAction = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter()
    const {type, isOpen, onOpen, onClose} = useModal()

    return (
        <>
            <ActionTooltip side="right" align="center" label="Add a server">
                <button
                    onClick={() => onOpen("createServer")}
                    className="group flex items-center"
                >
                    <div className="flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center bg-background dark:bg-neutral-700 group-hover:bg-emerald-500 hover:text-blue-500">
                        <Plus className="group-hover:text-white transition text-emerald-500" size={25} />
                    </div>
                </button>
            </ActionTooltip>


        </>
    );
};
