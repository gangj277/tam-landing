const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

function pad(value: number) {
  return String(value).padStart(2, "0");
}

export function nowIso() {
  return new Date().toISOString();
}

export function addHours(dateIso: string, hours: number) {
  return new Date(new Date(dateIso).getTime() + hours * 60 * 60 * 1000).toISOString();
}

export function toKstDateKey(input: string | Date) {
  const source = input instanceof Date ? input : new Date(input);
  const kst = new Date(source.getTime() + KST_OFFSET_MS);
  return `${kst.getUTCFullYear()}-${pad(kst.getUTCMonth() + 1)}-${pad(kst.getUTCDate())}`;
}

export function fromKstDateKey(dateKey: string) {
  return new Date(`${dateKey}T00:00:00.000Z`);
}

export function kstDayOfWeek(input: string | Date) {
  const source = input instanceof Date ? input : new Date(input);
  return new Date(source.getTime() + KST_OFFSET_MS).getUTCDay();
}

export function startOfKstWeek(input: string | Date) {
  const source = input instanceof Date ? input : new Date(input);
  const kst = new Date(source.getTime() + KST_OFFSET_MS);
  const day = kst.getUTCDay();
  const delta = day === 0 ? 6 : day - 1;
  kst.setUTCDate(kst.getUTCDate() - delta);
  return `${kst.getUTCFullYear()}-${pad(kst.getUTCMonth() + 1)}-${pad(kst.getUTCDate())}`;
}

export function endOfKstWeek(input: string | Date) {
  const start = fromKstDateKey(startOfKstWeek(input));
  start.setUTCDate(start.getUTCDate() + 6);
  return `${start.getUTCFullYear()}-${pad(start.getUTCMonth() + 1)}-${pad(start.getUTCDate())}`;
}

export function diffDays(dateA: string, dateB: string) {
  const ms = fromKstDateKey(dateA).getTime() - fromKstDateKey(dateB).getTime();
  return Math.round(ms / (24 * 60 * 60 * 1000));
}

export function previousKstDate(dateKey: string, days = 1) {
  const value = fromKstDateKey(dateKey);
  value.setUTCDate(value.getUTCDate() - days);
  return `${value.getUTCFullYear()}-${pad(value.getUTCMonth() + 1)}-${pad(value.getUTCDate())}`;
}

export function isWeekendKst(input: string | Date) {
  const day = kstDayOfWeek(input);
  return day === 0 || day === 6;
}
