import { afterAll, beforeAll, describe, expect, setSystemTime, test } from 'bun:test';
import {
   DAY_MS,
   formatDateSeparator,
   formatMessageTimestamp,
   formatRelativeTimeLongUnit,
   formatRelativeTimeShortUnit,
   formatTimestamp,
   HOUR_MS,
   isOlderThan24h,
   MINUTE_MS,
   WEEK_MS,
} from './time';

const NOW = new Date('2026-06-15T12:00:00.000Z');
const ago = (ms: number) => new Date(NOW.getTime() - ms).toISOString();

beforeAll(() => setSystemTime(NOW));
afterAll(() => setSystemTime());

describe('isOlderThan24h', () => {
   test('true at or past 24h', () => {
      expect(isOlderThan24h(ago(DAY_MS))).toBe(true);
      expect(isOlderThan24h(ago(DAY_MS + 1))).toBe(true);
   });

   test('false under 24h', () => {
      expect(isOlderThan24h(ago(DAY_MS - 1))).toBe(false);
      expect(isOlderThan24h(ago(HOUR_MS))).toBe(false);
   });
});

describe('formatTimestamp', () => {
   test('sub-minute is "now"', () => {
      expect(formatTimestamp(ago(30_000))).toBe('now');
   });

   test('minutes and hours within the day', () => {
      expect(formatTimestamp(ago(5 * MINUTE_MS))).toBe('5m');
      expect(formatTimestamp(ago(3 * HOUR_MS))).toBe('3h');
   });

   test('yesterday then weekday then date', () => {
      expect(formatTimestamp(ago(DAY_MS))).toBe('Yesterday');
      expect(formatTimestamp(ago(3 * DAY_MS))).toMatch(/^[A-Z][a-z]{2}$/);
      expect(formatTimestamp(ago(10 * DAY_MS))).toMatch(/^[A-Z][a-z]{2} \d{1,2}$/);
   });
});

describe('formatMessageTimestamp', () => {
   test('yesterday, weekday, then month/day', () => {
      expect(formatMessageTimestamp(ago(DAY_MS))).toBe('Yesterday');
      expect(formatMessageTimestamp(ago(3 * DAY_MS))).toMatch(/^[A-Z][a-z]{2}$/);
      expect(formatMessageTimestamp(ago(30 * DAY_MS))).toMatch(/^[A-Z][a-z]{2} \d{1,2}$/);
   });
});

describe('formatDateSeparator', () => {
   test('today and yesterday', () => {
      expect(formatDateSeparator(ago(HOUR_MS))).toBe('Today');
      expect(formatDateSeparator(ago(DAY_MS))).toBe('Yesterday');
   });

   test('adds year past 365 days', () => {
      expect(formatDateSeparator(ago(400 * DAY_MS))).toMatch(/\d{4}$/);
   });
});

describe('formatRelativeTimeShortUnit', () => {
   test('picks the largest fitting unit', () => {
      expect(formatRelativeTimeShortUnit(ago(2 * MINUTE_MS))).toBe('2m');
      expect(formatRelativeTimeShortUnit(ago(5 * HOUR_MS))).toBe('5h');
      expect(formatRelativeTimeShortUnit(ago(3 * DAY_MS))).toBe('3d');
      expect(formatRelativeTimeShortUnit(ago(2 * WEEK_MS))).toBe('2w');
      expect(formatRelativeTimeShortUnit(ago(60 * DAY_MS))).toBe('2mo');
      expect(formatRelativeTimeShortUnit(ago(400 * DAY_MS))).toBe('1y');
   });

   test('sub-minute is "just now"', () => {
      expect(formatRelativeTimeShortUnit(ago(10_000))).toBe('just now');
   });

   test('invalid date is empty string', () => {
      expect(formatRelativeTimeShortUnit('not-a-date')).toBe('');
   });
});

describe('formatRelativeTimeLongUnit', () => {
   test('singular vs plural units', () => {
      expect(formatRelativeTimeLongUnit(ago(MINUTE_MS))).toBe('1 minute ago');
      expect(formatRelativeTimeLongUnit(ago(2 * MINUTE_MS))).toBe('2 minutes ago');
      expect(formatRelativeTimeLongUnit(ago(HOUR_MS))).toBe('1 hour ago');
      expect(formatRelativeTimeLongUnit(ago(DAY_MS))).toBe('1 day ago');
      expect(formatRelativeTimeLongUnit(ago(3 * DAY_MS))).toBe('3 days ago');
   });

   test('past a week switches to a calendar date', () => {
      expect(formatRelativeTimeLongUnit(ago(WEEK_MS))).toMatch(/^[A-Z][a-z]+ \d{1,2}$/);
   });

   test('sub-minute is "just now"', () => {
      expect(formatRelativeTimeLongUnit(ago(10_000))).toBe('just now');
   });
});
