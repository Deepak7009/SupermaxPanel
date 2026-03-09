"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { createRawMaterial } from "@/redux/thunks/rawMaterialThunks";

import DialogModal from "@/components/common/DialogModal";
import Button from "@/components/common/Button";
import FloatingInput from "@/components/common/FloatingInput";

interface Props {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const AddRawMaterialModal = ({ isOpen, setIsOpen }: Props) => {
  const dispatch = useDispatch<AppDispatch>();

  const [materialName, setMaterialName] = useState("");
  const [shopName, setShopName] = useState("");
  const [buyerName, setBuyerName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState<"pending" | "paid">("pending");

  const resetForm = () => {
    setMaterialName("");
    setShopName("");
    setBuyerName("");
    setQuantity("");
    setAmount("");
    setDate("");
    setStatus("pending");
  };

  const handleClose = () => {
    setIsOpen(false);
    resetForm();
  };

  const handleSubmit = async () => {
    if (
      !materialName ||
      !shopName ||
      !buyerName ||
      !quantity ||
      !amount ||
      !date
    ) {
      alert("Please fill all fields");
      return;
    }

    await dispatch(
      createRawMaterial({
        materialName,
        shopName,
        buyerName,
        quantity: Number(quantity),
        amount: Number(amount),
        date,
        status,
      })
    );

    handleClose();
  };

  return (
    <DialogModal
      isOpen={isOpen}
      setIsOpen={handleClose}
      title="Add Raw Material"
    >
      <div className="space-y-4">
        <FloatingInput
          label="Material Name"
          value={materialName}
          onChange={(e) => setMaterialName(e.target.value)}
        />

        <FloatingInput
          label="Shop Name"
          value={shopName}
          onChange={(e) => setShopName(e.target.value)}
        />

        <FloatingInput
          label="Buyer Name"
          value={buyerName}
          onChange={(e) => setBuyerName(e.target.value)}
        />

        <FloatingInput
          label="Quantity"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />

        <FloatingInput
          label="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <FloatingInput
          label="Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-500">Status</label>

          <select
            className="border rounded-md p-2 bg-transparent"
            value={status}
            onChange={(e) => setStatus(e.target.value as "pending" | "paid")}
          >
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
          </select>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Save</Button>
        </div>
      </div>
    </DialogModal>
  );
};

export default AddRawMaterialModal;