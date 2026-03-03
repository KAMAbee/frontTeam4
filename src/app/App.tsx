import { Outlet } from 'react-router-dom'
import styles from './App.module.scss'

export default function App() {
    return (
        <div className={styles.page}>
            <Outlet />
        </div>
    )
}
