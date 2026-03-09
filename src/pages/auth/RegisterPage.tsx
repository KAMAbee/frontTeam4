import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import {
    ApiError,
    fetchCurrentUserProfile,
    loginWithUsername,
    registerUser,
    setStoredTokens,
} from '../../api'
import { FUTURE_ROLE_DEFAULT_PATHS, PUBLIC_ROUTE_PATHS } from '../../app/routePaths'
import { AuthInput } from '../../components/AuthInput'
import { CommonButton } from '../../components/CommonButton'
import { useAuth } from '../../hooks/useAuth'
import { AuthLayout } from '../../layouts/AuthLayout'
import { UserRole, type UserRole as UserRoleType } from '../../types'
import styles from './RegisterPage.module.scss'

interface RegisterFormValues {
    username: string
    firstName: string
    lastName: string
    middleName: string
    email: string
    role: UserRoleType
    password: string
    confirmPassword: string
    isPolicyAccepted: boolean
}

type RegisterFormErrors = Partial<Record<keyof RegisterFormValues, string>>

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const NAME_REGEX = /^[\p{L}][\p{L}\s'-]*$/u
const USERNAME_REGEX = /^[a-zA-Z0-9._@+-]{3,150}$/

export default function RegisterPage() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { login } = useAuth()
    const [formValues, setFormValues] = useState<RegisterFormValues>({
        username: '',
        firstName: '',
        lastName: '',
        middleName: '',
        email: '',
        role: UserRole.EMPLOYEE,
        password: '',
        confirmPassword: '',
        isPolicyAccepted: false,
    })
    const [errors, setErrors] = useState<RegisterFormErrors>({})
    const [submitError, setSubmitError] = useState<string | null>(null)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const validate = (values: RegisterFormValues): RegisterFormErrors => {
        const nextErrors: RegisterFormErrors = {}
        const username = values.username.trim()
        const firstName = values.firstName.trim()
        const lastName = values.lastName.trim()
        const middleName = values.middleName.trim()
        const email = values.email.trim()

        if (!username) {
            nextErrors.username = t('auth.validation.requiredField')
        } else if (!USERNAME_REGEX.test(username)) {
            nextErrors.username = t('auth.validation.invalidUsername')
        }

        if (!firstName) {
            nextErrors.firstName = t('auth.validation.requiredField')
        } else if (!NAME_REGEX.test(firstName)) {
            nextErrors.firstName = t('auth.validation.invalidName')
        }

        if (!lastName) {
            nextErrors.lastName = t('auth.validation.requiredField')
        } else if (!NAME_REGEX.test(lastName)) {
            nextErrors.lastName = t('auth.validation.invalidName')
        }

        if (middleName && !NAME_REGEX.test(middleName)) {
            nextErrors.middleName = t('auth.validation.invalidName')
        }

        if (!email) {
            nextErrors.email = t('auth.validation.requiredField')
        } else if (!EMAIL_REGEX.test(email)) {
            nextErrors.email = t('auth.validation.invalidEmail')
        }

        if (!values.password) {
            nextErrors.password = t('auth.validation.requiredField')
        } else if (values.password.length < 8) {
            nextErrors.password = t('auth.validation.passwordMinLength')
        }

        if (!values.confirmPassword) {
            nextErrors.confirmPassword = t('auth.validation.requiredField')
        } else if (values.confirmPassword !== values.password) {
            nextErrors.confirmPassword = t('auth.validation.passwordsMismatch')
        }

        if (!values.isPolicyAccepted) {
            nextErrors.isPolicyAccepted = t('auth.validation.policyRequired')
        }

        return nextErrors
    }

    const handleTextFieldChange =
        (field: keyof Omit<RegisterFormValues, 'isPolicyAccepted' | 'role'>) =>
            (event: ChangeEvent<HTMLInputElement>) => {
                const nextValues = { ...formValues, [field]: event.target.value }
                setFormValues(nextValues)
                setSubmitError(null)

                if (isSubmitted) {
                    setErrors(validate(nextValues))
                }
            }

    const handlePolicyChange = (event: ChangeEvent<HTMLInputElement>) => {
        const nextValues = { ...formValues, isPolicyAccepted: event.target.checked }
        setFormValues(nextValues)
        setSubmitError(null)

        if (isSubmitted) {
            setErrors(validate(nextValues))
        }
    }

    const handleRoleButtonClick = (role: UserRoleType) => {
        const nextValues = { ...formValues, role }
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

            await registerUser({
                username: formValues.username.trim(),
                firstName: formValues.firstName.trim(),
                lastName: formValues.lastName.trim(),
                middleName: formValues.middleName.trim(),
                email: formValues.email.trim(),
                password: formValues.password,
                role: formValues.role,
            })

            const tokens = await loginWithUsername(formValues.username.trim(), formValues.password)
            setStoredTokens(tokens)

            const currentUser = await fetchCurrentUserProfile()
            login(currentUser)
            navigate(FUTURE_ROLE_DEFAULT_PATHS[currentUser.role], { replace: true })
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
            <div className={styles.registerPage}>
                <div className={styles.registerPage__header}>
                    <h1 className={styles.registerPage__title}>{t('auth.register.title')}</h1>
                    <p className={styles.registerPage__subtitle}>{t('auth.register.subtitle')}</p>
                </div>

                <form className={styles.registerPage__form} onSubmit={handleSubmit}>
                    <AuthInput
                        label={t('auth.register.usernameLabel')}
                        placeholder={t('auth.register.usernamePlaceholder')}
                        value={formValues.username}
                        onChange={handleTextFieldChange('username')}
                        name="username"
                        error={errors.username}
                    />

                    <div className={styles.registerPage__nameRow}>
                        <AuthInput
                            label={t('auth.register.firstNameLabel')}
                            placeholder={t('auth.register.firstNamePlaceholder')}
                            value={formValues.firstName}
                            onChange={handleTextFieldChange('firstName')}
                            name="firstName"
                            error={errors.firstName}
                        />

                        <AuthInput
                            label={t('auth.register.lastNameLabel')}
                            placeholder={t('auth.register.lastNamePlaceholder')}
                            value={formValues.lastName}
                            onChange={handleTextFieldChange('lastName')}
                            name="lastName"
                            error={errors.lastName}
                        />
                    </div>

                    <AuthInput
                        label={t('auth.register.middleNameLabel')}
                        placeholder={t('auth.register.middleNamePlaceholder')}
                        value={formValues.middleName}
                        onChange={handleTextFieldChange('middleName')}
                        name="middleName"
                        error={errors.middleName}
                    />

                    <AuthInput
                        label={t('auth.register.contactLabel')}
                        placeholder={t('auth.register.contactPlaceholder')}
                        value={formValues.email}
                        onChange={handleTextFieldChange('email')}
                        name="email"
                        error={errors.email}
                    />

                    <div className={styles.registerPage__field}>
                        <label className={styles.registerPage__fieldLabel}>
                            {t('auth.register.roleLabel')}
                        </label>
                        <div className={styles.registerPage__roleButtons}>
                            <button
                                type="button"
                                className={`${styles.registerPage__roleButton} ${styles.registerPage__roleButtonEmployee} ${formValues.role === UserRole.EMPLOYEE ? styles.registerPage__roleButtonActive : ''}`}
                                onClick={() => handleRoleButtonClick(UserRole.EMPLOYEE)}
                            >
                                {t('auth.register.roles.employee')}
                            </button>
                            <button
                                type="button"
                                className={`${styles.registerPage__roleButton} ${styles.registerPage__roleButtonManager} ${formValues.role === UserRole.MANAGER ? styles.registerPage__roleButtonActive : ''}`}
                                onClick={() => handleRoleButtonClick(UserRole.MANAGER)}
                            >
                                {t('auth.register.roles.manager')}
                            </button>
                            <button
                                type="button"
                                className={`${styles.registerPage__roleButton} ${styles.registerPage__roleButtonAdmin} ${formValues.role === UserRole.ADMIN ? styles.registerPage__roleButtonActive : ''}`}
                                onClick={() => handleRoleButtonClick(UserRole.ADMIN)}
                            >
                                {t('auth.register.roles.admin')}
                            </button>
                        </div>
                    </div>

                    <div className={styles.registerPage__passwordGroup}>
                        <AuthInput
                            label={t('auth.register.passwordLabel')}
                            placeholder={t('auth.register.passwordPlaceholder')}
                            type="password"
                            value={formValues.password}
                            onChange={handleTextFieldChange('password')}
                            name="password"
                            error={errors.password}
                        />
                        <p className={styles.registerPage__passwordHint}>{t('auth.register.passwordHint')}</p>
                    </div>

                    <AuthInput
                        label={t('auth.register.confirmPasswordLabel')}
                        placeholder={t('auth.register.confirmPasswordPlaceholder')}
                        type="password"
                        value={formValues.confirmPassword}
                        onChange={handleTextFieldChange('confirmPassword')}
                        name="confirmPassword"
                        error={errors.confirmPassword}
                    />

                    <label className={styles.registerPage__policyRow}>
                        <input
                            type="checkbox"
                            checked={formValues.isPolicyAccepted}
                            onChange={handlePolicyChange}
                        />
                        <span>
                            <Trans
                                i18nKey="auth.register.policy"
                                components={{ terms: <a href="#" />, privacy: <a href="#" /> }}
                            />
                        </span>
                    </label>
                    {errors.isPolicyAccepted && (
                        <p className={styles.registerPage__policyError}>{errors.isPolicyAccepted}</p>
                    )}

                    <div className={styles.registerPage__submit}>
                        <CommonButton type="submit" disabled={isSubmitting}>
                            {isSubmitting ? t('auth.register.loading') : t('auth.register.submit')}
                        </CommonButton>
                    </div>

                    {submitError && <p className={styles.registerPage__submitError}>{submitError}</p>}
                </form>

                <div className={styles.registerPage__loginLink}>
                    <Trans
                        i18nKey="auth.register.loginPrompt"
                        components={{ login: <Link to={PUBLIC_ROUTE_PATHS.login} /> }}
                    />
                </div>
            </div>
        </AuthLayout>
    )
}
