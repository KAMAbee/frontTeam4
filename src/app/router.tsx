/* eslint-disable react-refresh/only-export-components */
import { Navigate, createBrowserRouter, type RouteObject } from 'react-router-dom'
import App from './App'
import {
    FUTURE_ROLE_DEFAULT_PATHS,
    MANAGER_ROUTE_PATHS,
    PRIVATE_ROUTE_PATHS,
    PUBLIC_ROUTE_PATHS,
} from './routePaths'
import { RoleHomeRedirect } from './RoleHomeRedirect'
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'
import {
    CreateRequestPage,
    MyRequestsPage,
    ProfilePage,
    RequestDetailsPage,
    SessionDetailsPage,
    TrainingDetailsPage,
    TrainingsPage,
} from '../pages/manager'
import { AppLayout } from '../layouts/AppLayout'
import { RequireAuth } from '../guards'
import { RolePlaceholderPage, UnauthorizedPage } from '../pages/shared'
import { UserRole } from '../types'

const publicRoutes: RouteObject[] = [
    {
        path: PUBLIC_ROUTE_PATHS.login,
        element: <LoginPage />,
    },
    {
        path: PUBLIC_ROUTE_PATHS.register,
        element: <RegisterPage />,
    },
]

const managerRoutes: RouteObject[] = [
    {
        path: MANAGER_ROUTE_PATHS.trainings,
        element: <TrainingsPage />,
    },
    {
        path: MANAGER_ROUTE_PATHS.trainingDetails,
        element: <TrainingDetailsPage />,
    },
    {
        path: MANAGER_ROUTE_PATHS.sessionDetails,
        element: <SessionDetailsPage />,
    },
    {
        path: MANAGER_ROUTE_PATHS.requests,
        element: <MyRequestsPage />,
    },
    {
        path: MANAGER_ROUTE_PATHS.createRequest,
        element: <CreateRequestPage />,
    },
    {
        path: MANAGER_ROUTE_PATHS.requestDetails,
        element: <RequestDetailsPage />,
    },
    {
        path: MANAGER_ROUTE_PATHS.profile,
        element: <ProfilePage />,
    },
]

const privateRoutes: RouteObject[] = [
    {
        element: <RequireAuth />,
        children: [
            {
                element: <AppLayout />,
                children: [
                    {
                        path: PRIVATE_ROUTE_PATHS.unauthorized,
                        element: <UnauthorizedPage />,
                    },
                    {
                        index: true,
                        element: <RoleHomeRedirect />,
                    },
                    {
                        element: <RequireAuth allowedRoles={[UserRole.MANAGER]} />,
                        children: managerRoutes,
                    },
                    {
                        element: <RequireAuth allowedRoles={[UserRole.ADMIN]} />,
                        children: [
                            {
                                path: FUTURE_ROLE_DEFAULT_PATHS[UserRole.ADMIN],
                                element: <RolePlaceholderPage role={UserRole.ADMIN} />,
                            },
                        ],
                    },
                    {
                        element: <RequireAuth allowedRoles={[UserRole.EMPLOYEE]} />,
                        children: [
                            {
                                path: FUTURE_ROLE_DEFAULT_PATHS[UserRole.EMPLOYEE],
                                element: <RolePlaceholderPage role={UserRole.EMPLOYEE} />,
                            },
                        ],
                    },
                ],
            },
        ],
    },
]

export const router = createBrowserRouter([
    {
        path: PUBLIC_ROUTE_PATHS.root,
        element: <App />,
        children: [
            ...publicRoutes,
            ...privateRoutes,
            {
                path: '*',
                element: <Navigate to={PUBLIC_ROUTE_PATHS.root} replace />,
            },
        ],
    },
])
