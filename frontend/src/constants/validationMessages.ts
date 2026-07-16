/**
 * Reusable validation/error messages for expense validation flows.
 */

export const EXPENSE_VALIDATION_MESSAGES = {
  amountRequired: "Amount is required",
  amountPositive: "Amount must be greater than 0",
  descriptionRequired: "Description is required",
  categoryRequired: "Category is required",
  dateRequired: "Date is required",
  dateFuture: "Expenses cannot be dated in the future",
  categoryCreateRequired: "Category name is required",
  categoryCreateFailed: "Failed to add category",
  categoryDuplicate: "Category already exists",
} as const;

export type ExpenseValidationMessageKey =
  keyof typeof EXPENSE_VALIDATION_MESSAGES;
