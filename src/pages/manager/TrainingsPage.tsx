import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { fetchTrainings } from '../../api'
import { managerRouteLinks } from '../../app/routePaths'
import { useAsyncData } from '../../hooks'
import { Pagination } from '../../components/Pagination'
import { PricingType } from '../../types'
import { formatMoneyKzt } from '../../utils/formatters'
import styles from './ManagerPages.module.scss'

const ITEMS_PER_PAGE = 8

export const TrainingsPage = () => {
    const { t } = useTranslation()
    const [searchValue, setSearchValue] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const { data: trainings, isLoading, error } = useAsyncData(fetchTrainings, [], [])

    const filteredTrainings = useMemo(
        () =>
            trainings.filter((training) =>
                training.title.toLowerCase().includes(searchValue.trim().toLowerCase()),
            ),
        [searchValue, trainings],
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
                    <h1 className={styles.managerPage__title}>{t('manager.trainings.title')}</h1>
                    <p className={styles.managerPage__subtitle}>{t('manager.trainings.subtitle')}</p>
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
                placeholder={t('manager.trainings.searchPlaceholder')}
                aria-label={t('manager.trainings.searchAria')}
            />

            {isLoading && <p className={styles.managerPage__metaText}>{t('manager.trainings.loading')}</p>}
            {error && (
                <p className={styles.managerPage__metaText}>
                    {t('ui.error.withMessage', { error })}
                </p>
            )}

            {paginatedTrainings.length === 0 ? (
                <p className={styles.managerPage__emptyState}>{t('manager.trainings.empty')}</p>
            ) : (
                <div className={styles.managerPage__cardGrid}>
                    {paginatedTrainings.map((training) => (
                        <Link
                            key={training.id}
                            className={styles.managerPage__card}
                            to={managerRouteLinks.trainingDetails(training.id)}
                        >
                            <h2 className={styles.managerPage__cardTitle}>{training.title}</h2>
                            <p className={styles.managerPage__cardMeta}>
                                {t('manager.trainings.card.type')}: {training.type}
                            </p>
                            <p className={styles.managerPage__cardMeta}>
                                {t('manager.trainings.card.pricing')}:{' '}
                                {t(`labels.pricingType.${training.pricingType as PricingType}`)} (
                                {formatMoneyKzt(training.price)})
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
