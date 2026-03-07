import {
    PricingType,
    RequestStatus,
    type Request,
    type Session,
    type Training,
} from '../../types'

export interface EmployeeOption {
    id: string
    fullName: string
    department: string
}

export const employeeOptions: EmployeeOption[] = [
    { id: 'emp-101', fullName: 'Ariana West', department: 'Engineering' },
    { id: 'emp-102', fullName: 'Noah Reed', department: 'Finance' },
    { id: 'emp-103', fullName: 'Emma Clark', department: 'Operations' },
    { id: 'emp-104', fullName: 'Liam Stone', department: 'Marketing' },
]

export const trainingsMock: Training[] = [
    {
        id: 'tr-001',
        title: 'Agile Leadership Fundamentals',
        type: 'Leadership',
        pricingType: PricingType.PER_GROUP,
        price: 2200,
    },
    {
        id: 'tr-002',
        title: 'Advanced Excel for Analysts',
        type: 'Technical',
        pricingType: PricingType.PER_PERSON,
        price: 190,
    },
    {
        id: 'tr-003',
        title: 'Conflict Resolution at Work',
        type: 'Soft Skills',
        pricingType: PricingType.PER_PERSON,
        price: 160,
    },
    {
        id: 'tr-004',
        title: 'Strategic Communication for Managers',
        type: 'Leadership',
        pricingType: PricingType.PER_PERSON,
        price: 210,
    },
    {
        id: 'tr-005',
        title: 'Data Storytelling Essentials',
        type: 'Technical',
        pricingType: PricingType.PER_PERSON,
        price: 180,
    },
    {
        id: 'tr-006',
        title: 'Time Management for Teams',
        type: 'Soft Skills',
        pricingType: PricingType.PER_GROUP,
        price: 1500,
    },
    {
        id: 'tr-007',
        title: 'Project Risk Management',
        type: 'Technical',
        pricingType: PricingType.PER_PERSON,
        price: 230,
    },
    {
        id: 'tr-008',
        title: 'Negotiation Skills Bootcamp',
        type: 'Soft Skills',
        pricingType: PricingType.PER_PERSON,
        price: 175,
    },
    {
        id: 'tr-009',
        title: 'Performance Review Best Practices',
        type: 'Leadership',
        pricingType: PricingType.PER_GROUP,
        price: 2000,
    },
    {
        id: 'tr-010',
        title: 'Fundamentals of Cyber Awareness',
        type: 'Technical',
        pricingType: PricingType.PER_PERSON,
        price: 140,
    },
    {
        id: 'tr-011',
        title: 'Change Management Workshop',
        type: 'Leadership',
        pricingType: PricingType.PER_GROUP,
        price: 2400,
    },
    {
        id: 'tr-012',
        title: 'Business Writing for Corporate Teams',
        type: 'Soft Skills',
        pricingType: PricingType.PER_PERSON,
        price: 150,
    },
    {
        id: 'tr-013',
        title: 'Lean Process Improvement',
        type: 'Technical',
        pricingType: PricingType.PER_GROUP,
        price: 2600,
    },
    {
        id: 'tr-014',
        title: 'Coaching Conversations for Line Managers',
        type: 'Leadership',
        pricingType: PricingType.PER_PERSON,
        price: 220,
    },
    {
        id: 'tr-015',
        title: 'Customer-Centric Thinking',
        type: 'Soft Skills',
        pricingType: PricingType.PER_PERSON,
        price: 165,
    },
]

