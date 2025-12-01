"use client";

import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import LoadingOverlay from "@/components/global/LoadingOverlay";
import {useLoadingStore} from "@/store/loading-store";
import {useEffect} from "react";
import {usePathname} from "next/navigation";
import { Toaster, toast } from "sonner"
import ClientLayoutWrapper from "@/components/global/ClientLayoutWrapper";


const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export default function RootLayout({children,}: Readonly<{ children: React.ReactNode; }>) {

    const setLoading = useLoadingStore((s) => s.setLoading);
    const pathname = usePathname();

    useEffect(() => {
        setLoading(false); // Force reset on every navigation
    }, [pathname]);

    {
        return (
            <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >

            <ClientLayoutWrapper>
                <LoadingOverlay/>
                {children}
            </ClientLayoutWrapper>

            </body>
            </html>
        );
    }
}