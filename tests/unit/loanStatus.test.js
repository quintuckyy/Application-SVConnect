import { describe, it, expect } from "vitest";
import { assessLoan } from "../../www/js/lib/loanStatus.js";

const loan = {
  dueDate: ["Oct 15, 2026", "Nov 15, 2026", "Dec 15, 2026"],
  dueDateIndex: 0,
  monthlyPayment: 4666.67,
  isOverDue: false,
  penaltyEligible: false,
};
const day = (d) => new Date(2026, 9, d); // October 2026

describe("assessLoan", () => {
  it("does nothing on or before the due date", () => {
    const r = assessLoan(loan, [], day(15));
    expect(r.overdue).toBe(false);
    expect(r.updates).toEqual({});
  });

  it("flags the loan overdue the day after the due date", () => {
    const r = assessLoan(loan, [], day(16));
    expect(r.overdue).toBe(true);
    expect(r.updates).toEqual({ isOverDue: true });
    expect(r.notifications.map((n) => n.type)).toEqual(["loanOverDue"]);
  });

  it("does not notify twice for the same overdue installment", () => {
    const r = assessLoan({ ...loan, isOverDue: true }, [], day(17));
    expect(r.overdue).toBe(true);
    expect(r.notifications).toEqual([]);
  });

  it("applies a 2% penalty once the 7-day grace period has passed", () => {
    const r = assessLoan({ ...loan, isOverDue: true }, [], day(23));
    expect(r.updates).toEqual({ penaltyEligible: true, penalties: 93.33 });
    expect(r.notifications.map((n) => n.type)).toEqual(["loanPenaltyEligible"]);
  });

  it("does not apply the penalty on the last day of the grace period", () => {
    const r = assessLoan({ ...loan, isOverDue: true }, [], new Date(2026, 9, 22, 0, 0));
    expect(r.updates).toEqual({});
  });

  it("does not apply the penalty twice", () => {
    const r = assessLoan({ ...loan, isOverDue: true, penaltyEligible: true }, [], day(30));
    expect(r.updates).toEqual({});
  });

  it("is not overdue when the current installment has been paid", () => {
    const r = assessLoan(loan, [{ paymentIndex: 0 }], day(30));
    expect(r.overdue).toBe(false);
    expect(r.updates).toEqual({});
  });

  it("checks the installment at dueDateIndex, not the first one", () => {
    const r = assessLoan({ ...loan, dueDateIndex: 1 }, [{ paymentIndex: 0 }], day(30));
    expect(r.overdue).toBe(false);
  });

  it("does nothing once every installment is past (loan fully scheduled)", () => {
    const r = assessLoan({ ...loan, dueDateIndex: 3 }, [], day(30));
    expect(r.dueDate).toBeNull();
    expect(r.updates).toEqual({});
  });
});
