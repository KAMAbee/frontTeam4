import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { managerRouteLinks } from '../../app/routePaths'
import { Pagination } from '../../components/Pagination'
import { PRICING_TYPE_LABELS, trainingsMock } from './manager.mock'
import styles from './ManagerPages.module.scss'

const ITEMS_PER_PAGE = 8

export const TrainingsPage = () => {
    const { t } = useTranslation()
    const [searchValue, setSearchValue] = useState('')
    const [currentPage, setCurrentPage] = useState(1)

    const filteredTrainings = useMemo(
        () =>
            trainingsMock.filter((training) =>
                training.title.toLowerCase().includes(searchValue.trim().toLowerCase()),
            ),
        [searchValue],
    )

    const totalPages = Math.max(1, Math.ceil(filteredTrainings.length / ITEMS_PER_PAGE))
    const normalizedCurrentPage = Math.min(currentPage, totalPages)

    const paginatedTrainings = useMemo(() => {
        const startIndex = (normalizedCurrentPage - 1) * ITEMS_PER_PAGE
        return filteredTrainings.slice(startIndex, startIndex + ITEMS_PER_PAGE)
    }, [filteredTrainings, normalizedCurrentPage])

    return (
        <section className={styles.managerPage}>
            <header className={styles.managerPage__header}>
                <div className={styles.managerPage__headerContent}>
                    <h1 className={styles.managerPage__title}>Trainings</h1>
                    <p className={styles.managerPage__subtitle}>
                        Browse available trainings and open session details.
                    </p>
                </div>
            </header>

            <input
                className={styles.managerPage__searchInput}
                type="search"
                value={searchValue}
                onChange={(event) => {
                    setSearchValue(event.target.value)
                    setCurrentPage(1)
                }}
                placeholder="Search training by title"
                aria-label="Search training"
            />

            {paginatedTrainings.length === 0 ? (
                <p className={styles.managerPage__emptyState}>No trainings found for this query.</p>
            ) : (
                <div className={styles.managerPage__cardGrid}>
                    {paginatedTrainings.map((training) => (
                        <Link
                            key={training.id}
                            className={styles.managerPage__card}
                            to={managerRouteLinks.trainingDetails(training.id)}
                        >
                            <h2 className={styles.managerPage__cardTitle}>{training.title}</h2>
                            <p className={styles.managerPage__cardMeta}>Type: {training.type}</p>
                            <p className={styles.managerPage__cardMeta}>
                                Pricing: {PRICING_TYPE_LABELS[training.pricingType]} ({training.price}{' '}
                                USD)
                            </p>
                        </Link>
                    ))}
                </div>
            )}

            <Pagination
                currentPage={normalizedCurrentPage}
                totalPages={totalPages}
                onPageChange={(nextPage) => {
                    setCurrentPage(Math.max(1, Math.min(nextPage, totalPages)))
                }}
                ariaLabel={t('ui.pagination.trainingsAria')}
            />
        </section>
    )
}
