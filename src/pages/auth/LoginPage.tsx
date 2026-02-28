import { useState, type FormEvent } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { AuthInput } from '../../components/AuthInput'
import { CommonButton } from '../../components/CommonButton'
import { AuthLayout } from '../../layouts/AuthLayout'
import styles from './LoginPage.module.scss'

export default function LoginPage() {
    const { t } = useTranslation()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        console.log({ email, password })
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
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                    />

                    <div className={styles.passwordWrapper}>
                        <AuthInput
                            label={t('auth.login.passwordLabel')}
                            placeholder={t('auth.login.passwordPlaceholder')}
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
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
