import { useNavigate } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { adminRouteLinks } from '../../app/routePaths'
import { DataTable, type DataTableColumn } from '../../components/DataTable'
import { Pagination } from '../../components/Pagination'

import {
    contractsMock,
    suppliersMock,
    contractAllocationsMock,
} from '../manager/manager.mock'

import styles from '../manager/ManagerPages.module.scss'

const ITEMS_PER_PAGE = 7

export const ContractsPage = () => {
    const navigate = useNavigate()

    const [searchValue, setSearchValue] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const suppliersById = useMemo(
        () => new Map(suppliersMock.map((supplier) => [supplier.id, supplier])),
        [],
    )
    const allocationsByContractId = useMemo(() => {
        const amounts = new Map<string, number>()

        contractAllocationsMock.forEach((allocation) => {
            const currentAmount = amounts.get(allocation.contractId) ?? 0
            amounts.set(allocation.contractId, currentAmount + allocation.amount)
        })

        return amounts
    }, [])

    const filteredContracts = useMemo(() => {
        const query = searchValue.trim().toLowerCase()
        if (!query) return contractsMock

        return contractsMock.filter((ctr) => {
            const supplier = suppliersById.get(ctr.supplierId)

            const combined = [
                supplier?.name,
                ctr.contractNumber,
                ctr.startDate,
                ctr.endDate,
                String(ctr.limit),
            ]
                .join(' ')
                .toLowerCase()

            return combined.includes(query)
        })
    }, [searchValue, suppliersById])

    const totalPages = Math.max(1, Math.ceil(filteredContracts.length / ITEMS_PER_PAGE))
    const normalizedCurrentPage = Math.min(currentPage, totalPages)

    const paginatedContracts = useMemo(() => {
        const startIndex = (normalizedCurrentPage - 1) * ITEMS_PER_PAGE
        return filteredContracts.slice(startIndex, startIndex + ITEMS_PER_PAGE)
    }, [filteredContracts, normalizedCurrentPage])

    const columns = useMemo<DataTableColumn<(typeof contractsMock)[number]>[]>(
        () => [
            {
                key: 'supplier',
                header: 'Supplier',
                renderCell: (contract) => suppliersById.get(contract.supplierId)?.name ?? 'N/A',
            },
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
                renderCell: (contract) =>
                    `${allocationsByContractId.get(contract.id) ?? 0} ₸`,
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
        ],
        [allocationsByContractId, suppliersById],
    )

    return (
        <section className={styles.managerPage}>
            <header className={styles.managerPage__header}>
                <div className={styles.managerPage__headerContent}>
                    <h1 className={styles.managerPage__title}>Contracts</h1>
                    <p className={styles.managerPage__subtitle}>
                        Supplier contracts and budget usage
                    </p>
                </div>
            </header>

            <input
                className={styles.managerPage__searchInput}
                placeholder="Search contracts..."
                value={searchValue}
                onChange={(e) => {
                    setSearchValue(e.target.value)
                    setCurrentPage(1)
                }}
            />

            <DataTable
                columns={columns}
                rows={paginatedContracts}
                getRowKey={(contract) => contract.id}
                emptyState="No contracts found"
                onRowClick={(contract) => {
                    navigate(adminRouteLinks.contractDetails(contract.id))
                }}
                minWidth={960}
            />

            <Pagination
                currentPage={normalizedCurrentPage}
                totalPages={totalPages}
                onPageChange={(nextPage) => {
                    setCurrentPage(Math.max(1, Math.min(nextPage, totalPages)))
                }}
                ariaLabel="contracts pagination"
            />
        </section>
    )
}
