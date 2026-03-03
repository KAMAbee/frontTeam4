import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { PUBLIC_ROUTE_PATHS } from '../../app/routePaths'
import { AuthInput } from '../../components/AuthInput'
import { CommonButton } from '../../components/CommonButton'
import { AuthLayout } from '../../layouts/AuthLayout'
import styles from './RegisterPage.module.scss'

interface RegisterFormValues {
    firstName: string
    lastName: string
    middleName: string
    email: string
    password: string
    confirmPassword: string
    isPolicyAccepted: boolean
}

type RegisterFormErrors = Partial<Record<keyof RegisterFormValues, string>>

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const NAME_REGEX = /^[\p{L}][\p{L}\s'-]*$/u

export default function RegisterPage() {
    const { t } = useTranslation()
    const [formValues, setFormValues] = useState<RegisterFormValues>({
        firstName: '',
        lastName: '',
        middleName: '',
        email: '',
        password: '',
        confirmPassword: '',
        isPolicyAccepted: false,
    })
    const [errors, setErrors] = useState<RegisterFormErrors>({})
    const [isSubmitted, setIsSubmitted] = useState(false)

    const validate = (values: RegisterFormValues): RegisterFormErrors => {
        const nextErrors: RegisterFormErrors = {}
        const firstName = values.firstName.trim()
        const lastName = values.lastName.trim()
        const middleName = values.middleName.trim()
        const email = values.email.trim()

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
        (field: keyof Omit<RegisterFormValues, 'isPolicyAccepted'>) =>
            (event: ChangeEvent<HTMLInputElement>) => {
                const nextValues = { ...formValues, [field]: event.target.value }
                setFormValues(nextValues)

                if (isSubmitted) {
                    setErrors(validate(nextValues))
                }
            }

    const handlePolicyChange = (event: ChangeEvent<HTMLInputElement>) => {
        const nextValues = { ...formValues, isPolicyAccepted: event.target.checked }
        setFormValues(nextValues)

        if (isSubmitted) {
            setErrors(validate(nextValues))
        }
    }

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setIsSubmitted(true)

        const nextErrors = validate(formValues)
        setErrors(nextErrors)

        if (Object.keys(nextErrors).length > 0) {
            return
        }

        console.log({
            firstName: formValues.firstName.trim(),
            lastName: formValues.lastName.trim(),
            middleName: formValues.middleName.trim(),
            email: formValues.email.trim(),
            password: formValues.password,
            confirmPassword: formValues.confirmPassword,
            isPolicyAccepted: formValues.isPolicyAccepted,
        })
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
                        <CommonButton type="submit">{t('auth.register.submit')}</CommonButton>
                    </div>
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
