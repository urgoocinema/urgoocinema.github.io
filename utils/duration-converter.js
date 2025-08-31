export function durationConverter(minutes) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if(remainingMinutes === 0) {
        return `${hours}ц`;
    }
    return `${hours}ц ${remainingMinutes}мин`;
}