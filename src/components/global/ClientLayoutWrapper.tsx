"use client"
import {useLoadingStore} from "@/store/loading-store";
import {useEffect} from "react";
import {usePathname} from "next/navigation";
import {useErrorStore} from "@/store/error-store";

export default function ClientLayoutWrapper({children}: { children: React.ReactNode }) {
    const setLoading = useLoadingStore((s) => s.setLoading);
    const path = usePathname();
    const setError = useErrorStore((s) => s.setError);

    useEffect(() => {
        setLoading(false);
    }, [path, setLoading]);

    useEffect(() => {
        setError(null);
    }, [path, setError]);

    return <>{children}</>;
}