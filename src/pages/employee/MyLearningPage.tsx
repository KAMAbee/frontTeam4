import { Link } from 'react-router-dom'
import { useMemo } from 'react'
import { employeeLearningMock } from './employee.mock'
import styles from '../manager/ManagerPages.module.scss'

export const MyLearningPage = () => {
  const today = new Date()

  const { upcoming, history } = useMemo(() => {
    const upcomingItems = employeeLearningMock.filter(
      (item) => new Date(item.startDate!) >= today
    )

    const historyItems = employeeLearningMock.filter(
      (item) => new Date(item.startDate!) < today
    )

    return {
      upcoming: upcomingItems,
      history: historyItems,
    }
  }, [])

  return (
    <section className={styles.managerPage}>
      <header className={styles.managerPage__header}>
        <div className={styles.managerPage__headerContent}>
          <h1 className={styles.managerPage__title}>My Learning</h1>
          <p className={styles.managerPage__subtitle}>
            View your upcoming and completed trainings
          </p>
        </div>
      </header>

      {/* UPCOMING */}
      <article>
        <h2 className={styles.managerPage__sectionTitle}>Upcoming</h2>

        {upcoming.length === 0 ? (
          <p className={styles.managerPage__emptyState}>
            No upcoming trainings.
          </p>
        ) : (
          <div className={styles.managerPage__cardGrid}>
            {upcoming.map((item) => (
              <Link
                key={item.enrollmentId}
                to={`/employee/learning/${item.enrollmentId}`}
                className={styles.managerPage__card}
              >
                <h3 className={styles.managerPage__cardTitle}>
                  {item.trainingTitle}
                </h3>

                <p className={styles.managerPage__cardMeta}>
                  City: {item.city}
                </p>

                <p className={styles.managerPage__cardMeta}>
                  Dates: {item.startDate} – {item.endDate}
                </p>

                <p className={styles.managerPage__cardMeta}>
                  Status: {item.attendanceStatus}
                </p>
              </Link>
            ))}
          </div>
        )}
      </article>

      {/* HISTORY */}
      <article>
        <h2 className={styles.managerPage__sectionTitle}>History</h2>

        {history.length === 0 ? (
          <p className={styles.managerPage__emptyState}>
            No completed trainings yet.
          </p>
        ) : (
          <div className={styles.managerPage__cardGrid}>
            {history.map((item) => (
              <Link
                key={item.enrollmentId}
                to={`/employee/learning/${item.enrollmentId}`}
                className={styles.managerPage__card}
              >
                <h3 className={styles.managerPage__cardTitle}>
                  {item.trainingTitle}
                </h3>

                <p className={styles.managerPage__cardMeta}>
                  City: {item.city}
                </p>

                <p className={styles.managerPage__cardMeta}>
                  Dates: {item.startDate} – {item.endDate}
                </p>

                <p className={styles.managerPage__cardMeta}>
                  Attendance: {item.attendanceStatus}
                </p>

                {item.certificateNumber && (
                  <p className={styles.managerPage__cardMeta}>
                    Certificate: {item.certificateNumber}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </article>
    </section>
  )
}