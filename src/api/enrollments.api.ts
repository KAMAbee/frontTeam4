import type { MyEnrollment, SessionParticipant } from '../types'
import { API_PATHS } from './config'
import { apiGet, apiPatch } from './http'

interface MyEnrollmentDto {
    id: string
    training_title: string
    start_date: string
    end_date: string
    city?: string | null
    location?: string | null
    is_attended: boolean
    certificate_file: string | null
    certificate_number: string
}

interface SessionParticipantDto {
    enrollment_id: string
    employee: {
        id: string
        fio: string
        email: string
    }
    training_title: string
    start_date: string
    end_date: string
    is_attended: boolean
    certificate_number: string
    certificate_file: string | null
}

export interface UpdateSessionParticipantPayload {
    enrollmentId: string
    isAttended: boolean
    certificateNumber: string
    certificateFile?: File | null
}

export const fetchMyEnrollments = async (): Promise<MyEnrollment[]> => {
    const enrollments = await apiGet<MyEnrollmentDto[]>(API_PATHS.myEnrollments)

    return enrollments.map((enrollment) => ({
        id: enrollment.id,
        trainingTitle: enrollment.training_title,
        startDate: enrollment.start_date,
        endDate: enrollment.end_date,
        city: enrollment.city || '',
        location: enrollment.location || '',
        isAttended: enrollment.is_attended,
        certificateFile: enrollment.certificate_file,
        certificateNumber: enrollment.certificate_number,
    }))
}

export const fetchSessionParticipants = async (sessionId: string): Promise<SessionParticipant[]> => {
    const participants = await apiGet<SessionParticipantDto[]>(
        `/api/enrollments/session/${sessionId}/participants/`,
    )

    return participants.map((participant) => ({
        enrollmentId: participant.enrollment_id,
        employeeId: participant.employee.id,
        employeeFio: participant.employee.fio,
        employeeEmail: participant.employee.email,
        trainingTitle: participant.training_title,
        startDate: participant.start_date,
        endDate: participant.end_date,
        isAttended: participant.is_attended,
        certificateNumber: participant.certificate_number,
        certificateFile: participant.certificate_file,
    }))
}

export const updateSessionParticipants = async (
    sessionId: string,
    payload: UpdateSessionParticipantPayload[],
): Promise<SessionParticipant[]> => {
    const hasFiles = payload.some((item) => item.certificateFile instanceof File)
    const normalizedItems = payload.map((item) => ({
        enrollment_id: item.enrollmentId,
        is_attended: item.isAttended,
        certificate_number: item.certificateNumber,
    }))

    let participants: SessionParticipantDto[]

    if (hasFiles) {
        const formData = new FormData()
        formData.append('items', JSON.stringify(normalizedItems))

        payload.forEach((item) => {
            if (item.certificateFile instanceof File) {
                formData.append(`files.${item.enrollmentId}`, item.certificateFile)
            }
        })

        participants = await apiPatch<SessionParticipantDto[]>(
            `/api/enrollments/session/${sessionId}/participants/`,
            formData,
        )
    } else {
        participants = await apiPatch<SessionParticipantDto[]>(
            `/api/enrollments/session/${sessionId}/participants/`,
            normalizedItems,
        )
    }

    return participants.map((participant) => ({
        enrollmentId: participant.enrollment_id,
        employeeId: participant.employee.id,
        employeeFio: participant.employee.fio,
        employeeEmail: participant.employee.email,
        trainingTitle: participant.training_title,
        startDate: participant.start_date,
        endDate: participant.end_date,
        isAttended: participant.is_attended,
        certificateNumber: participant.certificate_number,
        certificateFile: participant.certificate_file,
    }))
}