export const sessionsMock: Session[] = [
    {
        id: 'sess-001',
        trainingId: 'tr-001',
        startDate: '2026-03-21',
        endDate: '2026-03-22',
        city: 'Almaty',
        capacity: 20,
    },
    {
        id: 'sess-002',
        trainingId: 'tr-001',
        startDate: '2026-04-03',
        endDate: '2026-04-04',
        city: 'Astana',
        capacity: 18,
    },
    {
        id: 'sess-003',
        trainingId: 'tr-002',
        startDate: '2026-03-28',
        endDate: '2026-03-28',
        city: 'Shymkent',
        capacity: 25,
    },
    {
        id: 'sess-004',
        trainingId: 'tr-003',
        startDate: '2026-04-11',
        endDate: '2026-04-11',
        city: 'Karaganda',
        capacity: 30,
    },
    {
        id: 'sess-005',
        trainingId: 'tr-004',
        startDate: '2026-04-18',
        endDate: '2026-04-19',
        city: 'Almaty',
        capacity: 22,
    },
    {
        id: 'sess-006',
        trainingId: 'tr-004',
        startDate: '2026-05-02',
        endDate: '2026-05-03',
        city: 'Astana',
        capacity: 20,
    },
    {
        id: 'sess-007',
        trainingId: 'tr-005',
        startDate: '2026-04-05',
        endDate: '2026-04-05',
        city: 'Atyrau',
        capacity: 24,
    },
    {
        id: 'sess-008',
        trainingId: 'tr-006',
        startDate: '2026-04-09',
        endDate: '2026-04-10',
        city: 'Almaty',
        capacity: 26,
    },
    {
        id: 'sess-009',
        trainingId: 'tr-007',
        startDate: '2026-04-16',
        endDate: '2026-04-16',
        city: 'Pavlodar',
        capacity: 20,
    },
    {
        id: 'sess-010',
        trainingId: 'tr-008',
        startDate: '2026-04-24',
        endDate: '2026-04-24',
        city: 'Aktobe',
        capacity: 28,
    },
    {
        id: 'sess-011',
        trainingId: 'tr-009',
        startDate: '2026-05-06',
        endDate: '2026-05-07',
        city: 'Astana',
        capacity: 18,
    },
    {
        id: 'sess-012',
        trainingId: 'tr-010',
        startDate: '2026-05-12',
        endDate: '2026-05-12',
        city: 'Almaty',
        capacity: 35,
    },
    {
        id: 'sess-013',
        trainingId: 'tr-011',
        startDate: '2026-05-20',
        endDate: '2026-05-21',
        city: 'Karaganda',
        capacity: 16,
    },
    {
        id: 'sess-014',
        trainingId: 'tr-012',
        startDate: '2026-05-25',
        endDate: '2026-05-25',
        city: 'Kostanay',
        capacity: 30,
    },
    {
        id: 'sess-015',
        trainingId: 'tr-013',
        startDate: '2026-06-03',
        endDate: '2026-06-04',
        city: 'Shymkent',
        capacity: 20,
    },
    {
        id: 'sess-016',
        trainingId: 'tr-014',
        startDate: '2026-06-10',
        endDate: '2026-06-10',
        city: 'Almaty',
        capacity: 24,
    },
    {
        id: 'sess-017',
        trainingId: 'tr-015',
        startDate: '2026-06-14',
        endDate: '2026-06-14',
        city: 'Astana',
        capacity: 28,
    },
    {
        id: 'sess-018',
        trainingId: 'tr-005',
        startDate: '2026-06-21',
        endDate: '2026-06-21',
        city: 'Turkistan',
        capacity: 26,
    },
]

export const requestsMock: Request[] = [
    {
        id: 'req-001',
        sessionId: 'sess-001',
        managerId: 'mgr-001',
        status: RequestStatus.PENDING,
        employees: ['emp-101', 'emp-103'],
        comment: 'Team lead onboarding and sprint planning focus.',
    },
    {
        id: 'req-002',
        sessionId: 'sess-003',
        managerId: 'mgr-001',
        status: RequestStatus.APPROVED,
        employees: ['emp-102'],
        comment: 'Financial reporting optimization goal.',
    },
    {
        id: 'req-003',
        sessionId: 'sess-004',
        managerId: 'mgr-001',
        status: RequestStatus.REJECTED,
        employees: ['emp-104', 'emp-103'],
        comment: 'Please prioritize this for Q2 soft-skills roadmap.',
    },
    {
        id: 'req-004',
        sessionId: 'sess-005',
        managerId: 'mgr-001',
        status: RequestStatus.PENDING,
        employees: ['emp-101'],
        comment: 'Manager communication track for new leads.',
    },
    {
        id: 'req-005',
        sessionId: 'sess-006',
        managerId: 'mgr-001',
        status: RequestStatus.DRAFT,
        employees: ['emp-101', 'emp-102'],
        comment: 'Preparing full team nomination list.',
    },
    {
        id: 'req-006',
        sessionId: 'sess-008',
        managerId: 'mgr-001',
        status: RequestStatus.APPROVED,
        employees: ['emp-103', 'emp-104'],
        comment: 'Cross-functional time management initiative.',
    },
    {
        id: 'req-007',
        sessionId: 'sess-009',
        managerId: 'mgr-001',
        status: RequestStatus.PENDING,
        employees: ['emp-102', 'emp-104'],
        comment: 'Risk handling for delivery team.',
    },
    {
        id: 'req-008',
        sessionId: 'sess-010',
        managerId: 'mgr-001',
        status: RequestStatus.REJECTED,
        employees: ['emp-101', 'emp-104'],
        comment: 'Need rescheduling to match sprint plan.',
    },
    {
        id: 'req-009',
        sessionId: 'sess-011',
        managerId: 'mgr-001',
        status: RequestStatus.PENDING,
        employees: ['emp-103'],
        comment: 'Quarterly performance calibration prep.',
    },
    {
        id: 'req-010',
        sessionId: 'sess-012',
        managerId: 'mgr-001',
        status: RequestStatus.APPROVED,
        employees: ['emp-101', 'emp-102', 'emp-103'],
        comment: 'Company-wide security awareness baseline.',
    },
    {
        id: 'req-011',
        sessionId: 'sess-013',
        managerId: 'mgr-001',
        status: RequestStatus.DRAFT,
        employees: ['emp-104'],
        comment: 'Awaiting final approval from department head.',
    },
    {
        id: 'req-012',
        sessionId: 'sess-014',
        managerId: 'mgr-001',
        status: RequestStatus.PENDING,
        employees: ['emp-102', 'emp-103'],
        comment: 'Business writing uplift for client comms.',
    },
    {
        id: 'req-013',
        sessionId: 'sess-015',
        managerId: 'mgr-001',
        status: RequestStatus.APPROVED,
        employees: ['emp-101'],
        comment: 'Process improvement pilot team.',
    },
    {
        id: 'req-014',
        sessionId: 'sess-016',
        managerId: 'mgr-001',
        status: RequestStatus.PENDING,
        employees: ['emp-101', 'emp-104'],
        comment: 'Coaching skills for front-line managers.',
    },
    {
        id: 'req-015',
        sessionId: 'sess-017',
        managerId: 'mgr-001',
        status: RequestStatus.REJECTED,
        employees: ['emp-102'],
        comment: 'Need budget confirmation first.',
    },
    {
        id: 'req-016',
        sessionId: 'sess-018',
        managerId: 'mgr-001',
        status: RequestStatus.PENDING,
        employees: ['emp-103', 'emp-104'],
        comment: 'Customer mindset refresh training.',
    },
    {
        id: 'req-017',
        sessionId: 'sess-002',
        managerId: 'mgr-001',
        status: RequestStatus.APPROVED,
        employees: ['emp-101', 'emp-103'],
        comment: 'Leadership module continuation group.',
    },
    {
        id: 'req-018',
        sessionId: 'sess-007',
        managerId: 'mgr-001',
        status: RequestStatus.PENDING,
        employees: ['emp-102'],
        comment: 'Data storytelling for planning reviews.',
    },
]

