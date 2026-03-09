import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import {
    ApiError,
    createSession,
    createTraining,
    fetchSessions,
    fetchSuppliers,
    fetchTrainings,
} from '../../api'
import { adminRouteLinks } from '../../app/routePaths'
import { DataTable, type DataTableColumn } from '../../components/DataTable'
import { DateTimeRangeBadge } from '../../components/DateTimeBadge'
import { Pagination } from '../../components/Pagination'
import { useAsyncData } from '../../hooks'
import type { PricingType, Session } from '../../types'
import { formatMoneyKzt } from '../../utils/formatters'
import styles from '../manager/ManagerPages.module.scss'

const ITEMS_PER_PAGE = 7
const TRAINING_TYPES = ['SEMINAR', 'TRAINING', 'CERTIFICATION'] as const

interface TrainingFormState {
    supplierId: string
    title: string
    type: (typeof TRAINING_TYPES)[number]
    trainerName: string
    description: string
    pricingType: PricingType
    price: string
}

interface SessionFormState {
    trainingId: string
    startDate: string
    endDate: string
    location: string
    city: string
    capacity: string
}

const parseLocalDateTime = (value: string): Date | null => {
    if (!value) {
        return null
    }

    const parsed = new Date(value)
    if (Number.isNaN(parsed.getTime())) {
        return null
    }

    return parsed
}

