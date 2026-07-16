/**
 * Custom hook for managing expense form state and validation
 */

import { useState } from "react";
import { ExpenseFormData } from "../types";
import { formatDate, validateExpenseDate } from "../utils/expenseUtils";
import { EXPENSE_VALIDATION_MESSAGES } from "../constants/validationMessages";

interface UseExpenseFormProps {
  initialData?: Partial<ExpenseFormData>;
  onSubmit: (data: ExpenseFormData) => Promise<void>;
}

export function useExpenseForm({ initialData, onSubmit }: UseExpenseFormProps) {
  const [formData, setFormData] = useState<ExpenseFormData>({
    amount: initialData?.amount || "",
    description: initialData?.description || "",
    category: initialData?.category || "",
    date: initialData?.date || formatDate(new Date()),
  });

  const [errors, setErrors] = useState<Partial<ExpenseFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof ExpenseFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ExpenseFormData> = {};

    if (!formData.amount || Number(formData.amount) <= 0) {
      newErrors.amount = EXPENSE_VALIDATION_MESSAGES.amountPositive;
    }

    if (!formData.description.trim()) {
      newErrors.description = EXPENSE_VALIDATION_MESSAGES.descriptionRequired;
    }

    if (!formData.category) {
      newErrors.category = EXPENSE_VALIDATION_MESSAGES.categoryRequired;
    }

    if (!formData.date) {
      newErrors.date = EXPENSE_VALIDATION_MESSAGES.dateRequired;
    } else {
      const dateError = validateExpenseDate(formData.date);
      if (dateError) {
        newErrors.date = dateError;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      // Reset form on success
      setFormData({
        amount: "",
        description: "",
        category: "",
        date: formatDate(new Date()),
      });
      setErrors({});
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      amount: initialData?.amount || "",
      description: initialData?.description || "",
      category: initialData?.category || "",
      date: initialData?.date || formatDate(new Date()),
    });
    setErrors({});
  };

  return {
    formData,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    resetForm,
  };
}
