import { useMemo, useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
    ApiError,
    createTrainingRequest,
    fetchSessions,
    fetchTrainings,
    fetchUsers,
} from '../../api'
import { MANAGER_ROUTE_PATHS, managerRouteLinks } from '../../app/routePaths'
import { BackButton } from '../../components/BackButton'
import { DateTimeRangeBadge } from '../../components/DateTimeBadge'
import { useAsyncData } from '../../hooks'
import { useAuth } from '../../hooks/useAuth'
import { PricingType, UserRole } from '../../types'
import { formatAmount } from '../../utils/formatters'
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

const replaceUsernamesInConflictMessage = (
    rawMessage: string,
    usernamesToFio: Map<string, string>,
): string => {
    if (!/сотрудник|employee/i.test(rawMessage)) {
        return rawMessage
    }

    const separatorIndex = rawMessage.indexOf(':')
    if (separatorIndex < 0) {
        return rawMessage
    }

    const head = rawMessage.slice(0, separatorIndex + 1)
    const tail = rawMessage.slice(separatorIndex + 1).trim()

    if (!tail) {
        return rawMessage
    }

    const replacedTail = tail
        .split(/\s*,\s*/)
        .map((item) => {
            const match = item.match(/^(?<name>[\w.@+-]+)(?<suffix>[^\w.@+-]*)$/u)
            if (!match?.groups?.name) {
                return item
            }

            const normalizedName = match.groups.name.toLowerCase()
            const fio = usernamesToFio.get(normalizedName)
            if (!fio) {
                return item
            }

            return `${fio}${match.groups.suffix || ''}`
        })
        .join(', ')

    return `${head} ${replacedTail}`
}

