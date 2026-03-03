import {
    MANAGER_ROUTE_PATHS,
} from '../../app/routePaths'
import { UserRole } from '../../types'

export type SidebarNavLabelKey = 'trainings' | 'myRequests' | 'profile'

export interface SidebarNavItem {
    labelKey: SidebarNavLabelKey
    path: string
}

export const ROLE_NAVIGATION: Record<UserRole, SidebarNavItem[]> = {
    [UserRole.ADMIN]: [],
    [UserRole.MANAGER]: [
        { labelKey: 'trainings', path: MANAGER_ROUTE_PATHS.trainings },
        { labelKey: 'myRequests', path: MANAGER_ROUTE_PATHS.requests },
        { labelKey: 'profile', path: MANAGER_ROUTE_PATHS.profile },
    ],
    [UserRole.EMPLOYEE]: [],
}
