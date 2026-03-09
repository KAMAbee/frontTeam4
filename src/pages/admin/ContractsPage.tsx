import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import {
    ApiError,
    createContract,
    fetchBudgetSummary,
    fetchContractAnalytics,
    fetchContracts,
    fetchSuppliers,
} from '../../api'
import { adminRouteLinks } from '../../app/routePaths'
import { DataTable, type DataTableColumn } from '../../components/DataTable'
import { DateTimeBadge } from '../../components/DateTimeBadge'
import { Pagination } from '../../components/Pagination'
import { useAsyncData } from '../../hooks'
import { formatMoneyKzt } from '../../utils/formatters'
import styles from '../manager/ManagerPages.module.scss'

const ITEMS_PER_PAGE = 7

interface ContractFormState {
    supplierId: string
    contractNumber: string
    startDate: string
    endDate: string
    totalAmount: string
}

export const ContractsPage = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const [searchValue, setSearchValue] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [isCreating, setIsCreating] = useState(false)
    const [createError, setCreateError] = useState<string | null>(null)

    const { data: contracts, isLoading: isContractsLoading, error: contractsError, reload: reloadContracts } = useAsyncData(
        fetchContracts,
        [],
        [],
    )
    const { data: suppliers, isLoading: isSuppliersLoading, error: suppliersError } = useAsyncData(
        fetchSuppliers,
        [],
        [],
    )
    const { data: budgetSummary, isLoading: isBudgetLoading, error: budgetError, reload: reloadBudget } = useAsyncData(
        fetchBudgetSummary,
        null,
        [],
    )

    const [formState, setFormState] = useState<ContractFormState>({
        supplierId: '',
        contractNumber: '',
        startDate: '',
        endDate: '',
        totalAmount: '',
    })

    useEffect(() => {
        if (!formState.supplierId && suppliers.length > 0) {
            setFormState((prev) => ({ ...prev, supplierId: suppliers[0].id }))
        }
    }, [formState.supplierId, suppliers])

    const [spentByContractId, setSpentByContractId] = useState<Map<string, number>>(new Map())
    const [isAnalyticsLoading, setIsAnalyticsLoading] = useState(false)
    const [analyticsError, setAnalyticsError] = useState<string | null>(null)

    useEffect(() => {
        if (contracts.length === 0) {
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
                    contracts.map(async (contract) => {
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
                    setAnalyticsError(hasAnalyticsErrors ? t('admin.contracts.analyticsError') : null)
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
    }, [contracts, t])

    const suppliersById = useMemo(
        () => new Map(suppliers.map((supplier) => [supplier.id, supplier])),
        [suppliers],
    )

    const filteredContracts = useMemo(() => {
        const query = searchValue.trim().toLowerCase()
        if (!query) return contracts

        return contracts.filter((contract) => {
            const supplier = suppliersById.get(contract.supplierId)

            const combined = [
                supplier?.name ?? '',
                contract.contractNumber,
                contract.startDate,
                contract.endDate,
                String(contract.limit),
            ]
                .join(' ')
                .toLowerCase()

            return combined.includes(query)
        })
    }, [contracts, searchValue, suppliersById])

    const totalPages = Math.max(1, Math.ceil(filteredContracts.length / ITEMS_PER_PAGE))
    const normalizedCurrentPage = Math.min(currentPage, totalPages)

    const paginatedContracts = useMemo(() => {
        const startIndex = (normalizedCurrentPage - 1) * ITEMS_PER_PAGE
        return filteredContracts.slice(startIndex, startIndex + ITEMS_PER_PAGE)
    }, [filteredContracts, normalizedCurrentPage])

    const columns = useMemo<DataTableColumn<(typeof contracts)[number]>[]>(
        () => [
            {
                key: 'supplier',
                header: t('admin.contracts.columns.supplier'),
                renderCell: (contract) => suppliersById.get(contract.supplierId)?.name ?? t('ui.na'),
            },
            {
                key: 'contractNumber',
                header: t('admin.contracts.columns.contractNumber'),
                className: styles.managerPage__nowrapCell,
                renderCell: (contract) => contract.contractNumber,
            },
            {
                key: 'startDate',
                header: t('admin.contracts.columns.startDate'),
                renderCell: (contract) => <DateTimeBadge value={contract.startDate} />,
            },
            {
                key: 'endDate',
                header: t('admin.contracts.columns.endDate'),
                renderCell: (contract) => <DateTimeBadge value={contract.endDate} tone="end" />,
            },
            {
                key: 'limit',
                header: t('admin.contracts.columns.limit'),
                className: styles.managerPage__nowrapCell,
                renderCell: (contract) => formatMoneyKzt(contract.limit),
            },
            {
                key: 'used',
                header: t('admin.contracts.columns.used'),
                className: styles.managerPage__nowrapCell,
                renderCell: (contract) => formatMoneyKzt(spentByContractId.get(contract.id) ?? 0),
            },
            {
                key: 'remaining',
                header: t('admin.contracts.columns.remaining'),
                className: styles.managerPage__nowrapCell,
                renderCell: (contract) => {
                    const used = spentByContractId.get(contract.id) ?? 0
                    return formatMoneyKzt(contract.limit - used)
                },
            },
            {
                key: 'progress',
                header: t('admin.contracts.columns.progress'),
                className: styles.managerPage__nowrapCell,
                renderCell: (contract) => {
                    const used = spentByContractId.get(contract.id) ?? 0
                    const progress = contract.limit > 0 ? (used / contract.limit) * 100 : 0
                    return `${progress.toFixed(1)}%`
                },
            },
        ],
        [contracts, spentByContractId, suppliersById, t],
    )

    const handleCreateContract = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setCreateError(null)

        const totalAmount = Number(formState.totalAmount)
        if (
            !formState.supplierId
            || !formState.contractNumber.trim()
            || !formState.startDate
            || !formState.endDate
            || Number.isNaN(totalAmount)
            || totalAmount <= 0
        ) {
            setCreateError(t('admin.contracts.form.validation.required'))
            return
        }

        try {
            setIsCreating(true)
            await createContract({
                supplierId: formState.supplierId,
                contractNumber: formState.contractNumber.trim(),
                startDate: formState.startDate.split('T')[0],
                endDate: formState.endDate.split('T')[0],
                totalAmount,
            })
            setFormState((prev) => ({
                ...prev,
                contractNumber: '',
                startDate: '',
                endDate: '',
                totalAmount: '',
            }))
            await Promise.all([reloadContracts(), reloadBudget()])
        } catch (createContractError) {
            if (createContractError instanceof ApiError) {
                setCreateError(createContractError.message)
            } else {
                setCreateError(t('admin.contracts.form.validation.failed'))
            }
        } finally {
            setIsCreating(false)
        }
    }

    return (
        <section className={styles.managerPage}>
            <header className={styles.managerPage__header}>
                <div className={styles.managerPage__headerContent}>
                    <h1 className={styles.managerPage__title}>{t('admin.contracts.title')}</h1>
                    <p className={styles.managerPage__subtitle}>{t('admin.contracts.subtitle')}</p>
                </div>
            </header>

            <article className={styles.managerPage__infoBlock}>
                <h2 className={styles.managerPage__infoTitle}>{t('admin.contracts.budgetTitle')}</h2>
                {isBudgetLoading && <p className={styles.managerPage__metaText}>{t('admin.contracts.loading')}</p>}
                {budgetError && (
                    <p className={styles.managerPage__metaText}>
                        {t('ui.error.withMessage', { error: budgetError })}
                    </p>
                )}
                {budgetSummary && (
                    <div className={styles.managerPage__infoGrid}>
                        <div>
                            <p className={styles.managerPage__infoLabel}>{t('admin.contracts.budget.total')}</p>
                            <p className={styles.managerPage__infoValue}>
                                {formatMoneyKzt(budgetSummary.totalContractAmount)}
                            </p>
                        </div>
                        <div>
                            <p className={styles.managerPage__infoLabel}>{t('admin.contracts.budget.allocated')}</p>
                            <p className={styles.managerPage__infoValue}>
                                {formatMoneyKzt(budgetSummary.allocatedTotal)}
                            </p>
                        </div>
                        <div>
                            <p className={styles.managerPage__infoLabel}>{t('admin.contracts.budget.remaining')}</p>
                            <p className={styles.managerPage__infoValue}>
                                {formatMoneyKzt(budgetSummary.remainingBudget)}
                            </p>
                        </div>
                    </div>
                )}
            </article>

            <article className={styles.managerPage__infoBlock}>
                <h2 className={styles.managerPage__infoTitle}>{t('admin.contracts.form.title')}</h2>
                <form className={styles.managerPage__inlineForm} onSubmit={handleCreateContract}>
                    <div className={styles.managerPage__formGrid}>
                        <label className={styles.managerPage__field}>
                            <span className={styles.managerPage__fieldLabel}>{t('admin.contracts.form.supplier')}</span>
                            <select
                                className={styles.managerPage__select}
                                value={formState.supplierId}
                                onChange={(event) => {
                                    setFormState((prev) => ({ ...prev, supplierId: event.target.value }))
                                    setCreateError(null)
                                }}
                            >
                                {suppliers.map((supplier) => (
                                    <option key={supplier.id} value={supplier.id}>
                                        {supplier.name}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label className={styles.managerPage__field}>
                            <span className={styles.managerPage__fieldLabel}>
                                {t('admin.contracts.form.contractNumber')}
                            </span>
                            <input
                                className={styles.managerPage__input}
                                value={formState.contractNumber}
                                onChange={(event) => {
                                    setFormState((prev) => ({ ...prev, contractNumber: event.target.value }))
                                    setCreateError(null)
                                }}
                            />
                        </label>
                        <label className={styles.managerPage__field}>
                            <span className={styles.managerPage__fieldLabel}>{t('admin.contracts.form.startDate')}</span>
                            <input
                                className={styles.managerPage__input}
                                type="datetime-local"
                                value={formState.startDate}
                                onChange={(event) => {
                                    setFormState((prev) => ({ ...prev, startDate: event.target.value }))
                                    setCreateError(null)
                                }}
                            />
                        </label>
                        <label className={styles.managerPage__field}>
                            <span className={styles.managerPage__fieldLabel}>{t('admin.contracts.form.endDate')}</span>
                            <input
                                className={styles.managerPage__input}
                                type="datetime-local"
                                value={formState.endDate}
                                onChange={(event) => {
                                    setFormState((prev) => ({ ...prev, endDate: event.target.value }))
                                    setCreateError(null)
                                }}
                            />
                        </label>
                        <label className={styles.managerPage__field}>
                            <span className={styles.managerPage__fieldLabel}>{t('admin.contracts.form.limit')}</span>
                            <input
                                className={styles.managerPage__input}
                                type="number"
                                min={0}
                                step={0.01}
                                value={formState.totalAmount}
                                onChange={(event) => {
                                    setFormState((prev) => ({ ...prev, totalAmount: event.target.value }))
                                    setCreateError(null)
                                }}
                            />
                        </label>
                    </div>
                    <div className={styles.managerPage__formActions}>
                        <button className={styles.managerPage__buttonPrimary} type="submit" disabled={isCreating}>
                            {isCreating ? t('admin.contracts.form.creating') : t('admin.contracts.form.submit')}
                        </button>
                    </div>
                    {createError && <p className={styles.managerPage__metaText}>{createError}</p>}
                </form>
            </article>

            <input
                className={styles.managerPage__searchInput}
                type="search"
                placeholder={t('admin.contracts.searchPlaceholder')}
                aria-label={t('admin.contracts.searchAria')}
                value={searchValue}
                onChange={(event) => {
                    setSearchValue(event.target.value)
                    setCurrentPage(1)
                }}
            />

            <DataTable
                columns={columns}
                rows={paginatedContracts}
                getRowKey={(contract) => contract.id}
                emptyState={t('admin.contracts.empty')}
                onRowClick={(contract) => {
                    navigate(adminRouteLinks.contractDetails(contract.id))
                }}
                minWidth={1120}
            />

            {(isContractsLoading || isSuppliersLoading || isAnalyticsLoading) && (
                <p className={styles.managerPage__metaText}>{t('admin.contracts.loading')}</p>
            )}
            {(contractsError || suppliersError) && (
                <p className={styles.managerPage__metaText}>
                    {t('ui.error.withMessage', { error: contractsError || suppliersError })}
                </p>
            )}
            {analyticsError && <p className={styles.managerPage__metaText}>{analyticsError}</p>}

            <Pagination
                currentPage={normalizedCurrentPage}
                totalPages={totalPages}
                onPageChange={(nextPage) => {
                    setCurrentPage(Math.max(1, Math.min(nextPage, totalPages)))
                }}
                ariaLabel={t('ui.pagination.contractsAria')}
            />
        </section>
    )
}
