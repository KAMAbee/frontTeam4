import styles from './CopyableId.module.scss'

interface CopyableIdProps {
    value: string
    headLength?: number
    tailLength?: number
}

const shortenId = (value: string, headLength: number, tailLength: number): string => {
    if (value.length <= headLength + tailLength + 1) {
        return value
    }

    return `${value.slice(0, headLength)}...${value.slice(-tailLength)}`
}

const copyText = async (text: string): Promise<void> => {
    if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text)
        return
    }

    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.setAttribute('readonly', 'true')
    textarea.style.position = 'absolute'
    textarea.style.left = '-9999px'
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
}

export const CopyableId = ({
    value,
    headLength = 8,
    tailLength = 4,
}: CopyableIdProps) => {
    const shortValue = shortenId(value, headLength, tailLength)

    return (
        <button
            type="button"
            className={styles.copyableId}
            title={value}
            onClick={(event) => {
                event.preventDefault()
                event.stopPropagation()
                void copyText(value)
            }}
            aria-label={value}
        >
            {shortValue}
        </button>
    )
}

