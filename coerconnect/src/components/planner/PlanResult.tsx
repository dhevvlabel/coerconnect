import React from 'react';
import { ConcertPlan } from "../../types";
import { cn } from "../../lib/utils";
import { 
  CheckCircle2, 
  Circle, 
  MapPin, 
  Clock, 
  Wallet, 
  Package, 
  Palette,
  TrendingUp,
  Info
} from "lucide-react";
import { motion } from "motion/react";
import { useLanguage } from "../../contexts/LanguageContext";

interface PlanResultProps {
  plan: ConcertPlan;
}

export function PlanResult({ plan }: PlanResultProps) {
  const { t } = useLanguage();
  const { concert_summary, budget_allocation, itinerary, dresscode_recommendations, concert_kit_checklist } = plan;

  return (
    <div className="space-y-12">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label={t('location')} value={concert_summary.target_location} icon={<MapPin className="w-4 h-4" />} />
        <StatCard label={t('duration')} value={`${concert_summary.estimated_days} ${t('days')}`} icon={<Clock className="w-4 h-4" />} />
        <StatCard label={t('totalBudget')} value={concert_summary.total_budget_needed} icon={<Wallet className="w-4 h-4" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-12">
          {/* Itinerary */}
          <section>
            <h4 className="text-lg font-black mb-10 flex items-center gap-3 uppercase tracking-[0.2em]">
              <Clock className="text-accent w-5 h-5" />
              {t('itinerary')}
            </h4>
            <div className="space-y-12 relative before:absolute before:left-[19px] before:top-4 before:bottom-0 before:w-px before:bg-accent/10">
              {itinerary.map((day) => (
                <div key={day.day} className="relative pl-14">
                  <div className="absolute left-0 top-0 w-10 h-10 rounded-2xl bg-accent flex items-center justify-center font-black text-surface z-10 shadow-2xl shadow-accent/20 text-lg uppercase">
                    {day.day}
                  </div>
                  <h5 className="text-2xl font-black mb-6 pt-1 leading-none uppercase tracking-tight">{t('day')} {day.day}</h5>
                  <div className="space-y-6">
                    {day.activities.map((act, idx) => (
                      <div key={idx} className="p-8 rounded-[32px] bg-surface border border-accent/5 shadow-xl shadow-accent/5 hover:border-accent/10 transition-all duration-500 group">
                        <div className="flex justify-between items-start mb-4">
                           <span className="text-[10px] font-black tracking-[0.2em] text-accent/60 bg-accent/5 px-4 py-1.5 rounded-full uppercase">{act.time}</span>
                        </div>
                        <p className="text-xl font-black mb-3 uppercase leading-tight group-hover:text-accent transition-colors">{act.activity}</p>
                        <div className="flex items-start gap-3 text-xs text-accent/40 font-bold uppercase tracking-tight">
                           <Info className="w-4 h-4 mt-0.5 shrink-0 opacity-50" />
                           <p className="italic leading-relaxed">{act.tips}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-10">
          {/* Budget */}
          <section className="p-10 rounded-[48px] bg-surface border border-accent/5 shadow-2xl shadow-accent/5">
            <h4 className="text-sm font-black mb-8 flex items-center gap-3 uppercase tracking-[0.2em]">
              <TrendingUp className="text-accent w-4 h-4" />
              {t('budget')}
            </h4>
            <div className="space-y-6">
              {budget_allocation.map((item, idx) => (
                <div key={idx} className="p-6 rounded-3xl bg-sage/5 border border-accent/5">
                   <div className="flex justify-between items-end mb-3">
                      <span className="text-[10px] font-black text-accent/40 uppercase tracking-widest">{item.category}</span>
                      <span className="text-xs font-black text-accent">{item.percentage}%</span>
                   </div>
                   <div className="h-1.5 w-full bg-accent/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-accent rounded-full shadow-[0_0_10px_rgba(0,0,0,0.1)]" 
                        style={{ width: `${item.percentage}%` }}
                      />
                   </div>
                </div>
              ))}
            </div>
          </section>

          {/* Checklist */}
          <section className="p-10 rounded-[48px] bg-surface border border-accent/5 shadow-2xl shadow-accent/5">
            <h4 className="text-sm font-black mb-8 flex items-center gap-3 uppercase tracking-[0.2em]">
              <Package className="text-accent w-4 h-4" />
              {t('concertKit')}
            </h4>
            <div className="space-y-4">
              {concert_kit_checklist.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 group cursor-pointer p-3 hover:bg-sage/5 rounded-2xl transition-all">
                  {item.urgency === 'Wajib' ? (
                    <CheckCircle2 className="w-5 h-5 text-accent" />
                  ) : (
                    <Circle className="w-5 h-5 text-accent/20" />
                  )}
                  <span className={cn(
                    "text-xs uppercase tracking-tight",
                    item.urgency === 'Wajib' ? 'font-black' : 'text-accent/30 font-bold opacity-50'
                  )}>
                    {item.item}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Dresscode */}
          <section className="p-10 rounded-[48px] bg-surface border border-accent/5 shadow-2xl shadow-accent/5">
            <h4 className="text-sm font-black mb-8 flex items-center gap-3 uppercase tracking-[0.2em]">
              <Palette className="text-accent w-4 h-4" />
              {t('dresscode')}
            </h4>
            <p className="text-xs font-black text-accent/40 mb-6 px-1 uppercase tracking-widest leading-relaxed">{dresscode_recommendations.concept}</p>
            <div className="flex gap-3 mb-10 px-1 flex-wrap">
              {dresscode_recommendations.color_palette.map((color, idx) => (
                <div 
                  key={idx} 
                  className="w-12 h-12 rounded-full border border-accent/10 shadow-xl"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {dresscode_recommendations.items.map((item, idx) => (
                <div key={idx} className="px-4 py-2 rounded-xl bg-sage/10 text-[10px] font-black text-accent/60 border border-accent/5 uppercase tracking-widest leading-none">
                  {item}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string, value: string, icon: React.ReactNode }) {
  return (
    <div className="p-8 rounded-[40px] bg-surface border border-accent/5 backdrop-blur-sm shadow-xl shadow-accent/5">
      <div className="flex items-center gap-2 text-accent mb-3 uppercase tracking-[0.3em] text-[10px] font-black opacity-40">
        {icon}
        {label}
      </div>
      <p className="text-3xl font-black truncate leading-none uppercase tracking-tighter">{value}</p>
    </div>
  );
}
