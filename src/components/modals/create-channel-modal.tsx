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
import { useRouter, useParams } from "next/navigation";
import { useModal } from "../../../hooks/use-modal-store";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {ChannelType} from "@prisma/client";
import qs from "query-string";

const formSchema = z.object({
    name: z.string().min(1, { message: "Server name is required" }).refine(name => name !== "general", {message: "Channel name cannot be 'general'"}),
    type: z.nativeEnum(ChannelType)
});

export const CreateChannelModal = () => {
    const router = useRouter();
    const params = useParams()
    const { type, isOpen, onClose } = useModal();

    const isModalOpen = isOpen && type === "createChannel";

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            type: ChannelType.TEXT, // Default to TEXT channel type
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
                url: "/api/channels",
                query: { serverId: params.serverId }
            })
            await axios.post(url, values);
            form.reset();
            router.refresh();
            onClose();
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
                        Create a Channel
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="w-full flex flex-col items-center justify-center space-y-6"
                    >

                        <div className="w-full flex flex-col gap-6">
                            {/* Channel Name Field */}
                            <FormField
                                control={form.control}
                                name="name"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                                            Channel Name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                disabled={isLoading}
                                                placeholder="Enter a name"
                                                className="bg-zinc-100 dark:bg-[#1e1f22] border border-zinc-300 dark:border-zinc-700 rounded-md text-sm focus-visible:ring-2 focus-visible:ring-emerald-500 focus:outline-none"
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            {/* Channel Type Field */}
                            <FormField
                                control={form.control}
                                name="type"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                                            Channel Type
                                        </FormLabel>
                                        <Select
                                            disabled={isLoading}
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger
                                                    className="bg-zinc-100 dark:bg-[#1e1f22] border border-zinc-300 dark:border-zinc-700 rounded-md text-sm capitalize focus:outline-none focus:ring-2 focus:ring-emerald-500">
                                                    <SelectValue placeholder="Select a channel type"/>
                                                </SelectTrigger>
                                            </FormControl>

                                            <SelectContent>
                                                {Object.values(ChannelType).map((type) => (
                                                    <SelectItem key={type} value={type} className="capitalize">
                                                        {type.toLowerCase()}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage/>
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
                                Create
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
