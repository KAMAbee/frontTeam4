import { Navigate, Outlet, useLocation } from 'react-router-dom'
import {
    FUTURE_ROLE_DEFAULT_PATHS,
    PUBLIC_ROUTE_PATHS,
} from '../app/routePaths'
import { useAuth } from '../hooks/useAuth'
import type { UserRole } from '../types'

interface RequireAuthProps {
    allowedRoles?: UserRole[]
}

export const RequireAuth = ({ allowedRoles }: RequireAuthProps) => {
    const { isAuthenticated, user } = useAuth()
    const location = useLocation()

    if (!isAuthenticated || !user) {
        return (
            <Navigate
                to={PUBLIC_ROUTE_PATHS.login}
                replace
                state={{ from: location.pathname }}
            />
        )
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to={FUTURE_ROLE_DEFAULT_PATHS[user.role]} replace />
    }

    return <Outlet />
}
