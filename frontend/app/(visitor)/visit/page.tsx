// src/app/visit/page.tsx
'use client';

import { Suspense } from 'react';
import ReservationForm from '@/components/ReservationForm';
import Skeleton from '@/components/DashboardSkeleton'

export default function VisitPage() {
  const handleSuccess = (passCode: string) => {
    console.log("Visitor Check-in Success. Passcode:", passCode);
    // You can add logic here to trigger local notifications or redirects
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-pulse text-gray-400 font-medium">
            <Skeleton/>
          </div>
        </div>
      }>
        <ReservationForm onSuccess={handleSuccess} />
      </Suspense>
    </main>
  );
}