"use client"

import api from "@/lib/api/axios"
import { Button } from "@/components/ui/button"

export default function Home() {
    const testRequest = async () => {
        try {
            const res = await api.get("/users/profile")
            console.log("Success:", res.data)
        } catch (err) {
            console.log("Error:", err)
        }
    }
    return (
        <div className="p-10">
            <Button onClick={testRequest}>Test API</Button>
        </div>
    )
}
