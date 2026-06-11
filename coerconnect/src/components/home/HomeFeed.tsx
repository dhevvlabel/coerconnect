import React from 'react';
import { motion } from "motion/react";
import { Calendar, MapPin, Trash2, ChevronRight, MessageSquare, TrendingUp, Clock, Sparkles } from "lucide-react";
import { SavedPlan } from "../../types";

interface HomeFeedProps {
  user: any;
  savedPlans: SavedPlan[];
  deletePlan: (id: string) => Promise<void>;
  viewPlan: (plan: SavedPlan) => void;
  startPlanning: () => void;
}

export function HomeFeed({ user, savedPlans, deletePlan, viewPlan, startPlanning }: HomeFeedProps) {
  return (
    <div className="space-y-16">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-6xl font-black tracking-tighter mb-4 uppercase">
            HALO, <span className="text-accent">{user?.displayName?.split(' ')[0]}</span>
          </h2>
          <p className="text-accent/40 font-black uppercase tracking-[0.3em] text-sm flex items-center gap-3">
            <span className="w-8 h-px bg-accent/20" />
            CONCERT HUB & SOCIAL FEED
          </p>
        </div>
        <div className="hidden lg:block">
          <div className="px-6 py-4 bg-surface border border-accent/10 rounded-2xl flex items-center gap-4 shadow-2xl shadow-accent/5">
            <div className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent/50">COER NETWORK ACTIVE</span>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Social Hub */}
        <div className="lg:col-span-8 space-y-12">
          
          {/* Community Feed Placeholder */}
          <section className="space-y-8">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black flex items-center gap-3 uppercase tracking-[0.4em] text-accent/40">
                <MessageSquare className="w-4 h-4" />
                COER COMMUNITY FEED
              </h4>
              <button className="text-[10px] font-black uppercase tracking-widest text-accent/30 hover:text-accent transition-colors">View All</button>
            </div>
            
            <div className="space-y-4">
              <FeedItem 
                author="Martina_99" 
                content="Anyone going to the Seoul stop for <PUT YOUR PHONE DOWN>? I'm looking for a soundcheck buddy! 💚" 
                time="2m ago" 
              />
              <FeedItem 
                author="Keonho_Bias" 
                content="The new REDRED visual concept is actually insane. How are we surviving this comeback??" 
                time="15m ago" 
              />
              <div className="p-8 rounded-[40px] border-2 border-dashed border-accent/5 bg-surface/50 flex items-center justify-center">
                <p className="text-[10px] font-black text-accent/20 uppercase tracking-[0.3em]">Join the discussion in real-time</p>
              </div>
            </div>
          </section>

          {/* Trending Discussions */}
          <section className="space-y-8">
            <h4 className="text-xs font-black flex items-center gap-3 uppercase tracking-[0.4em] text-accent/40">
              <TrendingUp className="w-4 h-4" />
              TRENDING DISCUSSIONS
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TrendingCard tag="#PYPD_Tour" count="12.4K Posts" />
              <TrendingCard tag="#Cortis_GREENGREEN" count="8.1K Posts" />
            </div>
          </section>
        </div>

        {/* Right Column: Plans & Schedule */}
        <div className="lg:col-span-4 space-y-12">
          
          {/* Saved Plans Card */}
          <section className="space-y-6">
            <h4 className="text-xs font-black flex items-center gap-3 uppercase tracking-[0.4em] text-accent/40">
              <Calendar className="w-4 h-4" />
              SAVED CONCERT PLANS
            </h4>
            
            {savedPlans.length > 0 ? (
              <div className="space-y-4">
                {savedPlans.slice(0, 2).map(plan => (
                  <div key={plan.id} className="group p-8 rounded-[40px] bg-surface border border-accent/5 hover:border-accent/20 transition-all duration-500 relative overflow-hidden shadow-xl shadow-accent/5">
                    <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => { e.stopPropagation(); deletePlan(plan.id); }}
                        className="p-3 rounded-2xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-3 text-accent text-[10px] font-black uppercase tracking-[0.3em] mb-4">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{plan.city}</span>
                    </div>
                    <h5 className="text-xl font-black mb-1 uppercase leading-none">{plan.city} TOUR</h5>
                    <p className="text-accent/30 text-[10px] font-bold mb-6 uppercase tracking-widest leading-relaxed">
                      Your generated concert journey is just a few clicks away, by Coer, for Coer.
                    </p>
                    <button 
                      onClick={() => viewPlan(plan)}
                      className="w-full flex items-center justify-between px-6 py-4 rounded-2xl bg-sage/10 hover:bg-accent hover:text-surface transition-all text-[10px] font-black uppercase tracking-[0.3em]"
                    >
                      View Journey
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {savedPlans.length > 2 && (
                   <div className="text-center">
                      <button className="text-[10px] font-black uppercase tracking-widest text-accent/30 hover:text-accent transition-colors">See all {savedPlans.length} plans</button>
                   </div>
                )}
              </div>
            ) : (
              <div className="p-10 rounded-[40px] bg-surface border border-accent/5 shadow-2xl shadow-accent/5 text-center">
                <div className="w-16 h-16 bg-sage/10 rounded-full flex items-center justify-center mx-auto mb-6">
                   <img src="/src/assets/images/cortis_abstract_logo_1781202290639.jpg" alt="Logo" className="w-8 h-8 opacity-20 filter grayscale" />
                </div>
                <p className="text-accent/40 mb-8 font-bold uppercase tracking-widest text-[10px] leading-relaxed">
                  Your generated concert journey is just a few clicks away, by Coer, for Coer.
                </p>
                <button 
                  onClick={startPlanning}
                  className="w-full py-4 bg-accent text-surface font-black rounded-2xl hover:opacity-90 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Create Your Kit
                </button>
              </div>
            )}
          </section>

          {/* Upcoming Schedule */}
          <section className="space-y-6">
            <h4 className="text-xs font-black flex items-center gap-3 uppercase tracking-[0.4em] text-accent/40">
              <Clock className="w-4 h-4" />
              CORTIS SCHEDULE
            </h4>
            <div className="p-8 rounded-[40px] bg-accent text-surface shadow-2xl shadow-accent/20 space-y-6">
              <ScheduleItem title="Incheon World Tour Stop" date="June 15, 2026" />
              <div className="h-px bg-surface/10" />
              <ScheduleItem title="GREENGREEN Special Live" date="June 20, 2026" />
              <div className="h-px bg-surface/10" />
              <ScheduleItem title="Martin's Birthday V-Live" date="June 28, 2026" />
            </div>
          </section>
        </div>

      </div>
    </div>
  );
}

function FeedItem({ author, content, time }: { author: string, content: string, time: string }) {
  return (
    <div className="p-8 rounded-[32px] bg-surface border border-accent/5 shadow-xl shadow-accent/5 hover:border-accent/10 transition-all">
      <div className="flex justify-between items-center mb-4">
        <span className="text-[10px] font-black uppercase tracking-widest text-accent">{author}</span>
        <span className="text-[10px] font-bold text-accent/20 uppercase tracking-widest">{time}</span>
      </div>
      <p className="text-accent/70 font-semibold leading-relaxed tracking-tight">{content}</p>
    </div>
  );
}

function TrendingCard({ tag, count }: { tag: string, count: string }) {
  return (
    <div className="p-8 rounded-[32px] bg-surface border border-accent/5 shadow-xl shadow-accent/5 hover:bg-accent hover:text-surface transition-all group">
      <h5 className="text-xl font-black mb-2 uppercase tracking-tighter">{tag}</h5>
      <p className="text-[10px] font-black uppercase tracking-widest opacity-40 group-hover:opacity-60">{count}</p>
    </div>
  );
}

function ScheduleItem({ title, date }: { title: string, date: string }) {
  return (
    <div>
      <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">{date}</p>
      <h5 className="font-black uppercase tracking-tight text-sm">{title}</h5>
    </div>
  );
}
