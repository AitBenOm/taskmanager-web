"use client"

import { Button } from "@/components/ui/button"

export default function Home() {
    return (
        <div className="p-10">
            <Button onClick={() => alert("Clicked!")}>
                ShadCN is working 🎉
            </Button>
        </div>
    )
}
