import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import {
    ApiError,
    fetchSessionParticipants,
    fetchSessions,
    fetchTrainings,
    updateSessionParticipants,
    type UpdateSessionParticipantPayload,
} from '../../api'
import { API_BASE_URL } from '../../api/config'
import { ADMIN_ROUTE_PATHS } from '../../app/routePaths'
import { BackButton } from '../../components/BackButton'
import { DateTimeBadge } from '../../components/DateTimeBadge'
import { useAsyncData } from '../../hooks'
import type { SessionParticipant } from '../../types'
import styles from '../manager/ManagerPages.module.scss'

export const SessionDetailsPage = () => {
    const { t } = useTranslation()
    const { id } = useParams<{ id: string }>()
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
    const {
        data: participants,
        isLoading: isParticipantsLoading,
        error: participantsError,
        setData: setParticipants,
    } = useAsyncData(
        async () => {
            if (!id) {
                return []
            }

            return fetchSessionParticipants(id)
        },
        [] as SessionParticipant[],
        [id],
    )

    const [editableParticipants, setEditableParticipants] = useState<SessionParticipant[]>([])
    const [certificateFilesByEnrollmentId, setCertificateFilesByEnrollmentId] = useState<
        Record<string, File | null>
    >({})
    const [isSaving, setIsSaving] = useState(false)
    const [saveError, setSaveError] = useState<string | null>(null)
    const [saveSuccess, setSaveSuccess] = useState<string | null>(null)

    useEffect(() => {
        setEditableParticipants(participants)
        setCertificateFilesByEnrollmentId({})
    }, [participants])

    const session = sessions.find((sessionItem) => sessionItem.id === id)
    const training = trainings.find((trainingItem) => trainingItem.id === session?.trainingId)
    const isSessionFinished = session ? new Date(session.endDate).getTime() < Date.now() : false

    if ((isSessionsLoading || isTrainingsLoading) && !session) {
        return <p className={styles.managerPage__metaText}>{t('admin.sessionDetails.loading')}</p>
    }

    if (!session) {
        return (
            <section className={styles.managerPage}>
                <header className={`${styles.managerPage__header} ${styles.managerPage__headerWithBack}`}>
                    <div className={styles.managerPage__headerActions}>
                        <BackButton fallbackTo={ADMIN_ROUTE_PATHS.sessions} />
                    </div>
                    <div className={styles.managerPage__headerContent}>
                        <h1 className={styles.managerPage__title}>{t('admin.sessionDetails.notFoundTitle')}</h1>
                        <p className={styles.managerPage__subtitle}>{t('admin.sessionDetails.notFoundSubtitle')}</p>
                    </div>
                </header>
            </section>
        )
    }

    const handleAttendedChange = (enrollmentId: string, isAttended: boolean) => {
        setEditableParticipants((prev) =>
            prev.map((participant) =>
                participant.enrollmentId === enrollmentId
                    ? { ...participant, isAttended }
                    : participant,
            ),
        )
        setSaveError(null)
        setSaveSuccess(null)
    }

    const handleCertificateChange = (enrollmentId: string, certificateNumber: string) => {
        setEditableParticipants((prev) =>
            prev.map((participant) =>
                participant.enrollmentId === enrollmentId
                    ? { ...participant, certificateNumber }
                    : participant,
            ),
        )
        setSaveError(null)
        setSaveSuccess(null)
    }

    const handleCertificateFileChange = (enrollmentId: string, file: File | null) => {
        setCertificateFilesByEnrollmentId((prev) => ({
            ...prev,
            [enrollmentId]: file,
        }))
        setSaveError(null)
        setSaveSuccess(null)
    }

    const resolveCertificateUrl = (rawUrl: string): string => {
        if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) {
            return rawUrl
        }

        const normalizedPath = rawUrl.startsWith('/') ? rawUrl : `/${rawUrl}`
        return `${API_BASE_URL}${normalizedPath}`
    }

    const handleSaveParticipants = async () => {
        if (!id) {
            return
        }

        try {
            setIsSaving(true)
            setSaveError(null)
            setSaveSuccess(null)

            const payload: UpdateSessionParticipantPayload[] = editableParticipants.map((participant) => ({
                enrollmentId: participant.enrollmentId,
                isAttended: participant.isAttended,
                certificateNumber: participant.certificateNumber,
                certificateFile: certificateFilesByEnrollmentId[participant.enrollmentId] ?? undefined,
            }))

            const updatedParticipants = await updateSessionParticipants(id, payload)
            setParticipants(updatedParticipants)
            setCertificateFilesByEnrollmentId({})
            setSaveSuccess(t('admin.sessionDetails.saveSuccess'))
        } catch (saveActionError) {
            if (saveActionError instanceof ApiError) {
                setSaveError(saveActionError.message)
            } else {
                setSaveError(t('admin.sessionDetails.saveError'))
            }
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <section className={styles.managerPage}>
            <header className={`${styles.managerPage__header} ${styles.managerPage__headerWithBack}`}>
                <div className={styles.managerPage__headerActions}>
                    <BackButton fallbackTo={ADMIN_ROUTE_PATHS.sessions} />
                </div>
                <div className={styles.managerPage__headerContent}>
                    <h1 className={styles.managerPage__title}>{t('admin.sessionDetails.title')}</h1>
                    <p className={styles.managerPage__subtitle}>
                        {t('admin.sessionDetails.subtitle', {
                            training: training?.title ?? t('admin.sessionDetails.defaultTrainingTitle'),
                            city: session.city,
                        })}
                    </p>
                </div>
            </header>

            <div className={styles.managerPage__infoBlock}>
                <h2 className={styles.managerPage__infoTitle}>{training?.title ?? t('ui.na')}</h2>
                {(isSessionsLoading || isTrainingsLoading) && (
                    <p className={styles.managerPage__metaText}>{t('admin.sessionDetails.loading')}</p>
                )}
                {(sessionsError || trainingsError) && (
                    <p className={styles.managerPage__metaText}>
                        {t('ui.error.withMessage', { error: sessionsError || trainingsError })}
                    </p>
                )}

                <div className={styles.managerPage__infoGrid}>
                    <div>
                        <p className={styles.managerPage__infoLabel}>{t('admin.sessionDetails.fields.city')}</p>
                        <p className={styles.managerPage__infoValue}>{session.city}</p>
                    </div>

                    <div>
                        <p className={styles.managerPage__infoLabel}>{t('admin.sessionDetails.fields.startDate')}</p>
                        <p className={styles.managerPage__infoValue}>
                            <DateTimeBadge value={session.startDate} />
                        </p>
                    </div>

                    <div>
                        <p className={styles.managerPage__infoLabel}>{t('admin.sessionDetails.fields.endDate')}</p>
                        <p className={styles.managerPage__infoValue}>
                            <DateTimeBadge value={session.endDate} tone="end" />
                        </p>
                    </div>

                    <div>
                        <p className={styles.managerPage__infoLabel}>{t('admin.sessionDetails.fields.capacity')}</p>
                        <p className={styles.managerPage__infoValue}>{session.capacity}</p>
                    </div>
                </div>
            </div>

            <div className={styles.managerPage__infoBlock}>
                <h2 className={styles.managerPage__infoTitle}>{t('admin.sessionDetails.participantsTitle')}</h2>

                {isParticipantsLoading && (
                    <p className={styles.managerPage__metaText}>{t('admin.sessionDetails.participantsLoading')}</p>
                )}
                {participantsError && (
                    <p className={styles.managerPage__metaText}>
                        {t('ui.error.withMessage', { error: participantsError })}
                    </p>
                )}
                {!isSessionFinished && (
                    <p className={styles.managerPage__metaText}>{t('admin.sessionDetails.notFinishedHint')}</p>
                )}

                {editableParticipants.length === 0 ? (
                    <p className={styles.managerPage__metaText}>{t('admin.sessionDetails.noParticipants')}</p>
                ) : (
                    <div className={styles.managerPage__participantsTableWrap}>
                        <table className={styles.managerPage__participantsTable}>
                            <thead>
                                <tr>
                                    <th>{t('admin.sessionDetails.table.employee')}</th>
                                    <th>{t('admin.sessionDetails.table.email')}</th>
                                    <th>{t('admin.sessionDetails.table.attended')}</th>
                                    <th>{t('admin.sessionDetails.table.certificate')}</th>
                                    <th>{t('admin.sessionDetails.table.certificateFile')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {editableParticipants.map((participant) => (
                                    <tr key={participant.enrollmentId}>
                                        <td>{participant.employeeFio}</td>
                                        <td>{participant.employeeEmail}</td>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={participant.isAttended}
                                                disabled={!isSessionFinished || isSaving}
                                                onChange={(event) => {
                                                    handleAttendedChange(
                                                        participant.enrollmentId,
                                                        event.target.checked,
                                                    )
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                className={styles.managerPage__tableInput}
                                                type="text"
                                                value={participant.certificateNumber}
                                                disabled={!isSessionFinished || isSaving}
                                                onChange={(event) => {
                                                    handleCertificateChange(
                                                        participant.enrollmentId,
                                                        event.target.value,
                                                    )
                                                }}
                                                placeholder={t('admin.sessionDetails.certificatePlaceholder')}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                className={styles.managerPage__tableFileInput}
                                                type="file"
                                                accept=".pdf,image/*"
                                                disabled={!isSessionFinished || isSaving}
                                                onChange={(event) => {
                                                    const nextFile = event.target.files?.[0] || null
                                                    handleCertificateFileChange(
                                                        participant.enrollmentId,
                                                        nextFile,
                                                    )
                                                }}
                                            />
                                            {certificateFilesByEnrollmentId[participant.enrollmentId]?.name && (
                                                <p className={styles.managerPage__tableFileName}>
                                                    {certificateFilesByEnrollmentId[participant.enrollmentId]?.name}
                                                </p>
                                            )}
                                            {participant.certificateFile && (
                                                <a
                                                    className={styles.managerPage__inlineLink}
                                                    href={resolveCertificateUrl(participant.certificateFile)}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    {t('admin.sessionDetails.openCurrentFile')}
                                                </a>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className={styles.managerPage__actionsRow}>
                    <button
                        type="button"
                        className={styles.managerPage__buttonPrimary}
                        onClick={handleSaveParticipants}
                        disabled={isSaving || editableParticipants.length === 0 || !isSessionFinished}
                    >
                        {isSaving ? t('admin.sessionDetails.saving') : t('admin.sessionDetails.save')}
                    </button>
                </div>

                {saveError && <p className={styles.managerPage__metaText}>{saveError}</p>}
                {saveSuccess && <p className={styles.managerPage__metaText}>{saveSuccess}</p>}
            </div>
        </section>
    )
}
