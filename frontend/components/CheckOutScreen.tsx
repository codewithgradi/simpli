interface ReservationFormProps {
  onDone: () => void;
}

export default function CheckoutScreen({ onDone }: ReservationFormProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-50/95 backdrop-blur-md z-100 p-6">
      <div className="flex flex-col items-center animate-slide-up-center">
        
        {/* Animated Heart/Wave Icon */}
        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-8 shadow-inner">
          <svg 
            className="w-12 h-12 text-blue-600 animate-pulse" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="1.5" 
                d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
        </div>

        {/* Text Content */}
        <h2 className="text-3xl font-bold text-slate-900 text-center tracking-tight">
          Safe Travels! 👋
        </h2>
        <p className="text-slate-500 mt-3 text-center max-w-70 leading-relaxed text-lg">
          Thank you for visiting us. We hope to see you again soon!
        </p>

        {/* Action Button for Mobile */}
        <button 
          onClick={onDone}
          className="mt-10 px-8 py-3 bg-white border border-slate-200 text-slate-600 font-semibold rounded-full shadow-sm hover:bg-slate-50 active:scale-95 transition-all"
        >
          Return Home
        </button>
      </div>
    </div>
  );
}