"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
    name: z.string().min(1, { message: "Server name is required" }),
    imageUrl: z.string().url({ message: "Server image is required" }),
});

export const CreateServerModal = () => {
    const router = useRouter();
    const { type, isOpen, onClose } = useModal();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            imageUrl: "",
        },
    });

    const isLoading = form.formState.isSubmitting;

    const handleClose = () => {
        form.reset();
        onClose();
    };

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post("/api/servers", values);
            form.reset();
            router.refresh();
            onClose();
        } catch (error) {
            console.error("Error creating server:", error);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent
                className="z-50 bg-white dark:bg-[#2b2d31] text-black dark:text-white w-full max-w-lg rounded-lg p-6 sm:p-8 flex flex-col items-center justify-center"
            >
                <DialogHeader className="w-full text-center space-y-1 mb-4">
                    <DialogTitle className="text-2xl font-extrabold">
                        Create a Server
                    </DialogTitle>
                    <DialogDescription className="text-zinc-500 dark:text-zinc-400 text-sm">
                        Give your server a personality with a name and an icon.
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
                                name="imageUrl"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <FileUpload
                                                endpoint="serverImage"
                                                value={field.value}
                                                onChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Server Name */}
                        <div className="w-full">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                                            Server Name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                disabled={isLoading}
                                                placeholder="Enter a name"
                                                className="bg-zinc-100 dark:bg-[#1e1f22] border-none text-sm focus-visible:ring-2 focus-visible:ring-emerald-500"
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
                                Create Server
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
