import { ADMIN_ROUTE_PATHS } from '../../app/routePaths'
import { BackButton } from '../../components/BackButton'
import { useParams } from 'react-router-dom'
import { DataTable, type DataTableColumn } from '../../components/DataTable'
import { Pagination } from '../../components/Pagination'
import { useState } from 'react'

import {
    contractsMock,
    suppliersMock,
    contractAllocationsMock,
    requestsMock,
} from '../manager/manager.mock'

import styles from '../manager/ManagerPages.module.scss'

const ITEMS_PER_PAGE = 5

export const ContractDetailsPage = () => {
    const { id } = useParams<{ id: string }>()
    const [currentPage, setCurrentPage] = useState(1)

    const contract = contractsMock.find((c) => c.id === id)

    if (!contract) {
        return (
            <section className={styles.managerPage}>
                <header className={`${styles.managerPage__header} ${styles.managerPage__headerWithBack}`}>
                    <div className={styles.managerPage__headerActions}>
                        <BackButton fallbackTo={ADMIN_ROUTE_PATHS.contracts} />
                    </div>
                    <div className={styles.managerPage__headerContent}>
                        <h1 className={styles.managerPage__title}>Contract not found</h1>
                        <p className={styles.managerPage__subtitle}>The requested contract is unavailable.</p>
                    </div>
                </header>
            </section>
        )
    }

    const supplier = suppliersMock.find(
        (s) => s.id === contract.supplierId
    )

    const allocations = contractAllocationsMock.filter(
        (a) => a.contractId === contract.id
    )

    const used = allocations.reduce((sum, a) => sum + a.amount, 0)

    const remaining = contract.limit - used
    const utilization = contract.limit > 0 ? (used / contract.limit) * 100 : 0
    const requestsById = new Map(requestsMock.map((request) => [request.id, request]))
    const columns: DataTableColumn<(typeof contractAllocationsMock)[number]>[] = [
        {
            key: 'request',
            header: 'Request',
            renderCell: (allocation) => requestsById.get(allocation.requestId)?.id ?? 'N/A',
        },
        {
            key: 'amount',
            header: 'Amount',
            renderCell: (allocation) => `${allocation.amount} ₸`,
        },
    ]
    const totalPages = Math.max(1, Math.ceil(allocations.length / ITEMS_PER_PAGE))
    const normalizedCurrentPage = Math.min(currentPage, totalPages)
    const startIndex = (normalizedCurrentPage - 1) * ITEMS_PER_PAGE
    const paginatedAllocations = allocations.slice(
        startIndex,
        startIndex + ITEMS_PER_PAGE,
    )

    return (
        <section className={styles.managerPage}>
            <header className={`${styles.managerPage__header} ${styles.managerPage__headerWithBack}`}>
                <div className={styles.managerPage__headerActions}>
                    <BackButton fallbackTo={ADMIN_ROUTE_PATHS.contracts} />
                </div>
                <div className={styles.managerPage__headerContent}>
                    <h1 className={styles.managerPage__title}>
                        Contract {contract.contractNumber}
                    </h1>
                    <p className={styles.managerPage__subtitle}>
                        Supplier: {supplier?.name}
                    </p>
                </div>
            </header>

            <div className={styles.managerPage__content}>
                <article className={styles.managerPage__infoBlock}>
                    <h2 className={styles.managerPage__infoTitle}>Budget Overview</h2>
                    <div className={styles.managerPage__infoGrid}>
                        <div>
                            <p className={styles.managerPage__infoLabel}>Start date</p>
                            <p className={styles.managerPage__infoValue}>{contract.startDate}</p>
                        </div>
                        <div>
                            <p className={styles.managerPage__infoLabel}>End date</p>
                            <p className={styles.managerPage__infoValue}>{contract.endDate}</p>
                        </div>
                        <div>
                            <p className={styles.managerPage__infoLabel}>Limit</p>
                            <p className={styles.managerPage__infoValue}>{contract.limit} ₸</p>
                        </div>
                        <div>
                            <p className={styles.managerPage__infoLabel}>Used</p>
                            <p className={styles.managerPage__infoValue}>{used} ₸</p>
                        </div>
                        <div>
                            <p className={styles.managerPage__infoLabel}>Remaining</p>
                            <p className={styles.managerPage__infoValue}>{remaining} ₸</p>
                        </div>
                        <div>
                            <p className={styles.managerPage__infoLabel}>Utilization</p>
                            <p className={styles.managerPage__infoValue}>{utilization.toFixed(1)}%</p>
                        </div>
                    </div>
                </article>

                <article className={styles.managerPage__infoBlock}>
                    <h2 className={styles.managerPage__infoTitle}>Allocations</h2>
                    <DataTable
                        columns={columns}
                        rows={paginatedAllocations}
                        getRowKey={(allocation) => allocation.id}
                        emptyState="No allocations yet"
                        minWidth={380}
                    />
                    <Pagination
                        currentPage={normalizedCurrentPage}
                        totalPages={totalPages}
                        onPageChange={(nextPage) => {
                            setCurrentPage(Math.max(1, Math.min(nextPage, totalPages)))
                        }}
                        ariaLabel="allocations pagination"
                    />
                </article>
            </div>
        </section>
    )
}
