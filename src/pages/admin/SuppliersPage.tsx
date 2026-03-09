import { useMemo, useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { ApiError, createSupplier, fetchSuppliers } from '../../api'
import { adminRouteLinks } from '../../app/routePaths'
import { DataTable, type DataTableColumn } from '../../components/DataTable'
import { Pagination } from '../../components/Pagination'
import { useAsyncData } from '../../hooks'
import type { Supplier } from '../../types/supplier.types'
import styles from '../manager/ManagerPages.module.scss'

const ITEMS_PER_PAGE = 7

interface SupplierFormState {
    name: string
    bin: string
    contactPerson: string
    phone: string
    email: string
}

const initialSupplierFormState: SupplierFormState = {
    name: '',
    bin: '',
    contactPerson: '',
    phone: '',
    email: '',
}

export const SuppliersPage = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const [searchValue, setSearchValue] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [formState, setFormState] = useState<SupplierFormState>(initialSupplierFormState)
    const [isCreating, setIsCreating] = useState(false)
    const [createError, setCreateError] = useState<string | null>(null)

    const {
        data: suppliers,
        isLoading,
        error,
        reload,
    } = useAsyncData(fetchSuppliers, [], [])

    const filteredSuppliers = useMemo(() => {
        const query = searchValue.trim().toLowerCase()
        if (!query) return suppliers

        return suppliers.filter((supplier) => {
            const combined = [
                supplier.name,
                supplier.bin,
                supplier.contactPerson,
                supplier.phone,
                supplier.email,
            ]
                .join(' ')
                .toLowerCase()

            return combined.includes(query)
        })
    }, [searchValue, suppliers])

    const totalPages = Math.max(1, Math.ceil(filteredSuppliers.length / ITEMS_PER_PAGE))
    const normalizedCurrentPage = Math.min(currentPage, totalPages)

    const paginatedSuppliers = useMemo(() => {
        const startIndex = (normalizedCurrentPage - 1) * ITEMS_PER_PAGE
        return filteredSuppliers.slice(startIndex, startIndex + ITEMS_PER_PAGE)
    }, [filteredSuppliers, normalizedCurrentPage])

    const columns = useMemo<DataTableColumn<Supplier>[]>(
        () => [
            {
                key: 'name',
                header: t('admin.suppliers.columns.name'),
                renderCell: (supplier) => supplier.name,
            },
            {
                key: 'bin',
                header: t('admin.suppliers.columns.bin'),
                renderCell: (supplier) => supplier.bin,
            },
            {
                key: 'contactPerson',
                header: t('admin.suppliers.columns.contactPerson'),
                renderCell: (supplier) => supplier.contactPerson || t('ui.na'),
            },
            {
                key: 'phone',
                header: t('admin.suppliers.columns.phone'),
                renderCell: (supplier) => supplier.phone || t('ui.na'),
            },
            {
                key: 'email',
                header: t('admin.suppliers.columns.email'),
                renderCell: (supplier) => supplier.email || t('ui.na'),
            },
        ],
        [t],
    )

    const handleCreateSupplier = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setCreateError(null)

        if (!formState.name.trim() || !formState.bin.trim()) {
            setCreateError(t('admin.suppliers.form.validation.required'))
            return
        }

        try {
            setIsCreating(true)
            await createSupplier({
                name: formState.name.trim(),
                bin: formState.bin.trim(),
                contactPerson: formState.contactPerson.trim(),
                phone: formState.phone.trim(),
                email: formState.email.trim(),
            })
            setFormState(initialSupplierFormState)
            await reload()
        } catch (createSupplierError) {
            if (createSupplierError instanceof ApiError) {
                setCreateError(createSupplierError.message)
            } else {
                setCreateError(t('admin.suppliers.form.validation.failed'))
            }
        } finally {
            setIsCreating(false)
        }
    }

    return (
        <section className={styles.managerPage}>
            <header className={styles.managerPage__header}>
                <div className={styles.managerPage__headerContent}>
                    <h1 className={styles.managerPage__title}>{t('admin.suppliers.title')}</h1>
                    <p className={styles.managerPage__subtitle}>{t('admin.suppliers.subtitle')}</p>
                </div>
            </header>

            <article className={styles.managerPage__infoBlock}>
                <h2 className={styles.managerPage__infoTitle}>{t('admin.suppliers.form.title')}</h2>
                <form className={styles.managerPage__inlineForm} onSubmit={handleCreateSupplier}>
                    <div className={styles.managerPage__formGrid}>
                        <label className={styles.managerPage__field}>
                            <span className={styles.managerPage__fieldLabel}>{t('admin.suppliers.form.name')}</span>
                            <input
                                className={styles.managerPage__input}
                                value={formState.name}
                                onChange={(event) => {
                                    setFormState((prev) => ({ ...prev, name: event.target.value }))
                                    setCreateError(null)
                                }}
                            />
                        </label>
                        <label className={styles.managerPage__field}>
                            <span className={styles.managerPage__fieldLabel}>{t('admin.suppliers.form.bin')}</span>
                            <input
                                className={styles.managerPage__input}
                                value={formState.bin}
                                onChange={(event) => {
                                    setFormState((prev) => ({ ...prev, bin: event.target.value }))
                                    setCreateError(null)
                                }}
                                maxLength={12}
                            />
                        </label>
                        <label className={styles.managerPage__field}>
                            <span className={styles.managerPage__fieldLabel}>
                                {t('admin.suppliers.form.contactPerson')}
                            </span>
                            <input
                                className={styles.managerPage__input}
                                value={formState.contactPerson}
                                onChange={(event) => {
                                    setFormState((prev) => ({ ...prev, contactPerson: event.target.value }))
                                }}
                            />
                        </label>
                        <label className={styles.managerPage__field}>
                            <span className={styles.managerPage__fieldLabel}>{t('admin.suppliers.form.phone')}</span>
                            <input
                                className={styles.managerPage__input}
                                value={formState.phone}
                                onChange={(event) => {
                                    setFormState((prev) => ({ ...prev, phone: event.target.value }))
                                }}
                            />
                        </label>
                        <label className={styles.managerPage__field}>
                            <span className={styles.managerPage__fieldLabel}>{t('admin.suppliers.form.email')}</span>
                            <input
                                className={styles.managerPage__input}
                                type="email"
                                value={formState.email}
                                onChange={(event) => {
                                    setFormState((prev) => ({ ...prev, email: event.target.value }))
                                }}
                            />
                        </label>
                    </div>
                    <div className={styles.managerPage__formActions}>
                        <button className={styles.managerPage__buttonPrimary} type="submit" disabled={isCreating}>
                            {isCreating ? t('admin.suppliers.form.creating') : t('admin.suppliers.form.submit')}
                        </button>
                    </div>
                    {createError && <p className={styles.managerPage__metaText}>{createError}</p>}
                </form>
            </article>

            <input
                className={styles.managerPage__searchInput}
                type="search"
                placeholder={t('admin.suppliers.searchPlaceholder')}
                aria-label={t('admin.suppliers.searchAria')}
                value={searchValue}
                onChange={(event) => {
                    setSearchValue(event.target.value)
                    setCurrentPage(1)
                }}
            />

            <DataTable
                columns={columns}
                rows={paginatedSuppliers}
                getRowKey={(supplier) => supplier.id}
                emptyState={t('admin.suppliers.empty')}
                onRowClick={(supplier) => {
                    navigate(adminRouteLinks.supplierDetails(supplier.id))
                }}
                minWidth={760}
            />

            {isLoading && <p className={styles.managerPage__metaText}>{t('admin.suppliers.loading')}</p>}
            {error && (
                <p className={styles.managerPage__metaText}>
                    {t('ui.error.withMessage', { error })}
                </p>
            )}

            <Pagination
                currentPage={normalizedCurrentPage}
                totalPages={totalPages}
                onPageChange={(nextPage) => {
                    setCurrentPage(Math.max(1, Math.min(nextPage, totalPages)))
                }}
                ariaLabel={t('ui.pagination.suppliersAria')}
            />
        </section>
    )
}
