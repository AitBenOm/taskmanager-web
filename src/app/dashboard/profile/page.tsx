"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Eye, EyeOff } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/lib/api/axios";
import { useRouter } from "next/navigation";
import {safePatch} from "@/lib/api/helpers";

//
// ZOD SCHEMAS
//
const passwordSchema = z.object({
    oldPassword: z.string().min(6),
    password: z.string().min(6),
    confirmPassword: z.string().min(6)
}).refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

const profileSchema = z.object({
    fullName: z.string().min(3, "Full name must be at least 3 characters"),
    email: z.string().email("Invalid email"),
    avatarUrl: z.string().url("Invalid URL").optional()
});

export default function ProfilePage() {
    const { user, logout, setUser } = useAuthStore();
    const router = useRouter();

    //
    // MODAL STATES
    //
    const [pwdOpen, setPwdOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);

    //
    // PASSWORD VISIBILITY STATES
    //
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    //
    // UPDATE ANIMATION STATE
    //
    const [updated, setUpdated] = useState(false);

    //
    // FORMS
    //
    const resetForm = useForm<z.infer<typeof passwordSchema>>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            oldPassword: "",
            password: "",
            confirmPassword: ""
        },
    });

    const editForm = useForm<z.infer<typeof profileSchema>>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            fullName: user?.fullName || "",
            email: user?.email || "",
            avatarUrl: user?.avatarUrl || ""
        },
    });

    //
    // ACTIONS
    //
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
            // LIVE ANIMATION TRIGGER
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
                avatarUrl: data.avatarUrl,
            };
            const response = await safePatch("/users/profile", dto);

            // FIX: merge instead of overwriting
            if (response) {
                setUser({
                    ...user,
                    ...response.data,
                });
            }

            // LIVE ANIMATION TRIGGER
            setUpdated(true);
            setTimeout(() => setUpdated(false), 600);

            setEditOpen(false);

        } catch (err) {
            console.log("Profile update failed", err);
        }
    };

    //
    // PAGE RENDER
    //
    return (
        <div className="w-full flex justify-center">
            <div
                className={`
          w-full max-w-3xl rounded-2xl p-10 bg-white border border-gray-200 shadow-sm
          transition-all duration-500
          ${updated ? "ring-2 ring-[rgba(100,150,255,0.45)] shadow-xl scale-[1.01]" : ""}
        `}
            >

                {/* HEADER */}
                <div className="flex flex-col items-center mb-8">

                    {/* AVATAR */}
                    <div className="w-28 h-28 rounded-full bg-gray-100 flex items-center justify-center border border-gray-300 overflow-hidden">
                        {user?.avatarUrl ? (
                            <img src={user.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-gray-500 text-sm">Avatar</span>
                        )}
                    </div>

                    {/* NAME + EMAIL */}
                    <h2 className="text-2xl font-semibold mt-4 text-gray-900">{user?.fullName}</h2>
                    <p className="text-gray-500 text-sm">{user?.email}</p>
                </div>

                {/* DIVIDER */}
                <hr className="my-8" />

                {/* INFO GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">

                    <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">Full Name</span>
                        <span className="text-gray-900 font-semibold">{user?.fullName}</span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">Email</span>
                        <span className="text-gray-900 font-semibold">{user?.email}</span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">Role</span>
                        <span className="text-gray-900 font-semibold">{user?.role}</span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">Family Group</span>
                        <span className="text-gray-900 font-semibold">
              {user?.familyId || "No Family Linked"}
            </span>
                    </div>
                </div>

                {/* ACTIONS */}
                <div className="flex justify-center mt-10 gap-4">
                    <Button
                        onClick={() => setEditOpen(true)}
                        className="px-6 bg-[#4e7dfc] hover:bg-[#3b6af6] text-white rounded-lg"
                    >
                        Edit Profile
                    </Button>

                    <Button variant="outline" onClick={onExit}>
                        Logout
                    </Button>
                </div>

                {/* CHANGE PASSWORD LINK */}
                <div className="mt-8 flex justify-center">
                    <button
                        onClick={() => setPwdOpen(true)}
                        className="text-blue-600 font-medium hover:underline text-sm"
                    >
                        Change Password
                    </button>
                </div>

                {/* CHANGE PASSWORD MODAL */}
                <Dialog open={pwdOpen} onOpenChange={setPwdOpen}>
                    <DialogContent className="bg-white rounded-xl p-8 shadow-xl w-full max-w-lg">

                        <DialogHeader>
                            <DialogTitle className="text-gray-900">Change Password</DialogTitle>
                            <DialogDescription className="text-gray-500">
                                Enter your old password and create a new one.
                            </DialogDescription>
                        </DialogHeader>

                        <Form {...resetForm}>
                            <form onSubmit={resetForm.handleSubmit(onChangePassword)} className="space-y-6 mt-4">

                                {/* OLD PASSWORD */}
                                <FormField
                                    control={resetForm.control}
                                    name="oldPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-800">Old Password</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        type={showOldPassword ? "text" : "password"}
                                                        placeholder="Enter old password"
                                                        className="rounded-lg border-gray-300 pr-12 text-gray-800 placeholder:text-gray-400"
                                                        {...field}
                                                    />
                                                    <button
                                                        type="button"
                                                        tabIndex={-1}
                                                        onClick={() => setShowOldPassword(!showOldPassword)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 z-10 text-gray-500 hover:text-gray-700"
                                                    >
                                                        {showOldPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
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
                                            <FormLabel className="text-gray-800">New Password</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        type={showNewPassword ? "text" : "password"}
                                                        placeholder="Enter new password"
                                                        className="rounded-lg border-gray-300 pr-12 text-gray-800 placeholder:text-gray-400"
                                                        {...field}
                                                    />
                                                    <button
                                                        type="button"
                                                        tabIndex={-1}
                                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 z-10 text-gray-500 hover:text-gray-700"
                                                    >
                                                        {showNewPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                                                    </button>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* CONFIRM PASSWORD */}
                                <FormField
                                    control={resetForm.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-800">Confirm Password</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        type={showConfirmPassword ? "text" : "password"}
                                                        placeholder="Confirm new password"
                                                        className="rounded-lg border-gray-300 pr-12 text-gray-800 placeholder:text-gray-400"
                                                        {...field}
                                                    />
                                                    <button
                                                        type="button"
                                                        tabIndex={-1}
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 z-10 text-gray-500 hover:text-gray-700"
                                                    >
                                                        {showConfirmPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                                                    </button>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button
                                    type="submit"
                                    className="w-full bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-lg py-3"
                                >
                                    Update Password
                                </Button>

                            </form>
                        </Form>

                    </DialogContent>
                </Dialog>

                {/* EDIT PROFILE MODAL */}
                {/* EDIT PROFILE MODAL */}
                <Dialog open={editOpen} onOpenChange={setEditOpen}>
                    <DialogContent className="bg-white rounded-xl p-8 shadow-xl w-full max-w-lg">

                        <DialogHeader>
                            <DialogTitle className="text-gray-900">Edit Profile</DialogTitle>
                            <DialogDescription className="text-gray-500">
                                Update your personal information.
                            </DialogDescription>
                        </DialogHeader>

                        <Form {...editForm}>
                            <form onSubmit={editForm.handleSubmit(onSubmitEdit)} className="space-y-6 mt-4">

                                {/* FULL NAME */}
                                <FormField
                                    control={editForm.control}
                                    name="fullName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-800">Full Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter your full name"
                                                    className="rounded-lg border-gray-300 text-gray-800 placeholder:text-gray-400"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* EMAIL */}
                                <FormField
                                    control={editForm.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-800">Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="email"
                                                    placeholder="Enter your email"
                                                    className="rounded-lg border-gray-300 text-gray-800 placeholder:text-gray-400"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* AVATAR URL */}
                                <FormField
                                    control={editForm.control}
                                    name="avatarUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-800">Avatar URL</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="https://your-image.com/avatar.png"
                                                    className="rounded-lg border-gray-300 text-gray-800 placeholder:text-gray-400"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* SAVE BUTTON */}
                                <Button
                                    type="submit"
                                    className="w-full bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-lg py-3"
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
