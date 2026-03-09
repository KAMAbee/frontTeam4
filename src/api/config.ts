const normalizeBaseUrl = (rawBaseUrl: string): string => rawBaseUrl.replace(/\/$/, '')

const envBaseUrl = import.meta.env.VITE_API_BASE_URL

export const API_BASE_URL = normalizeBaseUrl(envBaseUrl?.trim() || 'https://backteam4.onrender.com')

export const API_PATHS = {
    tokenObtain: '/api/token/',
    tokenRefresh: '/api/token/refresh/',
    register: '/api/auth/register/',
    profile: '/api/auth/profile/',
    meProfile: '/api/auth/me/profile/',
    users: '/api/auth/users/',
    trainings: '/api/trainings/list/',
    sessions: '/api/trainings/sessions/',
    trainingRequests: '/api/training-requests/',
    suppliers: '/api/suppliers/suppliers/',
    contracts: '/api/suppliers/contracts/',
    budgetSummary: '/api/suppliers/budget-summary/',
    myEnrollments: '/api/enrollments/my/',
} as const
