/**
 * Format time remaining in milliseconds to Arabic string
 * @param milliseconds - Time difference in milliseconds
 * @returns Formatted Arabic string (e.g., "4 أيام 3 ساعات 40 دقيقة") or null if time has passed
 */
export function formatTimeRemaining(milliseconds: number): string | null {
  if (milliseconds <= 0) {
    return null;
  }

  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  let days = Math.floor(hours / 24);

  let remainingHours = hours % 24;
  const remainingMinutes = minutes % 60;
  const remainingSeconds = seconds % 60;

  // Convert hours > 12 to days (e.g., 18 hours becomes 1 day + 6 hours)
  if (remainingHours > 12) {
    days += 1;
    remainingHours -= 12;
  }

  const parts: string[] = [];

  if (days > 0) {
    parts.push(`${days} ${days === 1 ? 'يوم' : days > 2 && days < 11 ? `أيام` : 'يوم'}`);
  }
  if (remainingHours > 0) {
    parts.push(`${remainingHours} ${remainingHours === 1 ? 'ساعة' : remainingHours > 2 && remainingHours < 11 ? `ساعات` : 'ساعة'}`);
  }
  if (remainingMinutes > 0 && days === 0) {
    parts.push(`${remainingMinutes} ${remainingMinutes === 1 ? 'دقيقة' : remainingMinutes > 2 && remainingMinutes < 11 ? `دقائق` : 'دقيقة'}`);
  }
  if (remainingSeconds > 0 && days === 0 && remainingHours === 0) {
    parts.push(`${remainingSeconds} ${remainingSeconds === 1 ? 'ثانية' : remainingSeconds > 2 && remainingSeconds < 11 ? `ثواني` : 'ثانية'}`);
  }

  return parts.length > 0 ? parts.join(' ') : 'أقل من دقيقة';
}

/**
 * Calculate remaining time from end date string
 * @param endTimeStr - ISO date string (e.g., "2026-01-01T13:00:00")
 * @param currentTime - Current date (defaults to now)
 * @returns Formatted Arabic string or null if time has passed or endTime is invalid
 */
export function calculateTimeRemaining(
  endTimeStr: string | null | undefined,
  currentTime: Date = new Date()
): string | null {
  if (!endTimeStr) {
    return null;
  }

  const endTime = new Date(endTimeStr);
  const diff = endTime.getTime() - currentTime.getTime();

  return formatTimeRemaining(diff);
}

