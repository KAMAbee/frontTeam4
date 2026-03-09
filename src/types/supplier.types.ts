export interface Supplier {
    id: string
    name: string
    bin: string
    contactPerson: string
    phone: string
    email: string
}

export interface Contract {
    id: string
    supplierId: string
    supplierName?: string
    contractNumber: string
    startDate: string
    endDate: string
    limit: number
    createdAt?: string
}

export interface ContractAnalytics {
    contractId: string
    contractNumber: string
    supplierId: string
    supplierName: string
    supplierBin: string
    totalAmount: number
    spentAmount: number
    remainingAmount: number
    spentPercent: number
    remainingPercent: number
}

export interface BudgetSummary {
    totalContractAmount: number
    allocatedTotal: number
    remainingBudget: number
}
