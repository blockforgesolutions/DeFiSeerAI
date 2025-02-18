type TypographyPProps = {
    paragraph: string,
    color?: string,
    className?: string
}

export function TypographyP({ paragraph, color, className }: TypographyPProps) {
    return (
        <h3 className={`leading-relaxed [&:not(:first-child)]:mt-6 ${color} ${className}`}>
            {paragraph}
        </h3>
    )
}
