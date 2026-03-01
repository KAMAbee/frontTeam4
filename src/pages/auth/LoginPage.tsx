import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { AuthInput } from '../../components/AuthInput'
import { CommonButton } from '../../components/CommonButton'
import { AuthLayout } from '../../layouts/AuthLayout'
import styles from './LoginPage.module.scss'

interface LoginFormValues {
    email: string
    password: string
}

type LoginFormErrors = Partial<Record<keyof LoginFormValues, string>>

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function LoginPage() {
    const { t } = useTranslation()
    const [formValues, setFormValues] = useState<LoginFormValues>({
        email: '',
        password: '',
    })
    const [errors, setErrors] = useState<LoginFormErrors>({})
    const [isSubmitted, setIsSubmitted] = useState(false)

    const validate = (values: LoginFormValues): LoginFormErrors => {
        const nextErrors: LoginFormErrors = {}

        if (!values.email.trim()) {
            nextErrors.email = t('auth.validation.requiredField')
        } else if (!EMAIL_REGEX.test(values.email.trim())) {
            nextErrors.email = t('auth.validation.invalidEmail')
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
            email: formValues.email.trim(),
            password: formValues.password,
        })
    }

    return (
        <AuthLayout>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>{t('auth.login.title')}</h1>
                    <p className={styles.subtitle}>{t('auth.login.subtitle')}</p>
                </div>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <AuthInput
                        label={t('auth.login.emailLabel')}
                        placeholder={t('auth.login.emailPlaceholder')}
                        value={formValues.email}
                        onChange={handleFieldChange('email')}
                        name="email"
                        error={errors.email}
                    />

                    <div className={styles.passwordWrapper}>
                        <AuthInput
                            label={t('auth.login.passwordLabel')}
                            placeholder={t('auth.login.passwordPlaceholder')}
                            type="password"
                            value={formValues.password}
                            onChange={handleFieldChange('password')}
                            name="password"
                            error={errors.password}
                        />
                        <a href="#" className={styles.forgotPassword}>
                            {t('auth.login.forgotPassword')}
                        </a>
                    </div>

                    <div className={styles.loginButton}>
                        <CommonButton type="submit">{t('auth.login.submit')}</CommonButton>
                    </div>
                </form>

                <div className={styles.signupLink}>
                    <Trans
                        i18nKey="auth.login.signupPrompt"
                        components={{ signup: <Link to="/register" /> }}
                    />
                </div>
            </div>
        </AuthLayout>
    )
}
