import { useEffect, useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { API_BASE_URL } from '../../api/config'
import { ApiError, fetchMyProfileCertificates, updateCurrentUserProfile } from '../../api'
import { DateTimeRangeBadge } from '../../components/DateTimeBadge'
import { useAsyncData } from '../../hooks'
import { useAuth } from '../../hooks/useAuth'
import { UserRole } from '../../types'
import styles from './ManagerPages.module.scss'

export const ProfilePage = () => {
    const { t } = useTranslation()
    const { user, login } = useAuth()
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [isSaving, setIsSaving] = useState(false)
    const [saveError, setSaveError] = useState<string | null>(null)
    const [saveSuccess, setSaveSuccess] = useState<string | null>(null)
    const {
        data: certificates,
        isLoading: isCertificatesLoading,
        error: certificatesError,
    } = useAsyncData(
        async () => {
            if (!user || user.role !== UserRole.EMPLOYEE) {
                return []
            }

            return fetchMyProfileCertificates()
        },
        [],
        [user?.id, user?.role],
    )

    useEffect(() => {
        if (!user) {
            return
        }

        setFirstName(user.firstName)
        setLastName(user.lastName)
    }, [user])

    if (!user) {
        return (
            <section className={styles.managerPage}>
                <header className={styles.managerPage__header}>
                    <div className={styles.managerPage__headerContent}>
                        <h1 className={styles.managerPage__title}>{t('profile.unavailableTitle')}</h1>
                        <p className={styles.managerPage__subtitle}>{t('profile.unavailableSubtitle')}</p>
                    </div>
                </header>
            </section>
        )
    }

    const resolveCertificateUrl = (rawUrl: string): string => {
        if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) {
            return rawUrl
        }

        const normalizedPath = rawUrl.startsWith('/') ? rawUrl : `/${rawUrl}`
        return `${API_BASE_URL}${normalizedPath}`
    }

    const handleSave = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setSaveError(null)
        setSaveSuccess(null)

        const nextFirstName = firstName.trim()
        const nextLastName = lastName.trim()

        if (!nextFirstName || !nextLastName) {
            setSaveError(t('profile.errors.required'))
            return
        }

        try {
            setIsSaving(true)
            const updatedUser = await updateCurrentUserProfile({
                firstName: nextFirstName,
                lastName: nextLastName,
            })

            login(updatedUser)
            setSaveSuccess(t('profile.saveSuccess'))
        } catch (updateError) {
            if (updateError instanceof ApiError) {
                setSaveError(updateError.message)
            } else {
                setSaveError(t('profile.errors.saveFailed'))
            }
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <section className={styles.managerPage}>
            <header className={styles.managerPage__header}>
                <div className={styles.managerPage__headerContent}>
                    <h1 className={styles.managerPage__title}>{t('profile.title')}</h1>
                    <p className={styles.managerPage__subtitle}>{t('profile.subtitle')}</p>
                </div>
            </header>

            <article className={styles.managerPage__infoBlock}>
                <h2 className={styles.managerPage__infoTitle}>{t('profile.editTitle')}</h2>

                <form className={styles.managerPage__inlineForm} onSubmit={handleSave}>
                    <div className={styles.managerPage__formGrid}>
                        <label className={styles.managerPage__field}>
                            <span className={styles.managerPage__fieldLabel}>{t('profile.fields.firstName')}</span>
                            <input
                                className={styles.managerPage__input}
                                value={firstName}
                                onChange={(event) => {
                                    setFirstName(event.target.value)
                                    setSaveError(null)
                                    setSaveSuccess(null)
                                }}
                                maxLength={150}
                            />
                        </label>

                        <label className={styles.managerPage__field}>
                            <span className={styles.managerPage__fieldLabel}>{t('profile.fields.lastName')}</span>
                            <input
                                className={styles.managerPage__input}
                                value={lastName}
                                onChange={(event) => {
                                    setLastName(event.target.value)
                                    setSaveError(null)
                                    setSaveSuccess(null)
                                }}
                                maxLength={150}
                            />
                        </label>
                    </div>

                    <div className={styles.managerPage__formActions}>
                        <button className={styles.managerPage__buttonPrimary} type="submit" disabled={isSaving}>
                            {isSaving ? t('profile.saving') : t('profile.save')}
                        </button>
                    </div>
                </form>

                {saveError && <p className={styles.managerPage__metaText}>{saveError}</p>}
                {saveSuccess && <p className={styles.managerPage__metaText}>{saveSuccess}</p>}
            </article>

            <article className={styles.managerPage__infoBlock}>
                <h2 className={styles.managerPage__infoTitle}>{t('profile.infoTitle')}</h2>
                <div className={styles.managerPage__infoGrid}>
                    <div>
                        <p className={styles.managerPage__infoLabel}>{t('profile.fields.role')}</p>
                        <p className={styles.managerPage__infoValue}>{t(`topbar.roles.${user.role}`)}</p>
                    </div>
                    <div>
                        <p className={styles.managerPage__infoLabel}>{t('profile.fields.department')}</p>
                        <p className={styles.managerPage__infoValue}>{user.department || t('ui.na')}</p>
                    </div>
                    <div>
                        <p className={styles.managerPage__infoLabel}>{t('profile.fields.userId')}</p>
                        <p className={styles.managerPage__infoValue}>{user.id}</p>
                    </div>
                </div>
            </article>

            {user.role === UserRole.EMPLOYEE && (
                <article className={styles.managerPage__infoBlock}>
                    <h2 className={styles.managerPage__infoTitle}>{t('profile.certificates.title')}</h2>

                    {isCertificatesLoading && (
                        <p className={styles.managerPage__metaText}>{t('profile.certificates.loading')}</p>
                    )}
                    {certificatesError && (
                        <p className={styles.managerPage__metaText}>
                            {t('ui.error.withMessage', { error: certificatesError })}
                        </p>
                    )}

                    {certificates.length === 0 ? (
                        <p className={styles.managerPage__metaText}>{t('profile.certificates.empty')}</p>
                    ) : (
                        <ul className={styles.managerPage__list}>
                            {certificates.map((certificate) => (
                                <li key={certificate.id} className={styles.managerPage__listItem}>
                                    <strong>{certificate.trainingTitle}</strong>
                                    <div className={styles.managerPage__dateCell}>
                                        <DateTimeRangeBadge
                                            startValue={certificate.startDate}
                                            endValue={certificate.endDate}
                                        />
                                    </div>
                                    <div>{[certificate.city, certificate.location].filter(Boolean).join(' | ') || t('ui.na')}</div>
                                    <div>
                                        {t('profile.certificates.number')}: {certificate.certificateNumber || t('ui.na')}
                                    </div>
                                    <div>
                                        {certificate.certificateFile ? (
                                            <a
                                                className={styles.managerPage__inlineLink}
                                                href={resolveCertificateUrl(certificate.certificateFile)}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                {t('profile.certificates.openFile')}
                                            </a>
                                        ) : (
                                            t('ui.na')
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </article>
            )}
        </section>
    )
}
