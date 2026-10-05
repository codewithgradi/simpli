'use client'
import React, { useState } from 'react';
import { ShieldCheck, Eye, EyeOff, Building2,  CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Notification from './Notification';

const BusinessSignUpForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string>>>({});
  const [form, setForm] = useState({
    companyName: '',
    email: '',
    contactNumber: '',
    password: ''
  })
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

  const handleForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let validationErrors: Partial<Record<keyof typeof form, string>> = {};
    if (!form.companyName.trim()) validationErrors.companyName = "Enter your company name.";
    if (!form.email.trim()) validationErrors.email = "Business email is required.";
    if (!form.contactNumber.startsWith('0')) validationErrors.contactNumber = "Phone number should start with zero";
    if (form.contactNumber.length !== 10) validationErrors.contactNumber = "Phone number should be 10 digits long";
    if (!form.contactNumber.trim()) validationErrors.contactNumber = "Please provide business contact number.";
    if (!form.password.trim()) validationErrors.password = "Password is required.";
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
      const res = await fetch(`${baseUrl}/api/auth/create`, {
        method: 'POST',
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
      
      const signupData = { email: form.email, password: form.password };
      sessionStorage.setItem('pendingLogin', JSON.stringify(signupData));
      
      router.push('/login');
      
      setIsSubmited(true)
      setForm({
        companyName: '',
        contactNumber: '',
        email: '',
        password:""
      })
      
    } catch (err) {
      setLoading(false);
      setShowNotification({
        show: true,
        msg: "Connection refused. SERVER COULD NOT BE RUNNING",
        type: "negative"
      });
      console.log('Connection error:', err);
    }
  }

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
      <div className="w-full lg:w-125 flex flex-col p-8 md:p-12 overflow-y-auto">
        <Link href={'/'} className="mb-10 flex items-center gap-2">
          <div className="w-8 h-8 bg-[#00ed64] rounded-lg flex items-center justify-center">
            <ShieldCheck className="text-[#001e2b] w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-[#001e2b]">SIMPLY <span className="font-normal text-gray-400">| Register</span></span>
        </Link>

        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-[#001e2b] mb-2">Create your Simply account</h1>
          <p className="text-sm text-gray-500 mb-8">
            Start managing your visitor flow with our enterprise platform.
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Company Name */}
            <div className="space-y-1.5">
              <label className="text-[12px] font-bold text-[#001e2b] uppercase tracking-wide">Company Name</label>
              <div className="relative">
                <input
                  onChange={handleForm}
                  name='companyName'
                  value={form.companyName}
                  type="text"
                  placeholder="Acme Corp"
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md focus:border-[#00ed64] focus:ring-1 focus:ring-[#00ed64] outline-none transition-all placeholder:text-gray-400 text-[#001e2b]"
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="text-[12px] font-bold text-[#001e2b] uppercase tracking-wide">Work Email</label>
              <input
                onChange={handleForm}
                  name='email'
                  value={form.email}
                type="email"
                placeholder="admin@company.com"
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md focus:border-[#00ed64] focus:ring-1 focus:ring-[#00ed64] outline-none transition-all placeholder:text-gray-400 text-[#001e2b]"
              />
            </div>

            {/* Contact Number */}
            <div className="space-y-1.5">
              <label className="text-[12px] font-bold text-[#001e2b] uppercase tracking-wide">Contact Number</label>
              <input
                type="tel"
                onChange={handleForm}
                  name='contactNumber'
                  value={form.contactNumber}
                placeholder="+27 00 000 0000"
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md focus:border-[#00ed64] focus:ring-1 focus:ring-[#00ed64] outline-none transition-all placeholder:text-gray-400 text-[#001e2b]"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-[12px] font-bold text-[#001e2b] uppercase tracking-wide">Password</label>
              <div className="relative">
                <input
                  onChange={handleForm}
                  name='password'
                  value={form.password}
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 8 characters"
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

            <div className="py-2">
              <p className="text-[11px] text-gray-500 leading-relaxed">
                By clicking "Get Started", you agree to our <a href="#" className="text-[#00ed64] underline">Terms of Service</a> and <a href="#" className="text-[#00ed64] underline">Privacy Policy</a>.
              </p>
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
                    "Create an account"
                  )}
                </button>
          </form>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            Already have an account? <Link href="/login" className="text-[#00ed64] font-semibold hover:underline">Log In</Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 bg-[#001e2b] relative items-center justify-center overflow-hidden p-20">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#00ed64 0.5px, transparent 0.5px)', backgroundSize: '32px 32px' }}></div>
        
        <div className="relative z-10 max-w-lg">
          <div className="mb-8 p-3 bg-white/5 inline-block rounded-2xl border border-white/10">
            <Building2 className="text-[#00ed64] w-8 h-8" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
            Scale your physical security with <span className="text-[#00ed64]">automated workflows.</span>
          </h2>
          
          <div className="grid grid-cols-1 gap-8">
            {[
              { title: "Limited to no human error", desc: "Automated services by scaning" },
              { title: "Save time", desc: "No need for queues to just book a room" },
              { title: "WhatsApp Native", desc: "No apps to download. Visitors use what they already have." },
              { title: "Enterprise Grade", desc: "Encrypted data storage and deterministic identity hashing." }
            ].map((item, i) => (
              <div key={i} className="flex gap-4">
                <CheckCircle2 className="text-[#00ed64] w-6 h-6 shrink-0 mt-1" />
                <div>
                  <h4 className="text-white font-bold">{item.title}</h4>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          
        </div>
      </div>
    </div>
  );

}

export default BusinessSignUpForm;