/**
 * Converts a UTC time string to a target timezone
 * @param utcTime - time string in "HH:mm" format, e.g., "04:00"
 * @param timeZone - target timezone, e.g., "Asia/Kolkata"
 * @returns formatted time string in target timezone, e.g., "09:30"
 */
export function convertUTCToTimeZone(utcTime: string, timeZone: string): string {
  const [hours, minutes] = utcTime.split(":").map(Number);

  // Create a UTC Date object with today's date
  const now = new Date();
  const utcDate = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    hours,
    minutes
  ));

  // Format the date in target timezone
  const options: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone
  };

  return new Intl.DateTimeFormat("en-US", options).format(utcDate);
}
