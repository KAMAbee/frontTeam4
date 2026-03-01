import { useState, useId, type ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'
import styles from './AuthInput.module.scss'

interface AuthInputProps {
    label?: string
    placeholder?: string
    value?: string
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void
    type?: string
    name?: string
    error?: string
}

export const AuthInput = ({
    label,
    placeholder,
    value,
    onChange,
    type = 'text',
    name,
    error,
}: AuthInputProps) => {
    const { t } = useTranslation()
    const generatedId = useId()
    const inputId = name ?? generatedId
    const [showPassword, setShowPassword] = useState(false)

    const isPassword = type === 'password'
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

    return (
        <div className={styles.inputWrapper}>
            {label && (
                <label className={styles.label} htmlFor={inputId}>
                    {label}
                </label>
            )}
            <div className={styles.inputContainer}>
                <input
                    id={inputId}
                    className={`${styles.input} ${error ? styles.inputError : ''}`.trim()}
                    type={inputType}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    name={name}
                    aria-invalid={Boolean(error)}
                />
                {isPassword && (
                    <button
                        type="button"
                        className={styles.togglePassword}
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={
                            showPassword
                                ? t('auth.input.hidePassword')
                                : t('auth.input.showPassword')
                        }
                    >
                        {showPassword ? (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                <line x1="1" y1="1" x2="23" y2="23" />
                            </svg>
                        ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                <circle cx="12" cy="12" r="3" />
                            </svg>
                        )}
                    </button>
                )}
            </div>
            {error && <p className={styles.errorText}>{error}</p>}
        </div>
    )
}
