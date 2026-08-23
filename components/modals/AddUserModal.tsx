"use client";

import { useState } from "react";
import DialogModal from "@/components/common/DialogModal";
import Button from "@/components/common/Button";
import FloatingInput from "@/components/common/FloatingInput";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { createUser, fetchUsers } from "@/redux/thunks/userThunks";

interface AddUserModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const AddUserModal = ({ isOpen, setIsOpen }: AddUserModalProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!name || !email || !password) {
      setError("All fields are required");
      return;
    }
    setError("");

    const result = await dispatch(createUser({ name, email, password }));

    if (createUser.rejected.match(result)) {
      setError((result.payload as string) || "Failed to create user");
      return;
    }

    dispatch(fetchUsers());
    setIsOpen(false);
    setName("");
    setEmail("");
    setPassword("");
  };

  return (
    <DialogModal isOpen={isOpen} setIsOpen={setIsOpen} title="Add New User">
      <div className="space-y-4">
        <FloatingInput label="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
        <FloatingInput label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <FloatingInput
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <p className="text-[var(--text-error)] text-sm">{error}</p>
        )}

        <div className="flex justify-end gap-2">
          <Button onClick={() => { setIsOpen(false); setError(""); }}>Cancel</Button>
          <Button onClick={handleSubmit}>Add User</Button>
        </div>
      </div>
    </DialogModal>
  );
};

export default AddUserModal;
