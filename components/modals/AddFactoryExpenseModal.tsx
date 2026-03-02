"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { createFactoryExpense } from "@/redux/thunks/factoryExpenseThunks";

import DialogModal from "@/components/common/DialogModal";
import Button from "@/components/common/Button";
import FloatingInput from "@/components/common/FloatingInput";

interface Props {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const AddFactoryExpenseModal = ({ isOpen, setIsOpen }: Props) => {
  const dispatch = useDispatch<AppDispatch>();

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [quantity, setQuantity] = useState("");
  const [entryDate, setEntryDate] = useState("");
  const [entryPerson, setEntryPerson] = useState("");
  const [shopName, setShopName] = useState("");
  const [status, setStatus] = useState<"pending" | "approved" | "rejected">(
    "pending",
  );

  const resetForm = () => {
    setName("");
    setAmount("");
    setQuantity("");
    setEntryDate("");
    setEntryPerson("");
    setShopName("");
    setStatus("pending");
  };

  const handleClose = () => {
    setIsOpen(false);
    resetForm();
  };

  const handleSubmit = async () => {
    if (
      !name ||
      !amount ||
      !entryDate ||
      !entryPerson ||
      !quantity ||
      !shopName
    ) {
      alert("Please fill all fields");
      return;
    }

    await dispatch(
      createFactoryExpense({
        name,
        amount: Number(amount),
        entryDate,
        entryPerson,
        quantity: Number(quantity),
        shopName,
        status,
      }),
    );

    handleClose();
  };

  return (
    <DialogModal
      isOpen={isOpen}
      setIsOpen={handleClose}
      title="Add Factory Expense"
    >
      <div className="space-y-4">
        <FloatingInput
          label="Expense Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <FloatingInput
          label="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <FloatingInput
          label="Quantity"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />

        <FloatingInput
          label="Entry Date"
          type="date"
          value={entryDate}
          onChange={(e) => setEntryDate(e.target.value)}
        />

        <FloatingInput
          label="Entry Person"
          value={entryPerson}
          onChange={(e) => setEntryPerson(e.target.value)}
        />

        <FloatingInput
          label="Shop Name"
          value={shopName}
          onChange={(e) => setShopName(e.target.value)}
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Save</Button>
        </div>
      </div>
    </DialogModal>
  );
};

export default AddFactoryExpenseModal;
