import { describe, it, expect } from "vitest";
import { validateLoanApplication, calculateAge, parseDateInput, addBusinessDays } from "../../www/js/lib/loanRules.js";

const valid = {
  monthlyIncome: 15000,
  loanAmount: 50000,
  loanTerm: 12,
  shareCapital: 15000,
  termLimits: { minMonths: 6, maxMonths: 24 },
  hasExistingApplication: false,
};

describe("validateLoanApplication", () => {
  it("accepts a valid application", () => {
    expect(validateLoanApplication(valid)).toEqual([]);
  });

  it("rejects income below ₱5,000", () => {
    expect(validateLoanApplication({ ...valid, monthlyIncome: 4999 })).toHaveLength(1);
  });

  it("accepts income of exactly ₱5,000", () => {
    expect(validateLoanApplication({ ...valid, monthlyIncome: 5000 })).toEqual([]);
  });

  it("rejects a blank income instead of letting NaN slip through", () => {
    expect(validateLoanApplication({ ...valid, monthlyIncome: "" })).toHaveLength(1);
  });

  it("requires ₱20,000 share capital for loans of ₱500,000 or more", () => {
    const large = { ...valid, loanAmount: 500000 };
    expect(validateLoanApplication({ ...large, shareCapital: 19999 })).toHaveLength(1);
    expect(validateLoanApplication({ ...large, shareCapital: 20000 })).toEqual([]);
  });

  it("does not require extra share capital just below ₱500,000", () => {
    expect(validateLoanApplication({ ...valid, loanAmount: 499999, shareCapital: 0 })).toEqual([]);
  });

  it.each([5, 25, 12.5, "abc"])("rejects a term of %s months for a 6–24 month product", (loanTerm) => {
    expect(validateLoanApplication({ ...valid, loanTerm })).toHaveLength(1);
  });

  it.each([6, 24, "12"])("accepts a term of %s months", (loanTerm) => {
    expect(validateLoanApplication({ ...valid, loanTerm })).toEqual([]);
  });

  it("rejects a second application while one is pending", () => {
    expect(validateLoanApplication({ ...valid, hasExistingApplication: true })).toEqual([
      "You already have an existing loan application.",
    ]);
  });

  it("reports every problem at once", () => {
    const errors = validateLoanApplication({
      ...valid,
      monthlyIncome: 100,
      loanTerm: 99,
      hasExistingApplication: true,
    });
    expect(errors).toHaveLength(3);
  });
});

describe("calculateAge", () => {
  const today = new Date(2026, 9, 13); // 13 Oct 2026

  it("counts a birthday earlier this year", () => {
    expect(calculateAge(new Date(1990, 0, 1), today)).toBe(36);
  });

  it("does not count a birthday later this year", () => {
    expect(calculateAge(new Date(1990, 11, 25), today)).toBe(35);
  });

  it("counts a birthday that is today", () => {
    expect(calculateAge(new Date(2008, 9, 13), today)).toBe(18);
  });

  it("does not count a birthday that is tomorrow", () => {
    expect(calculateAge(new Date(2008, 9, 14), today)).toBe(17);
  });
});

describe("parseDateInput", () => {
  it("parses YYYY-MM-DD as a local date, not UTC", () => {
    const d = parseDateInput("1990-05-12");
    expect([d.getFullYear(), d.getMonth(), d.getDate()]).toEqual([1990, 4, 12]);
  });
});

describe("addBusinessDays", () => {
  it("adds weekdays within the same week", () => {
    const monday = new Date(2026, 9, 12);
    expect(addBusinessDays(monday, 3).getDate()).toBe(15); // Thursday
  });

  it("skips the weekend", () => {
    const friday = new Date(2026, 9, 2);
    expect(addBusinessDays(friday, 3).getDate()).toBe(7); // Wednesday
  });

  it("starting on a Saturday, counts from Monday", () => {
    const saturday = new Date(2026, 9, 3);
    expect(addBusinessDays(saturday, 1).getDate()).toBe(5); // Monday
  });

  it("does not modify the date passed in", () => {
    const start = new Date(2026, 9, 12);
    addBusinessDays(start, 3);
    expect(start.getDate()).toBe(12);
  });
});
