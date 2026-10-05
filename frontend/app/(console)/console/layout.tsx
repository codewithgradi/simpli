'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ConsoleLayout({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // If we reached this layout, the Middleware already verified 
    // that the 'jwt' cookie exists. We can just render.
    setIsReady(true);
  }, []);

  if (!isReady) return null; // Or your ProfileSkeleton

  return <>{children}</>;
}