import { UserRole } from '../types'

export const PUBLIC_ROUTE_PATHS = {
    root: '/',
    login: '/login',
    register: '/register',
} as const

export const PRIVATE_ROUTE_PATHS = {
    unauthorized: '/unauthorized',
} as const

export const ADMIN_ROUTE_PATHS = {
    sessions: '/admin',
    sessionDetails: '/admin/sessions/:id',
    contracts: '/admin/contracts',
    contractDetails: '/admin/contracts/:id',
    suppliers: '/admin/suppliers',
    supplierDetails: '/admin/suppliers/:id',
    requests: '/admin/requests',
    requestDetails: '/admin/requests/:id',
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
    [UserRole.ADMIN]: ADMIN_ROUTE_PATHS.sessions,
    [UserRole.MANAGER]: MANAGER_ROUTE_PATHS.trainings,
    [UserRole.EMPLOYEE]: '/employee',
}

export const adminRouteLinks = {
    sessionDetails: (id: string): string => `/admin/sessions/${id}`,
    contractDetails: (id: string): string => `/admin/contracts/${id}`,
    supplierDetails: (id: string): string => `/admin/suppliers/${id}`,
    requestDetails: (id: string): string => `/admin/requests/${id}`,
} as const

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
