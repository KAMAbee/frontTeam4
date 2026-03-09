import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ApiError, fetchCurrentUserProfile, loginWithUsername, setStoredTokens } from '../../api'
import {
    FUTURE_ROLE_DEFAULT_PATHS,
    PUBLIC_ROUTE_PATHS,
} from '../../app/routePaths'
import { AuthInput } from '../../components/AuthInput'
import { CommonButton } from '../../components/CommonButton'
import { useAuth } from '../../hooks/useAuth'
import { AuthLayout } from '../../layouts/AuthLayout'
import styles from './LoginPage.module.scss'

interface LoginFormValues {
    username: string
    password: string
}

type LoginFormErrors = Partial<Record<keyof LoginFormValues, string>>

interface LocationState {
    from?: string
}

export default function LoginPage() {
    const { t } = useTranslation()
    const { login } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const [formValues, setFormValues] = useState<LoginFormValues>({
        username: '',
        password: '',
    })
    const [errors, setErrors] = useState<LoginFormErrors>({})
    const [submitError, setSubmitError] = useState<string | null>(null)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const validate = (values: LoginFormValues): LoginFormErrors => {
        const nextErrors: LoginFormErrors = {}

        if (!values.username.trim()) {
            nextErrors.username = t('auth.validation.requiredField')
        }

        if (!values.password) {
            nextErrors.password = t('auth.validation.requiredField')
        } else if (values.password.length < 8) {
            nextErrors.password = t('auth.validation.passwordMinLength')
        }

        return nextErrors
    }

    const handleFieldChange =
        (field: keyof LoginFormValues) => (event: ChangeEvent<HTMLInputElement>) => {
            const nextValues = { ...formValues, [field]: event.target.value }
            setFormValues(nextValues)
            setSubmitError(null)

            if (isSubmitted) {
                setErrors(validate(nextValues))
            }
        }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setIsSubmitted(true)
        setSubmitError(null)

        const nextErrors = validate(formValues)
        setErrors(nextErrors)

        if (Object.keys(nextErrors).length > 0) {
            return
        }

        try {
            setIsSubmitting(true)

            const tokens = await loginWithUsername(formValues.username.trim(), formValues.password)
            setStoredTokens(tokens)

            const currentUser = await fetchCurrentUserProfile()
            login(currentUser)

            const redirectState = location.state as LocationState | null
            const fallbackPath = FUTURE_ROLE_DEFAULT_PATHS[currentUser.role]
            navigate(redirectState?.from ?? fallbackPath, { replace: true })
        } catch (submitActionError) {
            if (submitActionError instanceof ApiError) {
                setSubmitError(submitActionError.message)
                return
            }

            setSubmitError(t('auth.validation.serverError'))
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <AuthLayout>
            <div className={styles.loginPage}>
                <div className={styles.loginPage__header}>
                    <h1 className={styles.loginPage__title}>{t('auth.login.title')}</h1>
                    <p className={styles.loginPage__subtitle}>{t('auth.login.subtitle')}</p>
                </div>

                <form className={styles.loginPage__form} onSubmit={handleSubmit}>
                    <AuthInput
                        label={t('auth.login.usernameLabel')}
                        placeholder={t('auth.login.usernamePlaceholder')}
                        value={formValues.username}
                        onChange={handleFieldChange('username')}
                        name="username"
                        error={errors.username}
                    />

                    <div className={styles.loginPage__passwordWrapper}>
                        <AuthInput
                            label={t('auth.login.passwordLabel')}
                            placeholder={t('auth.login.passwordPlaceholder')}
                            type="password"
                            value={formValues.password}
                            onChange={handleFieldChange('password')}
                            name="password"
                            error={errors.password}
                        />
                        <a href="#" className={styles.loginPage__forgotPassword}>
                            {t('auth.login.forgotPassword')}
                        </a>
                    </div>

                    <div className={styles.loginPage__submit}>
                        <CommonButton type="submit" disabled={isSubmitting}>
                            {isSubmitting ? t('auth.login.loading') : t('auth.login.submit')}
                        </CommonButton>
                    </div>

                    {submitError && <p className={styles.loginPage__submitError}>{submitError}</p>}
                </form>

                <div className={styles.loginPage__signupLink}>
                    <Trans
                        i18nKey="auth.login.signupPrompt"
                        components={{ signup: <Link to={PUBLIC_ROUTE_PATHS.register} /> }}
                    />
                </div>
            </div>
        </AuthLayout>
    )
}
