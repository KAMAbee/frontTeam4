import { UserRole } from '../types'

export const PUBLIC_ROUTE_PATHS = {
    root: '/',
    login: '/login',
    register: '/register',
} as const

export const PRIVATE_ROUTE_PATHS = {
    unauthorized: '/unauthorized',
} as const

export const MANAGER_ROUTE_PATHS = {
    trainings: '/trainings',
    trainingDetails: '/trainings/:id',
    sessionDetails: '/sessions/:id',
    requests: '/requests',
    createRequest: '/requests/new',
    requestDetails: '/requests/:id',
    profile: '/profile',
} as const

export const FUTURE_ROLE_DEFAULT_PATHS: Record<UserRole, string> = {
    [UserRole.ADMIN]: '/admin',
    [UserRole.MANAGER]: MANAGER_ROUTE_PATHS.trainings,
    [UserRole.EMPLOYEE]: '/employee',
}

export const managerRouteLinks = {
    trainingDetails: (id: string): string => `/trainings/${id}`,
    sessionDetails: (id: string): string => `/sessions/${id}`,
    requestDetails: (id: string): string => `/requests/${id}`,
    createRequest: (sessionId?: string): string => {
        if (!sessionId) {
            return MANAGER_ROUTE_PATHS.createRequest
        }

        return `${MANAGER_ROUTE_PATHS.createRequest}?sessionId=${sessionId}`
    },
} as const
