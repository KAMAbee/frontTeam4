import { Link } from 'react-router-dom'
import { PUBLIC_ROUTE_PATHS } from '../../app/routePaths'
import styles from './SharedPages.module.scss'

export const UnauthorizedPage = () => {
    return (
        <section className={styles.sharedPage}>
            <h1 className={styles.sharedPage__title}>Access denied</h1>
            <p className={styles.sharedPage__description}>
                Your role does not have permission to access this page.
            </p>
            <Link className={styles.sharedPage__link} to={PUBLIC_ROUTE_PATHS.root}>
                Back to dashboard
            </Link>
        </section>
    )
}
