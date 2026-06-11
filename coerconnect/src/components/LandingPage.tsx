import React from 'react';
import { motion } from "motion/react";
import { useAuth } from "../hooks/useAuth";
import { LogIn, Sparkles, Shield, Users } from "lucide-react";

export function LandingPage() {
  const { signIn } = useAuth();

  return (
    <div className="min-h-screen bg-sage text-accent font-['Urbanist'] selection:bg-accent selection:text-white">
      {/* Background patterns could be added here if needed, removing neon gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-accent opacity-[0.03] blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent opacity-[0.03] blur-[100px]" />
      </div>

      <nav className="relative z-10 max-w-7xl mx-auto px-6 py-8 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
            <span className="text-surface font-bold text-xl">C</span>
          </div>
          <span className="text-xl font-bold tracking-tight">CoerConnect</span>
        </div>
        <button 
          onClick={signIn}
          className="px-6 py-2 rounded-full border border-accent/20 text-sm font-semibold hover:bg-accent hover:text-surface transition-all duration-300"
        >
          Login
        </button>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/5 border border-accent/10 text-accent text-xs font-bold mb-6">
            <Sparkles className="w-3 h-3" />
            <span>EXCLUSIVE FOR COER FANDOM</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8 uppercase">
            YOUR <span className="opacity-40">ULTIMATE</span> SAFE SPACE & CONCERT PLANNER.
          </h1>
          <p className="text-accent/60 text-lg md:text-xl max-w-xl mb-10 leading-relaxed font-medium">
            Plan your next Cortis tour, find mutuals, and organize your concert gear in one premium minimalist space. 
          </p>
          <button 
            onClick={signIn}
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-accent text-surface font-bold rounded-2xl overflow-hidden active:scale-95 transition-transform shadow-2xl shadow-accent/20"
          >
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <LogIn className="w-5 h-5 relative z-10" />
            <span className="relative z-10">Join CoerConnect with Google</span>
          </button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <FeatureCard 
            icon={<Sparkles className="w-6 h-6 text-accent" />}
            title="Coer Space Assistant"
            description="AI-powered concert planner that knows everything about Cortis lore and concert history."
          />
          <FeatureCard 
            icon={<Users className="w-6 h-6 text-accent" />}
            title="Mutual Match"
            description="Connect with other Coers heading to the same city and concert date."
          />
          <FeatureCard 
            icon={<Shield className="w-6 h-6 text-accent" />}
            title="Secure Vault"
            description="Your travel plans and personal fandom data are encrypted and protected."
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
