'use client'

import  React, {  useEffect, useState } from 'react';
import { Eye, EyeOff, ShieldCheck, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Notification from './Notification';

const BusinessLogForm =  () => {
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string>>>({});

  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [isSubmited, setIsSubmited] = useState(false)
  
  
  const [showNotification, setShowNotification] = useState<{
        show: boolean, msg: string, type: 'positive' | 'negative'
    }>(
        {
    show: false,
    msg: '',
    type: 'positive'
    });
  
  const router = useRouter()
  const handleForm = (e:React.ChangeEvent<HTMLInputElement>) => {
    const {name , value} = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    
  }
  
useEffect(() => {
  // 1. Look for the data we saved during Sign Up
  const pendingData = sessionStorage.getItem('pendingLogin');

  if (pendingData) {
    try {
      const { email, password } = JSON.parse(pendingData);

      setForm({
        email: email || '',
        password: password || ''
      });

      sessionStorage.removeItem('pendingLogin');

      setShowNotification({
        show: true,
        msg: "Account created! Your details have been filled.",
        type: 'positive'
      });
    } catch (error) {
      console.error("Error parsing auto-fill data", error);
    }
  }
}, []); 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    let validationErrors: Partial<Record<keyof typeof form, string>> = {};

    if (!form.email.trim()) validationErrors.email = "Business email is required";
    if (!form.password.trim()) validationErrors.password = "Password is required";
    setErrors(validationErrors);
  const errorMessages = Object.values(validationErrors);

  if (errorMessages.length > 0) {
    setShowNotification({
      show: true,
      msg: errorMessages[0] as string,
      type: "negative"
    });
    return; 
  }

    setLoading(true);
    
  

    try {
    const baseUrl = process.env.NODE_ENV === 'development'
    ? process.env.NEXT_PUBLIC_DEVELOPMENT_URL
    : process.env.NEXT_PUBLIC_PRODUCTION_URL;

    if (!baseUrl) {
      console.log('Missing base url');
      return;
    }
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      credentials:"include",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(form) 
    });

    if (!res.ok) {
      const errorData = await res.json();
      setLoading(false)
      setShowNotification({
        show: true,
        msg: errorData.message || "Invalid email or password",
        type: "negative"
      });
      return;
    }
      setIsSubmited(true)
      
    const data = await res.json();
    Cookies.set('jwt', data.token);

    router.push('/console');
    
  } catch (err) {
    setLoading(false);
    setShowNotification({
      show: true,
      msg: "Connection refused. Is the server running?",
      type: "negative"
    });
    console.log('Connection error:', err);
    } 
};
  
  

  return (
    <div className="min-h-screen w-full flex bg-white font-sans selection:bg-[#00ed64] selection:text-[#001e2b]">
      {showNotification.show && (
              <Notification 
                message={showNotification.msg} 
                type={showNotification.type} 
                onClose={() => setShowNotification(prev => ({ ...prev, show: false }))} 
              />
            )}
      {/* Left Side: The Form (Clean & Focused) */}
      <div className="w-full lg:w-112.5 flex flex-col p-8 md:p-16">
        <Link href={'/'} className="mb-12 flex items-center gap-2">
          <div className="w-8 h-8 bg-[#00ed64] rounded-lg flex items-center justify-center">
            <ShieldCheck className="text-[#001e2b] w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-[#001e2b]">SIMPLY
            <span className="font-normal text-gray-400">| Login</span></span>
        </Link>

        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-[#001e2b] mb-2">Log in to Simply</h1>
          <p className="text-sm text-gray-500 mb-8">
            Enter your details to access your business dashboard.
          </p>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <label className="text-[13px] font-bold text-[#001e2b] uppercase tracking-wide">Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleForm}
                placeholder="email@company.com"
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md focus:border-[#00ed64] focus:ring-1 focus:ring-[#00ed64] outline-none transition-all placeholder:text-gray-400 text-[#001e2b]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] font-bold text-[#001e2b] uppercase tracking-wide">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  onChange={handleForm}
                  placeholder="••••••••"
                  value={form.password}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md focus:border-[#00ed64] focus:ring-1 focus:ring-[#00ed64] outline-none transition-all placeholder:text-gray-400 text-[#001e2b]"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {!isSubmited}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex items-center justify-center font-semibold py-3 px-4 rounded-lg mt-4 transition-all duration-200 shadow-md ${loading
                      ? "bg-green-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700 active:scale-[0.98] text-white"
                    }`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    "Log in"
                  )}
                </button>
            </form>
                  <div className="mt-auto pt-10 border-t border-gray-100">
          <p className="text-sm text-gray-500">
                          Don't have an account?
                          <Link href="/signup"
                              className="text-[#00ed64] font-semibold hover:underline">
                              Sign Up</Link>
          </p>
        </div>
                  <div className="mt-auto pt-10 border-t border-gray-100">
          <p className="text-sm text-gray-500">
                          Profile deactivate?
                          <Link href="/console/reactivate"
                              className="text-red-600 underline font-semibold hover:underline">
                              Reactivated Profile</Link>
          </p>
        </div>
        </div>

        
      </div>

      {/* Right Side: Feature Showcase (The "Mongo" Visual) */}
      <div className="hidden lg:flex flex-1 bg-[#001e2b] relative items-center justify-center overflow-hidden p-20">
        {/* Abstract Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#00ed64 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}></div>
        
        <div className="relative z-10 max-w-lg">
          <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
            The developer data platform for <span className="text-[#00ed64]">modern applications.</span>
          </h2>
          
          <ul className="space-y-6">
            {[
              "Automated visitor check-ins with QR codes.",
              "Real-time analytics for your business security.",
              "Integrated WhatsApp notification system."
            ].map((text, i) => (
              <li key={i} className="flex items-start gap-3 text-gray-300">
                <CheckCircle2 className="text-[#00ed64] w-6 h-6 shrink-0" />
                <span className="text-lg">{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BusinessLogForm;