import type { CSSProperties, Key, KeyboardEvent, ReactNode } from 'react'
import styles from './DataTable.module.scss'

export interface DataTableColumn<RowData> {
    key: string
    header: ReactNode
    renderCell: (row: RowData) => ReactNode
    className?: string
    headerClassName?: string
}

interface DataTableProps<RowData> {
    columns: DataTableColumn<RowData>[]
    rows: RowData[]
    getRowKey: (row: RowData) => Key
    emptyState: ReactNode
    onRowClick?: (row: RowData) => void
    rowClassName?: string | ((row: RowData) => string)
    minWidth?: number | string
}

export const DataTable = <RowData,>({
    columns,
    rows,
    getRowKey,
    emptyState,
    onRowClick,
    rowClassName,
    minWidth,
}: DataTableProps<RowData>) => {
    const tableStyle: CSSProperties | undefined =
        minWidth === undefined ? undefined : { minWidth }

    const handleRowKeyDown = (
        event: KeyboardEvent<HTMLTableRowElement>,
        row: RowData,
    ) => {
        if (!onRowClick) {
            return
        }

        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            onRowClick(row)
        }
    }

    return (
        <div className={styles.dataTableWrap}>
            <table className={styles.dataTable} style={tableStyle}>
                <thead>
                    <tr>
                        {columns.map((column) => (
                            <th key={column.key} className={column.headerClassName} scope="col">
                                {column.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.length === 0 ? (
                        <tr>
                            <td className={styles.dataTable__emptyCell} colSpan={columns.length}>
                                {emptyState}
                            </td>
                        </tr>
                    ) : (
                        rows.map((row) => {
                            const resolvedRowClassName =
                                typeof rowClassName === 'function'
                                    ? rowClassName(row)
                                    : (rowClassName ?? '')

                            const rowClasses = [
                                onRowClick ? styles.dataTable__rowInteractive : '',
                                resolvedRowClassName,
                            ]
                                .filter(Boolean)
                                .join(' ')

                            return (
                                <tr
                                    key={getRowKey(row)}
                                    className={rowClasses}
                                    onClick={() => {
                                        onRowClick?.(row)
                                    }}
                                    onKeyDown={(event) => {
                                        handleRowKeyDown(event, row)
                                    }}
                                    role={onRowClick ? 'button' : undefined}
                                    tabIndex={onRowClick ? 0 : undefined}
                                >
                                    {columns.map((column) => (
                                        <td key={column.key} className={column.className}>
                                            {column.renderCell(row)}
                                        </td>
                                    ))}
                                </tr>
                            )
                        })
                    )}
                </tbody>
            </table>
        </div>
    )
}
