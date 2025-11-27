"use client"

import {useForm} from "react-hook-form"
import {z} from "zod"
import {zodResolver} from "@hookform/resolvers/zod"

import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form"

import {Input} from "@/components/ui/input"
import {Button} from "@/components/ui/button"
import {Card, CardHeader, CardTitle, CardContent} from "@/components/ui/card"
import {useState} from "react"
import {Eye, EyeOff, XCircle} from "lucide-react"
import api, {setToken} from "@/lib/api/axios"
import { useRouter } from "next/navigation";

const LoginSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(1, "Password is required"),
})

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })
    const router = useRouter()


    async function onSubmit(values: z.infer<typeof LoginSchema>) {
        setLoading(true)
        setError(null)

        try {
            const response = await api.post("/auth/login", values, {withCredentials: true})

            setToken(response.data.access_token)

            // ❗ DO NOT AWAIT HERE ❗
            router.push("/dashboard")

            console.log("Login successful")

        } catch (err: any) {
            console.log("FULL ERROR OBJECT:", err);

            if (err.response) {
                console.log("ERROR RESPONSE:", err.response.data);
            }
            if (err.message) {
                console.log("ERROR MESSAGE:", err.message);
            }
            if (err.stack) {
                console.log("STACK:", err.stack);
            }

            setError("Login failed");
        } finally {
            setLoading(false)
        }
    }


    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F7F8FA]">
            <div className="w-full max-w-md bg-white shadow-md rounded-xl p-8">
                <div className="w-12 h-1 bg-[#A78BFA] rounded-full mb-6"></div>

                <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome back 👋</h1>
                <p className="text-gray-500 mb-6">Login to your TaskManager account</p>

                {error && (
                    <Card
                        className="mb-4 max-w-sm mx-auto border-red-200 bg-red-50 rounded-md shadow-sm"
                        role="alert"
                        aria-live="assertive"
                    >
                        <CardHeader className="flex items-center justify-between gap-2 px-3 py-2">
                            <div className="flex items-center gap-2">
                                <XCircle className="text-red-600" size={16}/>
                                <CardTitle className="text-sm font-medium text-red-700">Login failed</CardTitle>
                            </div>
                            <button
                                onClick={() => setError(null)}
                                className="text-xs text-red-600 hover:underline"
                                aria-label="Dismiss error"
                            >
                                Dismiss
                            </button>
                        </CardHeader>

                        <CardContent className="px-3 pb-3 text-sm text-red-700 leading-tight">
                            Invalid email or password. Verify your credentials or{' '}
                            <a href="/auth/reset" className="font-medium underline text-red-700">
                                reset your password
                            </a>
                            .
                        </CardContent>
                    </Card>
                )}

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="email@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Your password"
                                                className="rounded-lg border-gray-300 pr-10"
                                                {...field}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                aria-label={showPassword ? "Hide password" : "Show password"}
                                            >
                                                {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                                            </button>
                                        </div>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-lg py-3"
                        >
                            {loading ? "Logging in..." : "Login"}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}
