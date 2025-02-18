type TypographyH3Props = {
    title: string,
    color?: string,
    className?: string
}

export function TypographyH3({ title, color, className }: TypographyH3Props) {
    return (
        <h3 className={`scroll-m-20 tracking-tight ${color} ${className}`}>
            {title}
        </h3>
    )
}
