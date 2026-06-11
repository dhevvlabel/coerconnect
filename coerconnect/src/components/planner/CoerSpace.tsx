import React from 'react';
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Loader2 } from "lucide-react";
import { PlannerForm } from "./PlannerForm";
import { PlanResult } from "./PlanResult";
import { ConcertPlan } from "../../types";

interface CoerSpaceProps {
  generatedPlan: ConcertPlan | null;
  setGeneratedPlan: (plan: ConcertPlan | null) => void;
  isLoading: boolean;
  setIsLoading: (val: boolean) => void;
  savePlan: (city: string, budget: number, duration: number, plan: ConcertPlan) => Promise<void>;
}

export function CoerSpace({ generatedPlan, setGeneratedPlan, isLoading, setIsLoading, savePlan }: CoerSpaceProps) {
  return (
    <div className="space-y-12 pb-20">
      <AnimatePresence mode="wait">
        {!generatedPlan ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-2xl mx-auto"
          >
            <header className="mb-12 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/5 border border-accent/10 mb-8">
                 <Sparkles className="w-4 h-4 text-accent" />
                 <span className="text-[10px] font-black uppercase tracking-[0.3em]">AI CONCERT ENGINE</span>
              </div>
              <h2 className="text-6xl font-black mb-4 tracking-tighter uppercase">COER SPACE</h2>
              <p className="text-accent/40 font-bold uppercase tracking-widest text-sm max-w-md mx-auto">
                Your high-end curated journey through the Cortis world begins here.
              </p>
            </header>
            <PlannerForm onPlanGenerated={setGeneratedPlan} isGenerating={isLoading} setIsGenerating={setIsLoading} />
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="flex flex-col md:flex-row justify-between items-center bg-surface p-10 rounded-[48px] border border-accent/5 shadow-2xl shadow-accent/5 gap-8">
              <div>
                <h3 className="text-4xl font-black uppercase tracking-tighter">PREMIUM JOURNEY</h3>
                <p className="text-accent/30 text-[10px] font-black uppercase tracking-[0.4em] mt-3">
                  Algorithmically curated for {generatedPlan.concert_summary.target_location}
                </p>
              </div>
              <div className="flex gap-4 w-full md:w-auto">
                <button 
                  onClick={() => setGeneratedPlan(null)}
                  className="flex-1 md:flex-none px-10 py-4 rounded-2xl text-xs font-black border border-accent/10 hover:bg-accent/5 transition-all uppercase tracking-widest"
                >
                  Edit Input
                </button>
                <button 
                  onClick={() => savePlan(generatedPlan.concert_summary.target_location, 0, generatedPlan.concert_summary.estimated_days, generatedPlan)}
                  className="flex-1 md:flex-none px-10 py-4 rounded-2xl text-xs font-black bg-accent text-surface hover:opacity-90 transition-all uppercase tracking-widest shadow-2xl shadow-accent/20"
                >
                  Archive Plan
                </button>
              </div>
            </div>
            <PlanResult plan={generatedPlan} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
