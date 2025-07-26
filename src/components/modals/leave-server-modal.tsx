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
import {useRouter} from "next/navigation";

export const LeaveServerModal = () => {
    const {onOpen, isOpen, onClose, type, data } = useModal();
    const {server} = data || {};
    const isModalOpen = isOpen && type === "leaveServer";
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const onClickLeave = async () => {
        try{
            setIsLoading(true);
            await axios.patch(`/api/servers/${server?.id}/leave`);
            onClose();
            router.refresh();
            router.push("/servers");
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
                        Leave Server
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
