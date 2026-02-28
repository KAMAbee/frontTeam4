import { useState, type FormEvent } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { AuthInput } from '../../components/AuthInput'
import { CommonButton } from '../../components/CommonButton'
import { AuthLayout } from '../../layouts/AuthLayout'
import styles from './RegisterPage.module.scss'

export default function RegisterPage() {
    const { t } = useTranslation()
    const [fullName, setFullName] = useState('')
    const [contact, setContact] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isPolicyAccepted, setIsPolicyAccepted] = useState(false)

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        console.log({ fullName, contact, password, confirmPassword, isPolicyAccepted })
    }

    return (
        <AuthLayout>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>{t('auth.register.title')}</h1>
                    <p className={styles.subtitle}>{t('auth.register.subtitle')}</p>
                </div>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <AuthInput
                        label={t('auth.register.fullNameLabel')}
                        placeholder={t('auth.register.fullNamePlaceholder')}
                        value={fullName}
                        onChange={(event) => setFullName(event.target.value)}
                        name="fullName"
                    />

                    <AuthInput
                        label={t('auth.register.contactLabel')}
                        placeholder={t('auth.register.contactPlaceholder')}
                        value={contact}
                        onChange={(event) => setContact(event.target.value)}
                        name="contact"
                    />

                    <div className={styles.passwordGroup}>
                        <AuthInput
                            label={t('auth.register.passwordLabel')}
                            placeholder={t('auth.register.passwordPlaceholder')}
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            name="password"
                        />
                        <p className={styles.passwordHint}>{t('auth.register.passwordHint')}</p>
                    </div>

                    <AuthInput
                        label={t('auth.register.confirmPasswordLabel')}
                        placeholder={t('auth.register.confirmPasswordPlaceholder')}
                        type="password"
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        name="confirmPassword"
                    />

                    <label className={styles.policyRow}>
                        <input
                            type="checkbox"
                            checked={isPolicyAccepted}
                            onChange={(event) => setIsPolicyAccepted(event.target.checked)}
                        />
                        <span>
                            <Trans
                                i18nKey="auth.register.policy"
                                components={{ terms: <a href="#" />, privacy: <a href="#" /> }}
                            />
                        </span>
                    </label>

                    <div className={styles.submitButton}>
                        <CommonButton type="submit">{t('auth.register.submit')}</CommonButton>
                    </div>
                </form>

                <div className={styles.loginLink}>
                    <Trans
                        i18nKey="auth.register.loginPrompt"
                        components={{ login: <Link to="/login" /> }}
                    />
                </div>
            </div>
        </AuthLayout>
    )
}
