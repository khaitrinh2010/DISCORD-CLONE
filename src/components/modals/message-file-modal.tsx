"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import qs from "query-string";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useModal } from "../../../hooks/use-modal-store";

const formSchema = z.object({
    fileUrl: z.string({ message: "Attachment is required" }),
});

export const MessageFileModal = () => {
    const router = useRouter();
    const { type, isOpen, onClose, data } = useModal();
    const isModalOpen = isOpen && type === "messageFile";
    const { apiUrl, query } = data || {};
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fileUrl: "",
        },
    });

    const isLoading = form.formState.isSubmitting;

    const handleClose = () => {
        form.reset();
        onClose();
    };

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const url = qs.stringifyUrl({
                url: apiUrl,
                query,
            })
            await axios.post(url, {
                ...values,
                content: values.fileUrl,
            });
            form.reset();
            router.refresh();
            handleClose()
        } catch (error) {
            console.error("Error creating server:", error);
        }
    };

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent
                className="z-50 bg-white dark:bg-[#2b2d31] text-black dark:text-white w-full max-w-lg rounded-lg p-6 sm:p-8 flex flex-col items-center justify-center"
            >
                <DialogHeader className="w-full text-center space-y-1 mb-4">
                    <DialogTitle className="text-2xl font-extrabold">
                        Add an attachment
                    </DialogTitle>
                    <DialogDescription className="text-zinc-500 dark:text-zinc-400 text-sm">
                        Send a file as a message
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="w-full flex flex-col items-center justify-center space-y-6"
                    >
                        {/* Upload */}
                        <div className="flex justify-center">
                            <FormField
                                control={form.control}
                                name="fileUrl"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <FileUpload
                                                endpoint="messageFile"
                                                value={field.value}
                                                onChange={field.onChange}
                                                name="fileUrl"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        {/* Create Button */}
                        <DialogFooter className="w-full pt-2">
                            <Button
                                disabled={isLoading}
                                type="submit"
                                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold"
                            >
                                Send
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
