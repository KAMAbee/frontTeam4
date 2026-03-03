import { useMemo, useState, type FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { MANAGER_ROUTE_PATHS } from '../../app/routePaths'
import { BackButton } from '../../components/BackButton'
import { PricingType } from '../../types'
import { useAuth } from '../../hooks/useAuth'
import {
    employeeOptions,
    PRICING_TYPE_LABELS,
    sessionsMock,
    trainingsMock,
} from './manager.mock'
import styles from './ManagerPages.module.scss'

interface CalculationInput {
    pricingType: PricingType
    basePrice: number
    participantCount: number
}

const calculateTotalPrice = ({
    pricingType,
    basePrice,
    participantCount,
}: CalculationInput): number => {
    if (pricingType === PricingType.PER_PERSON) {
        return basePrice * participantCount
    }

    return basePrice
}

export const CreateRequestPage = () => {
    const [searchParams] = useSearchParams()
    const { user } = useAuth()

    const sessionIdFromQuery = searchParams.get('sessionId')
    const selectedSession =
        sessionsMock.find((session) => session.id === sessionIdFromQuery) ?? sessionsMock[0]
    const selectedTraining = trainingsMock.find(
        (training) => training.id === selectedSession.trainingId,
    )

    const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<string[]>([])
    const [comment, setComment] = useState('')

    const totalPrice = useMemo(() => {
        if (!selectedTraining) {
            return 0
        }

        return calculateTotalPrice({
            pricingType: selectedTraining.pricingType,
            basePrice: selectedTraining.price,
            participantCount: selectedEmployeeIds.length,
        })
    }, [selectedEmployeeIds.length, selectedTraining])

    if (!selectedTraining || !user) {
        return (
            <section className={styles.managerPage}>
                <header className={`${styles.managerPage__header} ${styles.managerPage__headerWithBack}`}>
                    <div className={styles.managerPage__headerActions}>
                        <BackButton fallbackTo={MANAGER_ROUTE_PATHS.trainings} />
                    </div>
                    <div className={styles.managerPage__headerContent}>
                        <h1 className={styles.managerPage__title}>Cannot create request now</h1>
                        <p className={styles.managerPage__subtitle}>
                            Missing session or user context for request creation.
                        </p>
                    </div>
                </header>
            </section>
        )
    }

    const handleEmployeeToggle = (employeeId: string) => {
        setSelectedEmployeeIds((prev) =>
            prev.includes(employeeId)
                ? prev.filter((existingId) => existingId !== employeeId)
                : [...prev, employeeId],
        )
    }

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        console.log({
            sessionId: selectedSession.id,
            managerId: user.id,
            employees: selectedEmployeeIds,
            comment: comment.trim(),
            pricingType: selectedTraining.pricingType,
            totalPrice,
        })
    }

    return (
        <section className={styles.managerPage}>
            <header className={`${styles.managerPage__header} ${styles.managerPage__headerWithBack}`}>
                <div className={styles.managerPage__headerActions}>
                    <BackButton fallbackTo={MANAGER_ROUTE_PATHS.trainings} />
                </div>
                <div className={styles.managerPage__headerContent}>
                    <h1 className={styles.managerPage__title}>Create Request</h1>
                    <p className={styles.managerPage__subtitle}>
                        Select employees and submit a manager request.
                    </p>
                </div>
            </header>

            <article className={styles.managerPage__infoBlock}>
                <h2 className={styles.managerPage__infoTitle}>Session Context</h2>
                <p className={styles.managerPage__metaText}>Training: {selectedTraining.title}</p>
                <p className={styles.managerPage__metaText}>
                    Session: {selectedSession.city}, {selectedSession.startDate} - {selectedSession.endDate}
                </p>
                <p className={styles.managerPage__metaText}>
                    Pricing: {PRICING_TYPE_LABELS[selectedTraining.pricingType]} | Base: {selectedTraining.price}{' '}
                    USD
                </p>
            </article>

            <form className={styles.managerPage} onSubmit={handleSubmit}>
                <div>
                    <h2 className={styles.managerPage__sectionTitle}>Employees</h2>
                    <div className={styles.managerPage__selectList}>
                        {employeeOptions.map((employee) => (
                            <label key={employee.id} className={styles.managerPage__checkboxRow}>
                                <input
                                    type="checkbox"
                                    checked={selectedEmployeeIds.includes(employee.id)}
                                    onChange={() => {
                                        handleEmployeeToggle(employee.id)
                                    }}
                                />
                                <span>
                                    {employee.fullName} ({employee.department})
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    <h2 className={styles.managerPage__sectionTitle}>Comment</h2>
                    <textarea
                        className={styles.managerPage__textarea}
                        value={comment}
                        onChange={(event) => {
                            setComment(event.target.value)
                        }}
                        placeholder="Add context for approver"
                    />
                </div>

                <article className={styles.managerPage__infoBlock}>
                    <h2 className={styles.managerPage__infoTitle}>Price Preview</h2>
                    <p className={styles.managerPage__metaText}>Selected employees: {selectedEmployeeIds.length}</p>
                    <p className={styles.managerPage__metaText}>Estimated total: {totalPrice} USD</p>
                </article>

                <div className={styles.managerPage__formActions}>
                    <button className={styles.managerPage__primaryButton} type="submit">
                        Submit Request
                    </button>
                </div>
            </form>
        </section>
    )
}
