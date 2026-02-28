import { useState, type FormEvent } from 'react'
import { AuthInput } from '../../components/AuthInput'
import { CommonButton } from '../../components/CommonButton'
import { Logo } from '../../components/Logo/Logo'
import styles from './LoginPage.module.scss'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        console.log({ email, password })
    }

    return (
        <div className={styles.page}>
            <div className={styles.logoTopLeft}>
                <Logo />
            </div>

            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>С возвращением!</h1>
                    <p className={styles.subtitle}>Встретьте своих товарищей сегодня</p>
                </div>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <AuthInput
                        label="E-mail или номер телефона"
                        placeholder="Введите e-mail или номер телефона"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <div className={styles.passwordWrapper}>
                        <AuthInput
                            label="Пароль"
                            placeholder="Введите пароль"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <a href="#" className={styles.forgotPassword}>Забыли пароль?</a>
                    </div>

                    <div className={styles.loginButton}>
                        <CommonButton type="submit">Войти</CommonButton>
                    </div>
                </form>

                <p className={styles.signupLink}>
                    Нет аккаунта? <a href="#">Зарегистрироваться</a>
                </p>
            </div>
        </div>
    )
}
