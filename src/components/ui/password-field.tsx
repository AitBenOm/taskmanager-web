"use client";

import { FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";

interface PasswordFieldProps {
    id: string;
    label: string;
    field: any;
    show: boolean;
    toggle: () => void;
    placeholder?: string;
}

export default function PasswordField({
                                          id,
                                          label,
                                          field,
                                          show,
                                          toggle,
                                          placeholder
                                      }: PasswordFieldProps) {

    return (
        <FormItem>
            <FormLabel htmlFor={id} className="font-medium text-gray-700">
                {label}
            </FormLabel>

            <FormControl>
                <div className="relative">
                    <Input
                        {...field}
                        id={id}
                        type={show ? "text" : "password"}
                        placeholder={placeholder}
                        className="rounded-lg border-gray-300 pr-10"
                    />

                    <button
                        type="button"
                        onClick={toggle}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        aria-label={show ? "Hide password" : "Show password"}
                    >
                        {show ? <EyeOff size={18}/> : <Eye size={18}/> }
                    </button>
                </div>
            </FormControl>

            <FormMessage />
        </FormItem>
    );
}
