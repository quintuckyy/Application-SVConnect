// Loan application business rules. Pure functions with no DOM or Firebase access,
// so they can be unit tested and shared with server-side validation later.

export const MIN_MONTHLY_INCOME = 5000;
export const LARGE_LOAN_AMOUNT = 500000;
export const LARGE_LOAN_MIN_SHARE_CAPITAL = 20000;
export const MIN_BORROWER_AGE = 18;
export const MAX_BORROWER_AGE = 80;

const toNumber = (value) => (value === "" || value === null || value === undefined ? NaN : Number(value));

/**
 * Returns a list of error messages; an empty list means the application is valid.
 * @param {object} input
 * @param {number|string} input.monthlyIncome
 * @param {number|string} input.loanAmount
 * @param {number|string} input.loanTerm - months
 * @param {number} input.shareCapital - the member's current share capital
 * @param {{minMonths: number, maxMonths: number}} input.termLimits - from loanProducts/{type}
 * @param {boolean} input.hasExistingApplication
 */
export function validateLoanApplication({
  monthlyIncome,
  loanAmount,
  loanTerm,
  shareCapital,
  termLimits,
  hasExistingApplication,
}) {
  const errors = [];
  const income = toNumber(monthlyIncome);
  const amount = toNumber(loanAmount);
  const term = toNumber(loanTerm);

  if (!Number.isFinite(income) || income < MIN_MONTHLY_INCOME) {
    errors.push(`Monthly income must be at least ₱${MIN_MONTHLY_INCOME.toLocaleString("en-US")}.00.`);
  }
  if (!Number.isFinite(amount) || amount <= 0) {
    errors.push("Enter a valid loan amount.");
  } else if (amount >= LARGE_LOAN_AMOUNT && !(Number(shareCapital) >= LARGE_LOAN_MIN_SHARE_CAPITAL)) {
    errors.push(
      `Loans of ₱${LARGE_LOAN_AMOUNT.toLocaleString("en-US")}.00 or more require a share capital of at least ₱${LARGE_LOAN_MIN_SHARE_CAPITAL.toLocaleString("en-US")}.00.`,
    );
  }
  if (!Number.isInteger(term) || term < termLimits.minMonths || term > termLimits.maxMonths) {
    errors.push(`Loan term must be a whole number of months from ${termLimits.minMonths} to ${termLimits.maxMonths}.`);
  }
  if (hasExistingApplication) {
    errors.push("You already have an existing loan application.");
  }
  return errors;
}

// Parse an <input type="date"> value ("YYYY-MM-DD") as a local date.
// new Date("YYYY-MM-DD") would parse it as UTC midnight, which is the previous day west of UTC.
export function parseDateInput(value) {
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, m - 1, d);
}

// Whole years between birthDate and today
export function calculateAge(birthDate, today = new Date()) {
  let age = today.getFullYear() - birthDate.getFullYear();
  const beforeBirthday =
    today.getMonth() < birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate());
  return beforeBirthday ? age - 1 : age;
}

// The date `days` business days after startDate, skipping Saturdays and Sundays
export function addBusinessDays(startDate, days) {
  const date = new Date(startDate);
  let added = 0;
  while (added < days) {
    date.setDate(date.getDate() + 1);
    if (date.getDay() !== 0 && date.getDay() !== 6) added++;
  }
  return date;
}
