import { API_BASE_URL, API_PATHS } from './config'
import { clearStoredTokens, getStoredTokens, setStoredTokens } from './authStorage'

export class ApiError extends Error {
    status: number
    details: unknown

    constructor(message: string, status: number, details?: unknown) {
        super(message)
        this.name = 'ApiError'
        this.status = status
        this.details = details
    }
}

interface ApiRequestOptions {
    auth?: boolean
    retryOnUnauthorized?: boolean
}

type ApiRequestBody = BodyInit | Record<string, unknown> | unknown[]

const buildUrl = (path: string) => {
    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path
    }

    const normalizedPath = path.startsWith('/') ? path : `/${path}`
    return `${API_BASE_URL}${normalizedPath}`
}

const parseResponsePayload = async (response: Response): Promise<unknown> => {
    const contentType = response.headers.get('content-type')?.toLowerCase() || ''

    if (contentType.includes('application/json')) {
        try {
            return await response.json()
        } catch {
            return null
        }
    }

    if (contentType.includes('text/')) {
        try {
            return await response.text()
        } catch {
            return null
        }
    }

    return null
}

const extractErrorMessage = (payload: unknown, fallbackMessage: string): string => {
    if (!payload) {
        return fallbackMessage
    }

    if (typeof payload === 'string') {
        return payload
    }

    if (typeof payload !== 'object') {
        return fallbackMessage
    }

    const record = payload as Record<string, unknown>

    if (typeof record.detail === 'string') {
        return record.detail
    }

    const preferredFields = ['non_field_errors', 'error', 'message'] as const
    for (const field of preferredFields) {
        const value = record[field]
        if (typeof value === 'string') {
            return value
        }

        if (Array.isArray(value) && value.length > 0) {
            const firstItem = value[0]
            if (typeof firstItem === 'string') {
                return firstItem
            }
        }
    }

    for (const value of Object.values(record)) {
        if (typeof value === 'string') {
            return value
        }

        if (Array.isArray(value) && value.length > 0) {
            const firstItem = value[0]
            if (typeof firstItem === 'string') {
                return firstItem
            }
        }
    }

    return fallbackMessage
}

const tryRefreshAccessToken = async (): Promise<string | null> => {
    const storedTokens = getStoredTokens()

    if (!storedTokens?.refresh) {
        return null
    }

    const response = await fetch(buildUrl(API_PATHS.tokenRefresh), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: storedTokens.refresh }),
    })

    if (!response.ok) {
        clearStoredTokens()
        return null
    }

    const payload = (await parseResponsePayload(response)) as { access?: unknown } | null
    const nextAccessToken = payload?.access

    if (typeof nextAccessToken !== 'string' || !nextAccessToken) {
        clearStoredTokens()
        return null
    }

    setStoredTokens({
        access: nextAccessToken,
        refresh: storedTokens.refresh,
    })

    return nextAccessToken
}

const withAuthHeader = (headers: Headers, accessToken: string | undefined) => {
    if (!accessToken) {
        return
    }

    headers.set('Authorization', `Bearer ${accessToken}`)
}

const isNativeBodyInit = (value: unknown): value is BodyInit => {
    if (typeof value === 'string') {
        return true
    }

    if (typeof FormData !== 'undefined' && value instanceof FormData) {
        return true
    }

    if (typeof URLSearchParams !== 'undefined' && value instanceof URLSearchParams) {
        return true
    }

    if (typeof Blob !== 'undefined' && value instanceof Blob) {
        return true
    }

    if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
        return true
    }

    if (typeof ArrayBuffer !== 'undefined' && ArrayBuffer.isView(value)) {
        return true
    }

    if (typeof ReadableStream !== 'undefined' && value instanceof ReadableStream) {
        return true
    }

    return false
}

const serializeRequestBody = (body?: ApiRequestBody): BodyInit | undefined => {
    if (body === undefined) {
        return undefined
    }

    if (isNativeBodyInit(body)) {
        return body
    }

    return JSON.stringify(body)
}

export const apiRequest = async <T>(
    path: string,
    init: RequestInit = {},
    options: ApiRequestOptions = {},
): Promise<T> => {
    const { auth = true, retryOnUnauthorized = true } = options

    const headers = new Headers(init.headers)
    const isFormDataBody = typeof FormData !== 'undefined' && init.body instanceof FormData

    if (!isFormDataBody && !headers.has('Content-Type') && init.body) {
        headers.set('Content-Type', 'application/json')
    }

    const storedTokens = getStoredTokens()
    if (auth) {
        withAuthHeader(headers, storedTokens?.access)
    }

    const response = await fetch(buildUrl(path), {
        ...init,
        headers,
    })

    if (response.status === 401 && auth && retryOnUnauthorized) {
        const refreshedAccessToken = await tryRefreshAccessToken()

        if (refreshedAccessToken) {
            return apiRequest<T>(
                path,
                init,
                {
                    auth,
                    retryOnUnauthorized: false,
                },
            )
        }
    }

    const payload = await parseResponsePayload(response)

    if (!response.ok) {
        throw new ApiError(
            extractErrorMessage(payload, `Request failed with status ${response.status}`),
            response.status,
            payload,
        )
    }

    if (response.status === 204) {
        return null as T
    }

    return payload as T
}

export const apiGet = <T>(path: string, options?: ApiRequestOptions) =>
    apiRequest<T>(path, { method: 'GET' }, options)

export const apiPost = <T>(
    path: string,
    body?: ApiRequestBody,
    options?: ApiRequestOptions,
) => {
    const payload = serializeRequestBody(body)

    return apiRequest<T>(
        path,
        {
            method: 'POST',
            body: payload,
        },
        options,
    )
}

export const apiPatch = <T>(
    path: string,
    body?: ApiRequestBody,
    options?: ApiRequestOptions,
) => {
    const payload = serializeRequestBody(body)

    return apiRequest<T>(
        path,
        {
            method: 'PATCH',
            body: payload,
        },
        options,
    )
}
