import { useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import { ADMIN_ROUTE_PATHS, adminRouteLinks } from '../../app/routePaths'
import { BackButton } from '../../components/BackButton'
import { DataTable, type DataTableColumn } from '../../components/DataTable'
import { Pagination } from '../../components/Pagination'
import {
    suppliersMock,
    contractsMock,
    contractAllocationsMock,
} from '../manager/manager.mock'

import styles from '../manager/ManagerPages.module.scss'

const ITEMS_PER_PAGE = 5

export const SupplierDetailsPage = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [currentPage, setCurrentPage] = useState(1)

    const supplier = suppliersMock.find((s) => s.id === id)

    if (!supplier) {
        return (
            <section className={styles.managerPage}>
                <header className={`${styles.managerPage__header} ${styles.managerPage__headerWithBack}`}>
                    <div className={styles.managerPage__headerActions}>
                        <BackButton fallbackTo={ADMIN_ROUTE_PATHS.suppliers} />
                    </div>
                    <div className={styles.managerPage__headerContent}>
                        <h1 className={styles.managerPage__title}>Supplier not found</h1>
                        <p className={styles.managerPage__subtitle}>The requested supplier is unavailable.</p>
                    </div>
                </header>
            </section>
        )
    }

    // contracts belonging to this supplier
    const supplierContracts = contractsMock.filter(
        (c) => c.supplierId === supplier.id
    )
    const allocationsByContractId = new Map<string, number>()
    contractAllocationsMock.forEach((allocation) => {
        const currentAmount = allocationsByContractId.get(allocation.contractId) ?? 0
        allocationsByContractId.set(allocation.contractId, currentAmount + allocation.amount)
    })

    const columns: DataTableColumn<(typeof contractsMock)[number]>[] = [
        {
            key: 'contractNumber',
            header: 'Contract #',
            renderCell: (contract) => contract.contractNumber,
        },
        {
            key: 'startDate',
            header: 'Start',
            renderCell: (contract) => contract.startDate,
        },
        {
            key: 'endDate',
            header: 'End',
            renderCell: (contract) => contract.endDate,
        },
        {
            key: 'limit',
            header: 'Limit',
            renderCell: (contract) => `${contract.limit} ₸`,
        },
        {
            key: 'used',
            header: 'Used',
            renderCell: (contract) => `${allocationsByContractId.get(contract.id) ?? 0} ₸`,
        },
        {
            key: 'remaining',
            header: 'Remaining',
            renderCell: (contract) => {
                const used = allocationsByContractId.get(contract.id) ?? 0
                return `${contract.limit - used} ₸`
            },
        },
        {
            key: 'progress',
            header: 'Progress',
            renderCell: (contract) => {
                const used = allocationsByContractId.get(contract.id) ?? 0
                const progress = (used / contract.limit) * 100
                return `${progress.toFixed(1)}%`
            },
        },
    ]
    const totalPages = Math.max(1, Math.ceil(supplierContracts.length / ITEMS_PER_PAGE))
    const normalizedCurrentPage = Math.min(currentPage, totalPages)
    const startIndex = (normalizedCurrentPage - 1) * ITEMS_PER_PAGE
    const paginatedContracts = supplierContracts.slice(
        startIndex,
        startIndex + ITEMS_PER_PAGE,
    )

    return (
        <section className={styles.managerPage}>
            <header className={`${styles.managerPage__header} ${styles.managerPage__headerWithBack}`}>
                <div className={styles.managerPage__headerActions}>
                    <BackButton fallbackTo={ADMIN_ROUTE_PATHS.suppliers} />
                </div>
                <div className={styles.managerPage__headerContent}>
                    <h1 className={styles.managerPage__title}>
                        Supplier: {supplier.name}
                    </h1>
                    <p className={styles.managerPage__subtitle}>
                        Training supplier details & contract budgets
                    </p>
                </div>
            </header>

            {/* SUPPLIER INFO */}
            <div className={styles.managerPage__infoBlock}>
                <h2 className={styles.managerPage__infoTitle}>Supplier Info</h2>

                <div className={styles.managerPage__infoGrid}>
                    <div>
                        <p className={styles.managerPage__infoLabel}>Name</p>
                        <p className={styles.managerPage__infoValue}>
                            {supplier.name}
                        </p>
                    </div>

                    <div>
                        <p className={styles.managerPage__infoLabel}>BIN</p>
                        <p className={styles.managerPage__infoValue}>
                            {supplier.bin}
                        </p>
                    </div>

                    <div>
                        <p className={styles.managerPage__infoLabel}>
                            Contact Person
                        </p>
                        <p className={styles.managerPage__infoValue}>
                            {supplier.contactPerson}
                        </p>
                    </div>

                    <div>
                        <p className={styles.managerPage__infoLabel}>Phone</p>
                        <p className={styles.managerPage__infoValue}>
                            {supplier.phone}
                        </p>
                    </div>

                    <div>
                        <p className={styles.managerPage__infoLabel}>Email</p>
                        <p className={styles.managerPage__infoValue}>
                            {supplier.email}
                        </p>
                    </div>
                </div>
            </div>

            {/* CONTRACT LIST */}
            <div className={styles.managerPage__infoBlock}>
                <h2 className={styles.managerPage__infoTitle}>
                    Contracts & Budget Usage
                </h2>

                <DataTable
                    columns={columns}
                    rows={paginatedContracts}
                    getRowKey={(contract) => contract.id}
                    emptyState="No contracts found"
                    onRowClick={(contract) => {
                        navigate(adminRouteLinks.contractDetails(contract.id))
                    }}
                    minWidth={900}
                />

                <Pagination
                    currentPage={normalizedCurrentPage}
                    totalPages={totalPages}
                    onPageChange={(nextPage) => {
                        setCurrentPage(Math.max(1, Math.min(nextPage, totalPages)))
                    }}
                    ariaLabel="supplier contracts pagination"
                />
            </div>
        </section>
    )
}
