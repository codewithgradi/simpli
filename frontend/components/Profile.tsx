"use client";
import {
  MapPin,
  Globe,
  Phone,
  ShieldCheckIcon,
  AlertCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import ProfileSkeleton from "./ProfileSkeleton";
import EditProfileModal, { BusinessData } from "./UpdateProfileComponent";
import { useCompany } from "@/hooks/useCompany";

const ProfileView = () => {
  const [data, setData] = useState<BusinessData>({
    id: "",
    companyName: "",
    registrationNumber: "",
    contactNumber: "",
    createdAt: "",
    website: "",
    address: {
      streetNumber: "",
      streetName: "",
      city: "",
      country: "",
    },
    streetNumber: "",
    streetName: "",
    city: "",
    country: "",
    isProfileComplete: false,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { getCompany, loading, error } = useCompany();

  useEffect(() => {
    const fetchCompanyProfile = async () => {
      const result = await getCompany();
      if (result) {
        const actualBusinessInfo = (result as any).data || result;
        const { id, createdAt, email, operatingHours, ...cleanData } =
          actualBusinessInfo;

        const resolvedAddress = cleanData.address || {
          streetNumber: cleanData.streetNumber || "",
          streetName: cleanData.streetName || "",
          city: cleanData.city || "",
          country: cleanData.country || "",
        };

        setData({
          id: id || "",
          createdAt: createdAt || "",
          ...cleanData,
          address: resolvedAddress,
          streetNumber: resolvedAddress.streetNumber,
          streetName: resolvedAddress.streetName,
          city: resolvedAddress.city,
          country: resolvedAddress.country,
        });
      } else if (error) {
        console.error("Failed to fetch company profile:", error);
      }
    };

    fetchCompanyProfile();
  }, []);

  // Helper component/render function for missing values
  const renderValueOrMissing = (value: string | undefined, label: string) => {
    if (value && value.trim() !== "") {
      return <span>{value}</span>;
    }
    return (
      <button
        onClick={() => setIsModalOpen(true)}
        className="text-amber-600 text-xs italic font-medium hover:underline flex items-center gap-1 mt-0.5 text-left"
      >
        <AlertCircle size={12} /> Missing value - Click to update
      </button>
    );
  };

  const streetNameVal = data.address?.streetName || data.streetName;
  const streetNumVal = data.address?.streetNumber || data.streetNumber;
  const cityVal = data.address?.city || data.city;
  const countryVal = data.address?.country || data.country;

  return (
    <div className="max-w-4xl space-y-6">
      {loading ? (
        <ProfileSkeleton />
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          {/* Header Banner */}
          <div className="h-32 bg-[#001e2b] relative">
            <div className="absolute -bottom-10 left-8 p-1 bg-white rounded-xl shadow-md">
              <div className="w-20 h-20 bg-[#00ed64] rounded-lg flex items-center justify-center font-bold text-2xl text-[#001e2b]">
                <ShieldCheckIcon />
              </div>
            </div>
          </div>

          {/* Business Info Row */}
          <div className="pt-14 pb-8 px-8 flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-[#001e2b]">
                {data.companyName || "New Business"}
              </h1>
              <div className="text-gray-500 flex items-center gap-1 mt-1 text-sm">
                <MapPin size={14} className="shrink-0" />
                {streetNameVal ? (
                  `${streetNumVal ? streetNumVal + " " : ""}${streetNameVal}, ${cityVal}, ${countryVal}`
                ) : (
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="text-amber-600 text-xs italic font-medium hover:underline flex items-center gap-1"
                  >
                    <AlertCircle size={12} /> Address missing - Click to update
                  </button>
                )}
              </div>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="border border-gray-300 px-4 py-2 rounded font-bold text-sm hover:bg-gray-50 transition-all"
            >
              Edit Profile
            </button>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 border-t border-gray-100 divide-x divide-gray-100">
            <div className="p-6 space-y-3">
              <p className="text-[10px] uppercase font-bold text-gray-400">
                Contact Info
              </p>

              <div className="text-sm">
                <div className="flex items-center gap-2 text-gray-400 text-xs mb-0.5">
                  <Phone size={12} /> Phone
                </div>
                {renderValueOrMissing(data.contactNumber, "Contact Number")}
              </div>

              <div className="text-sm">
                <div className="flex items-center gap-2 text-gray-400 text-xs mb-0.5">
                  <Globe size={12} /> Website
                </div>
                {renderValueOrMissing(data.website, "Website")}
              </div>
            </div>

            <div className="p-6 space-y-3">
              <p className="text-[10px] uppercase font-bold text-gray-400">
                Profile Status
              </p>
              <div className="text-sm">
                <div
                  className={`flex items-center gap-2 font-bold underline decoration-2 ${data.isProfileComplete ? "text-[#00ed64]" : "text-amber-500"}`}
                >
                  {data.isProfileComplete ? "Complete" : "Incomplete"}
                </div>
                {!data.isProfileComplete && (
                  <p className="text-xs text-gray-400 mt-1">
                    Please fill out all required details to finalize your setup.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <EditProfileModal
        isOpen={isModalOpen}
        initialData={data}
        onUpdateSuccess={(updatedData) => setData(updatedData)}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export { ProfileView };
