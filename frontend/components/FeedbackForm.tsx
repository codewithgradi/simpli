import React, { useState, ChangeEvent, FormEvent } from 'react';
import MyNotification from '../components/Notification';

interface FeedbackFormData {
  name: string;
  email: string;
  message: string;
}

type NotificationType = 'positive' | 'negative';

interface NotificationState {
  show: boolean;
  type: NotificationType;
  message: string;
}

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<FeedbackFormData>({
    name: '',
    email: '',
    message: ''
  });

  const [notification, setNotification] = useState<NotificationState>({
    show: false,
    type: 'positive',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const triggerNotification = (type: NotificationType, message: string) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 4000);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!formData.email.includes('@') || formData.message.length < 5) {
      triggerNotification('negative', 'Invalid input: Provide a valid email and detailed message.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        triggerNotification('positive', 'Feedback saved to the cloud successfully!');
        setFormData({ name: '', email: '', message: '' });
        setTimeout(onClose, 2000);
      } else {
        throw new Error();
      }
    } catch (err) {
      triggerNotification('negative', 'Connection failed. Please check your network.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      {/* MongoDB Styled Backdrop */}
      <div 
        className="absolute inset-0 bg-[#001E2B]/80 backdrop-blur-md" 
        onClick={onClose} 
      />

      <div className="relative w-full max-w-md bg-[#001E2B] border border-[#3D4F58] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] text-white overflow-hidden transition-all transform animate-in zoom-in-95 duration-200">
        
        {/* Notification Overlay */}
        <div className="absolute top-4 left-0 w-full flex justify-center z-110 px-4">
          {notification.show && (
            <MyNotification 
              onClose={() => setNotification(prev => ({ ...prev, show: false }))}
              type={notification.type} 
              message={notification.message} 
            />
          )}
        </div>

        {/* Decorative Top Bar */}
        <div className="h-1.5 w-full bg-[#00ED64]" />

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold font-sans tracking-tight text-[#00ED64]">
              Share Feedback
            </h2>
            <p className="text-sm text-gray-400">Help us build a better experience.</p>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400" htmlFor="name">
              Full Name
            </label>
            <input
              className="w-full px-4 py-3 bg-[#1C2D38] border border-[#3D4F58] rounded-lg outline-none focus:border-[#00ED64] focus:ring-1 focus:ring-[#00ED64] transition-all text-gray-100 placeholder-gray-500"
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Alex Rivers"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400" htmlFor="email">
              Email Address
            </label>
            <input
              className="w-full px-4 py-3 bg-[#1C2D38] border border-[#3D4F58] rounded-lg outline-none focus:border-[#00ED64] focus:ring-1 focus:ring-[#00ED64] transition-all text-gray-100 placeholder-gray-500"
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="alex@mongodb.com"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400" htmlFor="message">
              Message
            </label>
            <textarea
              className="w-full px-4 py-3 bg-[#1C2D38] border border-[#3D4F58] rounded-lg outline-none focus:border-[#00ED64] focus:ring-1 focus:ring-[#00ED64] transition-all min-h-25 resize-none text-gray-100"
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-[#3D4F58] text-gray-300 font-semibold rounded-lg hover:bg-[#1C2D38] transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-2 py-3 bg-[#00ED64] text-[#001E2B] font-bold rounded-lg hover:bg-[#00c855] active:scale-[0.98] transition-all disabled:opacity-50 shadow-[0_4px_14px_0_rgba(0,237,100,0.39)]"
            >
              {isSubmitting ? 'Syncing...' : 'Submit Feedback'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackModal;