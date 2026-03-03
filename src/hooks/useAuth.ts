import { useContext } from 'react'
import { AuthContext } from '../context/auth-context'

export const useAuth = () => {
    const contextValue = useContext(AuthContext)

    if (!contextValue) {
        throw new Error('useAuth must be used within AuthProvider')
    }

    return contextValue
}
