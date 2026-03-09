import {
    ADMIN_ROUTE_PATHS,
    MANAGER_ROUTE_PATHS,
} from '../../app/routePaths'
import { UserRole } from '../../types'

export type SidebarNavLabelKey =
    | 'trainings'
    | 'myRequests'
    | 'profile'
    | 'adminSessions'
    | 'adminRequests'
    | 'adminContracts'
    | 'adminSuppliers'
    | 'myLearning'

export interface SidebarNavItem {
    labelKey: SidebarNavLabelKey
    path: string
    end?: boolean
}

export const ROLE_NAVIGATION: Record<UserRole, SidebarNavItem[]> = {
    [UserRole.ADMIN]: [
        {
            labelKey: 'adminRequests',
            path: ADMIN_ROUTE_PATHS.requests,
        },
        {
            labelKey: 'adminSessions',
            path: ADMIN_ROUTE_PATHS.sessions,
            end: true,
        },
        {
            labelKey: 'adminContracts',
            path: ADMIN_ROUTE_PATHS.contracts,
        },
        {
            labelKey: 'adminSuppliers',
            path: ADMIN_ROUTE_PATHS.suppliers,
        },
    ],

    [UserRole.MANAGER]: [
        { labelKey: 'trainings', path: MANAGER_ROUTE_PATHS.trainings },
        { labelKey: 'myRequests', path: MANAGER_ROUTE_PATHS.requests },
        { labelKey: 'profile', path: MANAGER_ROUTE_PATHS.profile },
    ],

    [UserRole.EMPLOYEE]: [
        {
            labelKey: 'myLearning',
            path: '/employee',
        },
    ],
}
