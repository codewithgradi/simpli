'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import UnsupportedDeviceModal from '@/components/UnSupportedDeviceModal';

export default function ConsoleLayout({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // If we reached this layout, the Middleware already verified 
    // that the 'jwt' cookie exists. We can just render.
    setIsReady(true);
  }, []);

  if (!isReady) return null; // Or your ProfileSkeleton

  return (<div className="min-h-screen bg-[#001e2b]">
      <UnsupportedDeviceModal />
      {children}
    </div>);
}