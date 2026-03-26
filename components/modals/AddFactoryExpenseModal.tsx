"use client";

import { useState, useEffect, FormEvent } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";

import {
  createFactoryExpense,
  updateFactoryExpense,
} from "@/redux/thunks/factoryExpenseThunks";

import DialogModal from "@/components/common/DialogModal";
import FloatingInput from "@/components/common/FloatingInput";
import Button from "@/components/common/Button";

import { FactoryExpense } from "@/redux/types/factoryExpense";

interface Props {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  expense?: FactoryExpense | null;
}

const AddFactoryExpenseModal = ({ isOpen, setIsOpen, expense }: Props) => {
  const dispatch = useDispatch<AppDispatch>();

  const [name, setName] = useState("");
  const [amount, setAmount] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [entryDate, setEntryDate] = useState("");
  const [entryPerson, setEntryPerson] = useState("");
  const [shopName, setShopName] = useState("");
  const [status, setStatus] = useState<"pending" | "paid">("pending");

  useEffect(() => {
    if (expense) {
      setName(expense.name || "");
      setAmount(expense.amount || 0);
      setQuantity(expense.quantity || 0);
      setEntryDate(expense.entryDate?.slice(0, 10) || "");
      setEntryPerson(expense.entryPerson || "");
      setShopName(expense.shopName || "");
      setStatus(expense.status || "pending");
    } else {
      setName("");
      setAmount(0);
      setQuantity(0);
      setEntryDate("");
      setEntryPerson("");
      setShopName("");
      setStatus("pending");
    }
  }, [expense]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

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

    const payload = {
      name,
      amount,
      entryDate,
      entryPerson,
      quantity,
      shopName,
      status,
    };

    if (expense) {
      await dispatch(
        updateFactoryExpense({
          id: expense._id,
          updatedData: payload,
        }),
      );
    } else {
      await dispatch(createFactoryExpense(payload));
    }

    setIsOpen(false);
  };

  return (
    <DialogModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title={expense ? "Edit Factory Expense" : "Add Factory Expense"}
      className="max-w-2xl"
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <FloatingInput
            label="Expense Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <FloatingInput
            label="Amount"
            type="number"
            value={amount.toString()}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FloatingInput
            label="Quantity"
            type="number"
            value={quantity.toString()}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
          <FloatingInput
            label="Entry Date"
            type="date"
            value={entryDate}
            onChange={(e) => setEntryDate(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
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
        </div>

        <div>
          <label className="text-sm text-gray-500">Status</label>
          <select
            className="border rounded-md p-2 w-full"
            value={status}
            onChange={(e) => setStatus(e.target.value as "pending" | "paid")}
          >
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
          </select>
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button type="submit">{expense ? "Update" : "Save"}</Button>
        </div>
      </form>
    </DialogModal>
  );
};

export default AddFactoryExpenseModal;
