export function truncate(text: string, length = 20): string {
    if (text.length <= length) return text;
    return text.slice(0, length) + "...";
}

export function capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
}