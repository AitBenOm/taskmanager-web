"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/components/ui/button";
import {
    Form, FormField, FormItem, FormLabel,
    FormControl, FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Dialog, DialogContent, DialogHeader,
    DialogTitle, DialogDescription
} from "@/components/ui/dialog";
import { Eye, EyeOff } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/lib/api/axios";
import { useRouter } from "next/navigation";
import { safePatch } from "@/lib/api/helpers";

const passwordSchema = z.object({
    oldPassword: z.string().min(6),
    password: z.string().min(6),
    confirmPassword: z.string().min(6)
}).refine((d) => d.password === d.confirmPassword, {
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

    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

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
            setTimeout(() => setUpdated(false), 500);
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
                setUser({ ...user, ...response.data });
            }

            setUpdated(true);
            setTimeout(() => setUpdated(false), 500);
            setEditOpen(false);
        } catch (err) {
            console.log("Profile update failed", err);
        }
    };

    return (
        <div className="w-full min-h-screen p-4 sm:p-10
            bg-[url('/dashboard-bg.png')] bg-cover bg-center bg-fixed flex justify-center">

            <div
                className={`
          w-full max-w-3xl rounded-2xl p-6 sm:p-10
          bg-blue-900/20 backdrop-blur-xl
          border border-white/10
          shadow-[0_8px_32px_rgba(0,0,0,0.25)]
          text-gray-100 transition-all duration-500
          ${updated ? "ring-2 ring-blue-300/50 scale-[1.01]" : ""}
        `}
            >
                {/* HEADER */}
                <div className="flex flex-col items-center mb-8">
                    <div className="
              w-28 h-28 rounded-full
              bg-blue-100/20 backdrop-blur-xl
              border border-white/20 shadow-lg
              flex items-center justify-center overflow-hidden
            ">
                        {user?.avatarUrl ? (
                            <img src={user.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-gray-200 text-sm">Avatar</span>
                        )}
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-semibold mt-4">
                        {user?.fullName}
                    </h2>
                    <p className="text-gray-300 text-sm">{user?.email}</p>
                </div>

                <hr className="my-8 border-white/10" />

                {/* INFO GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-300">Full Name</span>
                        <span className="font-semibold">{user?.fullName}</span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-gray-300">Email</span>
                        <span className="font-semibold">{user?.email}</span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-gray-300">Role</span>
                        <span className="font-semibold">{user?.role}</span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-gray-300">Group</span>
                        <span className="font-semibold">{user?.familyId || "No Group Linked"}</span>
                    </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex flex-col sm:flex-row justify-center mt-10 gap-3 sm:gap-4">
                    <Button
                        onClick={() => setEditOpen(true)}
                        className="
                px-6 py-2 rounded-xl bg-blue-500/30
                border border-white/20 text-white
                hover:bg-blue-500/40 shadow
              "
                    >
                        Edit Profile
                    </Button>

                    <Button
                        variant="outline"
                        onClick={onExit}
                        className="
                border-white/20 text-gray-100
                hover:bg-white/10 rounded-xl
              "
                    >
                        Logout
                    </Button>
                </div>

                {/* CHANGE PASSWORD */}
                <div className="mt-8 flex justify-center">
                    <button
                        onClick={() => setPwdOpen(true)}
                        className="text-blue-300 font-medium hover:underline text-sm"
                    >
                        Change Password
                    </button>
                </div>

                {/* PASSWORD MODAL */}
                <Dialog open={pwdOpen} onOpenChange={setPwdOpen}>
                    <DialogContent
                        className="
              bg-blue-900/30 backdrop-blur-xl
              border border-white/10 shadow-2xl
              text-gray-100 rounded-2xl p-8
            "
                    >
                        <DialogHeader>
                            <DialogTitle className="text-xl font-semibold">
                                Change Password
                            </DialogTitle>
                            <DialogDescription className="text-gray-300">
                                Enter your current and new password.
                            </DialogDescription>
                        </DialogHeader>

                        <Form {...resetForm}>
                            <form
                                onSubmit={resetForm.handleSubmit(onChangePassword)}
                                className="space-y-5 mt-4"
                            >
                                {/* OLD PASSWORD */}
                                <FormField
                                    control={resetForm.control}
                                    name="oldPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-100">Old Password</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        type={showOld ? "text" : "password"}
                                                        placeholder="Enter old password"
                                                        className="rounded-lg
                              bg-white/10 border border-white/20
                              text-white placeholder-gray-400"
                                                        {...field}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowOld(!showOld)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300"
                                                    >
                                                        {showOld ? <EyeOff size={18} /> : <Eye size={18} />}
                                                    </button>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* NEW PASSWORD */}
                                <FormField
                                    control={resetForm.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-100">New Password</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        type={showNew ? "text" : "password"}
                                                        placeholder="Enter new password"
                                                        className="rounded-lg
                              bg-white/10 border border-white/20
                              text-white placeholder-gray-400"
                                                        {...field}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowNew(!showNew)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300"
                                                    >
                                                        {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                                                    </button>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* CONFIRM */}
                                <FormField
                                    control={resetForm.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-100">Confirm Password</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        type={showConfirm ? "text" : "password"}
                                                        placeholder="Confirm password"
                                                        className="rounded-lg
                              bg-white/10 border border-white/20
                              text-white placeholder-gray-400"
                                                        {...field}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowConfirm(!showConfirm)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300"
                                                    >
                                                        {showConfirm ? (
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
                                    className="
                    w-full bg-blue-500/30 hover:bg-blue-500/40
                    text-white rounded-xl py-3 shadow
                  "
                                >
                                    Update Password
                                </Button>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>

                {/* EDIT PROFILE MODAL */}
                <Dialog open={editOpen} onOpenChange={setEditOpen}>
                    <DialogContent
                        className="
              bg-blue-900/30 backdrop-blur-xl
              border border-white/10 shadow-2xl
              text-gray-100 rounded-2xl p-8
            "
                    >
                        <DialogHeader>
                            <DialogTitle className="text-xl font-semibold">
                                Edit Profile
                            </DialogTitle>
                            <DialogDescription className="text-gray-300">
                                Update your account information.
                            </DialogDescription>
                        </DialogHeader>

                        <Form {...editForm}>
                            <form
                                onSubmit={editForm.handleSubmit(onSubmitEdit)}
                                className="space-y-6 mt-4"
                            >
                                {/* NAME */}
                                <FormField
                                    control={editForm.control}
                                    name="fullName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-100">Full Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    className="rounded-lg bg-white/10 border border-white/20 text-white"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* EMAIL (read only) */}
                                <FormField
                                    control={editForm.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-100">Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    disabled
                                                    className="rounded-lg bg-white/10 border border-white/20 text-gray-300 cursor-not-allowed"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* AVATAR */}
                                <FormField
                                    control={editForm.control}
                                    name="avatarUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-100">Avatar URL</FormLabel>
                                            <FormControl>
                                                <Input
                                                    className="rounded-lg bg-white/10 border border-white/20 text-white"
                                                    placeholder="https://image.com/avatar.png"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button
                                    type="submit"
                                    className="
                    w-full bg-blue-500/30 hover:bg-blue-500/40
                    text-white rounded-xl py-3 shadow
                  "
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
