export interface AuthTokens {
    access: string
    refresh: string
}

const AUTH_TOKENS_STORAGE_KEY = 'ctms_auth_tokens'

const isAuthTokens = (payload: unknown): payload is AuthTokens => {
    if (!payload || typeof payload !== 'object') {
        return false
    }

    const record = payload as Partial<AuthTokens>
    return typeof record.access === 'string' && typeof record.refresh === 'string'
}

export const getStoredTokens = (): AuthTokens | null => {
    if (typeof window === 'undefined') {
        return null
    }

    const rawValue = window.localStorage.getItem(AUTH_TOKENS_STORAGE_KEY)
    if (!rawValue) {
        return null
    }

    try {
        const parsedValue = JSON.parse(rawValue) as unknown
        return isAuthTokens(parsedValue) ? parsedValue : null
    } catch {
        return null
    }
}

export const setStoredTokens = (tokens: AuthTokens | null) => {
    if (typeof window === 'undefined') {
        return
    }

    if (!tokens) {
        window.localStorage.removeItem(AUTH_TOKENS_STORAGE_KEY)
        return
    }

    window.localStorage.setItem(AUTH_TOKENS_STORAGE_KEY, JSON.stringify(tokens))
}

export const clearStoredTokens = () => {
    setStoredTokens(null)
}
