import { formatDate } from '@angular/common';

/**
 * The date picker returns the iso format date, it should be formatted properly before
 * displaying it into the input field.
 *
 * This function accepts the raw date obj or string and format it into 'd MMM yyyy' format.
 *
 * @param date
 * @returns {string}
 */
export function rawToDisplayDate(date: string | Date | undefined): string {
  if (!date) return '';
  const parsedDate = typeof date === 'string' ? new Date(date) : date;
  return !isNaN(parsedDate.getTime())
    ? formatDate(parsedDate, 'd MMM yyyy', 'en-US')
    : '';
}

/**
 * The 'd MMM yyyy' can be used only for displaying purpose. it should be convert into iso or utc format
 * before storing it into the indexDB.
 *
 * This function accepts the formatted date string and returns the iso date string.
 *
 * @param formattedDate
 * @returns {string}
 */
export function displayToRawDate(
  formattedDate: string | undefined
): string | null {
  if (!formattedDate) return null;
  const date = new Date(formattedDate);
  return !isNaN(date.getTime()) ? date.toISOString() : null;
}

/**
 * This function is used to generate unique random id. It will be used to identify the employee from the list.
 *
 * @returns id
 */
export function genUniqueId() {
  const min = 0;
  const max = 9999;

  let id = Math.floor(Math.random() * (max - min + 1)) + min;
  return id.toString().padStart(4, '0');
}
