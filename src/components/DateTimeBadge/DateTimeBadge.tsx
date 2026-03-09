import { formatDateTimeParts } from '../../utils/formatters'
import styles from './DateTimeBadge.module.scss'

interface DateTimeBadgeProps {
    value: string
    tone?: 'default' | 'start' | 'end'
}

interface DateTimeRangeBadgeProps {
    startValue: string
    endValue: string
}

export const DateTimeBadge = ({ value, tone = 'default' }: DateTimeBadgeProps) => {
    const { date, time } = formatDateTimeParts(value)

    const isEndTone = tone === 'end'

    return (
        <span className={styles.dateTimeBadge}>
            <span className={isEndTone ? `${styles.dateChip} ${styles.dateChipEnd}` : styles.dateChip}>{date}</span>
            <span className={isEndTone ? `${styles.timeChip} ${styles.timeChipEnd}` : styles.timeChip}>{time}</span>
        </span>
    )
}

export const DateTimeRangeBadge = ({ startValue, endValue }: DateTimeRangeBadgeProps) => {
    return (
        <span className={styles.range}>
            <DateTimeBadge value={startValue} tone="start" />
            <span className={styles.arrow}>→</span>
            <DateTimeBadge value={endValue} tone="end" />
        </span>
    )
}
