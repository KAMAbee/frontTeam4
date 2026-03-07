import { UserRole } from '../types'

/* PUBLIC */

export const PUBLIC_ROUTE_PATHS = {
  root: '/',
  login: '/login',
  register: '/register',
} as const

/* PRIVATE */

export const PRIVATE_ROUTE_PATHS = {
  unauthorized: '/unauthorized',
} as const

/* MANAGER */

export const MANAGER_ROUTE_PATHS = {
  trainings: '/trainings',
  trainingDetails: '/trainings/:id',
  sessionDetails: '/sessions/:id',

  requests: '/requests',
  createRequest: '/requests/new',
  requestDetails: '/requests/:id',

  profile: '/profile',
} as const

/* ADMIN */

export const ADMIN_ROUTE_PATHS = {
  root: '/admin',

  requests: '/admin/requests',
  requestDetails: '/admin/requests/:id',

  suppliers: '/admin/suppliers',
  supplierDetails: '/admin/suppliers/:id',

  contracts: '/admin/contracts',
  contractDetails: '/admin/contracts/:id',

  sessions: '/admin/sessions',
  sessionDetails: '/admin/sessions/:id',
} as const

/* EMPLOYEE */

export const EMPLOYEE_ROUTE_PATHS = {
  myLearning: '/employee',
  learningDetails: '/employee/learning/:enrollmentId',
} as const

/* DEFAULT PATH BY ROLE */

export const FUTURE_ROLE_DEFAULT_PATHS: Record<UserRole, string> = {
  [UserRole.ADMIN]: ADMIN_ROUTE_PATHS.root,
  [UserRole.MANAGER]: MANAGER_ROUTE_PATHS.trainings,
  [UserRole.EMPLOYEE]: EMPLOYEE_ROUTE_PATHS.myLearning,
}

/* MANAGER LINKS */

export const managerRouteLinks = {
  trainingDetails: (id: string): string => `/trainings/${id}`,

  sessionDetails: (id: string): string => `/sessions/${id}`,

  requestDetails: (id: string): string => `/requests/${id}`,

  createRequest: (sessionId?: string): string => {
    if (!sessionId) return MANAGER_ROUTE_PATHS.createRequest

    return `${MANAGER_ROUTE_PATHS.createRequest}?sessionId=${sessionId}`
  },
} as const

/* ADMIN LINKS */

export const adminRouteLinks = {
  requestDetails: (id: string): string => `/admin/requests/${id}`,

  supplierDetails: (id: string): string => `/admin/suppliers/${id}`,

  contractDetails: (id: string): string => `/admin/contracts/${id}`,

  sessionDetails: (id: string): string => `/admin/sessions/${id}`,
} as const

/* EMPLOYEE LINKS */

export const employeeRouteLinks = {
  learningDetails: (enrollmentId: string): string =>
    `/employee/learning/${enrollmentId}`,
} as const