export const SessionsPage = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const [searchValue, setSearchValue] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [isCreatingTraining, setIsCreatingTraining] = useState(false)
    const [isCreatingSession, setIsCreatingSession] = useState(false)
    const [trainingCreateError, setTrainingCreateError] = useState<string | null>(null)
    const [sessionCreateError, setSessionCreateError] = useState<string | null>(null)

    const {
        data: sessions,
        isLoading: isSessionsLoading,
        error: sessionsError,
        reload: reloadSessions,
    } = useAsyncData(fetchSessions, [], [])
    const {
        data: trainings,
        isLoading: isTrainingsLoading,
        error: trainingsError,
        reload: reloadTrainings,
    } = useAsyncData(fetchTrainings, [], [])
    const { data: suppliers, isLoading: isSuppliersLoading } = useAsyncData(fetchSuppliers, [], [])

    const [trainingFormState, setTrainingFormState] = useState<TrainingFormState>({
        supplierId: '',
        title: '',
        type: 'TRAINING',
        trainerName: '',
        description: '',
        pricingType: 'PER_PERSON',
        price: '',
    })

    const [sessionFormState, setSessionFormState] = useState<SessionFormState>({
        trainingId: '',
        startDate: '',
        endDate: '',
        location: '',
        city: '',
        capacity: '',
    })

    useEffect(() => {
        if (!trainingFormState.supplierId && suppliers.length > 0) {
            setTrainingFormState((prev) => ({ ...prev, supplierId: suppliers[0].id }))
        }
    }, [suppliers, trainingFormState.supplierId])

    useEffect(() => {
        if (!sessionFormState.trainingId && trainings.length > 0) {
            setSessionFormState((prev) => ({ ...prev, trainingId: trainings[0].id }))
        }
    }, [sessionFormState.trainingId, trainings])

    const trainingsById = useMemo(
        () => new Map(trainings.map((training) => [training.id, training])),
        [trainings],
    )
    const selectedTrainingForSession = trainingsById.get(sessionFormState.trainingId)

    const filteredSessions = useMemo(() => {
        const query = searchValue.trim().toLowerCase()

        if (!query) return sessions

        return sessions.filter((session) => {
            const training = trainingsById.get(session.trainingId)

            const text = [training?.title ?? '', session.city, session.startDate]
                .join(' ')
                .toLowerCase()

            return text.includes(query)
        })
    }, [searchValue, sessions, trainingsById])

    const totalPages = Math.max(1, Math.ceil(filteredSessions.length / ITEMS_PER_PAGE))
    const normalizedCurrentPage = Math.min(currentPage, totalPages)

    const paginatedSessions = useMemo(() => {
        const startIndex = (normalizedCurrentPage - 1) * ITEMS_PER_PAGE
        return filteredSessions.slice(startIndex, startIndex + ITEMS_PER_PAGE)
    }, [filteredSessions, normalizedCurrentPage])

    const columns = useMemo<DataTableColumn<Session>[]>(
        () => [
            {
                key: 'training',
                header: t('admin.sessions.columns.training'),
                renderCell: (session) => trainingsById.get(session.trainingId)?.title ?? t('ui.na'),
            },
            {
                key: 'city',
                header: t('admin.sessions.columns.city'),
                renderCell: (session) => session.city,
            },
            {
                key: 'dates',
                header: t('admin.sessions.columns.dates'),
                renderCell: (session) => (
                    <DateTimeRangeBadge startValue={session.startDate} endValue={session.endDate} />
                ),
            },
            {
                key: 'capacity',
                header: t('admin.sessions.columns.capacity'),
                renderCell: (session) => session.capacity,
            },
        ],
        [t, trainingsById],
    )

    const handleCreateTraining = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setTrainingCreateError(null)

        const price = Number(trainingFormState.price)
        if (
            !trainingFormState.title.trim()
            || !trainingFormState.trainerName.trim()
            || Number.isNaN(price)
            || price <= 0
        ) {
            setTrainingCreateError(t('admin.sessions.trainingForm.validation.required'))
            return
        }

        try {
            setIsCreatingTraining(true)
            await createTraining({
                supplierId: trainingFormState.supplierId,
                title: trainingFormState.title.trim(),
                type: trainingFormState.type,
                trainerName: trainingFormState.trainerName.trim(),
                description: trainingFormState.description.trim(),
                pricingType: trainingFormState.pricingType,
                price,
            })
            setTrainingFormState((prev) => ({
                ...prev,
                title: '',
                trainerName: '',
                description: '',
                price: '',
            }))
            await reloadTrainings()
        } catch (createTrainingError) {
            if (createTrainingError instanceof ApiError) {
                setTrainingCreateError(createTrainingError.message)
            } else {
                setTrainingCreateError(t('admin.sessions.trainingForm.validation.failed'))
            }
        } finally {
            setIsCreatingTraining(false)
        }
    }

    const handleCreateSession = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setSessionCreateError(null)

        const capacity = Number(sessionFormState.capacity)
        const startDate = parseLocalDateTime(sessionFormState.startDate)
        const endDate = parseLocalDateTime(sessionFormState.endDate)
        if (
            !sessionFormState.trainingId
            || !startDate
            || !endDate
            || !sessionFormState.location.trim()
            || !sessionFormState.city.trim()
            || Number.isNaN(capacity)
            || capacity <= 0
        ) {
            setSessionCreateError(t('admin.sessions.sessionForm.validation.required'))
            return
        }

        if (endDate < startDate) {
            setSessionCreateError(t('admin.sessions.sessionForm.validation.range'))
            return
        }

        try {
            setIsCreatingSession(true)
            await createSession({
                trainingId: sessionFormState.trainingId,
                startDate: sessionFormState.startDate,
                endDate: sessionFormState.endDate,
                location: sessionFormState.location.trim(),
                city: sessionFormState.city.trim(),
                capacity,
            })
            setSessionFormState((prev) => ({
                ...prev,
                startDate: '',
                endDate: '',
                location: '',
                city: '',
                capacity: '',
            }))
            await reloadSessions()
        } catch (createSessionError) {
            if (createSessionError instanceof ApiError) {
                setSessionCreateError(createSessionError.message)
            } else {
                setSessionCreateError(t('admin.sessions.sessionForm.validation.failed'))
            }
        } finally {
            setIsCreatingSession(false)
        }
    }

    return (
        <section className={styles.managerPage}>
            <header className={styles.managerPage__header}>
                <div className={styles.managerPage__headerContent}>
                    <h1 className={styles.managerPage__title}>{t('admin.sessions.title')}</h1>
                    <p className={styles.managerPage__subtitle}>{t('admin.sessions.subtitle')}</p>
                </div>
            </header>

            <article className={styles.managerPage__infoBlock}>
                <h2 className={styles.managerPage__infoTitle}>{t('admin.sessions.trainingForm.title')}</h2>
                <form className={styles.managerPage__inlineForm} onSubmit={handleCreateTraining}>
                    <div className={styles.managerPage__formSections}>
                        <section className={styles.managerPage__formSection}>
                            <h3 className={styles.managerPage__formSectionTitle}>
                                {t('admin.sessions.trainingForm.sections.general')}
                            </h3>
                            <div className={styles.managerPage__formGrid}>
                                <label className={styles.managerPage__field}>
                                    <span className={styles.managerPage__fieldLabel}>
                                        {t('admin.sessions.trainingForm.supplier')}
                                    </span>
                                    <select
                                        className={styles.managerPage__select}
                                        value={trainingFormState.supplierId}
                                        onChange={(event) => {
                                            setTrainingFormState((prev) => ({ ...prev, supplierId: event.target.value }))
                                            setTrainingCreateError(null)
                                        }}
                                    >
                                        {suppliers.map((supplier) => (
                                            <option key={supplier.id} value={supplier.id}>
                                                {supplier.name}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                                <label className={styles.managerPage__field}>
                                    <span className={styles.managerPage__fieldLabel}>
                                        {t('admin.sessions.trainingForm.titleField')}
                                    </span>
                                    <input
                                        className={styles.managerPage__input}
                                        value={trainingFormState.title}
                                        onChange={(event) => {
                                            setTrainingFormState((prev) => ({ ...prev, title: event.target.value }))
                                            setTrainingCreateError(null)
                                        }}
                                    />
                                </label>
                                <label className={styles.managerPage__field}>
                                    <span className={styles.managerPage__fieldLabel}>
                                        {t('admin.sessions.trainingForm.type')}
                                    </span>
                                    <select
                                        className={styles.managerPage__select}
                                        value={trainingFormState.type}
                                        onChange={(event) => {
                                            setTrainingFormState((prev) => ({
                                                ...prev,
                                                type: event.target.value as TrainingFormState['type'],
                                            }))
                                            setTrainingCreateError(null)
                                        }}
                                    >
                                        {TRAINING_TYPES.map((type) => (
                                            <option key={type} value={type}>
                                                {t(`admin.sessions.trainingTypes.${type}`)}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                                <label className={styles.managerPage__field}>
                                    <span className={styles.managerPage__fieldLabel}>
                                        {t('admin.sessions.trainingForm.trainer')}
                                    </span>
                                    <input
                                        className={styles.managerPage__input}
                                        value={trainingFormState.trainerName}
                                        onChange={(event) => {
                                            setTrainingFormState((prev) => ({ ...prev, trainerName: event.target.value }))
                                            setTrainingCreateError(null)
                                        }}
                                    />
                                </label>
                            </div>
                        </section>

                        <section className={styles.managerPage__formSection}>
                            <h3 className={styles.managerPage__formSectionTitle}>
                                {t('admin.sessions.trainingForm.sections.pricing')}
                            </h3>
                            <div className={styles.managerPage__formGrid}>
                                <label className={styles.managerPage__field}>
                                    <span className={styles.managerPage__fieldLabel}>
                                        {t('admin.sessions.trainingForm.pricingType')}
                                    </span>
                                    <select
                                        className={styles.managerPage__select}
                                        value={trainingFormState.pricingType}
                                        onChange={(event) => {
                                            setTrainingFormState((prev) => ({
                                                ...prev,
                                                pricingType: event.target.value as TrainingFormState['pricingType'],
                                            }))
                                            setTrainingCreateError(null)
                                        }}
                                    >
                                        <option value="PER_PERSON">{t('labels.pricingType.PER_PERSON')}</option>
                                        <option value="PER_GROUP">{t('labels.pricingType.PER_GROUP')}</option>
                                    </select>
                                </label>
                                <label className={styles.managerPage__field}>
                                    <span className={styles.managerPage__fieldLabel}>
                                        {t('admin.sessions.trainingForm.price')}
                                    </span>
                                    <input
                                        className={styles.managerPage__input}
                                        type="number"
                                        min={0}
                                        step={0.01}
                                        value={trainingFormState.price}
                                        onChange={(event) => {
                                            setTrainingFormState((prev) => ({ ...prev, price: event.target.value }))
                                            setTrainingCreateError(null)
                                        }}
                                    />
                                </label>
                            </div>
                            <p className={styles.managerPage__formSectionHint}>
                                {t('admin.sessions.trainingForm.priceHint', {
                                    pricingType: t(`labels.pricingType.${trainingFormState.pricingType}`),
                                    amount: formatMoneyKzt(Number(trainingFormState.price) || 0),
                                })}
                            </p>
                        </section>
                    </div>

                    <section className={styles.managerPage__formSection}>
                        <h3 className={styles.managerPage__formSectionTitle}>
                            {t('admin.sessions.trainingForm.sections.description')}
                        </h3>
                        <label className={styles.managerPage__field}>
                            <span className={styles.managerPage__fieldLabel}>
                                {t('admin.sessions.trainingForm.description')}
                            </span>
                            <textarea
                                className={styles.managerPage__textarea}
                                value={trainingFormState.description}
                                onChange={(event) => {
                                    setTrainingFormState((prev) => ({ ...prev, description: event.target.value }))
                                }}
                            />
                        </label>
                    </section>

                    <div className={styles.managerPage__formActions}>
                        <button className={styles.managerPage__buttonPrimary} type="submit" disabled={isCreatingTraining}>
                            {isCreatingTraining
                                ? t('admin.sessions.trainingForm.creating')
                                : t('admin.sessions.trainingForm.submit')}
                        </button>
                    </div>
                    {trainingCreateError && <p className={styles.managerPage__metaText}>{trainingCreateError}</p>}
                </form>
            </article>

            <article className={styles.managerPage__infoBlock}>
                <h2 className={styles.managerPage__infoTitle}>{t('admin.sessions.sessionForm.title')}</h2>
                <form className={styles.managerPage__inlineForm} onSubmit={handleCreateSession}>
                    <div className={styles.managerPage__formSections}>
                        <section className={styles.managerPage__formSection}>
                            <h3 className={styles.managerPage__formSectionTitle}>
                                {t('admin.sessions.sessionForm.sections.training')}
                            </h3>
                            <div className={styles.managerPage__formGrid}>
                                <label className={styles.managerPage__field}>
                                    <span className={styles.managerPage__fieldLabel}>
                                        {t('admin.sessions.sessionForm.training')}
                                    </span>
                                    <select
                                        className={styles.managerPage__select}
                                        value={sessionFormState.trainingId}
                                        onChange={(event) => {
                                            setSessionFormState((prev) => ({ ...prev, trainingId: event.target.value }))
                                            setSessionCreateError(null)
                                        }}
                                    >
                                        {trainings.map((training) => (
                                            <option key={training.id} value={training.id}>
                                                {training.title}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                                <label className={styles.managerPage__field}>
                                    <span className={styles.managerPage__fieldLabel}>
                                        {t('admin.sessions.sessionForm.capacity')}
                                    </span>
                                    <input
                                        className={styles.managerPage__input}
                                        type="number"
                                        min={1}
                                        value={sessionFormState.capacity}
                                        onChange={(event) => {
                                            setSessionFormState((prev) => ({ ...prev, capacity: event.target.value }))
                                            setSessionCreateError(null)
                                        }}
                                    />
                                </label>
                            </div>
                            {selectedTrainingForSession && (
                                <p className={styles.managerPage__formSectionHint}>
                                    {t('admin.sessions.sessionForm.selectedTrainingSummary', {
                                        title: selectedTrainingForSession.title,
                                        price: formatMoneyKzt(selectedTrainingForSession.price),
                                    })}
                                </p>
                            )}
                        </section>

                        <section className={styles.managerPage__formSection}>
                            <h3 className={styles.managerPage__formSectionTitle}>
                                {t('admin.sessions.sessionForm.sections.schedule')}
                            </h3>
                            <div className={styles.managerPage__formGrid}>
                                <label className={styles.managerPage__field}>
                                    <span className={styles.managerPage__fieldLabel}>
                                        {t('admin.sessions.sessionForm.startDate')}
                                    </span>
                                    <input
                                        className={styles.managerPage__input}
                                        type="datetime-local"
                                        value={sessionFormState.startDate}
                                        onChange={(event) => {
                                            setSessionFormState((prev) => ({ ...prev, startDate: event.target.value }))
                                            setSessionCreateError(null)
                                        }}
                                    />
                                </label>
                                <label className={styles.managerPage__field}>
                                    <span className={styles.managerPage__fieldLabel}>
                                        {t('admin.sessions.sessionForm.endDate')}
                                    </span>
                                    <input
                                        className={styles.managerPage__input}
                                        type="datetime-local"
                                        value={sessionFormState.endDate}
                                        onChange={(event) => {
                                            setSessionFormState((prev) => ({ ...prev, endDate: event.target.value }))
                                            setSessionCreateError(null)
                                        }}
                                    />
                                </label>
                            </div>
                            <p className={styles.managerPage__formSectionHint}>
                                {t('admin.sessions.sessionForm.scheduleHint')}
                            </p>
                        </section>

                        <section className={styles.managerPage__formSection}>
                            <h3 className={styles.managerPage__formSectionTitle}>
                                {t('admin.sessions.sessionForm.sections.location')}
                            </h3>
                            <div className={styles.managerPage__formGrid}>
                                <label className={styles.managerPage__field}>
                                    <span className={styles.managerPage__fieldLabel}>
                                        {t('admin.sessions.sessionForm.city')}
                                    </span>
                                    <input
                                        className={styles.managerPage__input}
                                        value={sessionFormState.city}
                                        onChange={(event) => {
                                            setSessionFormState((prev) => ({ ...prev, city: event.target.value }))
                                            setSessionCreateError(null)
                                        }}
                                    />
                                </label>
                                <label className={styles.managerPage__field}>
                                    <span className={styles.managerPage__fieldLabel}>
                                        {t('admin.sessions.sessionForm.location')}
                                    </span>
                                    <input
                                        className={styles.managerPage__input}
                                        value={sessionFormState.location}
                                        onChange={(event) => {
                                            setSessionFormState((prev) => ({ ...prev, location: event.target.value }))
                                            setSessionCreateError(null)
                                        }}
                                    />
                                </label>
                            </div>
                        </section>
                    </div>
                    <div className={styles.managerPage__formActions}>
                        <button className={styles.managerPage__buttonPrimary} type="submit" disabled={isCreatingSession}>
                            {isCreatingSession
                                ? t('admin.sessions.sessionForm.creating')
                                : t('admin.sessions.sessionForm.submit')}
                        </button>
                    </div>
                    {sessionCreateError && <p className={styles.managerPage__metaText}>{sessionCreateError}</p>}
                </form>
            </article>

            <input
                className={styles.managerPage__searchInput}
                type="search"
                value={searchValue}
                onChange={(event) => {
                    setSearchValue(event.target.value)
                    setCurrentPage(1)
                }}
                placeholder={t('admin.sessions.searchPlaceholder')}
                aria-label={t('admin.sessions.searchAria')}
            />

            <DataTable
                columns={columns}
                rows={paginatedSessions}
                getRowKey={(session) => session.id}
                emptyState={t('admin.sessions.empty')}
                onRowClick={(session) => {
                    navigate(adminRouteLinks.sessionDetails(session.id))
                }}
                minWidth={700}
            />

            {(isSessionsLoading || isTrainingsLoading || isSuppliersLoading) && (
                <p className={styles.managerPage__metaText}>{t('admin.sessions.loading')}</p>
            )}
            {(sessionsError || trainingsError) && (
                <p className={styles.managerPage__metaText}>
                    {t('ui.error.withMessage', { error: sessionsError || trainingsError })}
                </p>
            )}

            <Pagination
                currentPage={normalizedCurrentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
                ariaLabel={t('ui.pagination.sessionsAria')}
            />
        </section>
    )
}
