// src/mocks/mockData.ts

// ======== TRAININGS ========

export const trainings = [
  {
    id: "t1",
    title: "Leadership Essentials",
    description: "Introduction to leadership principles",
  },
  {
    id: "t2",
    title: "Project Management",
    description: "Core PM methodology and tools",
  },
  {
    id: "t3",
    title: "Communication Skills",
    description: "Effective team communication",
  },
];

// ======== TRAINING SESSIONS ========

export const sessions = [
  {
    id: "s1",
    trainingId: "t1",
    city: "Almaty",
    startDate: "2026-03-20",
    endDate: "2026-03-22",
    capacity: 25,
  },
  {
    id: "s2",
    trainingId: "t2",
    city: "Astana",
    startDate: "2026-04-10",
    endDate: "2026-04-12",
    capacity: 20,
  },
  {
    id: "s3",
    trainingId: "t3",
    city: "Shymkent",
    startDate: "2026-05-15",
    endDate: "2026-05-17",
    capacity: 30,
  },
];

// ======== SUPPLIERS ========

export const suppliers = [
  {
    id: "sup1",
    name: "EduPro Training Center",
    bin: "123456789012",
    contactPerson: "Sarah Johnson",
    phone: "+7 777 123 4567",
    email: "contact@edupro.kz",
  },
  {
    id: "sup2",
    name: "SkillWorks Academy",
    bin: "987654321098",
    contactPerson: "Mark Davis",
    phone: "+7 777 222 3344",
    email: "info@skillworks.kz",
  },
];

// ======== CONTRACTS ========

export const contracts = [
  {
    id: "c1",
    supplierId: "sup1",
    contractNumber: "CT-001/2026",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    limit: 1000000,
  },
  {
    id: "c2",
    supplierId: "sup2",
    contractNumber: "CT-002/2026",
    startDate: "2026-02-01",
    endDate: "2026-11-30",
    limit: 750000,
  },
];

// ======== CONTRACT ALLOCATIONS ========

export const contractAllocations = [
  {
    id: "alloc1",
    contractId: "c1",
    requestId: "r1",
    amount: 150000,
  },
  {
    id: "alloc2",
    contractId: "c1",
    requestId: "r2",
    amount: 200000,
  },
  {
    id: "alloc3",
    contractId: "c2",
    requestId: "r3",
    amount: 180000,
  },
];

// ======== TRAINING REQUESTS ========

export const trainingRequests = [
  {
    id: "r1",
    createdAt: "2026-03-01",
    status: "pending",
    manager: "John Miller",
    department: "IT",
    trainingId: "t1",
    sessionId: "s1",
    comment: "",
  },
  {
    id: "r2",
    createdAt: "2026-03-02",
    status: "approved",
    manager: "Laura Smith",
    department: "Finance",
    trainingId: "t2",
    sessionId: "s2",
    comment: "",
  },
  {
    id: "r3",
    createdAt: "2026-03-03",
    status: "rejected",
    manager: "Michael Brown",
    department: "HR",
    trainingId: "t3",
    sessionId: "s3",
    comment: "Budget exceeded",
  },
];

// ======== EMPLOYEES ATTACHED TO REQUESTS ========

export const trainingRequestEmployees = [
  { id: "e1", requestId: "r1", name: "Alice Johnson" },
  { id: "e2", requestId: "r1", name: "Nick Patterson" },
  { id: "e3", requestId: "r2", name: "Maya Richards" },
  { id: "e4", requestId: "r3", name: "Daniel Evans" },
];

// ======== ENROLLMENTS (EMPLOYEE PARTICIPATION IN SESSIONS) ========

export const enrollments = [
  {
    id: "en1",
    employeeName: "Alice Johnson",
    sessionId: "s1",
    status: "planned",
  },
  {
    id: "en2",
    employeeName: "Nick Patterson",
    sessionId: "s1",
    status: "attended",
  },
  {
    id: "en3",
    employeeName: "Maya Richards",
    sessionId: "s2",
    status: "planned",
  },
];

// ======== ATTENDANCE ========

export const attendance = [
  {
    id: "att1",
    enrollmentId: "en2",
    attended: true,
  },
];

// ======== CERTIFICATES ========

export const certificates = [
  {
    id: "cert1",
    enrollmentId: "en2",
    certificateNumber: "C-2026-0001",
    fileUrl: "/certificates/C-2026-0001.pdf",
    issuedDate: "2026-03-23",
  },
];

