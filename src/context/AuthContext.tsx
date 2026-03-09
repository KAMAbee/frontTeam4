import { useEffect, useMemo, useState, type PropsWithChildren } from 'react'
import type { User } from '../types'
import { clearStoredTokens } from '../api/authStorage'
import { AuthContext, type AuthContextValue } from './auth-context'

const AUTH_STORAGE_KEY = 'ctms_auth_user'

const getStoredUser = (): User | null => {
    if (typeof window === 'undefined') {
        return null
    }

    const storedUser = window.localStorage.getItem(AUTH_STORAGE_KEY)

    if (!storedUser) {
        return null
    }

    try {
        return JSON.parse(storedUser) as User
    } catch {
        return null
    }
}

export const AuthProvider = ({ children }: PropsWithChildren) => {
    const [user, setUser] = useState<User | null>(() => getStoredUser())

    useEffect(() => {
        if (typeof window === 'undefined') {
            return
        }

        if (!user) {
            window.localStorage.removeItem(AUTH_STORAGE_KEY)
            return
        }

        window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
    }, [user])

    const contextValue = useMemo<AuthContextValue>(
        () => ({
            user,
            isAuthenticated: Boolean(user),
            login: setUser,
            logout: () => {
                setUser(null)
                clearStoredTokens()
            },
        }),
        [user],
    )

    return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}
