import { useParams } from "react-router-dom"

import {
  requestsMock,
  sessionsMock,
  trainingsMock,
  trainingRequestEmployeesMock,
  REQUEST_STATUS_LABELS,
} from "../manager/manager.mock"

import styles from "../../manager/ManagerPages.module.scss"

export const RequestDetailsPage = () => {
  const { id } = useParams()

  const request = requestsMock.find((r) => r.id === id)

  if (!request) {
    return <p>Request not found</p>
  }

  const session = sessionsMock.find((s) => s.id === request.sessionId)

  const training = trainingsMock.find(
    (t) => t.id === session?.trainingId
  )

  const employees = trainingRequestEmployeesMock.filter(
    (e) => e.requestId === request.id
  )

  return (
    <section className={styles.managerPage}>
      <header className={styles.managerPage__header}>
        <div className={styles.managerPage__headerContent}>
          <h1 className={styles.managerPage__title}>
            Request {request.id}
          </h1>
        </div>
      </header>

      <div className={styles.managerPage__content}>
        <p>
          <b>Status:</b> {REQUEST_STATUS_LABELS[request.status]}
        </p>

        <p>
          <b>Training:</b> {training?.title}
        </p>

        <p>
          <b>City:</b> {session?.city}
        </p>

        <h3>Employees</h3>

        <ul>
          {employees.map((emp) => (
            <li key={emp.id}>{emp.name}</li>
          ))}
        </ul>

        <p>
          <b>Comment:</b> {request.comment}
        </p>

        <div style={{ marginTop: 20 }}>
          <button>Approve</button>
          <button style={{ marginLeft: 10 }}>Reject</button>
        </div>
      </div>
    </section>
  )
}
