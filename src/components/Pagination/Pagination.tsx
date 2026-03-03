import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import styles from './Pagination.module.scss'

interface PaginationProps {
    currentPage: number
    totalPages: number
    onPageChange: (nextPage: number) => void
    ariaLabel: string
}

const VISIBLE_PAGES = 5

const createPageRange = (currentPage: number, totalPages: number): number[] => {
    if (totalPages <= VISIBLE_PAGES) {
        return Array.from({ length: totalPages }, (_, index) => index + 1)
    }

    let start = Math.max(1, currentPage - 2)
    const end = Math.min(totalPages, start + VISIBLE_PAGES - 1)

    start = Math.max(1, end - VISIBLE_PAGES + 1)

    return Array.from({ length: end - start + 1 }, (_, index) => start + index)
}

export const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
    ariaLabel,
}: PaginationProps) => {
    const { t } = useTranslation()
    const pageRange = useMemo(
        () => createPageRange(currentPage, totalPages),
        [currentPage, totalPages],
    )

    if (totalPages <= 1) {
        return null
    }

    return (
        <nav className={styles.pagination} aria-label={ariaLabel}>
            <button
                type="button"
                className={styles.pagination__button}
                onClick={() => {
                    onPageChange(currentPage - 1)
                }}
                disabled={currentPage === 1}
            >
                {t('ui.pagination.prev')}
            </button>

            <div className={styles.pagination__pages}>
                {pageRange.map((page) => (
                    <button
                        key={page}
                        type="button"
                        className={
                            page === currentPage
                                ? `${styles.pagination__button} ${styles.pagination__buttonActive}`
                                : styles.pagination__button
                        }
                        onClick={() => {
                            onPageChange(page)
                        }}
                    >
                        {page}
                    </button>
                ))}
            </div>

            <button
                type="button"
                className={styles.pagination__button}
                onClick={() => {
                    onPageChange(currentPage + 1)
                }}
                disabled={currentPage === totalPages}
            >
                {t('ui.pagination.next')}
            </button>
        </nav>
    )
}
