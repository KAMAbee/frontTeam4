import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PUBLIC_ROUTE_PATHS } from '../../app/routePaths'
import styles from './SharedPages.module.scss'

export const UnauthorizedPage = () => {
    const { t } = useTranslation()

    return (
        <section className={styles.sharedPage}>
            <h1 className={styles.sharedPage__title}>{t('shared.unauthorized.title')}</h1>
            <p className={styles.sharedPage__description}>
                {t('shared.unauthorized.description')}
            </p>
            <Link className={styles.sharedPage__link} to={PUBLIC_ROUTE_PATHS.root}>
                {t('shared.unauthorized.back')}
            </Link>
        </section>
    )
}
