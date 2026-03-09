import { UserRole, type MyEnrollment, type User } from '../types'
import { API_PATHS } from './config'
import type { AuthTokens } from './authStorage'
import { apiGet, apiPatch, apiPost } from './http'

interface TokenResponseDto {
    access: string
    refresh: string
}

interface RegisterResponseDto {
    id: string
    username: string
    email: string
    first_name: string
    last_name: string
    patronymic: string
    role: string
    department: string | null
}

interface ProfileResponseDto {
    id: string
    username: string
    email: string
    first_name: string
    last_name: string
    patronymic: string
    role?: string | null
    department: string | null
    department_name?: string | null
}

interface MeProfileCertificateDto {
    enrollment_id: string
    training_title: string
    start_date: string
    end_date: string
    location: string | null
    city: string | null
    is_attended: boolean
    certificate_number: string
    certificate_file: string | null
}

interface MeProfileResponseDto {
    certificates: MeProfileCertificateDto[]
}

export interface RegisterPayload {
    username: string
    email: string
    password: string
    firstName: string
    lastName: string
    middleName?: string
    role: UserRole
}

export interface UpdateCurrentUserPayload {
    firstName: string
    lastName: string
    middleName?: string
}

const normalizeUserRole = (role: unknown, fallback: UserRole = UserRole.EMPLOYEE): UserRole => {
    if (typeof role !== 'string') {
        return fallback
    }

    const normalizedRole = role.toUpperCase()
    if (normalizedRole === UserRole.ADMIN || normalizedRole === UserRole.MANAGER || normalizedRole === UserRole.EMPLOYEE) {
        return normalizedRole
    }

    return fallback
}

export const loginWithUsername = async (username: string, password: string): Promise<AuthTokens> => {
    const response = await apiPost<TokenResponseDto>(API_PATHS.tokenObtain, {
        username,
        password,
    }, { auth: false })

    return {
        access: response.access,
        refresh: response.refresh,
    }
}

export const registerUser = async (payload: RegisterPayload): Promise<RegisterResponseDto> =>
    apiPost<RegisterResponseDto>(
        API_PATHS.register,
        {
            username: payload.username,
            email: payload.email,
            password: payload.password,
            first_name: payload.firstName,
            last_name: payload.lastName,
            patronymic: payload.middleName || '',
            role: payload.role,
        },
        { auth: false },
    )

const mapProfileDto = (profile: ProfileResponseDto): User => ({
    id: profile.id,
    firstName: profile.first_name,
    lastName: profile.last_name,
    role: normalizeUserRole(profile.role),
    department: profile.department_name || profile.department || '',
})

export const fetchCurrentUserProfile = async (): Promise<User> => {
    const profile = await apiGet<ProfileResponseDto>(API_PATHS.profile)
    return mapProfileDto(profile)
}

export const updateCurrentUserProfile = async (payload: UpdateCurrentUserPayload): Promise<User> => {
    await apiPatch<ProfileResponseDto>(API_PATHS.profile, {
        first_name: payload.firstName,
        last_name: payload.lastName,
    })

    // Some backend implementations return only patched fields without role/department.
    // Re-fetch profile to keep auth role stable in frontend context.
    return fetchCurrentUserProfile()
}

const mapMeProfileCertificateDto = (certificate: MeProfileCertificateDto): MyEnrollment => ({
    id: certificate.enrollment_id,
    trainingTitle: certificate.training_title,
    startDate: certificate.start_date,
    endDate: certificate.end_date,
    city: certificate.city || '',
    location: certificate.location || '',
    isAttended: certificate.is_attended,
    certificateFile: certificate.certificate_file,
    certificateNumber: certificate.certificate_number,
})

export const fetchMyProfileCertificates = async (): Promise<MyEnrollment[]> => {
    const profile = await apiGet<MeProfileResponseDto>(API_PATHS.meProfile)
    return profile.certificates.map(mapMeProfileCertificateDto)
}
