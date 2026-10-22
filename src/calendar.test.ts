import assert from "node:assert/strict";
import test from "node:test";
import {
  dateKey,
  getHolidaysForMonth,
  getMonthDays,
  HOLIDAYS,
  MONTH_NAMES,
  WEEKDAY_NAMES,
  YEAR,
} from "./calendar.ts";

test("2027 calendar labels cover every month and Sunday-first weekday", () => {
  assert.equal(YEAR, 2027);
  assert.equal(MONTH_NAMES.length, 12);
  assert.equal(MONTH_NAMES[0], "Janeiro");
  assert.equal(MONTH_NAMES[11], "Dezembro");
  assert.deepEqual(WEEKDAY_NAMES, [
    "Dom",
    "Seg",
    "Ter",
    "Qua",
    "Qui",
    "Sex",
    "Sáb",
  ]);
});

// Independently known 2027 month lengths and weekday of each month's first day.
const monthLengths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const firstWeekdays = [5, 1, 1, 4, 6, 2, 4, 0, 3, 5, 1, 3];

for (let month = 0; month < 12; month += 1) {
  test(`${MONTH_NAMES[month]} has correct dates and complete aligned weeks`, () => {
    const cells = getMonthDays(month);
    const days = cells.filter((day): day is number => day !== null);
    assert.equal(cells.length % 7, 0);
    assert.equal(days.length, monthLengths[month]);
    assert.deepEqual(
      days,
      Array.from({ length: monthLengths[month] }, (_, index) => index + 1),
    );
    assert.equal(cells.indexOf(1), firstWeekdays[month]);
    assert.equal(
      cells.indexOf(monthLengths[month]) % 7,
      (firstWeekdays[month] + monthLengths[month] - 1) % 7,
    );
    assert.ok(
      cells.slice(0, firstWeekdays[month]).every((day) => day === null),
    );
    assert.ok(
      cells
        .slice(firstWeekdays[month] + monthLengths[month])
        .every((day) => day === null),
    );
    assert.ok(cells.length >= 28 && cells.length <= 42);
  });
}

test("the complete calendar contains exactly 365 unique dates", () => {
  const dates = MONTH_NAMES.flatMap((_, month) =>
    getMonthDays(month)
      .filter((day): day is number => day !== null)
      .map((day) => dateKey(month, day)),
  );
  assert.equal(dates.length, 365);
  assert.equal(new Set(dates).size, 365);
  assert.equal(dates[0], "2027-01-01");
  assert.equal(dates.at(-1), "2027-12-31");
  assert.ok(!dates.includes("2027-02-29"));
});

test("dateKey pads valid dates and accepts month-end boundaries", () => {
  assert.equal(dateKey(0, 1), "2027-01-01");
  assert.equal(dateKey(1, 28), "2027-02-28");
  assert.equal(dateKey(11, 31), "2027-12-31");
});

test("invalid months are rejected consistently", () => {
  for (const month of [-1, 12, 0.5, Number.NaN, Infinity]) {
    assert.throws(() => getMonthDays(month), RangeError);
    assert.throws(() => getHolidaysForMonth(month), RangeError);
    assert.throws(() => dateKey(month, 1), RangeError);
  }
});

test("invalid days do not silently overflow into another month", () => {
  for (const [month, day] of [
    [0, 0],
    [0, 32],
    [1, 29],
    [3, 31],
    [0, 1.5],
    [0, Number.NaN],
  ]) {
    assert.throws(() => dateKey(month, day), RangeError);
  }
});

test("all nine federal national holidays have correct dates", () => {
  assert.deepEqual(
    HOLIDAYS.filter((holiday) => holiday.kind === "national").map(
      (holiday) => holiday.date,
    ),
    [
      "2027-01-01",
      "2027-04-21",
      "2027-05-01",
      "2027-09-07",
      "2027-10-12",
      "2027-11-02",
      "2027-11-15",
      "2027-11-20",
      "2027-12-25",
    ],
  );
  assert.match(
    HOLIDAYS.find((holiday) => holiday.date === "2027-11-20")?.name ?? "",
    /Consciência Negra/,
  );
});

test("2027 movable dates are observances, not promises of a national holiday", () => {
  assert.deepEqual(
    HOLIDAYS.filter((holiday) => holiday.kind === "observance").map(
      (holiday) => holiday.date,
    ),
    ["2027-02-09", "2027-03-26", "2027-03-28", "2027-05-27"],
  );
  assert.equal(new Date("2027-03-28T12:00:00Z").getUTCDay(), 0);
  assert.equal(new Date("2027-03-26T12:00:00Z").getUTCDay(), 5);
  assert.equal(new Date("2027-05-27T12:00:00Z").getUTCDay(), 4);
});

test("month filtering preserves ordering, covers every date, and supports empty months", () => {
  assert.deepEqual(
    getHolidaysForMonth(2).map((holiday) => holiday.date),
    ["2027-03-26", "2027-03-28"],
  );
  assert.deepEqual(getHolidaysForMonth(5), []);
  assert.equal(getHolidaysForMonth(10).length, 3);
  assert.deepEqual(
    MONTH_NAMES.flatMap((_, month) => getHolidaysForMonth(month)),
    HOLIDAYS,
  );
  assert.equal(
    new Set(HOLIDAYS.map((holiday) => holiday.date)).size,
    HOLIDAYS.length,
  );
  assert.deepEqual(
    HOLIDAYS.map((holiday) => holiday.date),
    HOLIDAYS.map((holiday) => holiday.date).sort(),
  );
  for (const holiday of HOLIDAYS) {
    const [, month, day] = holiday.date.split("-").map(Number);
    assert.equal(dateKey(month - 1, day), holiday.date);
  }
});
