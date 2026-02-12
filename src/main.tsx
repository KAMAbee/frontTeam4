import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import styles from './index.module.scss'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div className={styles.page}>
      <App />
    </div>
  </StrictMode>,
)
