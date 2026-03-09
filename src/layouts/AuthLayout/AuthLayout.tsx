import type { PropsWithChildren } from 'react'
import { LanguageSwitcher } from '../../components/LanguageSwitcher'
import styles from './AuthLayout.module.scss'

export const AuthLayout = ({ children }: PropsWithChildren) => {
    return (
        <section className={styles.page}>
            <div className={styles.topBar}>
                <LanguageSwitcher />
            </div>

            <div className={styles.content}>{children}</div>
        </section>
    )
}
