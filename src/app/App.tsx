import { Outlet } from 'react-router-dom'
import styles from './App.module.scss'

export default function App() {
    return (
        <div className={styles.page}>
            <main className={styles.content}>
                <Outlet />
            </main>
        </div>
    )
}
