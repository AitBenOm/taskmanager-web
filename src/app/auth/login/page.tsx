"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import api from "@/lib/api/axios";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { useErrorStore } from "@/store/error-store";

//
// SCHEMA
//
const LoginSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(1, "Password is required"),
});

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { setUser, setToken } = useAuthStore();
    const errorMessage = useErrorStore((s) => s.error);
    const router = useRouter();

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    //
    // LOGIN
    //
    async function onSubmit(values: z.infer<typeof LoginSchema>) {
        setLoading(true);
        setError(null);

        try {
            const response = await api.post("/auth/login", values, {
                withCredentials: true,
            });
            setToken(response.data.access_token);

            if (response.data.user) {
                setUser(response.data.user);
            }

            router.push("/dashboard");
        } catch (err: any) {
            setError("Login failed");
        }
    }

    return (
        <div className="min-h-screen w-full grid grid-cols-1 md:grid-cols-2">

            {/* LEFT SIDE — MATCHES DASHBOARD STYLE */}
            <div
                className="flex items-center justify-center p-10 bg-gradient-to-br from-sky-900 via-blue-900 to-slate-900 dark:from-slate-900 dark:via-slate-950 dark:to-black
        "
            >
                <div
                    className="
            w-full max-w-md
            bg-white/10 dark:bg-white/5
            backdrop-blur-2xl
            border border-white/20 dark:border-slate-700
            shadow-[0_12px_30px_rgba(0,0,0,0.45)]
            p-10 rounded-2xl
          "
                >
                    {/* HEADER */}
                    <div className="mb-12 text-center">
                        <h1 className="text-3xl font-semibold tracking-tight text-white">
                            Welcome back
                        </h1>
                        <p className="text-slate-300 mt-2">
                            Sign in to continue.
                        </p>
                    </div>

                    {(errorMessage || error) && (
                        <p className="text-red-400 text-sm mb-4">
                            {errorMessage || error}
                        </p>
                    )}

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">

                            {/* EMAIL */}
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-200">Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="email@example.com"
                                                className="
                          bg-white/10 border border-slate-600/50
                          text-white placeholder-slate-400
                          h-12 px-4 rounded-xl
                          focus:ring-2 focus:ring-sky-400
                          transition
                        "
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* PASSWORD */}
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-200">Password</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="Your password"
                                                    className="
                            bg-white/10 border border-slate-600/50
                            text-white placeholder-slate-400
                            h-12 px-4 pr-12 rounded-xl
                            focus:ring-2 focus:ring-sky-400
                            transition
                          "
                                                    {...field}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="
                            absolute right-3 top-1/2 -translate-y-1/2
                            text-slate-300 hover:text-white transition
                          "
                                                >
                                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* BUTTON */}
                            <Button
                                type="submit"
                                disabled={loading}
                                className="
                  w-full h-12 rounded-xl font-medium
                  bg-sky-600 hover:bg-sky-500
                  dark:bg-sky-500 dark:hover:bg-sky-400
                  text-white shadow-lg
                  transition
                "
                            >
                                {loading ? "Signing in..." : "Sign In"}
                            </Button>

                        </form>

                        <p className="text-center text-sm text-slate-300 mt-4">
                            You don't have an account yet?{" "}
                            <a href="/auth/register" className="text-sky-400 hover:underline">
                                Sign Up
                            </a>
                        </p>

                    </Form>
                </div>
            </div>

            {/* RIGHT SIDE — HERO IMAGE */}
            <div
                className="
          hidden md:block relative bg-cover bg-center
        "
                style={{
                    backgroundImage:
                        'url("https://images.unsplash.com/photo-1529429617124-95b109e86b03?q=80&w=1200&auto=format&fit=crop")',
                }}
            >
                {/* darkened overlay for readability */}
                <div className="absolute inset-0 bg-black/20" />
            </div>
        </div>
    );
}
