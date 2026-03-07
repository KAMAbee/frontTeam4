import { sessionsMock, trainingsMock } from '../manager/manager.mock'

export type AttendanceStatus =
  | 'ATTENDED'
  | 'ABSENT'
  | 'PENDING'

export interface TrainingEnrollment {
  id: string
  employeeId: string
  sessionId: string
  attendanceStatus: AttendanceStatus
  certificateId?: string
}

export interface Certificate {
  id: string
  enrollmentId: string
  certificateNumber: string
  fileUrl: string
  issuedAt: string
}

export const enrollmentsMock: TrainingEnrollment[] = [
  {
    id: 'enr-001',
    employeeId: 'emp-101',
    sessionId: 'sess-001',
    attendanceStatus: 'ATTENDED',
    certificateId: 'cert-001',
  },
  {
    id: 'enr-002',
    employeeId: 'emp-101',
    sessionId: 'sess-003',
    attendanceStatus: 'ATTENDED',
    certificateId: 'cert-002',
  },
  {
    id: 'enr-003',
    employeeId: 'emp-101',
    sessionId: 'sess-005',
    attendanceStatus: 'PENDING',
  },
  {
    id: 'enr-004',
    employeeId: 'emp-101',
    sessionId: 'sess-008',
    attendanceStatus: 'PENDING',
  },
]

export const certificatesMock: Certificate[] = [
  {
    id: 'cert-001',
    enrollmentId: 'enr-001',
    certificateNumber: 'CERT-2026-001',
    fileUrl: '/src/assets/mock-certificates/cert-001.pdf',
    issuedAt: '2026-02-23',
  },
  {
    id: 'cert-002',
    enrollmentId: 'enr-002',
    certificateNumber: 'CERT-2026-014',
    fileUrl: '/src/assets/mock-certificates/cert-002.pdf',
    issuedAt: '2026-02-28',
  },
    {
    id: 'cert-003',
    enrollmentId: 'enr-003',
    certificateNumber: 'CERT-2026-001',
    fileUrl: '/src/assets/mock-certificates/cert-003.pdf',
    issuedAt: '2026-03-2',
  },
    {
    id: 'cert-004',
    enrollmentId: 'enr-004',
    certificateNumber: 'CERT-2026-001',
    fileUrl: '/src/assets/mock-certificates/cert-004.pdf',
    issuedAt: '2026-03-5',
  },
]

export const employeeLearningMock = enrollmentsMock.map((enrollment) => {
  const session = sessionsMock.find((s) => s.id === enrollment.sessionId)
  const training = trainingsMock.find((t) => t.id === session?.trainingId)
  const certificate = certificatesMock.find(
    (c) => c.enrollmentId === enrollment.id,
  )

  return {
    enrollmentId: enrollment.id,
    trainingTitle: training?.title,
    city: session?.city,
    startDate: session?.startDate,
    endDate: session?.endDate,
    attendanceStatus: enrollment.attendanceStatus,
    certificateNumber: certificate?.certificateNumber,
    certificateFile: certificate?.fileUrl,
    certificateDate: certificate?.issuedAt,
  }
})