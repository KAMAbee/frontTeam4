export const UserRole = {
    ADMIN: 'ADMIN',
    MANAGER: 'MANAGER',
    EMPLOYEE: 'EMPLOYEE',
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

export interface User {
    id: string
    firstName: string
    lastName: string
    role: UserRole
    department: string
}
