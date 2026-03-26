"use client";

import { useState, useEffect, FormEvent } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";

import {
  createRawMaterial,
  updateRawMaterial,
} from "@/redux/thunks/rawMaterialThunks";

import DialogModal from "@/components/common/DialogModal";
import Button from "@/components/common/Button";
import FloatingInput from "@/components/common/FloatingInput";

import { RawMaterial } from "@/redux/types/rawMaterial";

interface Props {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  material?: RawMaterial | null; // ✅ OPTIONAL (for edit)
}

const AddRawMaterialModal = ({ isOpen, setIsOpen, material }: Props) => {
  const dispatch = useDispatch<AppDispatch>();

  const [materialName, setMaterialName] = useState("");
  const [shopName, setShopName] = useState("");
  const [buyerName, setBuyerName] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [amount, setAmount] = useState(0);
  const [date, setDate] = useState("");
  const [status, setStatus] = useState<"pending" | "paid">("pending");

  // ✅ PREFILL FOR EDIT
  useEffect(() => {
    if (material) {
      setMaterialName(material.materialName || "");
      setShopName(material.shopName || "");
      setBuyerName(material.buyerName || "");
      setQuantity(material.quantity || 0);
      setAmount(material.amount || 0);
      setDate(material.date?.slice(0, 10) || "");
      setStatus(material.status || "pending");
    } else {
      resetForm();
    }
  }, [material]);

  // ✅ RESET
  const resetForm = () => {
    setMaterialName("");
    setShopName("");
    setBuyerName("");
    setQuantity(0);
    setAmount(0);
    setDate("");
    setStatus("pending");
  };

  const handleClose = () => {
    setIsOpen(false);
    resetForm();
  };

  // ✅ SUBMIT (CREATE + UPDATE)
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

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

    const payload = {
      materialName,
      shopName,
      buyerName,
      quantity,
      amount,
      date,
      status,
    };

    if (material) {
      // ✅ UPDATE
      await dispatch(
        updateRawMaterial({
          id: material._id,
          updatedData: payload,
        }),
      );
    } else {
      // ✅ CREATE
      await dispatch(createRawMaterial(payload));
    }

    handleClose();
  };

  return (
    <DialogModal
      isOpen={isOpen}
      setIsOpen={handleClose}
      title={material ? "Edit Raw Material" : "Add Raw Material"}
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
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
          value={quantity.toString()}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />

        <FloatingInput
          label="Amount"
          type="number"
          value={amount.toString()}
          onChange={(e) => setAmount(Number(e.target.value))}
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
          <Button type="button" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit">{material ? "Update" : "Save"}</Button>
        </div>
      </form>
    </DialogModal>
  );
};

export default AddRawMaterialModal;
