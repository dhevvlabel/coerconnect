import React, { useState } from "react";
import { ConcertPlan } from "../../types";
import { Sparkles, Loader2, MapPin, Wallet, Calendar } from "lucide-react";
import { cn } from "../../lib/utils";

interface PlannerFormProps {
  onPlanGenerated: (plan: ConcertPlan) => void;
  isGenerating: boolean;
  setIsGenerating: (val: boolean) => void;
}

export function PlannerForm({ onPlanGenerated, isGenerating, setIsGenerating }: PlannerFormProps) {
  const [city, setCity] = useState("Incheon");
  const [budget, setBudget] = useState("5000000");
  const [duration, setDuration] = useState(3);

  const cities = ["Incheon", "Seoul", "Tokyo", "LA"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      const response = await fetch("/api/planner/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city, budget: Number(budget), duration }),
      });

      if (!response.ok) throw new Error("Failed to generate plan");
      
      const data = await response.json();
      onPlanGenerated(data);
    } catch (error) {
      console.error(error);
      alert("Something went wrong while talking to the AI assistant.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-12 bg-surface border border-accent/5 p-12 rounded-[48px] shadow-2xl shadow-accent/5">
      <div className="space-y-8">
        <div>
          <label className="text-[10px] font-black uppercase tracking-[0.4em] text-accent/40 mb-4 block">Target Location</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {cities.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCity(c)}
                className={cn(
                  "px-6 py-4 rounded-2xl border text-xs font-black transition-all flex items-center justify-center gap-2 uppercase tracking-widest",
                  city === c 
                    ? "bg-accent text-surface border-accent shadow-xl shadow-accent/20" 
                    : "bg-sage/5 border-accent/5 text-accent/40 hover:border-accent/20"
                )}
              >
                <MapPin className="w-3.5 h-3.5" />
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative group">
            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-accent/40 mb-4 block">Budget (IDR)</label>
            <div className="relative">
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="e.g. 5000000"
                className="w-full bg-sage/5 border border-accent/5 rounded-2xl px-6 py-5 outline-none focus:border-accent/40 focus:ring-4 focus:ring-accent/5 transition-all font-black text-lg placeholder:text-accent/10"
              />
              <Wallet className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-accent/20 transition-colors group-focus-within:text-accent" />
            </div>
          </div>

          <div className="relative group">
            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-accent/40 mb-4 block">Duration (Days)</label>
            <div className="relative">
              <input
                type="number"
                min="1"
                max="14"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full bg-sage/5 border border-accent/5 rounded-2xl px-6 py-5 outline-none focus:border-accent/40 focus:ring-4 focus:ring-accent/5 transition-all font-black text-lg"
              />
              <Calendar className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-accent/20 transition-colors group-focus-within:text-accent" />
            </div>
          </div>
        </div>
      </div>

      <button
        disabled={isGenerating}
        className="w-full py-6 bg-accent text-surface rounded-[28px] font-black text-xl tracking-tighter hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed group shadow-2xl shadow-accent/20 uppercase"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Summoning Assistant...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
            <span>GENERATE MY PLAN</span>
          </>
        )}
      </button>
      
      <p className="text-center text-[10px] text-accent/20 uppercase tracking-[0.4em] font-black">
        Powered by CoerConnect AI Engine
      </p>
    </form>
  );
}
