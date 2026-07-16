/**
 * Form component for adding/editing expenses
 */

import React, { useState, useEffect } from "react";
import { ExpenseFormData } from "../types";
import { EXPENSE_CATEGORIES } from "../constants/categories";
import { TextField, SelectBox, Button, Modal } from "../vibes";
import { useExpenseForm } from "../hooks/useExpenseForm";
import { fetchCategories, createCategory } from "../services/api";
import { CategoryForm } from "./CategoryForm";

interface ExpenseFormProps {
  initialData?: Partial<ExpenseFormData>;
  onSubmit: (data: ExpenseFormData) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
}

export function ExpenseForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = "Add Expense",
}: ExpenseFormProps) {
  const { formData, errors, isSubmitting, handleChange, handleSubmit } =
    useExpenseForm({
      initialData,
      onSubmit,
    });

  const [categoryOptions, setCategoryOptions] = useState<
    Array<{ value: string; label: string }>
  >([]);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [showCategoryButton, setShowCategoryButton] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadCategories = async () => {
      try {
        const remote = await fetchCategories();
        if (!isMounted) return;

        const names = new Set<string>(EXPENSE_CATEGORIES);
        remote.forEach((c) => names.add(c.name));

        setCategoryOptions(
          Array.from(names)
            .sort((a, b) => a.localeCompare(b))
            .map((name) => ({ value: name, label: name })),
        );
      } catch {
        if (!isMounted) return;
        setCategoryOptions(
          EXPENSE_CATEGORIES.map((name) => ({ value: name, label: name })),
        );
      }
    };

    loadCategories();
    setShowCategoryButton(true);

    return () => {
      isMounted = false;
    };
  }, []);

  const openAddCategory = () => {
    setIsAddCategoryOpen(true);
  };

  const closeAddCategory = () => {
    setIsAddCategoryOpen(false);
  };

  const handleCategoryCreated = async (name: string) => {
    const created = await createCategory(name);
    setCategoryOptions((prev) => {
      const exists = prev.some((o) => o.value === created.name);
      if (!exists) {
        return [...prev, { value: created.name, label: created.name }].sort((a, b) =>
          a.label.localeCompare(b.label),
        );
      }
      return prev;
    });

    handleChange("category", created.name);
    closeAddCategory();
  };

  const formStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  };

  const buttonGroupStyle: React.CSSProperties = {
    display: "flex",
    gap: "0.5rem",
    marginTop: "0.5rem",
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <TextField
        label="Amount"
        type="number"
        step="0.01"
        placeholder="0.00"
        value={formData.amount}
        onChange={(e) => handleChange("amount", e.target.value)}
        error={errors.amount}
        fullWidth
        required
      />

      <TextField
        label="Description"
        type="text"
        placeholder="Enter description"
        value={formData.description}
        onChange={(e) => handleChange("description", e.target.value)}
        error={errors.description}
        fullWidth
        required
      />

      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          alignItems: "flex-end",
        }}
      >
        <div style={{ flex: 1 }}>
          <SelectBox
            label="Category"
            options={categoryOptions}
            value={formData.category}
            onChange={(e) => handleChange("category", e.target.value)}
            error={errors.category}
            fullWidth
            required
          />
        </div>
        {showCategoryButton && (
          <Button type="button" variant="secondary" onClick={openAddCategory}>
            Add Category
          </Button>
        )}
      </div>

      <TextField
        label="Date"
        type="date"
        value={formData.date}
        onChange={(e) => handleChange("date", e.target.value)}
        error={errors.date}
        fullWidth
        required
      />

      <div style={buttonGroupStyle}>
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          fullWidth
        >
          {isSubmitting ? "Submitting..." : submitLabel}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
      </div>

      <Modal isOpen={isAddCategoryOpen} onClose={closeAddCategory} title="Add Category">
        <CategoryForm onSubmit={handleCategoryCreated} onCancel={closeAddCategory} />
      </Modal>
    </form>
  );
}
