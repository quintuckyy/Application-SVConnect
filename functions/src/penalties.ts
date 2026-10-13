import { type Firestore } from "firebase-admin/firestore";
import { logger } from "firebase-functions";
import { onSchedule } from "firebase-functions/scheduler";
import { assessLoan } from "../../www/js/lib/loanStatus.js";
import { db, notificationData } from "./common.js";

/**
 * Check every active approved loan and apply overdue flags and penalties.
 * Exported separately from the schedule so tests can run it with a fixed date.
 */
export async function runPenaltyCheck(firestore: Firestore, today: Date) {
  const loans = await firestore.collectionGroup("approvedLoans").get();
  let updated = 0;

  for (const loanDoc of loans.docs) {
    const loan = loanDoc.data();
    if (loan.loanStatus && loan.loanStatus !== "Active") continue;

    const memberRef = loanDoc.ref.parent.parent!;
    const payments = await memberRef.collection("paymentHistory").get();
    const { updates, notifications } = assessLoan(
      loan,
      payments.docs.map((p) => p.data() as { paymentIndex: number }),
      today,
    );
    if (!Object.keys(updates).length) continue;

    const batch = firestore.batch();
    batch.update(loanDoc.ref, updates);
    for (const n of notifications) batch.create(memberRef.collection("Notifications").doc(), notificationData(n));
    await batch.commit();
    updated++;
  }

  logger.info("Penalty check finished", { loans: loans.size, updated });
  return { loans: loans.size, updated };
}

// Runs every day shortly after midnight in the Philippines. Replaces the old client-side
// check, which only ran when a member opened the app and used a test date from the database.
export const applyLoanPenalties = onSchedule({ schedule: "every day 00:30", timeZone: "Asia/Manila" }, async () => {
  await runPenaltyCheck(db(), new Date());
});
