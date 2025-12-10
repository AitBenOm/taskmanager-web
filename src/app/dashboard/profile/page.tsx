"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog";
import { Eye, EyeOff } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/lib/api/axios";
import { useRouter } from "next/navigation";
import { safePatch } from "@/lib/api/helpers";

const passwordSchema = z
    .object({
        oldPassword: z.string().min(6),
        password: z.string().min(6),
        confirmPassword: z.string().min(6)
    })
    .refine((d) => d.password === d.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"]
    });

const profileSchema = z.object({
    fullName: z.string().min(3, "Full name must be at least 3 characters"),
    email: z.string().email("Invalid email"),
    avatarUrl: z.string().url("Invalid URL").optional()
});

export default function ProfilePage() {
    const { user, logout, setUser } = useAuthStore();
    const router = useRouter();

    const [pwdOpen, setPwdOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);

    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [updated, setUpdated] = useState(false);

    const resetForm = useForm<z.infer<typeof passwordSchema>>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            oldPassword: "",
            password: "",
            confirmPassword: ""
        }
    });

    const editForm = useForm<z.infer<typeof profileSchema>>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            fullName: user?.fullName || "",
            email: user?.email || "",
            avatarUrl: user?.avatarUrl || ""
        }
    });

    const onExit = () => {
        logout();
        router.push("/auth/login");
    };

    const onChangePassword = async (data: z.infer<typeof passwordSchema>) => {
        try {
            await api.post("/auth/change-password", {
                oldPassword: data.oldPassword,
                newPassword: data.password
            });

            resetForm.reset();
            setPwdOpen(false);
            setUpdated(true);
            setTimeout(() => setUpdated(false), 600);
        } catch (err) {
            console.log("Password update failed", err);
        }
    };

    const onSubmitEdit = async (data: z.infer<typeof profileSchema>) => {
        try {
            const dto: any = {
                fullName: data.fullName,
                avatarUrl: data.avatarUrl
            };
            const response = await safePatch("/users/profile", dto);

            if (response) {
                setUser({
                    ...user,
                    ...response.data
                });
            }

            setUpdated(true);
            setTimeout(() => setUpdated(false), 600);

            setEditOpen(false);
        } catch (err) {
            console.log("Profile update failed", err);
        }
    };

    return (
        <div className="w-full flex justify-center">
            <div
                className={`
          w-full max-w-3xl rounded-2xl p-10 
          bg-white/90 backdrop-blur-sm 
          border border-[#D8E0EC] 
          shadow-[0_4px_20px_rgba(20,40,80,0.08)] 
          transition-all duration-500
          ${updated ? "ring-2 ring-[#7AB8FF] shadow-lg scale-[1.01]" : ""}
        `}
            >
                {/* HEADER */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-28 h-28 rounded-full bg-[#EEF4FF] flex items-center justify-center border border-[#C7D6EE] overflow-hidden shadow-sm">
                        {user?.avatarUrl ? (
                            <img
                                src={user.avatarUrl}
                                alt="avatar"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="text-[#6A7FA1] text-sm">Avatar</span>
                        )}
                    </div>

                    <h2 className="text-2xl font-semibold mt-4 text-[#0F213A]">
                        {user?.fullName}
                    </h2>
                    <p className="text-[#6A7FA1] text-sm">{user?.email}</p>
                </div>

                <hr className="my-8 border-[#E3EAF5]" />

                {/* INFO GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                    <div className="flex justify-between">
                        <span className="text-[#6A7FA1] font-medium">Full Name</span>
                        <span className="text-[#0F213A] font-semibold">
              {user?.fullName}
            </span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-[#6A7FA1] font-medium">Email</span>
                        <span className="text-[#0F213A] font-semibold">{user?.email}</span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-[#6A7FA1] font-medium">Role</span>
                        <span className="text-[#0F213A] font-semibold">{user?.role}</span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-[#6A7FA1] font-medium">Group</span>
                        <span className="text-[#0F213A] font-semibold">
              {user?.familyId || "No Group Linked"}
            </span>
                    </div>
                </div>

                {/* ACTIONS */}
                <div className="flex justify-center mt-10 gap-4">
                    <Button
                        onClick={() => setEditOpen(true)}
                        className="px-6 bg-[#1A4D7A] hover:bg-[#153E63] text-white rounded-lg shadow-sm"
                    >
                        Edit Profile
                    </Button>

                    <Button
                        variant="outline"
                        onClick={onExit}
                        className="border-[#C7D6EE] text-[#0F213A] hover:bg-[#EEF4FF]"
                    >
                        Logout
                    </Button>
                </div>

                {/* CHANGE PASSWORD */}
                <div className="mt-8 flex justify-center">
                    <button
                        onClick={() => setPwdOpen(true)}
                        className="text-[#1A4D7A] font-medium hover:underline text-sm"
                    >
                        Change Password
                    </button>
                </div>

                {/* MODALS KEEP SAME STRUCTURE, NEW COLORS BELOW */}

                <Dialog open={pwdOpen} onOpenChange={setPwdOpen}>
                    <DialogContent className="bg-white border border-[#D8E0EC] shadow-lg rounded-xl p-8">
                        <DialogHeader>
                            <DialogTitle className="text-[#0F213A]">
                                Change Password
                            </DialogTitle>
                            <DialogDescription className="text-[#6A7FA1]">
                                Enter your old password and create a new one.
                            </DialogDescription>
                        </DialogHeader>

                        <Form {...resetForm}>
                            <form
                                onSubmit={resetForm.handleSubmit(onChangePassword)}
                                className="space-y-6 mt-4"
                            >
                                {/* OLD PASSWORD */}
                                <FormField
                                    control={resetForm.control}
                                    name="oldPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[#0F213A]">
                                                Old Password
                                            </FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        type={showOldPassword ? "text" : "password"}
                                                        placeholder="Enter old password"
                                                        className="rounded-lg border-[#C7D6EE] bg-[#F7FAFF] text-[#0F213A]"
                                                        {...field}
                                                    />
                                                    <button
                                                        type="button"
                                                        tabIndex={-1}
                                                        onClick={() =>
                                                            setShowOldPassword(!showOldPassword)
                                                        }
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6A7FA1]"
                                                    >
                                                        {showOldPassword ? (
                                                            <EyeOff size={18} />
                                                        ) : (
                                                            <Eye size={18} />
                                                        )}
                                                    </button>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* NEW PASS */}
                                <FormField
                                    control={resetForm.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[#0F213A]">
                                                New Password
                                            </FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        type={showNewPassword ? "text" : "password"}
                                                        placeholder="Enter new password"
                                                        className="rounded-lg border-[#C7D6EE] bg-[#F7FAFF] text-[#0F213A]"
                                                        {...field}
                                                    />
                                                    <button
                                                        type="button"
                                                        tabIndex={-1}
                                                        onClick={() =>
                                                            setShowNewPassword(!showNewPassword)
                                                        }
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6A7FA1]"
                                                    >
                                                        {showNewPassword ? (
                                                            <EyeOff size={18} />
                                                        ) : (
                                                            <Eye size={18} />
                                                        )}
                                                    </button>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* CONFIRM PASS */}
                                <FormField
                                    control={resetForm.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[#0F213A]">
                                                Confirm Password
                                            </FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        type={showConfirmPassword ? "text" : "password"}
                                                        placeholder="Confirm new password"
                                                        className="rounded-lg border-[#C7D6EE] bg-[#F7FAFF] text-[#0F213A]"
                                                        {...field}
                                                    />
                                                    <button
                                                        type="button"
                                                        tabIndex={-1}
                                                        onClick={() =>
                                                            setShowConfirmPassword(!showConfirmPassword)
                                                        }
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6A7FA1]"
                                                    >
                                                        {showConfirmPassword ? (
                                                            <EyeOff size={18} />
                                                        ) : (
                                                            <Eye size={18} />
                                                        )}
                                                    </button>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button
                                    type="submit"
                                    className="w-full bg-[#1A4D7A] hover:bg-[#153E63] text-white rounded-lg py-3 shadow-sm"
                                >
                                    Update Password
                                </Button>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>

                {/* EDIT MODAL */}
                <Dialog open={editOpen} onOpenChange={setEditOpen}>
                    <DialogContent className="bg-white border border-[#D8E0EC] shadow-lg rounded-xl p-8">
                        <DialogHeader>
                            <DialogTitle className="text-[#0F213A]">
                                Edit Profile
                            </DialogTitle>
                            <DialogDescription className="text-[#6A7FA1]">
                                Update your personal information.
                            </DialogDescription>
                        </DialogHeader>

                        <Form {...editForm}>
                            <form
                                onSubmit={editForm.handleSubmit(onSubmitEdit)}
                                className="space-y-6 mt-4"
                            >
                                <FormField
                                    control={editForm.control}
                                    name="fullName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[#0F213A]">
                                                Full Name
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter your full name"
                                                    className="rounded-lg border-[#C7D6EE] bg-[#F7FAFF] text-[#0F213A]"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={editForm.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[#0F213A]">Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="email"
                                                    className="rounded-lg border-[#C7D6EE] bg-[#F7FAFF] text-[#0F213A]"
                                                    placeholder="Enter your email"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={editForm.control}
                                    name="avatarUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[#0F213A]">
                                                Avatar URL
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="https://image.com/avatar.png"
                                                    className="rounded-lg border-[#C7D6EE] bg-[#F7FAFF] text-[#0F213A]"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button
                                    type="submit"
                                    className="w-full bg-[#1A4D7A] hover:bg-[#153E63] text-white rounded-lg py-3 shadow-sm"
                                >
                                    Save Changes
                                </Button>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
