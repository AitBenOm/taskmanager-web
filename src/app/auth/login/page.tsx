"use client"

import {useForm} from "react-hook-form"
import {z} from "zod"
import {zodResolver} from "@hookform/resolvers/zod"

import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"

import {Input} from "@/components/ui/input"
import {Button} from "@/components/ui/button"
import {useState} from "react"
import {Eye, EyeOff} from "lucide-react"
import api from "@/lib/api/axios"
import {useRouter} from "next/navigation";
import {useAuthStore} from "@/store/auth.store";
import {useErrorStore} from "@/store/error-store";

const LoginSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(1, "Password is required"),
})

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const {setUser, setToken} = useAuthStore();


    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })
    const router = useRouter()
    const errorMessage = useErrorStore((s) => s.error);



    async function onSubmit(values: z.infer<typeof LoginSchema>) {
        setLoading(true)
        setError(null)

        try {
            const response = await api.post("/auth/login", values, {withCredentials: true})

            setToken(response.data.access_token);
            if (response.data.user) {
                setLoading(false)
                setUser(response.data.user);
            }
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
        }
    }


    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F7F8FA]">
            <div className="w-full max-w-md bg-white shadow-md rounded-xl p-8">
                <div className="w-12 h-1 bg-[#A78BFA] rounded-full mb-6"></div>

                <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome back 👋</h1>
                <p className="text-gray-500 mb-6">Login to your TaskManager account</p>

                {errorMessage && (
                    <p className="text-red-500 text-sm mb-3">{errorMessage}</p>
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