export const REQUEST_STATUS_LABELS: Record<RequestStatus, string> = {
    [RequestStatus.DRAFT]: 'Draft',
    [RequestStatus.PENDING]: 'Pending',
    [RequestStatus.APPROVED]: 'Approved',
    [RequestStatus.REJECTED]: 'Rejected',
}

export const PRICING_TYPE_LABELS: Record<PricingType, string> = {
    [PricingType.PER_PERSON]: 'Per person',
    [PricingType.PER_GROUP]: 'Per group',
}
// =============== SUPPLIERS ===============
export const suppliersMock = [
  {
    id: "sup-001",
    name: "EduPro Training Center",
    bin: "123456789012",
    contactPerson: "Sarah Johnson",
    phone: "+7 777 123 4567",
    email: "contact@edupro.kz",
  },
  {
    id: "sup-002",
    name: "SkillWorks Academy",
    bin: "987654321098",
    contactPerson: "Mark Davis",
    phone: "+7 777 222 3344",
    email: "info@skillworks.kz",
  },
];

// =============== CONTRACTS ===============
export const contractsMock = [
  {
    id: "ctr-001",
    supplierId: "sup-001",
    contractNumber: "CT-001/2026",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    limit: 1000000,
  },
  {
    id: "ctr-002",
    supplierId: "sup-002",
    contractNumber: "CT-002/2026",
    startDate: "2026-02-01",
    endDate: "2026-10-31",
    limit: 750000,
  },
];

// =============== CONTRACT ALLOCATIONS ===============
export const contractAllocationsMock = [
  {
    id: "alloc-001",
    contractId: "ctr-001",
    requestId: "req-001",
    amount: 150000,
  },
  {
    id: "alloc-002",
    contractId: "ctr-001",
    requestId: "req-002",
    amount: 250000,
  },
  {
    id: "alloc-003",
    contractId: "ctr-002",
    requestId: "req-003",
    amount: 180000,
  },
];

// =============== REQUEST EMPLOYEES ===============
export const trainingRequestEmployeesMock = [
  { id: "tre-001", requestId: "req-001", employeeId: "emp-101", name: "Ariana West" },
  { id: "tre-002", requestId: "req-001", employeeId: "emp-103", name: "Emma Clark" },

  { id: "tre-003", requestId: "req-002", employeeId: "emp-102", name: "Noah Reed" },

  { id: "tre-004", requestId: "req-003", employeeId: "emp-104", name: "Liam Stone" },
  { id: "tre-005", requestId: "req-003", employeeId: "emp-103", name: "Emma Clark" },
];

// =============== ENROLLMENTS ===============
export const enrollmentsMock = [
  {
    id: "enr-001",
    employeeName: "Ariana West",
    sessionId: "sess-001",
    status: "planned",
  },
  {
    id: "enr-002",
    employeeName: "Emma Clark",
    sessionId: "sess-001",
    status: "attended",
  },
  {
    id: "enr-003",
    employeeName: "Noah Reed",
    sessionId: "sess-003",
    status: "planned",
  },
];

// =============== ATTENDANCE ===============
export const attendanceMock = [
  {
    id: "att-001",
    enrollmentId: "enr-002",
    attended: true,
  },
];

// =============== CERTIFICATES ===============
export const certificatesMock = [
  {
    id: "cert-001",
    enrollmentId: "enr-002",
    certificateNumber: "C-2026-0001",
    fileUrl: "/certificates/C-2026-0001.pdf",
    issuedDate: "2026-03-23",
  },
];
