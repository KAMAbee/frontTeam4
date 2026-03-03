import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './app/router'
import { AuthProvider } from './context/AuthContext'
import { LanguageProvider } from './context/LanguageContext'
import './i18n'
import './styles/global.scss'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <AuthProvider>
            <LanguageProvider>
                <RouterProvider router={router} />
            </LanguageProvider>
        </AuthProvider>
    </StrictMode>,
)
