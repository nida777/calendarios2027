export const YEAR = 2027;

export const MONTH_NAMES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
] as const;

export const WEEKDAY_NAMES = [
  "Dom",
  "Seg",
  "Ter",
  "Qua",
  "Qui",
  "Sex",
  "Sáb",
] as const;

export type Holiday = {
  date: string;
  name: string;
  kind: "national" | "observance";
};

// National dates follow federal law. Movable religious/cultural dates are
// observances: whether they are a holiday or optional leave depends on local
// law and the official calendar of the relevant institution.
export const HOLIDAYS: readonly Holiday[] = [
  { date: "2027-01-01", name: "Confraternização Universal", kind: "national" },
  { date: "2027-02-09", name: "Carnaval", kind: "observance" },
  { date: "2027-03-26", name: "Paixão de Cristo", kind: "observance" },
  { date: "2027-03-28", name: "Páscoa", kind: "observance" },
  { date: "2027-04-21", name: "Tiradentes", kind: "national" },
  { date: "2027-05-01", name: "Dia do Trabalho", kind: "national" },
  { date: "2027-05-27", name: "Corpus Christi", kind: "observance" },
  { date: "2027-09-07", name: "Independência do Brasil", kind: "national" },
  { date: "2027-10-12", name: "Nossa Senhora Aparecida", kind: "national" },
  { date: "2027-11-02", name: "Finados", kind: "national" },
  { date: "2027-11-15", name: "Proclamação da República", kind: "national" },
  {
    date: "2027-11-20",
    name: "Dia Nacional de Zumbi e da Consciência Negra",
    kind: "national",
  },
  { date: "2027-12-25", name: "Natal", kind: "national" },
];

function validateMonth(month: number): void {
  if (!Number.isInteger(month) || month < 0 || month > 11) {
    throw new RangeError("O mês deve ser um número inteiro entre 0 e 11.");
  }
}

function daysInMonth(month: number): number {
  return new Date(Date.UTC(YEAR, month + 1, 0)).getUTCDate();
}

/** Return a Sunday-first calendar grid, including empty cells at both ends. */
export function getMonthDays(month: number): Array<number | null> {
  validateMonth(month);
  const firstWeekday = new Date(Date.UTC(YEAR, month, 1)).getUTCDay();
  const numberOfDays = daysInMonth(month);
  const cells = Math.ceil((firstWeekday + numberOfDays) / 7) * 7;

  return Array.from({ length: cells }, (_, index) => {
    const day = index - firstWeekday + 1;
    return day >= 1 && day <= numberOfDays ? day : null;
  });
}

/** Format a validated day in the fixed year; month is zero-based. */
export function dateKey(month: number, day: number): string {
  validateMonth(month);
  if (!Number.isInteger(day) || day < 1 || day > daysInMonth(month)) {
    throw new RangeError("O dia deve existir no mês escolhido de 2027.");
  }
  return `${YEAR}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function getHolidaysForMonth(month: number): Holiday[] {
  validateMonth(month);
  const monthPrefix = `${YEAR}-${String(month + 1).padStart(2, "0")}-`;
  return HOLIDAYS.filter((holiday) => holiday.date.startsWith(monthPrefix));
}
