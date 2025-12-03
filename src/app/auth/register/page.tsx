"use client"
import {useForm} from "react-hook-form"
import {z} from "zod"
import {zodResolver} from "@hookform/resolvers/zod";
import {useRouter} from "next/navigation";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Eye, EyeOff} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useErrorStore} from "@/store/error-store";
import {useState} from "react";
import {useLoadingStore} from "@/store/loading-store";
import api from "@/lib/api/axios";
import {safePost} from "@/lib/api/helpers";

const RegisterSchema = z.object({
    fullName: z.string().min(3, "Full name must be at least 3 characters"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password is required")
}).refine((data: { password: any; confirmPassword: any; }) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export default function RegisterPage() {
    const [error, setError] = useState<string | null>(null)

    const [showPassword, setShowPassword] = useState(false);
    const loading = useLoadingStore((s) => s.isLoading);
    const setLoading = useLoadingStore((s) => s.setLoading);

    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            fullName: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });
    const router = useRouter();

    async function onRegister(zodValues: z.infer<typeof RegisterSchema>) {
        setLoading(true);
        setError(null)

        try {
            console.log("Registering user with values:", zodValues);
            if (zodValues.password !== zodValues.confirmPassword) {
                setError("Passwords do not match");
                setLoading(false);
                return;
            }
            const response = await safePost("/users/register", {
                fullName: zodValues.fullName,
                email: zodValues.email,
                password: zodValues.password,
            });
            if (!response) {
                router.push("/auth/login");
            } else {
                router.push("/dashboard/profile");
            }
        } catch (e) {

        }

        setLoading(false);
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F7F8FA]">
            <div className="w-full max-w-md bg-white shadow-md rounded-xl p-8">
                <div className="w-12 h-1 bg-[#A78BFA] rounded-full mb-6"></div>

                <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome back 👋</h1>
                <p className="text-gray-500 mb-6">Login to your TaskManager account</p>

                {error && (
                    <p className="text-red-500 text-sm mb-3">{error}</p>
                )}

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onRegister)} className="space-y-6">
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
                            name="fullName"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Full Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Brian Smith" {...field} />
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
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Confirm Password</FormLabel>
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