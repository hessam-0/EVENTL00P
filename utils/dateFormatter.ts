import { format } from 'date-fns';

/**
 * Formats a date for user-facing display
 * Example: "24 May 2025, 11:43 AM"
 */
export function formatDisplayDateTime(date: Date | string | null | undefined): string {
  if (!date) return "N/A";
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) {
      console.error("Invalid date input:", date);
      return "Invalid Date";
    }
    return format(d, "dd MMM yyyy, hh:mm a");
  } catch (e) {
    console.error("Error formatting date:", date, e);
    return "Invalid Date";
  }
}

/**
 * Formats a date for datetime-local input fields
 * Example: "2025-05-24T11:43"
 */
export function formatIsoForInput(date: Date | string | null | undefined): string {
  if (!date) return "";
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return "";
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const day = d.getDate().toString().padStart(2, "0");
    const hours = d.getHours().toString().padStart(2, "0");
    const minutes = d.getMinutes().toString().padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  } catch (e) {
    console.error("Error formatting date for input:", date, e);
    return "";
  }
}
