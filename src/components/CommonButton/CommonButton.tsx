import type { CSSProperties, ReactNode } from 'react'
import styles from './CommonButton.module.scss'

interface CommonButtonProps {
    children: ReactNode
    onClick?: () => void
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
    width?: string | number
    height?: string | number
    fontSize?: string | number
}

export const CommonButton = ({
    children,
    onClick,
    type = 'button',
    disabled,
    width = '100%',
    height = 'auto',
    fontSize = 16,
}: CommonButtonProps) => {
    const buttonStyle: CSSProperties = {
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        fontSize: typeof fontSize === 'number' ? `${fontSize}px` : fontSize,
    }

    return (
        <button
            className={styles.button}
            onClick={onClick}
            type={type}
            disabled={disabled}
            style={buttonStyle}
        >
            {children}
        </button>
    )
}
