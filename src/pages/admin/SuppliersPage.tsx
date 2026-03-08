import { useNavigate } from 'react-router-dom'
import { useState, useMemo } from 'react'
import { adminRouteLinks } from '../../app/routePaths'
import { DataTable, type DataTableColumn } from '../../components/DataTable'
import { Pagination } from '../../components/Pagination'
import type { Supplier } from '../../types/supplier.types'

import { suppliersMock } from '../manager/manager.mock'
import styles from '../manager/ManagerPages.module.scss'

const ITEMS_PER_PAGE = 7

export const SuppliersPage = () => {
    const navigate = useNavigate()
    const [searchValue, setSearchValue] = useState('')
    const [currentPage, setCurrentPage] = useState(1)

    const filteredSuppliers = useMemo(() => {
        const query = searchValue.trim().toLowerCase()
        if (!query) return suppliersMock

        return suppliersMock.filter((sup) => {
            const combined = [
                sup.name,
                sup.bin,
                sup.contactPerson,
                sup.phone,
                sup.email,
            ]
                .join(' ')
                .toLowerCase()

            return combined.includes(query)
        })
    }, [searchValue])

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
                header: 'Name',
                renderCell: (supplier) => supplier.name,
            },
            {
                key: 'bin',
                header: 'BIN',
                renderCell: (supplier) => supplier.bin,
            },
            {
                key: 'contactPerson',
                header: 'Contact Person',
                renderCell: (supplier) => supplier.contactPerson,
            },
            {
                key: 'phone',
                header: 'Phone',
                renderCell: (supplier) => supplier.phone,
            },
            {
                key: 'email',
                header: 'Email',
                renderCell: (supplier) => supplier.email,
            },
        ],
        [],
    )

    return (
        <section className={styles.managerPage}>
            <header className={styles.managerPage__header}>
                <div className={styles.managerPage__headerContent}>
                    <h1 className={styles.managerPage__title}>Suppliers</h1>
                    <p className={styles.managerPage__subtitle}>
                        All registered training suppliers
                    </p>
                </div>
            </header>

            <input
                className={styles.managerPage__searchInput}
                placeholder="Search suppliers..."
                value={searchValue}
                onChange={(e) => {
                    setSearchValue(e.target.value)
                    setCurrentPage(1)
                }}
            />

            <DataTable
                columns={columns}
                rows={paginatedSuppliers}
                getRowKey={(supplier) => supplier.id}
                emptyState="No suppliers found"
                onRowClick={(supplier) => {
                    navigate(adminRouteLinks.supplierDetails(supplier.id))
                }}
                minWidth={760}
            />

            <Pagination
                currentPage={normalizedCurrentPage}
                totalPages={totalPages}
                onPageChange={(nextPage) => {
                    setCurrentPage(Math.max(1, Math.min(nextPage, totalPages)))
                }}
                ariaLabel="suppliers pagination"
            />
        </section>
    )
}
