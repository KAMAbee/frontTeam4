export const RequestStatus = {
    PENDING: 'PENDING',
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED',
    CANCELLED: 'CANCELLED',
} as const

export type RequestStatus = typeof RequestStatus[keyof typeof RequestStatus]

export interface RequestEmployee {
    id: string
    employeeId: string
    name: string
}

export interface TrainingRequest {
    id: string
    sessionId: string
    managerId: string
    status: RequestStatus
    employees: string[]
    employeeDetails?: RequestEmployee[]
    comment: string
    createdAt?: string
    trainingTitle?: string
}

export type Request = TrainingRequest
