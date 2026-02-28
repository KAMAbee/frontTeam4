import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { AuthInput } from '../../components/AuthInput'
import { CommonButton } from '../../components/CommonButton'
import { Logo } from '../../components/Logo/Logo'
import styles from './RegisterPage.module.scss'

export default function RegisterPage() {
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
        <section className={styles.page}>
            <div className={styles.topBar}>
                <Logo />
            </div>

            <div className={styles.content}>
                <div className={styles.container}>
                    <div className={styles.header}>
                        <h1 className={styles.title}>Создайте аккаунт</h1>
                        <p className={styles.subtitle}>Это бесплатно и просто</p>
                    </div>

                    <form className={styles.form} onSubmit={handleSubmit}>
                        <AuthInput
                            label="Полное имя"
                            placeholder="Введите ваше имя"
                            value={fullName}
                            onChange={(event) => setFullName(event.target.value)}
                            name="fullName"
                        />

                        <AuthInput
                            label="E-mail или номер телефона"
                            placeholder="Введите e-mail или номер телефона"
                            value={contact}
                            onChange={(event) => setContact(event.target.value)}
                            name="contact"
                        />

                        <div className={styles.passwordGroup}>
                            <AuthInput
                                label="Пароль"
                                placeholder="Введите пароль"
                                type="password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                name="password"
                            />
                            <p className={styles.passwordHint}>Минимум 8 символов</p>
                        </div>

                        <AuthInput
                            label="Подтвердите пароль"
                            placeholder="Введите пароль ещё раз"
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
                                Создавая аккаунт, вы соглашаетесь с <a href="#">Условиями использования</a> и <a href="#">Политикой конфиденциальности</a>
                            </span>
                        </label>

                        <div className={styles.submitButton}>
                            <CommonButton type="submit">Зарегистрироваться</CommonButton>
                        </div>
                    </form>

                    <div className={styles.loginLink}>
                        Уже есть аккаунт? <Link to="/login">Войти</Link>
                    </div>
                </div>
            </div>
        </section>
    )
}
