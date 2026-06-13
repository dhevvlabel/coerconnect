import React, { useState } from 'react';
import { motion, AnimatePresence } from "motion/react";
import { 
  Calendar, 
  MapPin, 
  Trash2, 
  ChevronRight, 
  MessageSquare, 
  TrendingUp, 
  Clock, 
  Sparkles, 
  Edit3, 
  X, 
  AlertTriangle,
  Package,
  Award,
  ShoppingBag,
  Ticket
} from "lucide-react";
import { SavedPlan } from "../../types";
import { useLanguage } from "../../contexts/LanguageContext";

interface HomeFeedProps {
  user: any;
  savedPlans: SavedPlan[];
  deletePlan: (id: string) => Promise<void>;
  viewPlan: (plan: SavedPlan) => void;
  startPlanning: () => void;
  editPlan: (plan: SavedPlan) => void;
  setActiveTab: (tab: string) => void;
}

export function HomeFeed({ user, savedPlans, deletePlan, viewPlan, startPlanning, editPlan, setActiveTab }: HomeFeedProps) {
  const { t } = useLanguage();
  const [showAllNews, setShowAllNews] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<SavedPlan | null>(null);

  return (
    <div className="space-y-12">
      {/* Brand Header Logo */}
      <div className="flex items-center gap-2.5 mb-2">
        <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center shrink-0 shadow-lg shadow-accent/5">
          <span className="text-surface font-bold text-xl">C</span>
        </div>
        <span className="font-sans font-black tracking-widest text-xs uppercase text-accent">CoerConnect</span>
      </div>

      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-6xl font-black tracking-tighter mb-4 uppercase">
            {t('hello')} <span className="text-accent">{user?.displayName?.split(' ')[0]}</span>
          </h2>
          <p className="text-accent/40 font-black uppercase tracking-[0.3em] text-sm flex items-center gap-3">
            <span className="w-8 h-px bg-accent/20" />
            {t('concertHub')}
          </p>
        </div>
        <div className="hidden lg:block">
          <div className="px-6 py-4 bg-surface border border-accent/10 rounded-2xl flex items-center gap-4 shadow-2xl shadow-accent/5">
            <div className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent/50">COER NETWORK ACTIVE</span>
          </div>
        </div>
      </header>

      {/* Grid Menu (Coer Memo, Membership, Store, Tickets) */}
      <section className="w-full">
        <div className="grid grid-cols-4 gap-3">
          <div 
            onClick={() => setActiveTab('memo')}
            className="aspect-square bg-white border border-accent/5 rounded-2xl md:rounded-3xl flex flex-col items-center justify-center p-2.5 sm:p-4 text-center shadow-sm hover:scale-[1.03] active:scale-95 transition-all cursor-pointer group"
          >
            <div className="p-2 bg-accent/5 rounded-xl text-accent mb-1 flex items-center justify-center group-hover:bg-accent group-hover:text-surface transition-colors">
              <Package className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <span className="text-[8px] sm:text-[10px] font-black uppercase text-accent/80 tracking-wider sm:tracking-widest mt-1 text-center line-clamp-1 leading-none">Coer Memo</span>
          </div>
          <div 
            onClick={() => alert("Membership special access coming soon in CoerConnect Premium!")}
            className="aspect-square bg-white border border-accent/5 rounded-2xl md:rounded-3xl flex flex-col items-center justify-center p-2.5 sm:p-4 text-center shadow-sm hover:scale-[1.03] active:scale-95 transition-all cursor-pointer group"
          >
            <div className="p-2 bg-accent/5 rounded-xl text-accent mb-1 flex items-center justify-center group-hover:bg-accent group-hover:text-surface transition-colors">
              <Award className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <span className="text-[8px] sm:text-[10px] font-black uppercase text-accent/80 tracking-wider sm:tracking-widest mt-1 text-center line-clamp-1 leading-none">Membership</span>
          </div>
          <div 
            onClick={() => alert("Coer Fanlight & Merch Store opening soon globally!")}
            className="aspect-square bg-white border border-accent/5 rounded-2xl md:rounded-3xl flex flex-col items-center justify-center p-2.5 sm:p-4 text-center shadow-sm hover:scale-[1.03] active:scale-95 transition-all cursor-pointer group"
          >
            <div className="p-2 bg-accent/5 rounded-xl text-accent mb-1 flex items-center justify-center group-hover:bg-accent group-hover:text-surface transition-colors">
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <span className="text-[8px] sm:text-[10px] font-black uppercase text-accent/80 tracking-wider sm:tracking-widest mt-1 text-center line-clamp-1 leading-none">Store</span>
          </div>
          <div 
            onClick={() => alert("Tour Concert tickets pre-sales are currently offline.")}
            className="aspect-square bg-white border border-accent/5 rounded-2xl md:rounded-3xl flex flex-col items-center justify-center p-2.5 sm:p-4 text-center shadow-sm hover:scale-[1.03] active:scale-95 transition-all cursor-pointer group"
          >
            <div className="p-2 bg-accent/5 rounded-xl text-accent mb-1 flex items-center justify-center group-hover:bg-accent group-hover:text-surface transition-colors">
              <Ticket className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <span className="text-[8px] sm:text-[10px] font-black uppercase text-accent/80 tracking-wider sm:tracking-widest mt-1 text-center line-clamp-1 leading-none">Tickets</span>
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Social Hub */}
        <div className="lg:col-span-8 space-y-12">
          
          {/* Community Feed Placeholder */}
          <section className="space-y-8">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black flex items-center gap-3 uppercase tracking-[0.4em] text-accent/40">
                <MessageSquare className="w-4 h-4" />
                {t('communityFeed')}
              </h4>
              <button 
                onClick={() => setShowAllNews(true)}
                className="text-[10px] font-black uppercase tracking-widest text-accent/30 hover:text-accent transition-colors"
              >
                {t('viewAll')}
              </button>
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
              <button 
                onClick={() => setActiveTab('mutuals')}
                className="w-full p-8 rounded-[32px] bg-neutral-950 hover:bg-neutral-900 border border-neutral-900 flex items-center justify-center transition-all duration-300 active:scale-[0.98] group cursor-pointer shadow-xl shadow-black/10"
              >
                <p className="text-base text-white font-serif font-medium tracking-wide">
                  Ayo gabung diskusi sekarang!
                </p>
              </button>
            </div>
          </section>

          {/* Trending Discussions */}
          <section className="space-y-8">
            <h4 className="text-xs font-black flex items-center gap-3 uppercase tracking-[0.4em] text-accent/40">
              <TrendingUp className="w-4 h-4" />
              {t('trendingDiscussions')}
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
              {t('savedPlans')}
            </h4>
            
            {savedPlans.length > 0 ? (
              <div className="space-y-4">
                {savedPlans.slice(0, 2).map(plan => (
                  <div key={plan.id} className="group p-8 rounded-[40px] bg-surface border border-accent/5 hover:border-accent/20 transition-all duration-500 relative overflow-hidden shadow-xl shadow-accent/5">
                    <div className="absolute top-4 right-4 flex items-center gap-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); editPlan(plan); }}
                        className="p-2.5 rounded-xl bg-accent/5 text-accent hover:bg-accent hover:text-surface transition-all duration-300"
                        title="Edit Plan"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setPlanToDelete(plan); }}
                        className="p-2.5 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-surface transition-all duration-300 pointer-events-auto"
                        title="Delete Plan"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="flex items-center gap-3 text-accent text-[10px] font-black uppercase tracking-[0.3em] mb-4">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{plan.city}</span>
                    </div>
                    <h5 className="text-xl font-black mb-1 uppercase leading-none">{plan.city} TOUR</h5>
                    <p className="text-accent/30 text-[10px] font-bold mb-6 uppercase tracking-widest leading-relaxed">
                      {t('noPlansDesc')}
                    </p>
                    <button 
                      onClick={() => viewPlan(plan)}
                      className="w-full flex items-center justify-between px-6 py-4 rounded-2xl bg-sage/10 hover:bg-accent hover:text-surface transition-all text-[10px] font-black uppercase tracking-[0.3em]"
                    >
                      {t('viewJourney')}
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                
                <div className="text-center pt-2">
                  <button 
                    onClick={() => setActiveTab('planner')}
                    className="text-[10px] font-black uppercase tracking-widest text-accent/30 hover:text-accent transition-colors flex items-center justify-center gap-2 mx-auto"
                  >
                    <span>{t('viewAll')} {savedPlans.length} plans</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-10 rounded-[40px] bg-surface border border-accent/5 shadow-2xl shadow-accent/5 text-center">
                <div className="w-16 h-16 bg-accent/5 rounded-full flex items-center justify-center mx-auto mb-6">
                   <span className="text-accent/20 font-black text-2xl">C</span>
                </div>
                <p className="text-accent/40 mb-8 font-bold uppercase tracking-widest text-[10px] leading-relaxed">
                  {t('noPlansDesc')}
                </p>
                <button 
                  onClick={startPlanning}
                  className="w-full py-4 bg-accent text-surface font-black rounded-2xl hover:opacity-90 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  {t('createYourKit')}
                </button>
              </div>
            )}
          </section>

          {/* Upcoming Schedule */}
          <section className="space-y-6">
            <h4 className="text-xs font-black flex items-center gap-3 uppercase tracking-[0.4em] text-accent/40">
              <Clock className="w-4 h-4" />
              {t('cortisSchedule')}
            </h4>
            <div className="p-8 rounded-[40px] bg-accent text-surface shadow-2xl shadow-accent/20 space-y-6">
              <div className="text-center font-black text-[11px] uppercase tracking-[0.1em] mb-2 text-surface/80 border-b border-surface/20 pb-4">
                2026 CORTIS TOUR &lt;PUT YOUR PHONE DOWN&gt;
              </div>
              <ScheduleItem title="Incheon, South Korea (Inspire Arena)" date="12-14 Juni 2026" />
              <div className="h-px bg-surface/10" />
              <ScheduleItem title="Seoul, South Korea" date="18 Juni 2026" />
              <div className="h-px bg-surface/10" />
              <ScheduleItem title="Tokyo, Japan" date="24 Juni 2026" />
              <div className="h-px bg-surface/10" />
              <ScheduleItem title="Singapore, Singapore" date="30 Juni 2026" />
            </div>
          </section>
        </div>

      </div>

      {/* Community Feed Modal */}
      <AnimatePresence>
        {showAllNews && (
          <div className="fixed inset-0 z-[10005] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAllNews(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-surface rounded-[40px] p-8 md:p-10 border border-accent/10 shadow-[0_50px_100px_rgba(0,0,0,0.5)] max-h-[85vh] flex flex-col overflow-hidden"
            >
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-accent/5 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent/5 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black uppercase tracking-tight">{t('communityFeed')}</h4>
                    <p className="text-[9px] font-black uppercase tracking-widest text-accent/30 mt-0.5">COER ACTIVE BOARD</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowAllNews(false)}
                  className="p-2.5 rounded-full hover:bg-accent/5 text-accent/40 hover:text-accent transition-all active:scale-90"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 overflow-y-auto flex-1 pr-2">
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
                <FeedItem 
                  author="James_Sunshine" 
                  content="Does anyone have tips for the Tokyo dome stop ticketing? Heard it sold out in 5 minutes last year! 😭" 
                  time="1h ago" 
                />
                <FeedItem 
                  author="Martin_Vibe" 
                  content="My custom acrylic lightstick strap finally arrived. I'll be distributing free stickers at Incheon Day 1, let's meet up!" 
                  time="3h ago" 
                />
                <FeedItem 
                  author="Seonghyeon_Stan99" 
                  content="I've been listening to AÇAÍ on repeat for 72 hours straight. Help, I think I'm addicted..." 
                  time="5h ago" 
                />
                <FeedItem 
                  author="CoerPower_Juhoon" 
                  content="Shared my transportation guide for Singapore concert! Make sure to book MRT cards early guys, it gets super packed." 
                  time="1d ago" 
                />
                <FeedItem 
                  author="Juliet_Coer" 
                  content="Planning a cupsleeve event in Jakarta for Martin's birthday. Let me know if you want to collaborate!" 
                  time="2d ago" 
                />
              </div>

              <div className="mt-6 pt-6 border-t border-accent/5 shrink-0">
                <button 
                  onClick={() => { setShowAllNews(false); setActiveTab('mutuals'); }}
                  className="w-full py-4 bg-accent text-surface rounded-2xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 animate-pulse text-surface" />
                  {t('joinDiscussion')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {planToDelete && (
          <div className="fixed inset-0 z-[10006] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPlanToDelete(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-surface rounded-[40px] p-8 md:p-10 border border-accent/10 shadow-[0_50px_100px_rgba(0,0,0,0.5)] overflow-hidden text-center"
            >
              <div className="flex flex-col items-center gap-6">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 animate-pulse">
                  <AlertTriangle className="w-8 h-8" />
                </div>
                
                <div className="space-y-3">
                  <h4 className="text-xl font-black uppercase tracking-tight text-accent">
                    {t('confirmDeleteTitle')}
                  </h4>
                  <p className="text-[10px] font-black text-accent/40 uppercase tracking-[0.2em] leading-relaxed">
                    {planToDelete.city} TOUR &bull; {planToDelete.planData?.inputs?.selectedConcert || "Cortis Plan"}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 w-full mt-2">
                  <button
                    onClick={() => setPlanToDelete(null)}
                    className="py-4 border border-accent/10 text-accent hover:bg-accent/5 rounded-2xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all text-center cursor-pointer"
                  >
                    {t('cancel')}
                  </button>
                  <button
                    onClick={async () => {
                      if (planToDelete) {
                        await deletePlan(planToDelete.id);
                        setPlanToDelete(null);
                      }
                    }}
                    className="py-4 bg-red-500 text-surface hover:bg-red-600 rounded-2xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all text-center cursor-pointer shadow-lg shadow-red-500/20"
                  >
                    {t('deleteAction')}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
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
