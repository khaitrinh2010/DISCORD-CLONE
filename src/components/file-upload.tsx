"use client"
import {UploadDropzone} from "@/lib/uploadthing";
import Image from "next/image";
import {FileIcon, X} from "lucide-react";
import "@uploadthing/react/styles.css";
import {Button} from "@/components/ui/button";
import {useEffect, useState} from "react";

interface FileUploadProps {
    onChange?: (url?: string) => void;
    value?: string;
    endpoint: "messageFile" | "serverImage";
    name?: string;
}
export const FileUpload = ({ onChange, value, endpoint, name }: FileUploadProps) => {
    const [fileType, setFileType] = useState<string | null>(null);

    if(value && fileType !== "pdf"){
        return (
            <div className="relative h-20 w-20">
                <Image
                    fill
                    src={value}
                    alt="upload"
                    className="rounded-full"
                />
                <button>
                    <X className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm" type="button" onClick={() => onChange?.("")} />
                </button>
            </div>

        );
    }
    else if(value && fileType === "pdf") {
        return (
            <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
                <FileIcon className="w-10 h-10 fill-indigo-200 stroke-indigo-400"/>
                <a
                    href={value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline max-w-[200px] truncate"
                >
                    {value}
                </a>
                <button>
                    <X className="bg-rose-500 text-white p-1 rounded-full absolute top-0 left-0 shadow-sm"
                       type="button" onClick={() => onChange?.("")}/>
                </button>

            </div>
        )
    }
    return (
        <UploadDropzone
            endpoint={endpoint}
            onClientUploadComplete={(res) => {
                const file = res?.[0];
                if (!file) return;
                const ext = file.name.split(".").pop()?.toLowerCase() ?? "unknown";
                setFileType(ext); // store type locally for display
                onChange?.(file.url); // only send the clean URL
            }}
        />
    );
};

