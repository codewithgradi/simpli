import { Users } from 'lucide-react';

export const NoVisitors = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 bg-white border border-dashed border-gray-300 rounded-xl">
      <div className="bg-gray-50 p-4 rounded-full mb-4">
        <Users size={40} className="text-gray-300" />
      </div>
      <h3 className="text-lg font-semibold text-[#001e2b]">No visitors yet</h3>
      <p className="text-gray-500 text-sm text-center max-w-xs mt-1">
        When people scan your QR code, their check-in details will appear here.
      </p>
    </div>
  );
};