import type { Metadata } from "next";
import { Open_Sans, Roboto_Mono } from "next/font/google";
import {ClerkProvider} from "@clerk/nextjs";
import "./globals.css";
import {ThemeProvider} from "@/components/providers/theme-provider";
import {cn} from "@/lib/utils";
import {ModalProvider} from "@/components/providers/modal-provider";
import {CreateServerModal} from "@/components/modals/create-server-modal";
import {SocketProvider} from "@/components/providers/socker-provider";

// Define font variables for Tailwind
const openSans = Open_Sans({
    variable: "--font-sans",
    subsets: ["latin"],
    display: "swap",
});

const robotoMono = Roboto_Mono({
    variable: "--font-mono",
    subsets: ["latin"],
    display: "swap",
});

export const metadata: Metadata = {
    title: "Discord Clone",
    description: "Built with Next.js, Tailwind and Typescript",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProvider>
            <html lang="en" suppressHydrationWarning>
                <body className={cn(openSans.variable, "bg-white dark:bg-[#313338]")}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    enableSystem={false}
                    storageKey="discord-theme"
                >
                    <SocketProvider>
                        <ModalProvider />
                        {children}
                    </SocketProvider>
                </ThemeProvider>

                </body>
            </html>
        </ClerkProvider>
    );
}
