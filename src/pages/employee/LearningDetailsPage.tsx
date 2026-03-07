import { useParams } from 'react-router-dom'
import { BackButton } from '../../components/BackButton'
import { EMPLOYEE_ROUTE_PATHS } from '../../app/routePaths'
import { employeeLearningMock } from './employee.mock'
import styles from '../manager/ManagerPages.module.scss'

export const LearningDetailsPage = () => {
  const { enrollmentId } = useParams<{ enrollmentId: string }>()

  const learning = employeeLearningMock.find(
    (item) => item.enrollmentId === enrollmentId
  )

  if (!learning) {
    return <p>Training not found</p>
  }

  return (
    <section className={styles.managerPage}>
      <header
        className={`${styles.managerPage__header} ${styles.managerPage__headerWithBack}`}
      >
        <div className={styles.managerPage__headerActions}>
          <BackButton fallbackTo={EMPLOYEE_ROUTE_PATHS.myLearning} />
        </div>

        <div className={styles.managerPage__headerContent}>
          <h1 className={styles.managerPage__title}>
            {learning.trainingTitle}
          </h1>
        </div>
      </header>

      <article className={styles.managerPage__infoBlock}>
        <div className={styles.managerPage__infoGrid}>
          <div>
            <p className={styles.managerPage__infoLabel}>City</p>
            <p className={styles.managerPage__infoValue}>{learning.city}</p>
          </div>

          <div>
            <p className={styles.managerPage__infoLabel}>Dates</p>
            <p className={styles.managerPage__infoValue}>
              {learning.startDate} – {learning.endDate}
            </p>
          </div>

          <div>
            <p className={styles.managerPage__infoLabel}>Attendance</p>
            <p className={styles.managerPage__infoValue}>
              {learning.attendanceStatus}
            </p>
          </div>
        </div>
      </article>

      {learning.certificateNumber && (
        <article className={styles.managerPage__infoBlock}>
          <h2 className={styles.managerPage__sectionTitle}>Certificate</h2>

          <p className={styles.managerPage__metaText}>
            Certificate number: {learning.certificateNumber}
          </p>

          <p className={styles.managerPage__metaText}>
            Issued at: {learning.certificateDate}
          </p>

          <a
            href={learning.certificateFile}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.managerPage__primaryButton}
          >
            Download certificate
          </a>
        </article>
      )}
    </section>
  )
}