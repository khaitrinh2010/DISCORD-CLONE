"use client";

import {Search} from "lucide-react";
import {useState, useEffect} from "react";
import {CommandDialog, CommandEmpty, CommandInput, CommandList, CommandGroup, CommandItem} from "@/components/ui/command";
import {useParams, useRouter} from "next/navigation";

interface ServerSearchProps {
    data: {
        label: string;
        type: "channel" | "member";
        data: {
            icon: React.ReactNode;
            name: string;
            id: string;
        }[] | undefined;
    }[];
}

export default function ServerSearch ({data}: ServerSearchProps){
    const [state, setState] = useState(false)
    const router = useRouter();
    const params = useParams()

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setState((open) => !open);
            }
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const onClick = ({ id, type } : { id : string, type : "member" | "channel"}) => {
        setState(false);
        if(type == "member"){
            return router.push(`/servers/${params.serverId}/conversations/${id}`);
        }
        if(type == "channel"){
            return router.push(`/servers/${params.serverId}/channels/${id}`);
        }
    }

    return (
        <>
            <button
                onClick={() => setState(true)}
                className="group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition"
            >
                <Search className="w-4 h-4 text-zinc-500 dark:text-zinc-400"/>
                <p className="font-semibold text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600">
                    Search
                </p>
            </button>
            <CommandDialog open={state} onOpenChange={setState}>
                <CommandInput placeholder="Search all channels and members" />
                    <CommandList>
                        <CommandEmpty>
                            No results found.
                        </CommandEmpty>
                    </CommandList>
                    {data.map(({ label, type, data }) => {
                        if (!data?.length) return null;
                        return (
                            <CommandGroup key={label} heading={label}>
                                {data?.map(({ id, icon, name }) => {
                                    return (
                                        <CommandItem key={id} onSelect={() => onClick({id, type})}>
                                            {icon}
                                            <span>{name}</span>
                                        </CommandItem>
                                    );
                                })}
                            </CommandGroup>
                        );
                    })}

            </CommandDialog>

        </>
    )
}
