import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchContractAnalytics, fetchContracts, fetchSuppliers } from '../../api'
import { ADMIN_ROUTE_PATHS, adminRouteLinks } from '../../app/routePaths'
import { BackButton } from '../../components/BackButton'
import { DataTable, type DataTableColumn } from '../../components/DataTable'
import { DateTimeBadge } from '../../components/DateTimeBadge'
import { Pagination } from '../../components/Pagination'
import { useAsyncData } from '../../hooks'
import { formatMoneyKzt } from '../../utils/formatters'
import styles from '../manager/ManagerPages.module.scss'

const ITEMS_PER_PAGE = 5

export const SupplierDetailsPage = () => {
    const { t } = useTranslation()
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [currentPage, setCurrentPage] = useState(1)

    const { data: suppliers, isLoading: isSuppliersLoading, error: suppliersError } = useAsyncData(
        fetchSuppliers,
        [],
        [],
    )
    const { data: contracts, isLoading: isContractsLoading, error: contractsError } = useAsyncData(
        fetchContracts,
        [],
        [],
    )

    const [spentByContractId, setSpentByContractId] = useState<Map<string, number>>(new Map())
    const [isAnalyticsLoading, setIsAnalyticsLoading] = useState(false)
    const [analyticsError, setAnalyticsError] = useState<string | null>(null)

    const supplier = suppliers.find((supplierItem) => supplierItem.id === id)
    const supplierContracts = useMemo(
        () => contracts.filter((contract) => contract.supplierId === id),
        [contracts, id],
    )

    useEffect(() => {
        if (supplierContracts.length === 0) {
            setSpentByContractId(new Map())
            setAnalyticsError(null)
            return
        }

        let isMounted = true

        const loadAnalytics = async () => {
            setIsAnalyticsLoading(true)
            setAnalyticsError(null)

            try {
                let hasAnalyticsErrors = false

                const analytics = await Promise.all(
                    supplierContracts.map(async (contract) => {
                        try {
                            const result = await fetchContractAnalytics(contract.id)
                            return [contract.id, result.spentAmount] as const
                        } catch {
                            hasAnalyticsErrors = true
                            return [contract.id, 0] as const
                        }
                    }),
                )

                if (isMounted) {
                    setSpentByContractId(new Map(analytics))
                    setAnalyticsError(hasAnalyticsErrors ? t('admin.supplierDetails.analyticsError') : null)
                }
            } finally {
                if (isMounted) {
                    setIsAnalyticsLoading(false)
                }
            }
        }

        void loadAnalytics()

        return () => {
            isMounted = false
        }
    }, [supplierContracts, t])

    if ((isSuppliersLoading || isContractsLoading) && !supplier) {
        return <p className={styles.managerPage__metaText}>{t('admin.supplierDetails.loading')}</p>
    }

    if (!supplier) {
        return (
            <section className={styles.managerPage}>
                <header className={`${styles.managerPage__header} ${styles.managerPage__headerWithBack}`}>
                    <div className={styles.managerPage__headerActions}>
                        <BackButton fallbackTo={ADMIN_ROUTE_PATHS.suppliers} />
                    </div>
                    <div className={styles.managerPage__headerContent}>
                        <h1 className={styles.managerPage__title}>{t('admin.supplierDetails.notFoundTitle')}</h1>
                        <p className={styles.managerPage__subtitle}>{t('admin.supplierDetails.notFoundSubtitle')}</p>
                    </div>
                </header>
            </section>
        )
    }

    const columns: DataTableColumn<(typeof contracts)[number]>[] = [
        {
            key: 'contractNumber',
            header: t('admin.supplierDetails.columns.contractNumber'),
            className: styles.managerPage__nowrapCell,
            renderCell: (contract) => contract.contractNumber,
        },
        {
            key: 'startDate',
            header: t('admin.supplierDetails.columns.startDate'),
            renderCell: (contract) => <DateTimeBadge value={contract.startDate} />,
        },
        {
            key: 'endDate',
            header: t('admin.supplierDetails.columns.endDate'),
            renderCell: (contract) => <DateTimeBadge value={contract.endDate} tone="end" />,
        },
        {
            key: 'limit',
            header: t('admin.supplierDetails.columns.limit'),
            className: styles.managerPage__nowrapCell,
            renderCell: (contract) => formatMoneyKzt(contract.limit),
        },
        {
            key: 'used',
            header: t('admin.supplierDetails.columns.used'),
            className: styles.managerPage__nowrapCell,
            renderCell: (contract) => formatMoneyKzt(spentByContractId.get(contract.id) ?? 0),
        },
        {
            key: 'remaining',
            header: t('admin.supplierDetails.columns.remaining'),
            className: styles.managerPage__nowrapCell,
            renderCell: (contract) => {
                const used = spentByContractId.get(contract.id) ?? 0
                return formatMoneyKzt(contract.limit - used)
            },
        },
        {
            key: 'progress',
            header: t('admin.supplierDetails.columns.progress'),
            className: styles.managerPage__nowrapCell,
            renderCell: (contract) => {
                const used = spentByContractId.get(contract.id) ?? 0
                const progress = contract.limit > 0 ? (used / contract.limit) * 100 : 0
                return `${progress.toFixed(1)}%`
            },
        },
    ]

    const totalPages = Math.max(1, Math.ceil(supplierContracts.length / ITEMS_PER_PAGE))
    const normalizedCurrentPage = Math.min(currentPage, totalPages)
    const startIndex = (normalizedCurrentPage - 1) * ITEMS_PER_PAGE
    const paginatedContracts = supplierContracts.slice(startIndex, startIndex + ITEMS_PER_PAGE)

    return (
        <section className={styles.managerPage}>
            <header className={`${styles.managerPage__header} ${styles.managerPage__headerWithBack}`}>
                <div className={styles.managerPage__headerActions}>
                    <BackButton fallbackTo={ADMIN_ROUTE_PATHS.suppliers} />
                </div>
                <div className={styles.managerPage__headerContent}>
                    <h1 className={styles.managerPage__title}>
                        {t('admin.supplierDetails.title', { name: supplier.name })}
                    </h1>
                    <p className={styles.managerPage__subtitle}>{t('admin.supplierDetails.subtitle')}</p>
                </div>
            </header>

            <div className={styles.managerPage__infoBlock}>
                <h2 className={styles.managerPage__infoTitle}>{t('admin.supplierDetails.infoTitle')}</h2>

                {(isSuppliersLoading || isContractsLoading || isAnalyticsLoading) && (
                    <p className={styles.managerPage__metaText}>{t('admin.supplierDetails.loading')}</p>
                )}
                {(suppliersError || contractsError) && (
                    <p className={styles.managerPage__metaText}>
                        {t('ui.error.withMessage', { error: suppliersError || contractsError })}
                    </p>
                )}
                {analyticsError && <p className={styles.managerPage__metaText}>{analyticsError}</p>}

                <div className={styles.managerPage__infoGrid}>
                    <div>
                        <p className={styles.managerPage__infoLabel}>{t('admin.supplierDetails.fields.name')}</p>
                        <p className={styles.managerPage__infoValue}>{supplier.name}</p>
                    </div>

                    <div>
                        <p className={styles.managerPage__infoLabel}>{t('admin.supplierDetails.fields.bin')}</p>
                        <p className={styles.managerPage__infoValue}>{supplier.bin}</p>
                    </div>

                    <div>
                        <p className={styles.managerPage__infoLabel}>
                            {t('admin.supplierDetails.fields.contactPerson')}
                        </p>
                        <p className={styles.managerPage__infoValue}>{supplier.contactPerson || t('ui.na')}</p>
                    </div>

                    <div>
                        <p className={styles.managerPage__infoLabel}>{t('admin.supplierDetails.fields.phone')}</p>
                        <p className={styles.managerPage__infoValue}>{supplier.phone || t('ui.na')}</p>
                    </div>

                    <div>
                        <p className={styles.managerPage__infoLabel}>{t('admin.supplierDetails.fields.email')}</p>
                        <p className={styles.managerPage__infoValue}>{supplier.email || t('ui.na')}</p>
                    </div>
                </div>
            </div>

            <div className={styles.managerPage__infoBlock}>
                <h2 className={styles.managerPage__infoTitle}>{t('admin.supplierDetails.contractsTitle')}</h2>

                <DataTable
                    columns={columns}
                    rows={paginatedContracts}
                    getRowKey={(contract) => contract.id}
                    emptyState={t('admin.supplierDetails.emptyContracts')}
                    onRowClick={(contract) => {
                        navigate(adminRouteLinks.contractDetails(contract.id))
                    }}
                    minWidth={1120}
                />

                <Pagination
                    currentPage={normalizedCurrentPage}
                    totalPages={totalPages}
                    onPageChange={(nextPage) => {
                        setCurrentPage(Math.max(1, Math.min(nextPage, totalPages)))
                    }}
                    ariaLabel={t('ui.pagination.supplierContractsAria')}
                />
            </div>
        </section>
    )
}
