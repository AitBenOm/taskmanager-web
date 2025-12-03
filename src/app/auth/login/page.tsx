"use client"

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import api from "@/lib/api/axios"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/auth.store"
import { useErrorStore } from "@/store/error-store"

//
// SCHEMA
//
const LoginSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(1, "Password is required"),
})

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const { setUser, setToken } = useAuthStore()
    const errorMessage = useErrorStore((s) => s.error)
    const router = useRouter()

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    //
    // LOGIN
    //
    async function onSubmit(values: z.infer<typeof LoginSchema>) {
        setLoading(true)
        setError(null)

        try {
            const response = await api.post("/auth/login", values, { withCredentials: true })
            setToken(response.data.access_token)

            if (response.data.user) {
                setUser(response.data.user)
            }

            router.push("/dashboard")
        } catch (err: any) {
            setError("Login failed")
        }
    }

    return (
        <div className="min-h-screen w-full grid grid-cols-1 md:grid-cols-2">

            {/* LEFT SIDE — UPDATED PREMIUM FORM PANEL */}
            <div className="
        flex items-center justify-center p-10
        bg-gradient-to-br from-[#0A1A2F] via-[#0F2E4F] to-[#1A4D7A]
      ">
                <div className="w-full max-w-md
                        bg-white/10 backdrop-blur-xl
                        border border-[#23456A]
                        shadow-[0_8px_30px_rgba(0,0,0,0.4)]
                        p-10 rounded-xl">

                    {/* HEADER */}
                    <div className="mb-12 text-center">
                        <h1 className="text-3xl font-semibold tracking-tight text-[#E8F0FF]">
                            Welcome back
                        </h1>
                        <p className="text-[#AFC6E6] mt-2">
                            Sign in to continue.
                        </p>
                    </div>

                    {(errorMessage || error) && (
                        <p className="text-red-400 text-sm mb-4">
                            {errorMessage || error}
                        </p>
                    )}

                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-7"
                        >

                            {/* EMAIL */}
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[#D0E0F5]">Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="email@example.com"
                                                className="
                          bg-white/5 border border-[#2D527D]
                          text-[#E8F0FF] placeholder-[#7FA5C7]
                          h-12 px-4 rounded-lg
                          focus:ring-2 focus:ring-[#3BA7F1]
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
                                        <FormLabel className="text-[#D0E0F5]">Password</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="Your password"
                                                    className="
                            bg-white/5 border border-[#2D527D]
                            text-[#E8F0FF] placeholder-[#7FA5C7]
                            h-12 px-4 pr-12 rounded-lg
                            focus:ring-2 focus:ring-[#3BA7F1]
                            transition
                          "
                                                    {...field}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="
                            absolute right-3 top-1/2 -translate-y-1/2
                            text-[#AFC6E6] hover:text-white
                            transition
                          "
                                                >
                                                    {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
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
                  w-full h-12 rounded-lg font-medium
                  bg-[#1A4D7A] hover:bg-[#153E63]
                  text-white shadow-lg
                  transition
                "
                            >
                                {loading ? "Signing in..." : "Sign In"}
                            </Button>

                        </form>
                        <p className="text-center text-sm text-[#AFC6E6] mt-4">
                            You don&#39;t have an account yet ?{" "}
                            <a href="/auth/register" className="text-[#7AB8FF] hover:underline">
                                Sign Up
                            </a>
                        </p>
                    </Form>
                </div>
            </div>

            {/* RIGHT SIDE — HERO IMAGE */}
            <div
                className="
          hidden md:block relative
          bg-cover bg-center bg-no-repeat
        "
                style={{
                    backgroundImage: `url("https://images.unsplash.com/photo-1529429617124-95b109e86b03?q=80&w=1920&auto=format&fit=crop")`
                }}
            >
                <div className="absolute inset-0 bg-black/20" />
            </div>

        </div>
    )
}
