"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

import DialogModal from "@/components/common/DialogModal";
import Button from "@/components/common/Button";

import { FactoryExpense } from "@/redux/types/factoryExpense";
import AddFactoryExpenseModal from "./AddFactoryExpenseModal";

interface Props {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  expenseId: string | null;
}

const FactoryExpenseViewModal = ({ isOpen, setIsOpen, expenseId }: Props) => {
  const [editOpen, setEditOpen] = useState(false);

  const expense = useSelector((state: RootState) =>
    state.factoryExpense.expenses.find((e) => e._id === expenseId),
  );

  if (!expense) return null;

  return (
    <>
      <DialogModal isOpen={isOpen} setIsOpen={setIsOpen} title="View Expense">
        <div className="grid grid-cols-2 gap-3">
          <Info label="Name" value={expense.name} />
          <Info label="Amount" value={`₹ ${expense.amount}`} />
          <Info label="Quantity" value={String(expense.quantity)} />
          <Info label="Shop" value={expense.shopName} />
          <Info label="Person" value={expense.entryPerson} />
          <Info label="Date" value={expense.entryDate.slice(0, 10)} />
          <Info label="Status" value={expense.status} />
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <Button
            onClick={() => {
              setIsOpen(false);
              setEditOpen(true);
            }}
          >
            Edit
          </Button>
          <Button onClick={() => setIsOpen(false)}>Close</Button>
        </div>
      </DialogModal>

      <AddFactoryExpenseModal
        isOpen={editOpen}
        setIsOpen={setEditOpen}
        expense={expense}
      />
    </>
  );
};

const Info = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-[var(--muted-foreground)] text-sm">{label}</p>
    <p className="font-medium">{value}</p>
  </div>
);

export default FactoryExpenseViewModal;
