"use client";
import React, { useState, useEffect } from "react";
import { X, Save, Loader2 } from "lucide-react";
import { useCompany } from "@/hooks/useCompany";
import { UpdateCompany } from "@/services/companyService";

export interface AddressContent {
  streetNumber: string;
  streetName: string;
  city: string;
  country: string;
}

export interface BusinessData {
  id?: string;
  _id?: string;
  companyName: string;
  registrationNumber: string;
  contactNumber: string;
  createdAt?: string;
  address?: AddressContent;
  streetNumber: string;
  streetName: string;
  city: string;
  country: string;
  website: string;
  isProfileComplete: boolean;
}

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: BusinessData;
  onUpdateSuccess: (updatedData: BusinessData) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  initialData,
  onUpdateSuccess,
}) => {
  const [formData, setFormData] = useState<BusinessData>(initialData);

  // Consume updateCompany from useCompany hook
  const { updateCompany, loading: isUpdating, error } = useCompany();

  useEffect(() => {
    setFormData(initialData);
  }, [initialData, isOpen]);

  // Check for unsaved changes
  const hasChanges = JSON.stringify(formData) !== JSON.stringify(initialData);

  const handleSafeClose = () => {
    if (hasChanges) {
      if (!window.confirm("You have unsaved changes. Close anyway?")) return;
    }
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Check if the field belongs to the nested address object
    if (["streetNumber", "streetName", "city", "country"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        [name]: value, // Keep flat property in sync for inputs
        address: {
          streetNumber: prev.address?.streetNumber || prev.streetNumber || "",
          streetName: prev.address?.streetName || prev.streetName || "",
          city: prev.address?.city || prev.city || "",
          country: prev.address?.country || prev.country || "",
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const requiredFields: (keyof BusinessData)[] = [
      "companyName",
      "registrationNumber",
      "contactNumber",
      "streetNumber",
      "streetName",
      "city",
      "country",
      "website",
    ];

    const allFilled = requiredFields.every(
      (field) => formData[field]?.toString().trim() !== "",
    );

    // Map form state to the nested address structure expected by the backend
    const payload: UpdateCompany = {
      companyName: formData.companyName,
      registrationNumber: formData.registrationNumber,
      contactNumber: formData.contactNumber,
      website: formData.website,
      address: {
        streetNumber: formData.address?.streetNumber || formData.streetNumber,
        streetName: formData.address?.streetName || formData.streetName,
        city: formData.address?.city || formData.city,
        country: formData.address?.country || formData.country,
      },
    };

    const res = await updateCompany(payload);

    if (!error) {
      const updatedPayload: BusinessData = {
        ...formData,
        isProfileComplete: allFilled,
      };
      onUpdateSuccess(updatedPayload);
      onClose();
    } else {
      console.error("Update failed:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && handleSafeClose()}
    >
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-[#001e2b]">
              Edit Business Profile
            </h2>
            {hasChanges && (
              <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold">
                UNSAVED
              </span>
            )}
          </div>
          <button
            onClick={handleSafeClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase text-gray-400">
                General Info
              </h3>
              <Input
                label="Business Name"
                name="companyName"
                value={formData.companyName ?? ""}
                onChange={handleChange}
                required
              />
              <Input
                label="Registration #"
                name="registrationNumber"
                value={formData.registrationNumber ?? ""}
                onChange={handleChange}
                required
              />
              <Input
                label="Website"
                name="website"
                value={formData.website ?? ""}
                onChange={handleChange}
                required
              />
              <Input
                label="Contact #"
                name="contactNumber"
                value={formData.contactNumber ?? ""}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase text-gray-400">
                Location Info
              </h3>
              <div className="grid grid-cols-3 gap-2">
                <Input
                  label="St #"
                  name="streetNumber"
                  value={
                    formData.address?.streetNumber ??
                    formData.streetNumber ??
                    ""
                  }
                  onChange={handleChange}
                  required
                />
                <div className="col-span-2">
                  <Input
                    label="Street Name"
                    name="streetName"
                    value={
                      formData.address?.streetName ?? formData.streetName ?? ""
                    }
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  label="City"
                  name="city"
                  value={formData.address?.city ?? formData.city ?? ""}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Country"
                  name="country"
                  value={formData.address?.country ?? formData.country ?? ""}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>
        </form>

        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button
            type="button"
            onClick={handleSafeClose}
            className="px-6 py-2.5 font-semibold text-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isUpdating}
            className="bg-[#00ed64] text-[#001e2b] px-8 py-2.5 rounded-lg font-bold flex items-center gap-2 hover:opacity-90 disabled:opacity-50"
          >
            {isUpdating ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Save size={18} />
            )}
            Update Profile
          </button>
        </div>
      </div>
    </div>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Input: React.FC<InputProps> = ({ label, ...props }) => (
  <div className="space-y-1">
    <label className="text-[11px] font-bold text-gray-500 uppercase flex gap-1">
      {label} {props.required && <span className="text-red-500">*</span>}
    </label>
    <input
      className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#00ed64] outline-none text-sm"
      {...props}
    />
  </div>
);

export default EditProfileModal;
