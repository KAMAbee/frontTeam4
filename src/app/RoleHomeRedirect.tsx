import { Navigate } from 'react-router-dom'
import { FUTURE_ROLE_DEFAULT_PATHS, PUBLIC_ROUTE_PATHS } from './routePaths'
import { useAuth } from '../hooks'

export const RoleHomeRedirect = () => {
    const { user } = useAuth()

    if (!user) {
        return <Navigate to={PUBLIC_ROUTE_PATHS.login} replace />
    }

    return <Navigate to={FUTURE_ROLE_DEFAULT_PATHS[user.role]} replace />
}
