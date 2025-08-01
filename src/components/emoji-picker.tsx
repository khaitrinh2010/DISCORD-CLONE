"use client";

import * as Popover from "@radix-ui/react-popover";
import { Smile } from "lucide-react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { useState } from "react";
import { cn } from "@/lib/utils"; // if you use a `cn` helper for class merging

interface EmojiPopoverPickerProps {
    onChange: (emoji: string) => void;
}

export default function EmojiPicker({ onChange }: EmojiPopoverPickerProps) {
    const [open, setOpen] = useState(false);

    return (
        <Popover.Root open={open} onOpenChange={setOpen}>
            <Popover.Trigger asChild>
                <button
                    className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition"
                    aria-label="Pick emoji"
                >
                    <Smile className="h-5 w-5 text-zinc-500" />
                </button>
            </Popover.Trigger>

            <Popover.Portal>
                <Popover.Content
                    side="right"
                    sideOffset={40}
                    className={cn(
                        "bg-transparent border-none shadow-none drop-shadow-none mb-16 z-50"
                    )}
                >
                    <Picker
                        data={data}
                        onEmojiSelect={(emoji: any) => {
                            onChange(emoji.native);
                            setOpen(false); // close after selecting
                        }}
                        theme="light"
                        previewPosition="none"
                        navPosition="top"
                    />
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
}
