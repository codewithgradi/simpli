'use client'
import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const SimplyLanding = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  } as const;

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  return (
    <div className="min-h-screen bg-[#001E2B] text-[#E8EDF0] font-sans selection:bg-[#00ED64] selection:text-[#001E2B] overflow-x-hidden scroll-smooth">
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-100 bg-[#001E2B]/80 backdrop-blur-md border-b border-[#3D4F58]/30"
      >
        <div className="flex items-center justify-between px-6 md:px-8 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <motion.div 
              whileHover={{ rotate: 135 }}
              className="w-7 h-7 md:w-8 md:h-8 bg-[#00ED64] rounded-lg rotate-45 flex items-center justify-center shadow-[0_0_20px_rgba(0,237,100,0.2)]"
            >
              <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-[#001E2B] rounded-full" />
            </motion.div>
            <span className="text-xl md:text-2xl font-black tracking-tighter text-white uppercase leading-none">SIMPLY</span>
          </div>
          
          <div className="hidden md:flex items-center gap-12 text-[11px] font-bold uppercase tracking-[0.25em] text-gray-400">
            <Link href="#workflow" className="hover:text-[#00ED64] transition-colors">About</Link>
            <Link href="#why-us" className="hover:text-[#00ED64] transition-colors">Why Us</Link>
            <Link 
              href="/login" 
              className="bg-[#00ED64] text-[#001E2B] px-6 py-2.5 rounded-lg font-black hover:brightness-110 hover:shadow-[0_0_20px_rgba(0,237,100,0.3)] transition-all active:scale-95"
            >
              Try Today
            </Link>
          </div>

          <button 
            className="md:hidden text-[#00ED64] focus:outline-none" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-[#001E2B] border-b border-[#3D4F58]/30 px-8 py-8 space-y-6 text-[10px] font-bold uppercase tracking-widest text-center"
            >
              <Link href="#workflow" onClick={() => setIsMenuOpen(false)} className="block py-2">About</Link>
              <Link href="#why-us" onClick={() => setIsMenuOpen(false)} className="block py-2">Why Us</Link>
              <Link 
                href="/login" 
                onClick={() => setIsMenuOpen(false)} 
                className="block py-4 bg-[#00ED64] text-[#001E2B] rounded-xl font-black"
              >
                Try Today
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      <main className="relative max-w-7xl mx-auto px-6 md:px-8 pt-32 md:pt-48 pb-20 md:pb-32">
        <motion.div 
          animate={{ opacity: [0.03, 0.08, 0.03], scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[10%] right-[-10%] w-64 h-64 md:w-150 md:h-150 bg-[#00ED64] blur-[120px] rounded-full -z-10" 
        />
        
        <div className="grid lg:grid-cols-2 gap-12 md:gap-24 items-center">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="space-y-6 md:space-y-10 text-center lg:text-left"
          >
            <motion.h1 variants={fadeInUp} className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.85] text-white">
              Access <br />
              <span className="text-[#00ED64]">Simply.</span>
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-lg md:text-xl text-gray-400 max-w-md mx-auto lg:mx-0 leading-relaxed font-medium">
              A frictionless security layer for the modern workspace. Instant identity verification via high-fidelity QR protocols.
            </motion.p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative group w-full max-w-112.5 mx-auto"
          >
            <div className="absolute -inset-4 bg-[#00ED64]/10 rounded-[3rem] blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
            <motion.div 
              whileHover={{ y: -10 }}
              className="relative bg-[#002E35] border border-[#3D4F58] p-8 md:p-12 rounded-4xl md:rounded-[2.5rem] shadow-2xl flex flex-col items-center"
            >
              <div className="w-full flex justify-between mb-8 md:mb-12">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#00ED64]" />
                  <div className="w-2 h-2 rounded-full bg-[#3D4F58]" />
                </div>
                <div className="text-[10px] font-mono text-[#00ED64] tracking-widest uppercase">Protocol_Active</div>
              </div>

              <motion.div 
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="p-6 md:p-8 bg-white rounded-2xl md:rounded-3xl shadow-[0_0_50px_rgba(0,237,100,0.2)]"
              >
                <div className="grid grid-cols-6 gap-1.5 md:gap-2">
                  {Array.from({ length: 36 }).map((_, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.01 + 0.5 }}
                      className={`h-4 w-4 md:h-5 md:w-5 rounded-xs ${
                        (i % 7 === 0 || i % 3 === 0) && i < 30 ? 'bg-[#001E2B]' : 'bg-gray-100'
                      } ${i === 0 || i === 5 || i === 30 ? 'bg-[#00ED64]' : ''}`} 
                    />
                  ))}
                </div>
              </motion.div>

              <div className="mt-8 md:mt-12 space-y-4 w-full">
                <div className="h-1.5 w-full bg-[#1C2D38] rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="h-full bg-[#00ED64] w-1/3" 
                  />
                </div>
                <div className="flex justify-between text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-500">
                  <span>Encrypting_</span>
                  <span>Auth_Success</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>

      <section id="workflow" className="py-20 md:py-32 bg-[#001B26] border-y border-[#3D4F58]/30">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="mb-12 md:mb-20 space-y-4 text-center md:text-left"
          >
            <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-[#00ED64]">Workflow</h2>
            <p className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight">How Simply handles <br className="md:hidden"/> your security.</p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
          >
            {[
              { step: '01', title: 'Check-In', text: 'Visitor enters credentials through the SIMPLY terminal interface.' },
              { step: '02', title: 'Hash & Sync', text: 'Data is encrypted via SHA-256 and stored in our global MongoDB cluster.' },
              { step: '03', title: 'QR Issue', text: 'A unique NanoID is generated and delivered as a QR pass via SMTP.' },
              { step: '04', title: 'Exit Scan', text: 'Visitor scans their mobile pass to release room occupancy instantly.' }
            ].map((item, i) => (
              <motion.div 
                key={i} 
                variants={fadeInUp}
                whileHover={{ y: -5, borderColor: '#00ED64' }}
                className="relative p-8 bg-[#001E2B] border border-[#3D4F58] rounded-2xl transition-all group overflow-hidden"
              >
                <div className="text-4xl font-black text-[#1C2D38] group-hover:text-[#00ED64]/10 transition-colors absolute top-4 right-6 leading-none">
                  {item.step}
                </div>
                <h3 className="text-lg font-black text-white mb-4 z-10 relative">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed z-10 relative">{item.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section id="why-us" className="py-20 md:py-32 bg-[#001E2B]">
        <div className="max-w-7xl mx-auto px-6 md:px-8 grid lg:grid-cols-2 gap-16 md:gap-20">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6 text-center lg:text-left"
          >
            <h2 className="text-5xl md:text-6xl font-black text-white tracking-tighter uppercase leading-[0.9]">Why <br className="hidden lg:block"/> Simply?</h2>
            <p className="text-base md:text-lg text-gray-400 leading-relaxed max-w-md mx-auto lg:mx-0">
              Manual logs are a security risk and an operational bottleneck. Simply digitizes the entire lifecycle of a visit.
            </p>
          </motion.div>
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 gap-4 md:gap-6"
          >
            {[
              { title: "Global Scalability", desc: "Built on MongoDB for 99.99% uptime and zero-latency syncing." },
              { title: "Privacy Focused", desc: "ID numbers are never stored in raw text. One-way hashing is standard." },
              { title: "POPIA Compliant", desc: "System removes customer data automatically after 30 days." }
            ].map((feature, i) => (
              <motion.div key={i} variants={fadeInUp} className="p-5 md:p-6 bg-[#1C2D38] rounded-xl border-l-4 border-[#00ED64]">
                <p className="font-bold text-white uppercase text-[10px] tracking-widest mb-1">{feature.title}</p>
                <p className="text-xs md:text-sm text-gray-500">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <footer className="py-10 border-t border-[#3D4F58]/30 px-6 bg-[#001B26]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-[9px] font-bold uppercase tracking-[0.2em] text-gray-600">
          <span>© 2024 Simply Protocol</span>
          <div className="flex gap-8">
            <p className="hover:text-white cursor-pointer transition-colors">Privacy</p>
            <p className="hover:text-white cursor-pointer transition-colors">Security</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SimplyLanding;