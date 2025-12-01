"use client";

import {useState} from "react";
import {useAuthStore} from "@/store/auth.store";
import {Button} from "@/components/ui/button";
import {Form, FormField, FormItem, FormLabel, FormControl, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Eye, EyeOff} from "lucide-react";
import {z} from "zod";
const resetPasswordSchema = z.object({
    oldPassword: z.string().min(6, "Old password must be at least 6 characters"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password is required")
}).refine((data: { password: any; confirmPassword: any; }) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

const profileFields = z.object({
    fullName: z.string().min(3, "Full name must be at least 3 characters"),
    email: z.string().email("Invalid email"),
    avatarUrl: z.string().url("Invalid URL").optional()
});

export default function ProfilePage() {
    const {user, logout: onLogout} = useAuthStore();

    const [showPasswordSection, setShowPasswordSection] = useState(false);
    const [loading, setLoading] = useState(false);

    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    // Your form instance here (Zod + react-hook-form)
    const resetForm = /* your existing form */ null;

    const onSubmit = async (data: any) => {
        setLoading(true);
        // your call logic
        setLoading(false);
    };

    return (
        <div className="w-full flex justify-center">
            <div className="w-full max-w-3xl bg-white border border-gray-200 shadow-sm rounded-2xl p-10">

                {/* HEADER */}
                <div className="flex flex-col items-center mb-8">

                    {/* Avatar */}
                    <div
                        className="w-28 h-28 rounded-full bg-gray-100 flex items-center justify-center border border-gray-300 overflow-hidden">
                        {user?.avatarUrl ? (
                            <img src={user.avatarUrl} alt="avatar" className="w-full h-full object-cover"/>
                        ) : (
                            <span className="text-gray-500 text-sm">Avatar</span>
                        )}
                    </div>

                    {/* Name & Email */}
                    <h2 className="text-2xl font-semibold mt-4 text-gray-900">
                        {user?.fullName}
                    </h2>

                    <p className="text-gray-500 text-sm">{user?.email}</p>
                </div>

                {/* DIVIDER */}
                <hr className="my-8"/>

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
                    <Button className="px-6 bg-blue-600 hover:bg-blue-700 text-white">
                        Edit Profile
                    </Button>

                    <Button variant="outline" onClick={onLogout}>
                        Logout
                    </Button>
                </div>

                {/* Toggle Password */}
                <div className="mt-8 flex justify-center">
                    <button
                        onClick={() => setShowPasswordSection(!showPasswordSection)}
                        className="text-blue-600 font-medium hover:underline text-sm"
                    >
                        {showPasswordSection ? "Hide Password ▲" : "Change Password ▼"}
                    </button>
                </div>

                {/* PASSWORD SECTION */}
                {showPasswordSection && (
                    <div className="mt-10 bg-gray-50 border border-gray-200 p-6 rounded-xl">

                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Change Password
                        </h3>

                        <Form {...resetPasswordSchema}>
                            <form onSubmit={resetPasswordSchema.handleSubmit(onSubmit)} className="space-y-6">

                                {/* OLD */}
                                <FormField
                                    control={resetPasswordSchema.control}
                                    name="oldPassword"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Old Password</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        type={showOld ? "text" : "password"}
                                                        placeholder="Enter old password"
                                                        {...field}
                                                    />
                                                    <span
                                                        onClick={() => setShowOld(!showOld)}
                                                        className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
                                                    >
                            {showOld ? <EyeOff size={18}/> : <Eye size={18}/>}
                          </span>
                                                </div>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                {/* NEW */}
                                <FormField
                                    control={resetPasswordSchema.control}
                                    name="password"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>New Password</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        type={showNew ? "text" : "password"}
                                                        placeholder="Enter new password"
                                                        {...field}
                                                    />
                                                    <span
                                                        onClick={() => setShowNew(!showNew)}
                                                        className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
                                                    >
                            {showNew ? <EyeOff size={18}/> : <Eye size={18}/>}
                          </span>
                                                </div>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                {/* CONFIRM */}
                                <FormField
                                    control={resetPasswordSchema.control}
                                    name="confirmPassword"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Confirm Password</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        type={showConfirm ? "text" : "password"}
                                                        placeholder="Confirm new password"
                                                        {...field}
                                                    />
                                                    <span
                                                        onClick={() => setShowConfirm(!showConfirm)}
                                                        className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
                                                    >
                            {showConfirm ? <EyeOff size={18}/> : <Eye size={18}/>}
                          </span>
                                                </div>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
                                >
                                    {loading ? "Updating..." : "Update Password"}
                                </Button>

                            </form>
                        </Form>
                    </div>
                )}

            </div>
        </div>
    );
}
