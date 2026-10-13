// Overdue and penalty rules for an approved loan. Pure: no Firebase, no clock.
// Used by the daily Cloud Function and by the client when Cloud Functions aren't available.

export const GRACE_PERIOD_DAYS = 7;
export const PENALTY_RATE = 0.02; // of the monthly amortization

const DAY_MS = 86_400_000;

/**
 * Decide what should change on an approved loan as of `today`.
 * @param {object} loan - approvedLoans document data
 * @param {Array<{paymentIndex: number}>} payments - paymentHistory documents
 * @param {Date} today
 * @returns {{ dueDate: Date|null, overdue: boolean, updates: object, notifications: Array<{title: string, message: string, type: string}> }}
 */
export function assessLoan(loan, payments, today) {
  const index = Number(loan.dueDateIndex);
  const dueText = Array.isArray(loan.dueDate) ? loan.dueDate[index] : undefined;
  const dueDate = dueText ? new Date(dueText) : null;
  const result = { dueDate, overdue: false, updates: {}, notifications: [] };

  // Fully paid, or no schedule to check against
  if (!dueDate || Number.isNaN(dueDate.getTime())) return result;

  const paid = payments.some((p) => Number(p.paymentIndex) === index);
  if (paid || today <= dueDate) return result;

  result.overdue = true;
  const dueLabel = dueDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  if (loan.isOverDue !== true) {
    result.updates.isOverDue = true;
    result.notifications.push({
      title: "Loan Overdue!",
      message: `⚠️ Your loan payment is overdue! Please settle immediately. Due date: ${dueLabel}`,
      type: "loanOverDue",
    });
  }

  const pastGrace = today.getTime() > dueDate.getTime() + GRACE_PERIOD_DAYS * DAY_MS;
  if (pastGrace && loan.penaltyEligible !== true) {
    result.updates.penaltyEligible = true;
    result.updates.penalties = Math.round(Number(loan.monthlyPayment) * PENALTY_RATE * 100) / 100;
    result.notifications.push({
      title: "Loan Penalty!",
      message: `⚠️ Your loan payment is overdue! A penalty of 2% of your monthly amortization has been applied. Please settle your payment immediately. Due date: ${dueLabel}`,
      type: "loanPenaltyEligible",
    });
  }

  return result;
}
