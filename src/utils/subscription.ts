export function isTrialAvailable(): boolean {
  const trialStartDate = new Date('2024-12-01');
  const currentDate = new Date();
  return currentDate >= trialStartDate;
}

export function calculateTrialEndDate(): Date {
  const date = new Date();
  date.setDate(date.getDate() + 30);
  return date;
}

export function calculateNextBillingDate(trialEndDate: Date): Date {
  const date = new Date(trialEndDate);
  date.setMonth(date.getMonth() + 1);
  return date;
}