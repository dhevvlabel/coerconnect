import React from 'react';
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Loader2, ShieldCheck } from "lucide-react";
import { PlannerForm } from "./PlannerForm";
import { PlanResult } from "./PlanResult";
import { ConcertPlan, SavedPlan } from "../../types";
import { useLanguage } from "../../contexts/LanguageContext";

interface CoerSpaceProps {
  generatedPlan: ConcertPlan | null;
  setGeneratedPlan: (plan: ConcertPlan | null) => void;
  isLoading: boolean;
  setIsLoading: (val: boolean) => void;
  savePlan: (city: string, budget: number, duration: number, plan: ConcertPlan) => Promise<void>;
  editingPlan: SavedPlan | null;
}

export function CoerSpace({ generatedPlan, setGeneratedPlan, isLoading, setIsLoading, savePlan, editingPlan }: CoerSpaceProps) {
  const { t } = useLanguage();

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
              <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-accent/5 border border-accent/10 mb-8">
                 <span className="text-[10px] font-black uppercase tracking-[0.3em] text-center">COER ENGINE ASSISTANT</span>
              </div>
              <h2 className="text-6xl font-black mb-4 tracking-tighter uppercase">{t('planner')}</h2>
              <p className="text-accent/40 font-bold uppercase tracking-widest text-sm max-w-md mx-auto">
                {t('journeyStarts')}
              </p>
            </header>

            {/* SECTION EDUKASI & FAQ */}
            <div className="bg-surface border border-accent/5 p-8 md:p-10 rounded-[32px] shadow-2xl shadow-accent/5 mb-12">
              <h3 className="text-xl font-black uppercase tracking-tight mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                {t('whatIsCoerSpace')}
              </h3>
              <p className="text-sm text-accent/70 font-medium leading-relaxed">
                {t('coerSpaceExplanation')}
              </p>
            </div>

            <PlannerForm 
              onPlanGenerated={setGeneratedPlan} 
              isGenerating={isLoading} 
              setIsGenerating={setIsLoading} 
              editingPlan={editingPlan}
            />

            {/* SECTION PRIVASI & ARAHAN JELAS */}
            <div className="bg-accent/5 border border-accent/10 p-6 rounded-2xl flex items-start gap-4 mt-12">
              <div className="p-3 bg-accent/5 text-accent rounded-xl flex-shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider mb-1 flex items-center gap-2">
                  {t('dataProtected')}
                </h4>
                <p className="text-xs text-accent/60 font-semibold leading-relaxed">
                  {t('privacyExplanation')}
                </p>
              </div>
            </div>
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
                <h3 className="text-4xl font-black uppercase tracking-tighter">{t('premiumJourney')}</h3>
                <p className="text-accent/30 text-[10px] font-black uppercase tracking-[0.4em] mt-3">
                  {t('algocuration')} {generatedPlan.concert_summary.target_location}
                </p>
              </div>
              <div className="flex gap-4 w-full md:w-auto">
                <button 
                  onClick={() => setGeneratedPlan(null)}
                  className="flex-1 md:flex-none px-10 py-4 rounded-2xl text-xs font-black border border-accent/10 hover:bg-accent/5 transition-all uppercase tracking-widest"
                >
                  {t('editInput')}
                </button>
                <button 
                  onClick={() => savePlan(generatedPlan.concert_summary.target_location, 0, generatedPlan.concert_summary.estimated_days, generatedPlan)}
                  className="flex-1 md:flex-none px-10 py-4 rounded-2xl text-xs font-black bg-accent text-surface hover:opacity-90 transition-all uppercase tracking-widest shadow-2xl shadow-accent/20"
                >
                  {t('archivePlan')}
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
