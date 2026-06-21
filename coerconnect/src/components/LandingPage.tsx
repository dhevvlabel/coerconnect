import React, { useState } from 'react';
import { motion } from "motion/react";
import { useAuth } from "../hooks/useAuth";
import { LogIn, Sparkles, Shield, Users, Globe } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import cortisBg from "../assets/images/cortis_abstract_logo_1781202290639.jpg";

export function LandingPage() {
  const { signIn } = useAuth();
  const { t, language, setLanguage } = useLanguage();

  return (
    <div className="min-h-screen bg-transparent text-accent font-sans selection:bg-accent selection:text-white relative z-10">
      {/* Hardware-accelerated, layered overlay fixed background */}
      <div className="fixed inset-0 z-[-10] overflow-hidden pointer-events-none" id="landing-background-container">
        <img 
          src="https://cdn.phototourl.com/free/2026-06-16-eed4309f-0cd6-47a1-842b-e7e08dc7329b.jpg"
          alt="Premium Background"
          className="landing-optimized-bg"
          referrerPolicy="no-referrer"
          onError={(e) => {
            // Fallback to local image or high-quality Unsplash concert image if loaded image fails
            const target = e.currentTarget;
            if (target.src !== cortisBg) {
              target.src = cortisBg;
            } else {
              const fallbackUrl = "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1600&auto=format&fit=crop&q=80";
              if (target.src !== fallbackUrl) {
                target.src = fallbackUrl;
              } else {
                // Gracefully hide the background container to reveal the default solid sage-green fallback background of body
                const container = document.getElementById("landing-background-container");
                if (container) {
                  container.style.display = "none";
                }
              }
            }
          }}
        />
        {/* Dark transparent overlay */}
        <div className="absolute inset-0 bg-black/15" />
      </div>

      {/* Background patterns */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-accent opacity-[0.03] blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent opacity-[0.03] blur-[100px]" />
      </div>

      <nav className="relative z-[2000] max-w-7xl mx-auto px-6 pt-5 pb-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
            <span className="text-surface font-bold text-xl">C</span>
          </div>
          <span className="text-xl font-bold tracking-tight">CoerConnect</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 text-accent/40 group-focus-within:text-accent transition-colors" />
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="bg-accent/5 border border-accent/10 rounded-full pl-9 pr-6 py-2.5 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-accent/40 appearance-none cursor-pointer transition-all hover:bg-accent/10"
            >
              <option value="ID">ID 🇮🇩</option>
              <option value="KR">KR 🇰🇷</option>
              <option value="EN">EN 🇺🇸</option>
            </select>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-4 md:pt-8 pb-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/5 border border-accent/10 text-accent text-xs font-bold mb-3 uppercase">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="w-3.5 h-3.5 flex-shrink-0"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 18c3-8 11-8 16-4" />
              <circle cx="4" cy="18" r="2.2" fill="currentColor" />
              <circle cx="11" cy="10" r="2.2" fill="currentColor" />
              <circle cx="20" cy="14" r="2.2" fill="currentColor" />
            </svg>
            <span>{t('exclusiveFandom')}</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-4 uppercase">
             {t('heroTitle').split('...')[0]} <span className="opacity-40">{t('heroTitle').includes('...') ? '...' : ''}</span>
          </h1>
          <div 
            className="max-w-xl p-4 rounded-xl border border-white/30 shadow-lg mb-6"
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.7)', 
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)' 
            }}
          >
            <p className="text-gray-900 text-base md:text-lg leading-relaxed font-semibold">
              {t('heroDescription')}
            </p>
          </div>
          <button 
            onClick={signIn}
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-accent text-surface font-bold rounded-2xl overflow-hidden active:scale-95 transition-transform shadow-2xl shadow-accent/20"
          >
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <LogIn className="w-5 h-5 relative z-10" />
            <span className="relative z-10">{t('joinWithGoogle')}</span>
          </button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mt-16 md:mt-24 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <FeatureCard 
            icon={<Sparkles className="w-6 h-6 text-accent" />}
            title={t('aiAssistantTitle')}
            description={t('aiAssistantDesc')}
          />
          <FeatureCard 
            icon={<Users className="w-6 h-6 text-accent" />}
            title={t('mutualMatchTitle')}
            description={t('mutualMatchDesc')}
          />
          <FeatureCard 
            icon={<Shield className="w-6 h-6 text-accent" />}
            title={t('secureVaultTitle')}
            description={t('secureVaultDesc')}
          />
        </motion.div>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 rounded-[32px] bg-surface border border-accent/5 shadow-xl shadow-accent/5 hover:border-accent/20 transition-all duration-500 group">
      <div className="w-12 h-12 rounded-2xl bg-accent/5 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-accent group-hover:text-surface transition-all duration-500">
        <div className="group-hover:text-white transition-colors">
          {icon}
        </div>
      </div>
      <h3 className="text-xl font-black mb-3 uppercase tracking-tight">{title}</h3>
      <p className="text-accent/60 leading-relaxed text-sm font-medium">{description}</p>
    </div>
  );
}
