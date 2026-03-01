import { useState, useId, type ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { FiEye, FiEyeOff } from 'react-icons/fi'
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
                            <FiEyeOff size={20} />
                        ) : (
                            <FiEye size={20} />
                        )}
                    </button>
                )}
            </div>
            {error && <p className={styles.errorText}>{error}</p>}
        </div>
    )
}
