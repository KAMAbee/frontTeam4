import { RequestStatus, type TrainingRequest } from '../types'
import { API_PATHS } from './config'
import { apiGet, apiPost } from './http'

interface TrainingRequestEmployeeDto {
    id: string
    employee: string
    employee_name: string
}

interface TrainingRequestDto {
    id: string
    manager: string
    training_session: string
    training_title: string
    status: string
    comment: string
    created_at: string
    employees: TrainingRequestEmployeeDto[]
}

export interface CreateTrainingRequestPayload {
    sessionId: string
    employeeIds: string[]
    comment: string
}

const normalizeRequestStatus = (status: string): RequestStatus => {
    if (
        status === RequestStatus.PENDING
        || status === RequestStatus.APPROVED
        || status === RequestStatus.REJECTED
        || status === RequestStatus.CANCELLED
    ) {
        return status
    }

    return RequestStatus.PENDING
}

export const mapTrainingRequestDto = (request: TrainingRequestDto): TrainingRequest => ({
    id: request.id,
    sessionId: request.training_session,
    managerId: request.manager,
    status: normalizeRequestStatus(request.status),
    employees: request.employees.map((employee) => employee.employee),
    employeeDetails: request.employees.map((employee) => ({
        id: employee.id,
        employeeId: employee.employee,
        name: employee.employee_name,
    })),
    comment: request.comment,
    createdAt: request.created_at,
    trainingTitle: request.training_title,
})

export const fetchTrainingRequests = async (): Promise<TrainingRequest[]> => {
    const requests = await apiGet<TrainingRequestDto[]>(API_PATHS.trainingRequests)
    return requests.map(mapTrainingRequestDto)
}

export const fetchTrainingRequestById = async (requestId: string): Promise<TrainingRequest> => {
    const request = await apiGet<TrainingRequestDto>(`${API_PATHS.trainingRequests}${requestId}/`)
    return mapTrainingRequestDto(request)
}

export const createTrainingRequest = async (
    payload: CreateTrainingRequestPayload,
): Promise<TrainingRequest> => {
    const request = await apiPost<TrainingRequestDto>(API_PATHS.trainingRequests, {
        training_session: payload.sessionId,
        employee_ids: payload.employeeIds,
        comment: payload.comment,
    })

    return mapTrainingRequestDto(request)
}

export const approveTrainingRequest = async (
    requestId: string,
    contractId: string,
): Promise<TrainingRequest> => {
    const request = await apiPost<TrainingRequestDto>(
        `${API_PATHS.trainingRequests}${requestId}/approve/`,
        { contract: contractId },
    )

    return mapTrainingRequestDto(request)
}

export const rejectTrainingRequest = async (requestId: string): Promise<TrainingRequest> => {
    const request = await apiPost<TrainingRequestDto>(
        `${API_PATHS.trainingRequests}${requestId}/reject/`,
        {},
    )

    return mapTrainingRequestDto(request)
}

export const cancelTrainingRequest = async (requestId: string): Promise<TrainingRequest> => {
    const request = await apiPost<TrainingRequestDto>(
        `${API_PATHS.trainingRequests}${requestId}/cancel/`,
        {},
    )

    return mapTrainingRequestDto(request)
}
