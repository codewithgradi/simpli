export default function SuccessScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/90 backdrop-blur-sm z-100 p-6">
      <div className="flex flex-col items-center animate-slide-up-center">
        {/* Animated Icon Container */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
          <svg 
            className="w-10 h-10 text-green-600 animate-bounce" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Text Content */}
        <h2 className="text-3xl font-bold text-gray-900 text-center">
          Enjoy your stay 😀
        </h2>
        <p className="text-gray-500 mt-2 text-center max-w-62.5">
          Your registration has been successfully processed.
        </p>
      </div>
    </div>
  );
}