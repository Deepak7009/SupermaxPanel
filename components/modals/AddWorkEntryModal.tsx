"use client";

import { useState } from "react";
import DialogModal from "@/components/common/DialogModal";
import Button from "@/components/common/Button";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { createWorkEntry, fetchWorkEntries } from "@/redux/thunks/workThunk";
import { Employee } from "@/redux/types/employee";
import FloatingInput from "../common/FloatingInput";

interface AddWorkEntryModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  employee: Employee | null;
}

const AddWorkEntryModal = ({
  isOpen,
  setIsOpen,
  employee,
}: AddWorkEntryModalProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const [date, setDate] = useState("");
  const [quantity, setQuantity] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = async () => {
    if (!employee) return;

    if (!date) {
      alert("Please select a date");
      return;
    }

    await dispatch(
      createWorkEntry({
        employee: employee._id,
        date,
        quantity: quantity ? Number(quantity) : undefined,
        amount: amount ? Number(amount) : undefined,
      })
    );

    dispatch(fetchWorkEntries(employee._id));

    setIsOpen(false);
    setDate("");
    setQuantity("");
    setAmount("");
  };

  return (
    <DialogModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title={`Add Work Entry - ${employee?.name}`}
    >
      <div className="space-y-4">
        <FloatingInput
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          label="Date"
        />

        <FloatingInput
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          label="Quantity"
        />

        <FloatingInput
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          label="Amount"
        />

        <div className="flex justify-end gap-2">
          <Button onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>Add</Button>
        </div>
      </div>
    </DialogModal>
  );
};

export default AddWorkEntryModal;
