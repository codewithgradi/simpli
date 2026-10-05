'use client'
import { useState, useEffect } from 'react';
import { Key, BellRing, Smartphone, ShieldAlert, QrCodeIcon, LucideIcon } from 'lucide-react';
import ChangePasswordModal from './ChangePassword';
import DeactivationModal from './DeactivateModal';
import FeedbackModal from './FeedbackForm';
import BusinessQRModal from './BusinessWebLink';
import { BusinessData } from './UpdateProfileComponent';

interface SettingItem {
  icon: LucideIcon;
  title: string;
  desc: string;
  action: string;
  enabled: boolean;
  onclick: () => void;
}

const baseUrl = process.env.NODE_ENV === 'development'
    ? process.env.NEXT_PUBLIC_DEVELOPMENT_URL
    : process.env.NEXT_PUBLIC_PRODUCTION_URL;

export const SettingsView = () => {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showForm, setshowForm] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);  
  const [isQrModelOpen,setIsQrcModelOpen] = useState(false)
  
  const [companyId, setCompanyId] = useState<string>('');

  const [company, setCompany] = useState<BusinessData>()

useEffect(() => {
  const getCompanyData = async () => {
    try {
      const res = await fetch(`${baseUrl}/api/company/profile`, { credentials: 'include' });
      const data = await res.json();
      
      if (data.success && data.data) {
        const rawData = data.data;
        setCompany(rawData);

        const id = rawData._id || rawData.id || data.user?.companyId;
        
        if (id) {
          setCompanyId(id);
        }
      }
    } catch (err) {
      console.error("Error fetching company data", err);
    }
  };
  getCompanyData();
}, []);

  const settingsItems: SettingItem[] = [
    {
      icon: Key,
      title: 'Password & Security',
      desc: 'Update your account password and security preferences.',
      action: 'Update',
      enabled: true,
      onclick: () => setShowPasswordModal(true)
    },
     
    {
      icon: Smartphone,
      title: 'Feedback',
      desc: 'Tell us how we can improve the system to better your platform experience.',
      action: 'Send feedback',
      // 2. Fix: Ensure it is enabled if we are attempting to fetch or have the ID
      enabled: true, 
      onclick: () => setshowForm(true)
    },
    {
      icon: QrCodeIcon,
      title: 'Generate Business Entrance QR Code ',
      desc: 'Visitors will scan this to check in to your business',
      action: 'Generate',
      enabled: true,
      onclick: () => {setIsQrcModelOpen(true)}
    },
  ];

  return (
    <div className="max-w-3xl space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold text-[#001e2b]">Account Settings</h2>
        <p className="text-gray-500 text-sm">Manage your security and platform configurations.</p>
      </div>

      <div className="space-y-4">
        {settingsItems.map((item, i) => (
          <div 
            key={i} 
            className={`flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg transition-all group ${
              item.enabled ? 'hover:border-[#00ed64] hover:shadow-sm' : 'opacity-60 grayscale-[0.5]'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="p-2 bg-gray-50 rounded text-[#001e2b] group-hover:bg-[#00ed64] group-hover:text-[#001e2b] transition-colors">
                <item.icon size={20} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#001e2b]">{item.title}</h4>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
            </div>

            {item.enabled ? (
              <button
                onClick={item.onclick}
                className="text-xs font-bold text-[#00684a] hover:underline uppercase tracking-wide px-3 py-1"
              >
                {item.action}
              </button>
            ) : (
              <span className="text-[10px] font-bold text-gray-400 uppercase bg-gray-100 px-2 py-1 rounded">
                Coming Soon
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="pt-6 border-t border-red-100">
        <div className="bg-red-50/50 p-4 rounded-lg flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-red-700">Danger Zone</h4>
            <p className="text-xs text-red-600/70">Permanently remove your organization and all visitor data.</p>
          </div>
          <button
            onClick={()=>setIsModalOpen(true)}
            className="text-red-600 text-sm font-bold hover:bg-red-600 hover:text-white border border-red-200 px-4 py-2 rounded-md transition-all">
            Deactivate
          </button>
        </div>
      </div>

      {/* Modals */}
      <ChangePasswordModal 
        isOpen={showPasswordModal} 
        onClose={() => setShowPasswordModal(false)} 
      />
      <BusinessQRModal
        onClose={() => setIsQrcModelOpen(false)}
        businessId={companyId}
        businessName={company?.companyName?? 'loading..'}
        isOpen={isQrModelOpen} />
     
      <FeedbackModal 
        
        isOpen={showForm} 
        onClose={() => setshowForm(false)} 
      />

      <DeactivationModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};