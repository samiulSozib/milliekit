export const convertMinutesToHours = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return `${hours} {{hoursAnd}} ${remainingMinutes} {{minutes}}`;
}