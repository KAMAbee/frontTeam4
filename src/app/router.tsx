/* eslint-disable react-refresh/only-export-components */
import {
    SessionsPage,
    SessionDetailsPage as AdminSessionDetailsPage,
    ContractsPage,
    ContractDetailsPage,
    SuppliersPage,
    SupplierDetailsPage,
    RequestsPage,
    RequestDetailsPage as AdminRequestDetailsPage,
} from '../pages/admin'
import { Navigate, createBrowserRouter, type RouteObject } from 'react-router-dom'
import App from './App'
import {
    ADMIN_ROUTE_PATHS,
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

import { MyLearningPage, LearningDetailsPage } from '../pages/employee'

import { AppLayout } from '../layouts/AppLayout'
import { RequireAuth } from '../guards'
import { UnauthorizedPage } from '../pages/shared'
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

                    // MANAGER ROUTES
                    {
                        element: <RequireAuth allowedRoles={[UserRole.MANAGER]} />,
                        children: managerRoutes,
                    },

                    // ADMIN ROUTES
                    {
                        element: <RequireAuth allowedRoles={[UserRole.ADMIN]} />,
                        children: [
                            {
                                path: ADMIN_ROUTE_PATHS.sessions,
                                element: <SessionsPage />,
                            
                            },
        
                            {
                                path: ADMIN_ROUTE_PATHS.sessionDetails,
                                element: <AdminSessionDetailsPage />,
                            },
        
                            {
                                path: ADMIN_ROUTE_PATHS.contracts,
                                element: <ContractsPage />,
                            },
        
                            {
                                path: ADMIN_ROUTE_PATHS.contractDetails,
                                element: <ContractDetailsPage />,
                            },
                            
                            {
                                path: ADMIN_ROUTE_PATHS.suppliers,
                                element: <SuppliersPage />,
                            },
        
                            {
                                path: ADMIN_ROUTE_PATHS.supplierDetails,
                                element: <SupplierDetailsPage />,
                            },
        
                            {
                                path: ADMIN_ROUTE_PATHS.requests,
                                element: <RequestsPage />,
        
                            },
        
                            {
                                path: ADMIN_ROUTE_PATHS.requestDetails,
                                element: <AdminRequestDetailsPage />,
                            },
    
                        ],

                    },

                    // EMPLOYEE ROUTES
                    {
                        element: <RequireAuth allowedRoles={[UserRole.EMPLOYEE]} />,
                        children: [
                            {
                                path: '/employee',
                                element: <MyLearningPage />,
                            },
                            {
                                path: '/employee/learning/:id',
                                element: <LearningDetailsPage />,
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
