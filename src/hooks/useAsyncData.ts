import { useCallback, useEffect, useState, type DependencyList, type SetStateAction } from 'react'

export interface AsyncDataResult<T> {
    data: T
    isLoading: boolean
    error: string | null
    setData: (nextValue: SetStateAction<T>) => void
    reload: () => Promise<void>
}

export const useAsyncData = <T>(
    loader: () => Promise<T>,
    initialValue: T,
    deps: DependencyList,
): AsyncDataResult<T> => {
    const [data, setData] = useState<T>(initialValue)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const load = useCallback(async () => {
        setIsLoading(true)
        setError(null)

        try {
            const loadedData = await loader()
            setData(loadedData)
        } catch (loadError) {
            const message = loadError instanceof Error ? loadError.message : 'Unexpected error'
            setError(message)
        } finally {
            setIsLoading(false)
        }
    }, deps)

    useEffect(() => {
        void load()
    }, [load])

    return {
        data,
        isLoading,
        error,
        setData,
        reload: load,
    }
}