export const CreateRequestPage = () => {
    const { t } = useTranslation()
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const { user } = useAuth()

    const { data: sessions, isLoading: isSessionsLoading, error: sessionsError } = useAsyncData(
        fetchSessions,
        [],
        [],
    )
    const { data: trainings, isLoading: isTrainingsLoading, error: trainingsError } = useAsyncData(
        fetchTrainings,
        [],
        [],
    )
    const { data: users, isLoading: isUsersLoading, error: usersError } = useAsyncData(fetchUsers, [], [])

    const sessionIdFromQuery = searchParams.get('sessionId')
    const selectedSession = useMemo(
        () => sessions.find((session) => session.id === sessionIdFromQuery) ?? sessions[0],
        [sessionIdFromQuery, sessions],
    )
    const selectedTraining = trainings.find((training) => training.id === selectedSession?.trainingId)

    const apiEmployees = users.filter((candidate) => candidate.role === UserRole.EMPLOYEE)
    const isUsingManualEmployees = apiEmployees.length === 0
    const employeesByUsername = useMemo(
        () =>
            new Map(
                apiEmployees.map((employee) => [employee.username.toLowerCase(), employee.fullName || employee.username]),
            ),
        [apiEmployees],
    )

    const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<string[]>([])
    const [manualEmployeeIds, setManualEmployeeIds] = useState('')
    const [comment, setComment] = useState('')
    const [submitError, setSubmitError] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const parsedManualEmployeeIds = useMemo(
        () => manualEmployeeIds.split(/[\s,]+/).map((item) => item.trim()).filter(Boolean),
        [manualEmployeeIds],
    )

    const participantCount = isUsingManualEmployees
        ? parsedManualEmployeeIds.length
        : selectedEmployeeIds.length

    const totalPrice = useMemo(() => {
        if (!selectedTraining) {
            return 0
        }

        return calculateTotalPrice({
            pricingType: selectedTraining.pricingType,
            basePrice: selectedTraining.price,
            participantCount,
        })
    }, [participantCount, selectedTraining])

    if (!selectedSession || !selectedTraining || !user) {
        return (
            <section className={styles.managerPage}>
                <header className={`${styles.managerPage__header} ${styles.managerPage__headerWithBack}`}>
                    <div className={styles.managerPage__headerActions}>
                        <BackButton fallbackTo={MANAGER_ROUTE_PATHS.trainings} />
                    </div>
                    <div className={styles.managerPage__headerContent}>
                        <h1 className={styles.managerPage__title}>{t('manager.createRequest.unavailableTitle')}</h1>
                        <p className={styles.managerPage__subtitle}>{t('manager.createRequest.unavailableSubtitle')}</p>
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
        setSubmitError(null)
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setSubmitError(null)

        const employeeIds = isUsingManualEmployees ? parsedManualEmployeeIds : selectedEmployeeIds

        if (employeeIds.length === 0) {
            setSubmitError(t('manager.createRequest.errors.noEmployees'))
            return
        }

        try {
            setIsSubmitting(true)

            const createdRequest = await createTrainingRequest({
                sessionId: selectedSession.id,
                employeeIds,
                comment: comment.trim(),
            })

            navigate(managerRouteLinks.requestDetails(createdRequest.id))
        } catch (submissionError) {
            if (submissionError instanceof ApiError) {
                setSubmitError(replaceUsernamesInConflictMessage(submissionError.message, employeesByUsername))
            } else {
                setSubmitError(t('manager.createRequest.errors.submitFailed'))
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <section className={styles.managerPage}>
            <header className={`${styles.managerPage__header} ${styles.managerPage__headerWithBack}`}>
                <div className={styles.managerPage__headerActions}>
                    <BackButton fallbackTo={MANAGER_ROUTE_PATHS.trainings} />
                </div>
                <div className={styles.managerPage__headerContent}>
                    <h1 className={styles.managerPage__title}>{t('manager.createRequest.title')}</h1>
                    <p className={styles.managerPage__subtitle}>{t('manager.createRequest.subtitle')}</p>
                </div>
            </header>

            <article className={styles.managerPage__infoBlock}>
                <h2 className={styles.managerPage__infoTitle}>{t('manager.createRequest.sessionContextTitle')}</h2>
                <p className={styles.managerPage__metaText}>
                    {t('manager.createRequest.trainingRow', { title: selectedTraining.title })}
                </p>
                <p className={styles.managerPage__metaText}>
                    {t('manager.createRequest.sessionRow', { city: selectedSession.city })}
                </p>
                <p className={styles.managerPage__metaText}>
                    {t('manager.createRequest.sessionDateTimeRow')}{' '}
                    <DateTimeRangeBadge
                        startValue={selectedSession.startDate}
                        endValue={selectedSession.endDate}
                    />
                </p>
                <p className={styles.managerPage__metaText}>
                    {t('manager.createRequest.pricingRow', {
                        pricingType: t(`labels.pricingType.${selectedTraining.pricingType}`),
                        basePrice: formatAmount(selectedTraining.price),
                        currency: t('ui.currency.kzt'),
                    })}
                </p>
                {(isSessionsLoading || isTrainingsLoading || isUsersLoading) && (
                    <p className={styles.managerPage__metaText}>{t('manager.createRequest.loading')}</p>
                )}
                {(sessionsError || trainingsError || usersError) && (
                    <p className={styles.managerPage__metaText}>
                        {t('ui.error.withMessage', { error: sessionsError || trainingsError || usersError })}
                    </p>
                )}
            </article>

            <form className={styles.managerPage} onSubmit={handleSubmit}>
                <div>
                    <h2 className={styles.managerPage__sectionTitle}>{t('manager.createRequest.employeesTitle')}</h2>

                    {isUsingManualEmployees ? (
                        <>
                            <p className={styles.managerPage__metaText}>{t('manager.createRequest.manualEmployeesHint')}</p>
                            <textarea
                                className={styles.managerPage__textarea}
                                value={manualEmployeeIds}
                                onChange={(event) => {
                                    setManualEmployeeIds(event.target.value)
                                    setSubmitError(null)
                                }}
                                placeholder={t('manager.createRequest.manualEmployeesPlaceholder')}
                            />
                        </>
                    ) : (
                        <div className={styles.managerPage__selectList}>
                            {apiEmployees.map((employee) => (
                                <label key={employee.id} className={styles.managerPage__checkboxRow}>
                                    <input
                                        type="checkbox"
                                        checked={selectedEmployeeIds.includes(employee.id)}
                                        onChange={() => {
                                            handleEmployeeToggle(employee.id)
                                        }}
                                    />
                                    <span>
                                        {t('manager.createRequest.employeeOption', {
                                            name: employee.fullName,
                                            department: employee.department || t('ui.na'),
                                        })}
                                    </span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                <div>
                    <h2 className={styles.managerPage__sectionTitle}>{t('manager.createRequest.commentTitle')}</h2>
                    <textarea
                        className={styles.managerPage__textarea}
                        value={comment}
                        onChange={(event) => {
                            setComment(event.target.value)
                            setSubmitError(null)
                        }}
                        placeholder={t('manager.createRequest.commentPlaceholder')}
                    />
                </div>

                <article className={styles.managerPage__infoBlock}>
                    <h2 className={styles.managerPage__infoTitle}>{t('manager.createRequest.pricePreviewTitle')}</h2>
                    <p className={styles.managerPage__metaText}>
                        {t('manager.createRequest.selectedEmployees', { count: participantCount })}
                    </p>
                    <p className={styles.managerPage__metaText}>
                        {t('manager.createRequest.estimatedTotal', {
                            amount: formatAmount(totalPrice),
                            currency: t('ui.currency.kzt'),
                        })}
                    </p>
                </article>

                {submitError && <p className={styles.managerPage__metaText}>{submitError}</p>}

                <div className={styles.managerPage__formActions}>
                    <button className={styles.managerPage__primaryButton} type="submit" disabled={isSubmitting}>
                        {isSubmitting ? t('manager.createRequest.submitting') : t('manager.createRequest.submit')}
                    </button>
                </div>
            </form>
        </section>
    )
}
