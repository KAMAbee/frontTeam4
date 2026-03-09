import type { BudgetSummary, Contract, ContractAnalytics, Supplier } from '../types/supplier.types'
import { API_PATHS } from './config'
import { apiGet, apiPost } from './http'

interface SupplierDto {
    id: string
    name: string
    bin: string
    contact_person: string | null
    phone: string | null
    email: string | null
    created_at: string
}

interface ContractDto {
    id: string
    supplier: string
    supplier_name: string
    contract_number: string
    start_date: string
    end_date: string
    total_amount: string | number
    created_at: string
}

interface ContractAnalyticsDto {
    contract_id: string
    contract_number: string
    supplier: {
        id: string
        name: string
        bin: string
    }
    total_amount: number
    spent_amount: number
    remaining_amount: number
    spent_percent: number
    remaining_percent: number
}

interface BudgetSummaryDto {
    total_contract_amount: number
    allocated_total: number
    remaining_budget: number
}

export interface CreateSupplierPayload {
    name: string
    bin: string
    contactPerson?: string
    phone?: string
    email?: string
}

export interface CreateContractPayload {
    supplierId: string
    contractNumber: string
    startDate: string
    endDate: string
    totalAmount: number
}

const mapSupplierDto = (supplier: SupplierDto): Supplier => ({
    id: supplier.id,
    name: supplier.name,
    bin: supplier.bin,
    contactPerson: supplier.contact_person || '',
    phone: supplier.phone || '',
    email: supplier.email || '',
})

const mapContractDto = (contract: ContractDto): Contract => ({
    id: contract.id,
    supplierId: contract.supplier,
    supplierName: contract.supplier_name,
    contractNumber: contract.contract_number,
    startDate: contract.start_date,
    endDate: contract.end_date,
    limit: Number(contract.total_amount),
    createdAt: contract.created_at,
})

export const fetchSuppliers = async (): Promise<Supplier[]> => {
    const suppliers = await apiGet<SupplierDto[]>(API_PATHS.suppliers)
    return suppliers.map(mapSupplierDto)
}

export const fetchContracts = async (): Promise<Contract[]> => {
    const contracts = await apiGet<ContractDto[]>(API_PATHS.contracts)
    return contracts.map(mapContractDto)
}

export const fetchContractAnalytics = async (contractId: string): Promise<ContractAnalytics> => {
    const analytics = await apiGet<ContractAnalyticsDto>(`${API_PATHS.contracts}${contractId}/analytics/`)

    return {
        contractId: analytics.contract_id,
        contractNumber: analytics.contract_number,
        supplierId: analytics.supplier.id,
        supplierName: analytics.supplier.name,
        supplierBin: analytics.supplier.bin,
        totalAmount: analytics.total_amount,
        spentAmount: analytics.spent_amount,
        remainingAmount: analytics.remaining_amount,
        spentPercent: analytics.spent_percent,
        remainingPercent: analytics.remaining_percent,
    }
}

export const fetchBudgetSummary = async (): Promise<BudgetSummary> => {
    const summary = await apiGet<BudgetSummaryDto>(API_PATHS.budgetSummary)

    return {
        totalContractAmount: summary.total_contract_amount,
        allocatedTotal: summary.allocated_total,
        remainingBudget: summary.remaining_budget,
    }
}

export const createSupplier = async (payload: CreateSupplierPayload): Promise<Supplier> => {
    const supplier = await apiPost<SupplierDto>(API_PATHS.suppliers, {
        name: payload.name,
        bin: payload.bin,
        contact_person: payload.contactPerson || null,
        phone: payload.phone || null,
        email: payload.email || null,
    })

    return mapSupplierDto(supplier)
}

export const createContract = async (payload: CreateContractPayload): Promise<Contract> => {
    const contract = await apiPost<ContractDto>(API_PATHS.contracts, {
        supplier: payload.supplierId,
        contract_number: payload.contractNumber,
        start_date: payload.startDate,
        end_date: payload.endDate,
        total_amount: payload.totalAmount,
    })

    return mapContractDto(contract)
}
