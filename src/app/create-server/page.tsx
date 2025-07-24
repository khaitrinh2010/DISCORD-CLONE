"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";
import axios from "axios";
import { useRouter } from "next/navigation";
import {initialSetupPage} from "@/lib/initial-profile";
import {db} from "@/lib/db";

const formSchema = z.object({
    name: z.string().min(1, { message: "Server name is required" }),
    imageUrl: z.string().url({ message: "Server image is required" })
});

const CreateServerModal =  () => {
    const router = useRouter();
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            imageUrl: ""
        }
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const newServer = await axios.post("/api/servers", values);
            form.reset();
            router.push(`/servers/${newServer.data.server.id}`);
            router.refresh();
        } catch (error) {
            console.error("Error creating server:", error);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white dark:bg-neutral-800 rounded-lg shadow">
            <h1 className="text-2xl font-bold text-center mb-4">Create a Server</h1>
            <p className="text-center text-zinc-500 mb-6">
                Give your server a name and an icon to get started.
            </p>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="flex items-center justify-center">
                        <FormField
                            control={form.control}
                            name="imageUrl"
                            render={({field}) => (
                                <FormItem>
                                    <FormControl>
                                        <FileUpload
                                            endpoint="serverImage"
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="name"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Server Name</FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={isLoading}
                                        placeholder="Enter server name"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <Button disabled={isLoading} type="submit" className="w-full">
                        Create
                    </Button>
                </form>
            </Form>
        </div>
    );
};

export default CreateServerModal
