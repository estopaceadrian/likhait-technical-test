/**
 * Reusable form for creating a new expense category
 */

import { useState } from "react";
import { TextField, Button } from "../vibes";
import { createCategory } from "../services/api";
import { EXPENSE_VALIDATION_MESSAGES } from "../constants/validationMessages";

interface CategoryFormProps {
  onSubmit: (name: string) => void;
  onCancel?: () => void;
  categoryNames?: string[];
}

export function CategoryForm({
  onSubmit,
  onCancel,
  categoryNames = [],
}: CategoryFormProps) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError(EXPENSE_VALIDATION_MESSAGES.categoryCreateRequired);
      return;
    }

    if (
      categoryNames.some(
        (existing) => existing.toLowerCase() === trimmed.toLowerCase(),
      )
    ) {
      setError(EXPENSE_VALIDATION_MESSAGES.categoryDuplicate);
      return;
    }

    setIsSubmitting(true);
    try {
      await createCategory(trimmed);
      onSubmit(trimmed);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : EXPENSE_VALIDATION_MESSAGES.categoryCreateFailed;
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <TextField
        label="Category Name"
        type="text"
        placeholder="e.g. Groceries"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          setError("");
        }}
        error={error}
        fullWidth
        required
      />
      <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
        <Button
          type="button"
          variant="primary"
          onClick={handleSave}
          disabled={isSubmitting}
          fullWidth
        >
          Save
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isSubmitting}
            fullWidth
          >
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
}
