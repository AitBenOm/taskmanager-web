"use client"
import {useForm} from "react-hook-form"
import {z} from "zod"
import {zodResolver} from "@hookform/resolvers/zod";
import {useRouter} from "next/navigation";
import {
    Form, FormControl, FormField, FormItem,
    FormLabel, FormMessage
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Eye, EyeOff} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useState} from "react";
import {useLoadingStore} from "@/store/loading-store";
import {safePost} from "@/lib/api/helpers";

const RegisterSchema = z.object({
    fullName: z.string().min(3, "Full name must be at least 3 characters"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password is required")
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export default function RegisterPage() {
    const [error, setError] = useState<string | null>(null);
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

    async function onRegister(values: z.infer<typeof RegisterSchema>) {
        setLoading(true);
        setError(null);

        try {
            if (values.password !== values.confirmPassword) {
                setError("Passwords do not match");
                setLoading(false);
                return;
            }

            const response = await safePost("/users/register", {
                fullName: values.fullName,
                email: values.email,
                password: values.password,
            });

            if (!response) router.push("/auth/login");
            else router.push("/dashboard/profile");

        } catch (e) {}

        setLoading(false);
    }

    return (
        <div
            className="min-h-screen w-full bg-cover bg-center bg-fixed bg-no-repeat"
            style={{ backgroundImage: "url('/dashboard-bg.png')" }}
        >
        <div className="min-h-screen flex items-center justify-center
         bg-gradient-to-br from-[#0A1A2F] via-[#0F2E4F] to-[#1A4D7A] px-4">

            <div className="w-full max-w-md
          bg-white/10 backdrop-blur-xl
          border border-[#23456A]
          shadow-[0_8px_40px_rgba(0,0,0,0.45)]
          rounded-xl p-10">

                {/* HEADER */}
                <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
                    Create account
                </h1>
                <p className="text-[#AFC6E6] mb-6">Join TaskManager today.</p>

                {error && (
                    <p className="text-red-400 text-sm mb-4">{error}</p>
                )}

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onRegister)} className="space-y-6">

                        {/* EMAIL */}
                        <FormField
                            control={form.control}
                            name="email"
                            render={({field}) => (
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
                      "
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        {/* FULL NAME */}
                        <FormField
                            control={form.control}
                            name="fullName"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel className="text-[#D0E0F5]">Full Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Brian Smith"
                                            className="
                        bg-white/5 border border-[#2D527D]
                        text-[#E8F0FF] placeholder-[#7FA5C7]
                        h-12 px-4 rounded-lg
                        focus:ring-2 focus:ring-[#3BA7F1]
                      "
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        {/* PASSWORD */}
                        <FormField
                            control={form.control}
                            name="password"
                            render={({field}) => (
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
                          h-12 px-4 pr-10 rounded-lg
                          focus:ring-2 focus:ring-[#3BA7F1]
                        "
                                                {...field}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2
                                   text-[#AFC6E6] hover:text-white">
                                                {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                                            </button>
                                        </div>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        {/* CONFIRM PASSWORD */}
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel className="text-[#D0E0F5]">Confirm Password</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Re-enter password"
                                                className="
                          bg-white/5 border border-[#2D527D]
                          text-[#E8F0FF] placeholder-[#7FA5C7]
                          h-12 px-4 pr-10 rounded-lg
                          focus:ring-2 focus:ring-[#3BA7F1]
                        "
                                                {...field}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2
                                   text-[#AFC6E6] hover:text-white">
                                                {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                                            </button>
                                        </div>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        {/* SUBMIT */}
                        <Button
                            type="submit"
                            disabled={loading}
                            className="
                w-full bg-[#1A4D7A] hover:bg-[#153E63]
                text-white rounded-lg py-3 font-semibold shadow-lg
              "
                        >
                            {loading ? "Creating..." : "Create Account"}
                        </Button>
                        <p className="text-center text-sm text-[#AFC6E6] mt-4">
                            Already have an account?{" "}
                            <a href="/auth/login" className="text-[#7AB8FF] hover:underline">
                                Sign In
                            </a>
                        </p>
                    </form>

                </Form>
            </div>
        </div>
        </div>
    );
}
