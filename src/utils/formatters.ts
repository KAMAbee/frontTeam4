const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/

const DATE_FORMATTER = new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
})

const TIME_FORMATTER = new Intl.DateTimeFormat('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
})

const KZT_FORMATTER = new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
})

const normalizeDateInput = (rawValue: string): string => {
    if (DATE_ONLY_PATTERN.test(rawValue)) {
        return `${rawValue}T00:00:00`
    }

    return rawValue
}

const toDate = (rawValue: string): Date | null => {
    if (!rawValue) {
        return null
    }

    const parsed = new Date(normalizeDateInput(rawValue))
    if (Number.isNaN(parsed.getTime())) {
        return null
    }

    return parsed
}

export interface DateTimeParts {
    date: string
    time: string
}

export const formatDateTimeParts = (rawValue: string): DateTimeParts => {
    const date = toDate(rawValue)
    if (!date) {
        return {
            date: rawValue || '—',
            time: '--:--',
        }
    }

    return {
        date: DATE_FORMATTER.format(date),
        time: TIME_FORMATTER.format(date),
    }
}

export const formatDateTime = (rawValue: string): string => {
    const parts = formatDateTimeParts(rawValue)
    return `${parts.date}, ${parts.time}`
}

export const formatDateTimeRange = (startValue: string, endValue: string): string => {
    return `${formatDateTime(startValue)} - ${formatDateTime(endValue)}`
}

export const formatMoneyKzt = (value: number): string => {
    return `${KZT_FORMATTER.format(value)}\u00A0\u20b8`
}

export const formatAmount = (value: number): string => {
    return KZT_FORMATTER.format(value)
}
