import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import {
    fetchContractAnalytics,
    fetchContracts,
    fetchSuppliers,
} from '../../api'
import { ADMIN_ROUTE_PATHS } from '../../app/routePaths'
import { BackButton } from '../../components/BackButton'
import { DateTimeBadge } from '../../components/DateTimeBadge'
import { useAsyncData } from '../../hooks'
import { formatMoneyKzt } from '../../utils/formatters'
import styles from '../manager/ManagerPages.module.scss'

export const ContractDetailsPage = () => {
    const { t } = useTranslation()
    const { id } = useParams<{ id: string }>()

    const { data: contracts, isLoading: isContractsLoading, error: contractsError } = useAsyncData(
        fetchContracts,
        [],
        [],
    )
    const { data: suppliers, isLoading: isSuppliersLoading, error: suppliersError } = useAsyncData(
        fetchSuppliers,
        [],
        [],
    )
    const { data: analytics, isLoading: isAnalyticsLoading, error: analyticsError } = useAsyncData(
        async () => {
            if (!id) {
                return null
            }

            return fetchContractAnalytics(id)
        },
        null,
        [id],
    )

    const contract = contracts.find((item) => item.id === id)

    if ((isContractsLoading || isSuppliersLoading) && !contract) {
        return <p className={styles.managerPage__metaText}>{t('admin.contractDetails.loading')}</p>
    }

    if (!contract) {
        return (
            <section className={styles.managerPage}>
                <header className={`${styles.managerPage__header} ${styles.managerPage__headerWithBack}`}>
                    <div className={styles.managerPage__headerActions}>
                        <BackButton fallbackTo={ADMIN_ROUTE_PATHS.contracts} />
                    </div>
                    <div className={styles.managerPage__headerContent}>
                        <h1 className={styles.managerPage__title}>{t('admin.contractDetails.notFoundTitle')}</h1>
                        <p className={styles.managerPage__subtitle}>{t('admin.contractDetails.notFoundSubtitle')}</p>
                    </div>
                </header>
            </section>
        )
    }

    const supplier = suppliers.find((item) => item.id === contract.supplierId)
    const spent = analytics?.spentAmount ?? 0
    const remaining = analytics?.remainingAmount ?? contract.limit - spent
    const utilization = analytics?.spentPercent ?? (contract.limit > 0 ? (spent / contract.limit) * 100 : 0)

    const warnings: string[] = []

    if (analyticsError) {
        warnings.push(t('admin.contractDetails.warnings.analyticsUnavailable'))
    }

    if (contractsError || suppliersError) {
        warnings.push(
            t('ui.error.withMessage', {
                error: contractsError || suppliersError,
            }),
        )
    }

    return (
        <section className={styles.managerPage}>
            <header className={`${styles.managerPage__header} ${styles.managerPage__headerWithBack}`}>
                <div className={styles.managerPage__headerActions}>
                    <BackButton fallbackTo={ADMIN_ROUTE_PATHS.contracts} />
                </div>
                <div className={styles.managerPage__headerContent}>
                    <h1 className={styles.managerPage__title}>
                        {t('admin.contractDetails.title', { number: contract.contractNumber })}
                    </h1>
                    <p className={styles.managerPage__subtitle}>
                        {t('admin.contractDetails.subtitle', {
                            supplier: supplier?.name || contract.supplierName || t('ui.na'),
                        })}
                    </p>
                </div>
            </header>

            {(isContractsLoading || isSuppliersLoading || isAnalyticsLoading) && (
                <p className={styles.managerPage__metaText}>{t('admin.contractDetails.loading')}</p>
            )}

            {warnings.map((warning) => (
                <p key={warning} className={styles.managerPage__metaText}>{warning}</p>
            ))}

            <div className={styles.managerPage__content}>
                <article className={styles.managerPage__infoBlock}>
                    <h2 className={styles.managerPage__infoTitle}>{t('admin.contractDetails.budgetTitle')}</h2>
                    <div className={styles.managerPage__infoGrid}>
                        <div>
                            <p className={styles.managerPage__infoLabel}>{t('admin.contractDetails.fields.startDate')}</p>
                            <p className={styles.managerPage__infoValue}>
                                <DateTimeBadge value={contract.startDate} />
                            </p>
                        </div>
                        <div>
                            <p className={styles.managerPage__infoLabel}>{t('admin.contractDetails.fields.endDate')}</p>
                            <p className={styles.managerPage__infoValue}>
                                <DateTimeBadge value={contract.endDate} tone="end" />
                            </p>
                        </div>
                        <div>
                            <p className={styles.managerPage__infoLabel}>{t('admin.contractDetails.fields.limit')}</p>
                            <p className={styles.managerPage__infoValue}>
                                {formatMoneyKzt(contract.limit)}
                            </p>
                        </div>
                        <div>
                            <p className={styles.managerPage__infoLabel}>{t('admin.contractDetails.fields.used')}</p>
                            <p className={styles.managerPage__infoValue}>
                                {formatMoneyKzt(spent)}
                            </p>
                        </div>
                        <div>
                            <p className={styles.managerPage__infoLabel}>{t('admin.contractDetails.fields.remaining')}</p>
                            <p className={styles.managerPage__infoValue}>
                                {formatMoneyKzt(remaining)}
                            </p>
                        </div>
                        <div>
                            <p className={styles.managerPage__infoLabel}>
                                {t('admin.contractDetails.fields.utilization')}
                            </p>
                            <p className={styles.managerPage__infoValue}>{utilization.toFixed(1)}%</p>
                        </div>
                    </div>
                </article>

                <article className={styles.managerPage__infoBlock}>
                    <h2 className={styles.managerPage__infoTitle}>{t('admin.contractDetails.allocationsTitle')}</h2>
                    <p className={styles.managerPage__metaText}>{t('admin.contractDetails.allocationsDescription')}</p>
                </article>
            </div>
        </section>
    )
}
