"use client";
import {useAuthStore} from "@/store/auth.store";
import api from "@/lib/api/axios";
import {useLoadingStore} from "@/store/loading-store";
import {useEffect} from "react";

export default function DashboardPage() {

    const {token, user, setUser, _hasHydrated} = useAuthStore();
    const setLoading = useLoadingStore((s) => s.setLoading);


    useEffect(() => {

        const fetchUserData = async () => {
            setLoading(true);
            try {
                const response = await api.get('/users/profile');
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (token !== null && user === null) {
            fetchUserData();
        }
    }, []);

    return (
        <div>
            <h1>Dashboard</h1>
            <p>Welcome to your dashboard!</p>

            {user && (
                <div style={{marginTop: 20}}>
                    <strong>Logged in as:</strong> {user.fullName} ({user.email})
                </div>
            )}
        </div>
    );
}