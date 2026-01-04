import { formatTimeRemaining, calculateTimeRemaining } from './time.util';

describe('TimeUtil', () => {
  describe('formatTimeRemaining', () => {
    it('should return null for negative milliseconds', () => {
      expect(formatTimeRemaining(-1000)).toBeNull();
      expect(formatTimeRemaining(0)).toBeNull();
    });

    it('should format days correctly', () => {
      const result = formatTimeRemaining(4 * 24 * 60 * 60 * 1000);
      expect(result).toContain('أيام');
      expect(result).toContain('4');
    });

    it('should format single day correctly', () => {
      const result = formatTimeRemaining(1 * 24 * 60 * 60 * 1000);
      expect(result).toContain('يوم');
      expect(result).not.toContain('أيام');
    });

    it('should format hours correctly', () => {
      const result = formatTimeRemaining(3 * 60 * 60 * 1000);
      expect(result).toContain('ساعات');
      expect(result).toContain('3');
    });

    it('should format single hour correctly', () => {
      const result = formatTimeRemaining(1 * 60 * 60 * 1000);
      expect(result).toContain('ساعة');
      expect(result).not.toContain('ساعات');
    });

    it('should format minutes correctly when no days', () => {
      const result = formatTimeRemaining(30 * 60 * 1000);
      expect(result).toContain('دقائق');
      expect(result).toContain('30');
    });

    it('should format single minute correctly', () => {
      const result = formatTimeRemaining(1 * 60 * 1000);
      expect(result).toContain('دقيقة');
      expect(result).not.toContain('دقائق');
    });

    it('should format seconds correctly when no days or hours', () => {
      const result = formatTimeRemaining(45 * 1000);
      expect(result).toContain('ثواني');
      expect(result).toContain('45');
    });

    it('should format single second correctly', () => {
      const result = formatTimeRemaining(1 * 1000);
      expect(result).toContain('ثانية');
      expect(result).not.toContain('ثواني');
    });

    it('should format days, hours, and minutes together', () => {
      const result = formatTimeRemaining(
        2 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000 + 30 * 60 * 1000
      );
      expect(result).toContain('أيام');
      expect(result).toContain('ساعات');
      expect(result).toContain('2');
      expect(result).toContain('5');
    });

    it('should not show minutes when days are present', () => {
      const result = formatTimeRemaining(
        2 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000
      );
      expect(result).toContain('أيام');
      expect(result).not.toContain('دقائق');
    });

    it('should not show seconds when days or hours are present', () => {
      const result = formatTimeRemaining(
        2 * 24 * 60 * 60 * 1000 + 45 * 1000
      );
      expect(result).toContain('أيام');
      expect(result).not.toContain('ثواني');
    });

    it('should return "أقل من دقيقة" for very small time', () => {
      const result = formatTimeRemaining(500);
      expect(result).toBe('أقل من دقيقة');
    });

    it('should convert hours > 12 to days (18 hours becomes 1 day + 6 hours)', () => {
      const result = formatTimeRemaining(18 * 60 * 60 * 1000);
      expect(result).toContain('يوم');
      expect(result).toContain('6');
      expect(result).toContain('ساعات');
      expect(result).not.toContain('18');
    });

    it('should convert hours > 12 to days (13 hours becomes 1 day + 1 hour)', () => {
      const result = formatTimeRemaining(13 * 60 * 60 * 1000);
      expect(result).toContain('يوم');
      expect(result).toContain('1');
      expect(result).toContain('ساعة');
      expect(result).not.toContain('13');
    });

    it('should not convert 12 hours to days', () => {
      const result = formatTimeRemaining(12 * 60 * 60 * 1000);
      expect(result).toContain('12');
      expect(result).toContain('ساعات');
      expect(result).not.toContain('يوم');
    });

    it('should convert hours > 12 when combined with existing days', () => {
      // 1 day + 18 hours = 2 days + 6 hours after conversion
      const result = formatTimeRemaining(
        1 * 24 * 60 * 60 * 1000 + 18 * 60 * 60 * 1000
      );
      expect(result).toContain('أيام');
      expect(result).toContain('2');
      expect(result).toContain('6');
      expect(result).toContain('ساعات');
      expect(result).not.toContain('18');
    });

    it('should handle 24 hours correctly (should show as 1 day)', () => {
      const result = formatTimeRemaining(24 * 60 * 60 * 1000);
      expect(result).toContain('يوم');
      expect(result).not.toContain('ساعات');
    });
  });

  describe('calculateTimeRemaining', () => {
    it('should return null for null endTime', () => {
      expect(calculateTimeRemaining(null)).toBeNull();
    });

    it('should return null for undefined endTime', () => {
      expect(calculateTimeRemaining(undefined)).toBeNull();
    });

    it('should return null for empty string endTime', () => {
      expect(calculateTimeRemaining('')).toBeNull();
    });

    it('should return null for past date', () => {
      const pastDate = new Date(Date.now() - 1000);
      expect(calculateTimeRemaining(pastDate.toISOString())).toBeNull();
    });

    it('should calculate remaining time for future date', () => {
      const futureDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
      const result = calculateTimeRemaining(futureDate.toISOString());
      expect(result).toBeTruthy();
      expect(result).toContain('أيام');
    });

    it('should use provided currentTime', () => {
      const futureDate = new Date('2026-01-01T13:00:00');
      const currentTime = new Date('2025-12-30T13:00:00');
      const result = calculateTimeRemaining(futureDate.toISOString(), currentTime);
      expect(result).toBeTruthy();
      expect(result).toContain('أيام');
    });

    it('should handle ISO date string format', () => {
      const futureDate = new Date(Date.now() + 3 * 60 * 60 * 1000);
      const result = calculateTimeRemaining(futureDate.toISOString());
      expect(result).toBeTruthy();
      expect(result).toContain('ساعات');
    });
  });
});

