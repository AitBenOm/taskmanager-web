"use client";


import {useAuthStore} from "@/store/auth.store";

export default function ProfilePage() {
    const user = useAuthStore((s) => s.user);

    if (!user) {
        return <p>Loading profile...</p>;
    }

    return (
        <div className="profile-container">
            <div className="profile-card">

                {/* Header */}
                <div className="profile-header">
                    <div className="avatar-wrapper">
                        <img
                            src={user.avatarUrl || "/placeholder-avatar.png"}
                            alt="User Avatar"
                            className="avatar"
                        />
                    </div>

                    <h2 className="profile-name">{user.fullName}</h2>
                    <p className="profile-email">{user.email}</p>
                </div>

                <div className="divider"></div>

                {/* Profile details */}
                <div className="profile-info">
                    <div className="info-item">
                        <span className="label">Full Name</span>
                        <span className="value">{user.fullName}</span>
                    </div>

                    <div className="info-item">
                        <span className="label">Email</span>
                        <span className="value">{user.email}</span>
                    </div>

                    <div className="info-item">
                        <span className="label">Role</span>
                        <span className="value">{user.role}</span>
                    </div>

                    <div className="info-item">
                        <span className="label">Family Group</span>
                        <span className="value">{user.familyId || "No Family Linked"}</span>
                    </div>
                </div>

                <div className="profile-actions">
                    <button className="btn-primary">Edit Profile</button>
                    <button className="btn-secondary">Logout</button>
                </div>

            </div>
        </div>
    );
}
