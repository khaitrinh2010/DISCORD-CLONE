"use client";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { useModal } from "../../../hooks/use-modal-store";
import { useState } from "react";
import {Button} from "@/components/ui/button";
import axios from "axios";
import {useParams, useRouter} from "next/navigation";
import qs from "query-string";

export const DeleteChannelModal = () => {
    const {onOpen, isOpen, onClose, type, data } = useModal();
    const {server, channel} = data || {};
    const isModalOpen = isOpen && type === "deleteChannel";
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const onClickLeave = async () => {
        try{
            setIsLoading(true);
            const url = qs.stringifyUrl({
                url: `/api/channels/${channel?.id}`,
                query: { serverId: server?.id }
            })
            await axios.delete(url);
            onClose();
            router.push(`/servers/${server?.id}`);
            router.refresh();
        }
        catch (error) {
            console.error("Error leaving server:", error);
        }
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Delete Channel
                    </DialogTitle>
                </DialogHeader>
                <DialogFooter className="bg-gray-100 px-6 py-4">
                    <div className="flex items-center justify-between w-full">
                        <Button
                            disabled={isLoading}
                            onClick = {onClose}
                            variant="ghost"
                        >
                            Cancel
                        </Button>
                        <Button
                            disabled={isLoading}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white"
                            onClick={onClickLeave}
                        >
                            Confirm
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
