export const RequestStatus = {
    DRAFT: 'DRAFT',
    PENDING: 'PENDING',
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED',
} as const;

export type RequestStatus = typeof RequestStatus[keyof typeof RequestStatus];

export interface TrainingRequest {
    id: string
    sessionId: string
    managerId: string
    status: RequestStatus
    employees: string[]
    comment: string
}

export type Request = TrainingRequest
