import { formatDate } from '@angular/common';

export function rawToDisplayDate(date: string | Date | undefined): string {
  if (!date) return '';
  const parsedDate = typeof date === 'string' ? new Date(date) : date;
  return !isNaN(parsedDate.getTime())
    ? formatDate(parsedDate, 'd MMM yyyy', 'en-US')
    : '';
}

export function displayToRawDate(
  formattedDate: string | undefined
): string | null {
  if (!formattedDate) return null;
  const date = new Date(formattedDate);
  return !isNaN(date.getTime()) ? date.toISOString() : null;
}
