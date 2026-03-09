import { UserRole } from '../types'
import { API_PATHS } from './config'
import { apiGet } from './http'

interface UserDto {
    id: string
    username: string
    email: string
    first_name: string
    last_name: string
    patronymic: string
    role: string
    department: string | null
    department_name?: string | null
    created_at: string
}

export interface DirectoryUser {
    id: string
    username: string
    firstName: string
    lastName: string
    fullName: string
    email: string
    role: UserRole
    department: string
}

const normalizeUserRole = (role: string): UserRole => {
    const normalizedRole = role.toUpperCase()

    if (normalizedRole === UserRole.ADMIN || normalizedRole === UserRole.MANAGER || normalizedRole === UserRole.EMPLOYEE) {
        return normalizedRole
    }

    return UserRole.EMPLOYEE
}

const mapUserDto = (user: UserDto): DirectoryUser => {
    const firstName = user.first_name || ''
    const lastName = user.last_name || ''
    const fullName = [firstName, lastName].filter(Boolean).join(' ').trim() || user.username

    return {
        id: user.id,
        username: user.username,
        firstName,
        lastName,
        fullName,
        email: user.email,
        role: normalizeUserRole(user.role),
        department: user.department_name || user.department || '',
    }
}

export const fetchUsers = async (): Promise<DirectoryUser[]> => {
    const users = await apiGet<UserDto[]>(API_PATHS.users)
    return users.map(mapUserDto)
}

export const fetchUserById = async (userId: string): Promise<DirectoryUser> => {
    const user = await apiGet<UserDto>(`${API_PATHS.users}${userId}/`)
    return mapUserDto(user)
}
