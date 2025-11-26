export interface User {
    id: string
    email: string
    fullName: string
    avatarUrl?: string
    role: string
    familyId?: string | null
    createdAt: string
}
