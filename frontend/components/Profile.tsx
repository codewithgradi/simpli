'use client'
import { MapPin, Globe, Phone, Clock, Mail, ShieldCheckIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import ProfileSkeleton from './ProfileSkeleton';
import EditProfileModal, { BusinessData } from './UpdateProfileComponent';

const ProfileView = () => {
  const [data, setData] = useState<BusinessData>({
    id: '',
    companyName: '',
    email: '',
    registrationNumber: '',
    contactNumber: '',
    createdAt: '',
    streetNumber: '',
    streetName: '',
    city: '',
    country: '',
    website: '',
    operatingHours: '',
    isProfileComplete: false
  });

  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const baseUrl = process.env.NODE_ENV === 'development'
        ? process.env.NEXT_PUBLIC_DEVELOPMENT_URL
        : process.env.NEXT_PUBLIC_PRODUCTION_URL;

      try {
        const res = await fetch(`${baseUrl}/api/company/profile/`, {
          method: 'GET',
          credentials: 'include',
        });
        if (!res.ok) return;
        const retrievedData = await res.json();
        const actualBusinessInfo = retrievedData.data || retrievedData;

        const { id, createdAt, ...cleanData } = actualBusinessInfo;

        const clean = {
          ...cleanData
        }
        setData(clean);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
              <h1 className="text-2xl font-bold text-[#001e2b]">{data.companyName || 'New Business'}</h1>
              <p className="text-gray-500 flex items-center gap-1 mt-1 text-sm">
                <MapPin size={14} /> 
                {data.streetName 
                  ? `${data.streetNumber || ''} ${data.streetName}, ${data.city}, ${data.country}` 
                  : 'Address not set'}
              </p>
            </div>

            {/* FIXED: Simple state toggle */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="border border-gray-300 px-4 py-2 rounded font-bold text-sm hover:bg-gray-50 transition-all"
            >
              Edit Profile
            </button>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 border-t border-gray-100 divide-x divide-gray-100">
            <div className="p-6 space-y-2">
              <p className="text-[10px] uppercase font-bold text-gray-400">Contact Info</p>
              <p className="text-sm flex items-center gap-2"><Phone size={14} /> {data.contactNumber || '---'}</p>
              <p className="text-sm flex items-center gap-2"><Globe size={14} /> {data.website || '---'}</p>
              <p className="text-sm flex items-center gap-2"><Mail size={14} /> {data.email}</p>
            </div>
            <div className="p-6 space-y-2">
              <p className="text-[10px] uppercase font-bold text-gray-400">Operating Hours</p>
              <p className="text-sm flex items-center gap-2"><Clock size={14} /> {data.operatingHours || '---'}</p>
            </div>
            <div className="p-6 space-y-2">
              <p className="text-[10px] uppercase font-bold text-gray-400">Profile Status</p>
              <div className={`flex items-center gap-2 font-bold text-sm underline decoration-2 ${data.isProfileComplete ? 'text-[#00ed64]' : 'text-amber-500'}`}>
                {data.isProfileComplete ? 'Complete' : 'Not Complete'}
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