import React, { useState } from "react";
import { ConcertPlan, SavedPlan } from "../../types";
import { Loader2, MapPin, Wallet, Calendar, AlertTriangle, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { motion, AnimatePresence } from "motion/react";

interface PlannerFormProps {
  onPlanGenerated: (plan: ConcertPlan) => void;
  isGenerating: boolean;
  setIsGenerating: (val: boolean) => void;
  editingPlan?: SavedPlan | null;
}

export function PlannerForm({ onPlanGenerated, isGenerating, setIsGenerating, editingPlan }: PlannerFormProps) {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  
  // Concert selection list
  const concerts = [
    { id: "Incheon", label: "Incheon, South Korea (Inspire Arena) [18-19 Juli 2026]" },
    { id: "Toronto", label: "Toronto, Canada (The Theatre at Great Canadian) [4 Agustus 2026]" },
    { id: "New York", label: "New York, USA (Madison Square Garden) [6 Agustus 2026]" },
    { id: "Atlanta", label: "Atlanta, USA (Fox Theatre) [8 Agustus 2026]" },
    { id: "Irving", label: "Irving, USA (The Pavilion at Toyota Music Factory) [11 Agustus 2026]" },
    { id: "Los Angeles", label: "Los Angeles, USA (YouTube Theater) [13 Agustus 2026]" },
    { id: "San Francisco", label: "San Francisco, USA (Bill Graham Civic Auditorium) [15-16 Agustus 2026]" },
    { id: "Seoul", label: "Seoul, South Korea (Hwajeong Tiger Dome) [22-23 Agustus 2026]" },
    { id: "Kanagawa", label: "Kanagawa, Japan (Pia Arena MM) [4-6 September 2026]" }
  ];

  const [selectedConcert, setSelectedConcert] = useState(concerts[0].label);
  const [origin, setOrigin] = useState("Jakarta, Indonesia");
  const [budget, setBudget] = useState("15.000.000");

  // Currency logic
  const getCurrency = (location: string) => {
    if (location.includes("Indonesia")) return "IDR";
    if (location.includes("Malaysia")) return "MYR";
    if (location.includes("Singapore")) return "SGD";
    if (location.includes("Philippines")) return "PHP";
    if (location.includes("Thailand")) return "THB";
    return "USD";
  };

  const currency = getCurrency(origin);

  // Formatting logic
  const formatNumber = (val: string) => {
    const numeric = val.replace(/\D/g, "");
    if (!numeric) return "";
    return numeric.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleOriginChange = (newOrigin: string) => {
    setOrigin(newOrigin);
    const newCurrency = getCurrency(newOrigin);
    switch (newCurrency) {
      case "IDR": setBudget("15.000.000"); break;
      case "SGD": setBudget("1.200"); break;
      case "MYR": setBudget("4.000"); break;
      case "PHP": setBudget("50.000"); break;
      case "THB": setBudget("30.000"); break;
      default: setBudget("1.000");
    }
  };

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBudget(formatNumber(e.target.value));
  };

  const budgetNum = Number(budget.replace(/\./g, "")) || 0;
  const todayStr = new Date().toISOString().split('T')[0];
  const inThreeDaysStr = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [departDate, setDepartDate] = useState(todayStr);
  const [returnDate, setReturnDate] = useState(inThreeDaysStr);

  React.useEffect(() => {
    if (editingPlan) {
      const match = concerts.find(c => c.id === editingPlan.city || c.label.includes(editingPlan.city));
      setSelectedConcert(match ? match.label : concerts[0].label);
      setOrigin(editingPlan.origin || "Jakarta, Indonesia");
      setBudget(formatNumber(String(editingPlan.budget)));
      setDepartDate(editingPlan.departDate || todayStr);
      setReturnDate(editingPlan.returnDate || inThreeDaysStr);
      setCurrentStep(2); // Directly configure the parameters
    }
  }, [editingPlan]);

  const getDuration = () => {
    if (!departDate || !returnDate) return 3;
    const t1 = new Date(departDate).getTime();
    const t2 = new Date(returnDate).getTime();
    const diff = t2 - t1;
    return diff < 0 ? 1 : Math.max(1, Math.ceil(diff / (1000 * 3600 * 24)));
  };

  const duration = getDuration();

  const getThreshold = (curr: string) => {
    switch (curr) {
      case "IDR": return 12000000;
      case "SGD": return 1100;
      case "MYR": return 3500;
      case "PHP": return 45000;
      case "THB": return 27000;
      default: return 800;
    }
  };

  const isBudgetInsufficient = budgetNum < getThreshold(currency);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isBudgetInsufficient) return;
    setIsGenerating(true);

    try {
      const response = await fetch("/api/planner/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          city: selectedConcert, 
          budget: budgetNum, 
          currency,
          duration,
          origin,
          departDate,
          returnDate
        }),
      });

      if (!response.ok) throw new Error("Failed to generate plan");
      const data = await response.json();
      const planWithInputs = {
        ...data,
        inputs: {
          selectedConcert,
          origin,
          budget,
          departDate,
          returnDate
        }
      };
      onPlanGenerated(planWithInputs);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 5));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const stepVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  return (
    <div className="bg-surface border border-accent/5 p-8 md:p-12 rounded-[48px] shadow-2xl shadow-accent/5 font-sans min-h-[500px] flex flex-col">
      <AnimatePresence mode="wait">
        {currentStep === 1 && (
          <motion.div key="step1" {...stepVariants} className="flex-1 flex flex-col items-center justify-center text-center space-y-8">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight max-w-2xl">
              {t('wizardIntroTitle')}
            </h2>
            <button
              onClick={nextStep}
              className="px-12 py-5 bg-accent text-surface rounded-full font-black text-lg tracking-widest uppercase hover:scale-105 active:scale-95 transition-all shadow-xl shadow-accent/20"
            >
              {t('start')}
            </button>
          </motion.div>
        )}

        {currentStep === 2 && (
          <motion.div key="step2" {...stepVariants} className="flex-1 flex flex-col justify-center space-y-8">
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-accent/40 mb-6 block text-center">
                {t('selectConcertLabel')}
              </label>
              <div className="relative group max-w-xl mx-auto">
                <select
                  value={selectedConcert}
                  onChange={(e) => setSelectedConcert(e.target.value)}
                  className="w-full bg-sage/5 border border-accent/10 rounded-2xl pl-8 pr-16 py-6 outline-none focus:border-accent/40 focus:ring-4 focus:ring-accent/5 transition-all font-bold text-base text-accent appearance-none cursor-pointer"
                >
                  {concerts.map((concert) => (
                    <option key={concert.id} value={concert.label} className="bg-sage text-accent">
                      {concert.label}
                    </option>
                  ))}
                </select>
                <MapPin className="absolute right-8 top-1/2 -translate-y-1/2 w-6 h-6 text-accent/20 pointer-events-none group-focus-within:text-accent" />
              </div>
            </div>
          </motion.div>
        )}

        {currentStep === 3 && (
          <motion.div key="step3" {...stepVariants} className="flex-1 flex flex-col justify-center space-y-8">
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-accent/40 mb-6 block text-center">
                {t('originLabel')}
              </label>
              <div className="relative group max-w-xl mx-auto">
                <select
                  value={origin}
                  onChange={(e) => handleOriginChange(e.target.value)}
                  className="w-full bg-sage/5 border border-accent/10 rounded-2xl pl-8 pr-16 py-6 outline-none focus:border-accent/40 focus:ring-4 focus:ring-accent/5 transition-all text-base font-bold text-accent appearance-none cursor-pointer"
                >
                  <option value="Jakarta, Indonesia">Jakarta, Indonesia</option>
                  <option value="Bandung, Indonesia">Bandung, Indonesia</option>
                  <option value="Surabaya, Indonesia">Surabaya, Indonesia</option>
                  <option value="Medan, Indonesia">Medan, Indonesia</option>
                  <option value="Kuala Lumpur, Malaysia">Kuala Lumpur, Malaysia</option>
                  <option value="Singapore, Singapore">Singapore, Singapore</option>
                  <option value="Bangkok, Thailand">Bangkok, Thailand</option>
                  <option value="Manila, Philippines">Manila, Philippines</option>
                </select>
                <ChevronDown className="absolute right-8 top-1/2 -translate-y-1/2 w-6 h-6 text-accent/20 pointer-events-none group-focus-within:text-accent" />
              </div>
            </div>
          </motion.div>
        )}

        {currentStep === 4 && (
          <motion.div key="step4" {...stepVariants} className="flex-1 flex flex-col justify-center space-y-8">
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-accent/40 mb-6 block text-center">
                {t('budgetLabel')} ({currency})
              </label>
              <div className="relative group max-w-md mx-auto">
                <input
                  type="text"
                  value={budget}
                  onChange={handleBudgetChange}
                  placeholder="0"
                  className="w-full bg-sage/5 border border-accent/10 rounded-2xl px-8 py-6 outline-none focus:border-accent/40 focus:ring-4 focus:ring-accent/5 transition-all font-black text-2xl text-accent text-center"
                />
                <Wallet className="absolute right-8 top-1/2 -translate-y-1/2 w-6 h-6 text-accent/20 group-focus-within:text-accent transition-colors" />
              </div>
              {isBudgetInsufficient && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 p-6 bg-red-500/5 border border-red-500/20 rounded-[24px] text-red-500 flex gap-4 items-start max-w-xl mx-auto">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div className="text-xs font-semibold leading-relaxed">{t('budgetWarning')}</div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {currentStep === 5 && (
          <motion.div key="step5" {...stepVariants} className="flex-1 flex flex-col justify-center space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto w-full">
              <div className="group w-full">
                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-accent/40 mb-4 block text-center">
                  {t('departureDateLabel')}
                </label>
                <div className="relative w-full flex items-center">
                  <input
                    type="date"
                    value={departDate}
                    onChange={(e) => setDepartDate(e.target.value)}
                    className="w-full bg-sage/5 border border-accent/10 rounded-2xl pl-14 pr-14 py-5 outline-none focus:border-accent/40 focus:ring-4 focus:ring-accent/5 transition-all font-bold text-sm text-accent cursor-pointer text-center appearance-none"
                  />
                  <Calendar className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-accent/20 pointer-events-none group-focus-within:text-accent" />
                </div>
              </div>
              <div className="group w-full">
                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-accent/40 mb-4 block text-center">
                  {t('returnDateLabel')}
                </label>
                <div className="relative w-full flex items-center">
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full bg-sage/5 border border-accent/10 rounded-2xl pl-14 pr-14 py-5 outline-none focus:border-accent/40 focus:ring-4 focus:ring-accent/5 transition-all font-bold text-sm text-accent cursor-pointer text-center appearance-none"
                  />
                  <Calendar className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-accent/20 pointer-events-none group-focus-within:text-accent" />
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <span className="text-[10px] font-black uppercase tracking-widest bg-accent/[0.04] border border-accent/10 px-6 py-3 rounded-full text-accent/60">
                {duration} {t('day')}
              </span>
            </div>
            {isBudgetInsufficient && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 p-6 bg-red-500/5 border border-red-500/20 rounded-[24px] text-red-500 flex gap-4 items-start max-w-xl mx-auto">
                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div className="text-xs font-semibold leading-relaxed">{t('budgetWarning')}</div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* NAVIGATION BUTTONS */}
      {currentStep > 1 && (
        <div className="pt-12 flex items-stretch justify-center mt-auto max-w-xl mx-auto w-full gap-4 md:gap-6">
          <button
            onClick={prevStep}
            className="flex-1 py-3.5 px-4 bg-accent/5 text-accent rounded-2xl font-black text-[10px] tracking-[0.15em] uppercase hover:bg-accent/10 transition-all flex items-center justify-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="truncate">{t('back')}</span>
          </button>

          {currentStep < 5 ? (
            <button
              onClick={nextStep}
              className="flex-1 py-3.5 px-4 bg-accent text-surface rounded-2xl font-black text-[10px] tracking-[0.15em] uppercase hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-accent/10"
            >
              <span className="truncate">{t('next')}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isGenerating || isBudgetInsufficient}
              className={`py-3.5 px-4 md:px-6 bg-accent text-surface rounded-2xl font-black text-[10px] tracking-[0.15em] uppercase hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-accent/20 ${
                isGenerating ? "flex-[2.2]" : "flex-[1.5]"
              }`}
            >
              {isGenerating ? (
                <span className="whitespace-nowrap">{t('summoningAssistant')}</span>
              ) : (
                <span className="whitespace-nowrap">{t('generateMyPlan')}</span>
              )}
            </button>
          )}
        </div>
      )}

      <p className="text-center text-[8px] text-accent/10 uppercase tracking-[0.4em] font-black mt-12">
        Powered by CoerConnect AI Engine • Step {currentStep} of 5
      </p>
    </div>
  );
}
