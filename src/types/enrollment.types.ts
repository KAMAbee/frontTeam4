export interface MyEnrollment {
    id: string
    trainingTitle: string
    startDate: string
    endDate: string
    city: string
    location: string
    isAttended: boolean
    certificateFile: string | null
    certificateNumber: string
}

export interface SessionParticipant {
    enrollmentId: string
    employeeId: string
    employeeFio: string
    employeeEmail: string
    trainingTitle: string
    startDate: string
    endDate: string
    isAttended: boolean
    certificateNumber: string
    certificateFile: string | null
}
