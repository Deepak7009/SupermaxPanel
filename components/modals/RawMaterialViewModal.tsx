"use client";

import { useState } from "react";
import DialogModal from "@/components/common/DialogModal";
import Button from "@/components/common/Button";
import AddRawMaterialModal from "./AddRawMaterialModal";
import { RawMaterial } from "@/redux/types/rawMaterial";

interface Props {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  material: RawMaterial | null;
}

const RawMaterialViewModal = ({ isOpen, setIsOpen, material }: Props) => {
  const [editOpen, setEditOpen] = useState(false);

  if (!material) return null;

  return (
    <>
      {/* VIEW MODAL */}
      <DialogModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="View Raw Material"
      >
        <div className="grid grid-cols-2 gap-3 p-2 text-sm">
          <Info label="Material Name" value={material.materialName} />
          <Info label="Shop Name" value={material.shopName} />
          <Info label="Buyer Name" value={material.buyerName} />
          <Info label="Quantity" value={material.quantity.toString()} />
          <Info label="Amount" value={`₹ ${material.amount}`} />
          <Info label="Date" value={material.date?.slice(0, 10)} />
          <Info
            label="Status"
            value={material.status === "paid" ? "Paid" : "Pending"}
          />
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

      {/* EDIT MODAL */}
      {editOpen && material && (
        <AddRawMaterialModal
          isOpen={editOpen}
          setIsOpen={setEditOpen}
          material={material}
        />
      )}
    </>
  );
};

export default RawMaterialViewModal;

/* ================= INFO COMPONENT ================= */

interface InfoProps {
  label: string;
  value: string;
}

const Info = ({ label, value }: InfoProps) => (
  <div className="flex flex-col">
    <span className="text-gray-500 text-sm">{label}</span>
    <span className="text-[15px] font-medium">{value}</span>
  </div>
);