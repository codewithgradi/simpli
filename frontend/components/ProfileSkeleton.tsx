import React from 'react';

const ProfileSkeleton = () => {
  return (
    <div className="w-full flex flex-col items-center animate-pulse">
      {/* Skeleton for Title/Header */}
      <div className="h-6 w-32 bg-gray-200 rounded-md mb-2"></div>
      <div className="h-4 w-48 bg-gray-100 rounded-md mb-8"></div>

      {/* Skeleton for QR Code Box */}
      <div className="bg-gray-50 p-6 rounded-2xl border-2 border-dashed border-gray-200 mb-8 flex items-center justify-center h-52.5 w-full">
        <div className="w-40 h-40 bg-gray-200 rounded-lg"></div>
      </div>

      {/* Skeleton for Profile Details List */}
      <div className="w-full space-y-4 px-4">
        <div className="flex justify-between">
          <div className="h-3 w-16 bg-gray-200 rounded"></div>
          <div className="h-3 w-24 bg-gray-100 rounded"></div>
        </div>
        <div className="flex justify-between">
          <div className="h-3 w-20 bg-gray-200 rounded"></div>
          <div className="h-3 w-32 bg-gray-100 rounded"></div>
        </div>
        <div className="h-10 w-full bg-gray-200 rounded-2xl mt-4"></div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;