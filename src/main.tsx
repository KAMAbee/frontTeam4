import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './app/router'
import { LanguageProvider } from './context/LanguageContext'
import './i18n'
import './styles/global.scss'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <LanguageProvider>
            <RouterProvider router={router} />
        </LanguageProvider>
    </StrictMode>,
)
