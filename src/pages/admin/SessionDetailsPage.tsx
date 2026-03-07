import { useParams } from 'react-router-dom'
import { useState } from 'react'
import { BackButton } from '../../components/BackButton'
import { ADMIN_ROUTE_PATHS } from '../../app/routePaths'

import { sessionsMock, trainingsMock, employeeOptions } from '../manager/manager.mock'
import { enrollmentsMock, certificatesMock } from '../employee/employee.mock'

import styles from '../manager/ManagerPages.module.scss'

type Tab = 'enrollments' | 'attendance' | 'certificates'

export const SessionDetailsPage = () => {
  const { id } = useParams<{ id: string }>()

  const [activeTab, setActiveTab] = useState<Tab>('enrollments')

  const session = sessionsMock.find((s) => s.id === id)
  const training = trainingsMock.find((t) => t.id === session?.trainingId)

  const enrollments = enrollmentsMock.filter(
    (e) => e.sessionId === session?.id
  )

  if (!session) {
    return <p>Session not found</p>
  }

  return (
    <section className={styles.managerPage}>
      {/* HEADER WITH BACK */}
      <header
        className={`${styles.managerPage__header} ${styles.managerPage__headerWithBack}`}
      >
        <div className={styles.managerPage__headerActions}>
          <BackButton fallbackTo={ADMIN_ROUTE_PATHS.sessions} />
        </div>

        <div className={styles.managerPage__headerContent}>
          <h1 className={styles.managerPage__title}>Session Details</h1>
        </div>
      </header>

      {/* SESSION INFO */}
      <article className={styles.managerPage__infoBlock}>
        <h2 className={styles.managerPage__infoTitle}>{training?.title}</h2>

        <div className={styles.managerPage__infoGrid}>
          <div>
            <p className={styles.managerPage__infoLabel}>City</p>
            <p className={styles.managerPage__infoValue}>{session.city}</p>
          </div>

          <div>
            <p className={styles.managerPage__infoLabel}>Start Date</p>
            <p className={styles.managerPage__infoValue}>{session.startDate}</p>
          </div>

          <div>
            <p className={styles.managerPage__infoLabel}>End Date</p>
            <p className={styles.managerPage__infoValue}>{session.endDate}</p>
          </div>

          <div>
            <p className={styles.managerPage__infoLabel}>Capacity</p>
            <p className={styles.managerPage__infoValue}>{session.capacity}</p>
          </div>

          <div>
            <p className={styles.managerPage__infoLabel}>Enrollments</p>
            <p className={styles.managerPage__infoValue}>{enrollments.length}</p>
          </div>
        </div>
      </article>

      {/* TABS */}
      <div className={styles.managerPage__tabs}>
        <button
          className={styles.managerPage__primaryButton}
          onClick={() => setActiveTab('enrollments')}
        >
          Enrollments
        </button>

        <button
          className={styles.managerPage__primaryButton}
          onClick={() => setActiveTab('attendance')}
        >
          Attendance
        </button>

        <button
          className={styles.managerPage__primaryButton}
          onClick={() => setActiveTab('certificates')}
        >
          Certificates
        </button>
      </div>

      {/* ENROLLMENTS */}
      {activeTab === 'enrollments' && (
        <article className={styles.managerPage__infoBlock}>
          <h2 className={styles.managerPage__sectionTitle}>Enrollments</h2>

          <ul className={styles.managerPage__list}>
            {enrollments.map((enrollment) => {
              const employee = employeeOptions.find(
                (e) => e.id === enrollment.employeeId
              )

              return (
                <li key={enrollment.id}>
                  {employee?.fullName} ({employee?.department})
                </li>
              )
            })}
          </ul>
        </article>
      )}

      {/* ATTENDANCE */}
      {activeTab === 'attendance' && (
        <article className={styles.managerPage__infoBlock}>
          <h2 className={styles.managerPage__sectionTitle}>Attendance</h2>

          <ul className={styles.managerPage__list}>
            {enrollments.map((enrollment) => {
              const employee = employeeOptions.find(
                (e) => e.id === enrollment.employeeId
              )

              return (
                <li key={enrollment.id}>
                  {employee?.fullName} — {enrollment.attendanceStatus}
                </li>
              )
            })}
          </ul>
        </article>
      )}

      {/* CERTIFICATES */}
      {activeTab === 'certificates' && (
        <article className={styles.managerPage__infoBlock}>
          <h2 className={styles.managerPage__sectionTitle}>Certificates</h2>

          <ul className={styles.managerPage__list}>
            {certificatesMock.map((cert) => {
              const enrollment = enrollmentsMock.find(
                (e) => e.id === cert.enrollmentId
              )

              if (enrollment?.sessionId !== session.id) return null

              const employee = employeeOptions.find(
                (e) => e.id === enrollment.employeeId
              )

              return (
                <li key={cert.id}>
                  {employee?.fullName} — {cert.certificateNumber}

                  <a
                    href={cert.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.managerPage__certificateLink}
                  >
                    View
                  </a>
                </li>
              )
            })}
          </ul>
        </article>
      )}
    </section>
  )
}