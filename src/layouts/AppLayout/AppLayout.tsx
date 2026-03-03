import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import styles from './AppLayout.module.scss'

export const AppLayout = () => {
    return (
        <div className={styles.root}>
            <aside className={styles.sidebar}>
                <Sidebar />
            </aside>

            <div className={styles.body}>
                <Topbar />
                <main className={styles.mainContent}>
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
