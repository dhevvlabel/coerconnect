import { useState, useEffect } from "react";
import { Sidebar } from "./layout/Sidebar";
import { MobileNav } from "./layout/MobileNav";
import { HomeFeed } from "./home/HomeFeed";
import { CoerSpace } from "./planner/CoerSpace";
import { CoerMemo } from "./home/CoerMemo";
import { useAuth } from "../hooks/useAuth";
import { useLanguage } from "../contexts/LanguageContext";
import { cn } from "../lib/utils";
import { 
  db, 
  handleFirestoreError, 
  OperationType 
} from "../lib/firebase";
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  updateDoc,
  setDoc,
  doc 
} from "firebase/firestore";
import { ConcertPlan, SavedPlan } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { Users, LogOut, Shield, ShieldCheck, User as UserIcon, Globe, Trash2, Edit3, Check, X, ChevronUp } from "lucide-react";

export function Dashboard() {
  const { user, profile, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [activeTab, setActiveTab] = useState('home');
  const [generatedPlan, setGeneratedPlan] = useState<ConcertPlan | null>(null);
  const [savedPlans, setSavedPlans] = useState<SavedPlan[]>([]);
  const [editingPlan, setEditingPlan] = useState<SavedPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [modalContent, setModalContent] = useState<{ title: string, desc: string } | null>(null);

  // Settings states
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [editData, setEditData] = useState({
    displayName: profile?.displayName || user?.displayName || 'Daffa Ramdhani',
    username: profile?.username || 'dhevv',
    bio: profile?.bio || 'HALOOO COERRRR'
  });

  const [privacy, setPrivacy] = useState({
    publicProfile: true,
    sharePlans: true
  });

  useEffect(() => {
    setEditData({
      displayName: profile?.displayName || user?.displayName || 'Daffa Ramdhani',
      username: profile?.username || 'dhevv',
      bio: profile?.bio || 'HALOOO COERRRR'
    });
  }, [profile, user]);

  const handleSaveProfile = async () => {
    if (!user) return;
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        displayName: editData.displayName,
        username: editData.username,
        bio: editData.bio
      }, { merge: true });
      setIsEditingProfile(false);
      setToastMessage("Perubahan berhasil disimpan!");
      setTimeout(() => setToastMessage(null), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  const handleClearCache = () => {
    if (confirm(t('clearCacheConfirm') || 'Clear all application cache and reload?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "plans"), 
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const plans = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as SavedPlan[];
      setSavedPlans(plans.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    }, (error) => {
       console.warn("Firestore plans listener error (likely rules):", error);
       setSavedPlans([]);
    });

    return () => unsubscribe();
  }, [user]);

  const savePlan = async (city: string, budget: number, duration: number, plan: ConcertPlan) => {
    if (!user) return;
    try {
      if (editingPlan) {
        const planDocRef = doc(db, 'plans', editingPlan.id);
        const finalBudget = plan.inputs?.budget ? Number(plan.inputs.budget.replace(/\./g, "")) : (plan.concert_summary?.total_budget_needed ? Number(plan.concert_summary.total_budget_needed.replace(/\D/g, "")) : budget);
        const finalCity = plan.concert_summary?.target_location || city;
        const finalDuration = plan.concert_summary?.estimated_days || duration;

        await updateDoc(planDocRef, {
          city: finalCity,
          budget: finalBudget,
          duration: finalDuration,
          planData: plan,
          origin: plan.inputs?.origin || editingPlan.origin || "",
          departDate: plan.inputs?.departDate || editingPlan.departDate || "",
          returnDate: plan.inputs?.returnDate || editingPlan.returnDate || "",
          updatedAt: new Date().toISOString()
        });
        alert(t('planArchivedAlert') || "Plan updated successfully!");
        setEditingPlan(null);
      } else {
        const finalBudget = plan.inputs?.budget ? Number(plan.inputs.budget.replace(/\./g, "")) : budget;
        await addDoc(collection(db, "plans"), {
          userId: user.uid,
          city,
          budget: finalBudget,
          duration,
          planData: plan,
          origin: plan.inputs?.origin || "",
          departDate: plan.inputs?.departDate || "",
          returnDate: plan.inputs?.returnDate || "",
          createdAt: new Date().toISOString()
        });
        alert(t('planArchivedAlert') || "Plan archived in your vault!");
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, "plans");
    }
  };

  const deletePlan = async (id: string) => {
    try {
      if (editingPlan && editingPlan.id === id) {
        setEditingPlan(null);
      }
      await deleteDoc(doc(db, "plans", id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, "plans");
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'planner':
        return (
          <CoerSpace 
            generatedPlan={generatedPlan} 
            setGeneratedPlan={setGeneratedPlan}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            savePlan={savePlan}
            editingPlan={editingPlan}
          />
        );
      case 'home':
        return (
          <HomeFeed 
            user={user}
            savedPlans={savedPlans}
            deletePlan={deletePlan}
            viewPlan={(plan) => {
              setGeneratedPlan(plan.planData);
              setActiveTab('planner');
              setEditingPlan(plan);
            }}
            editPlan={(plan) => {
              setEditingPlan(plan);
              setGeneratedPlan(null);
              setActiveTab('planner');
            }}
            startPlanning={() => {
              setEditingPlan(null);
              setGeneratedPlan(null);
              setActiveTab('planner');
            }}
            setActiveTab={setActiveTab}
          />
        );
      case 'memo':
        return (
          <CoerMemo 
            onBack={() => setActiveTab('home')}
          />
        );
      case 'mutuals':
        return (
          <div className="h-[60vh] flex flex-col items-center justify-center text-center">
            <Users className="w-16 h-16 text-accent mb-6 opacity-10" />
            <h2 className="text-3xl font-black mb-4 uppercase tracking-tighter">{t('mutuals')}</h2>
            <p className="text-accent/50 max-w-sm font-bold uppercase tracking-widest text-xs">{t('comingSoon') || 'Feature coming soon!'}</p>
          </div>
        );
      case 'settings':
        return (
          <div className="max-w-2xl text-left pb-20">
            <h2 className="text-4xl md:text-6xl font-black mb-12 uppercase tracking-tighter text-left">{t('settings')}</h2>
             
             <div className="space-y-10">
                {/* 1. PROFIL & AKUN */}
                <section>
                  <h3 className="text-[10px] text-accent/30 font-black uppercase tracking-[0.4em] mb-6 flex items-center gap-2">
                    <UserIcon size={12} /> {t('profileAndAccount')}
                  </h3>
                  
                  <div className="p-8 md:p-10 rounded-[40px] bg-surface border border-accent/5 shadow-2xl shadow-accent/5 overflow-hidden relative">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                      <div className="relative group">
                        <div className="w-24 h-24 rounded-full overflow-hidden bg-accent/5 border-2 border-accent/10 shadow-xl">
                          {profile?.photoURL || user?.photoURL ? (
                            <img src={profile?.photoURL || user?.photoURL || ''} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-accent text-surface text-4xl font-black">
                              {(profile?.displayName || user?.displayName || 'C').charAt(0)}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex-1 text-center md:text-left space-y-1">
                        <h4 className="text-2xl font-black uppercase tracking-tight">{profile?.displayName || user?.displayName || 'Daffa Ramdhani'}</h4>
                        <p className="text-xs text-accent/40 font-black uppercase tracking-widest">@{profile?.username || 'dhevv'}</p>
                        <p className="text-[10px] text-accent/30 font-black uppercase tracking-[0.2em] mt-2">{user?.email}</p>
                        <p className="text-xs text-accent/60 font-medium mt-4 line-clamp-2 italic">{profile?.bio || 'HALOOO COERRRR'}</p>
                        
                        <button 
                          onClick={() => setIsEditingProfile(true)}
                          className="mt-6 flex items-center gap-2 px-6 py-3 rounded-2xl border-2 border-accent/10 text-[10px] font-black uppercase tracking-widest hover:border-accent/30 transition-all group active:scale-95 mx-auto md:mx-0"
                        >
                          <Edit3 size={12} className="text-accent group-hover:scale-110 transition-transform" />
                          {t('editProfile')}
                        </button>
                      </div>
                    </div>
                  </div>
                </section>

                {/* 2. PRIVASI */}
                <section>
                  <h3 className="text-[10px] text-accent/30 font-black uppercase tracking-[0.4em] mb-6 flex items-center gap-2">
                    <Shield size={12} /> {t('privacy')}
                  </h3>
                  
                  <div className="space-y-4">
                    {[
                      { id: 'publicProfile', label: t('publicProfile') },
                      { id: 'sharePlans', label: t('sharePlans') }
                    ].map((item) => (
                      <div key={item.id} className="p-8 rounded-[32px] bg-surface border border-accent/5 flex items-center justify-between shadow-xl shadow-accent/5">
                        <span className="text-[11px] font-black uppercase tracking-widest">{item.label}</span>
                        <button 
                          onClick={() => setPrivacy(prev => ({...prev, [item.id]: !prev[item.id as keyof typeof privacy]}))}
                          className={cn(
                            "w-12 h-6 rounded-full relative transition-colors duration-300",
                            privacy[item.id as keyof typeof privacy] ? "bg-accent" : "bg-accent/10"
                          )}
                        >
                          <motion.div 
                            animate={{ x: privacy[item.id as keyof typeof privacy] ? 24 : 4 }}
                            className="absolute top-1 w-4 h-4 rounded-full bg-surface shadow-sm"
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </section>

                {/* 3. SISTEM & BAHASA */}
                <section>
                  <h3 className="text-[10px] text-accent/30 font-black uppercase tracking-[0.4em] mb-6 flex items-center gap-2">
                    <Globe size={12} /> {t('systemAndLanguage')}
                  </h3>
                  
                  <div className="p-8 md:p-10 rounded-[40px] bg-surface border border-accent/5 shadow-2xl shadow-accent/5 space-y-8">
                     <div className="space-y-4">
                        <label className="text-[8px] font-black uppercase text-accent/30 tracking-[0.2em]">{t('selectLanguage')}</label>
                        <div className="relative">
                          <select 
                            value={language}
                            onChange={(e) => setLanguage(e.target.value as any)}
                            className="w-full bg-sage/30 border-2 border-accent/10 rounded-2xl px-6 py-4 font-black uppercase tracking-widest text-xs appearance-none cursor-pointer focus:outline-none focus:border-accent/40 transition-all"
                          >
                            <option value="ID">INDONESIA 🇮🇩</option>
                            <option value="KR">한국어 🇰🇷</option>
                            <option value="EN">ENGLISH 🇺🇸</option>
                          </select>
                          <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-accent/30">
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                            </svg>
                          </div>
                        </div>
                     </div>

                     <button 
                      onClick={handleClearCache}
                      className="w-full flex items-center justify-between p-6 rounded-3xl bg-sage/20 border border-accent/5 text-accent/60 hover:bg-sage/40 transition-all group"
                     >
                        <div className="flex items-center gap-4">
                          <Trash2 size={16} className="text-accent/30 group-hover:text-accent transition-colors" />
                          <span className="text-[10px] font-black uppercase tracking-widest">{t('clearCache')}</span>
                        </div>
                     </button>

                     <div className="space-y-2 pt-2">
                        <button 
                          onClick={() => setModalContent({ title: t('reportBugTitle'), desc: t('reportBugDesc') })}
                          className="w-full text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-accent/40 hover:text-accent transition-all flex items-center justify-between"
                        >
                          {t('reportBug')}
                          <ChevronUp size={12} className="rotate-90 opacity-30" />
                        </button>
                        <button 
                          onClick={() => setModalContent({ title: t('privacyTitle'), desc: t('privacyDesc') })}
                          className="w-full text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-accent/40 hover:text-accent transition-all flex items-center justify-between"
                        >
                          {t('privacyPolicy')}
                          <ChevronUp size={12} className="rotate-90 opacity-30" />
                        </button>
                     </div>

                     <div className="pt-4 text-center">
                        <p className="text-[8px] font-black text-accent/20 uppercase tracking-[0.6em]">CoerConnect v1.2.0 - Production</p>
                     </div>
                  </div>
                </section>

                {/* 4. SESI AKUN */}
                <section className="pt-6">
                  <h3 className="text-[10px] text-accent/30 font-black uppercase tracking-[0.4em] mb-6 flex items-center gap-2">
                    <ShieldCheck size={12} /> {t('accountSession')}
                  </h3>
                  
                  <button 
                    onClick={handleLogout}
                    className="w-full py-6 rounded-[32px] bg-red-500/10 border border-red-500/20 text-red-500 font-black uppercase tracking-[0.3em] text-xs flex items-center justify-center gap-4 hover:bg-red-500 hover:text-surface transition-all duration-500 active:scale-95 shadow-2xl shadow-red-500/5 group"
                  >
                    <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
                    {t('logoutAccount')}
                  </button>
                </section>
             </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-sage text-accent font-sans tracking-tight">
      <AnimatePresence>
        {modalContent && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalContent(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm bg-surface rounded-[40px] p-10 border border-accent/10 shadow-[0_50px_100px_rgba(0,0,0,0.5)]"
            >
              <h4 className="text-xl font-black uppercase tracking-tight mb-4">{modalContent.title}</h4>
              <p className="text-xs text-accent/60 font-medium leading-relaxed mb-8">{modalContent.desc}</p>
              <button 
                onClick={() => setModalContent(null)}
                className="w-full py-4 bg-accent text-surface rounded-2xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all"
              >
                {t('close')}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <main className="lg:ml-72 min-h-screen pb-20 lg:pb-0">
        <div className="max-w-7xl mx-auto px-6 py-12 lg:px-20 lg:py-24">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[10010] bg-emerald-600 border border-emerald-500 text-white px-4 py-3 rounded-xl shadow-[0_15px_30px_rgba(16,185,129,0.25)] flex items-center justify-center gap-2.5 font-semibold text-sm pointer-events-none w-[90%] max-w-sm text-center whitespace-nowrap"
          >
            <Check className="w-4 h-4 text-white shrink-0" strokeWidth={3} />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditingProfile && (
          <div className="fixed inset-0 z-[10008] flex items-center justify-center p-6">
            {/* Backdrop with blur and dim */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditingProfile(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            {/* Modal container with spring bounce and pop animation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 15 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
              className="relative w-full max-w-lg bg-white text-slate-800 rounded-[36px] p-6 md:p-10 border border-slate-100 shadow-[0_50px_100px_rgba(0,0,0,0.5)] max-h-[90vh] flex flex-col overflow-y-auto"
            >
              {/* Close Button */}
               <button 
                 onClick={() => setIsEditingProfile(false)}
                 className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all cursor-pointer active:scale-90"
               >
                 <X className="w-5 h-5" />
               </button>

               {/* Title Header */}
               <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                 <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
                   <Edit3 className="w-5 h-5" />
                 </div>
                 <div>
                   <h4 className="text-xl font-black uppercase tracking-tight text-slate-800">{t('editProfile')}</h4>
                   <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-0.5">Edit Profile & Confirmation</p>
                 </div>
               </div>

               {/* Inputs Form */}
               <div className="space-y-4">
                 <div className="space-y-1.5 text-left">
                   <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest pl-1">{t('displayName')}</label>
                   <input 
                     value={editData.displayName}
                     onChange={(e) => setEditData({...editData, displayName: e.target.value})}
                     placeholder="Daffa Ramdhani"
                     className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all"
                   />
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="space-y-1.5 text-left">
                     <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest pl-1">{t('username')}</label>
                     <input 
                       value={editData.username}
                       onChange={(e) => setEditData({...editData, username: e.target.value})}
                       placeholder="e.g. dhevv_coer"
                       className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all"
                     />
                   </div>

                   <div className="space-y-1.5 text-left">
                     <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest pl-1">Email</label>
                     <input 
                       value={user?.email || ''} 
                       disabled 
                       className="w-full bg-slate-100 border border-slate-200 rounded-2xl py-3 px-4 text-xs font-bold text-slate-400 cursor-not-allowed opacity-80"
                     />
                   </div>
                 </div>

                 <div className="space-y-1.5 text-left">
                   <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest pl-1">{t('bio')}</label>
                   <textarea 
                     value={editData.bio}
                     onChange={(e) => setEditData({...editData, bio: e.target.value})}
                     placeholder="HALOOO COERRRR"
                     className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-xs font-medium text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all resize-none h-20"
                   />
                 </div>
               </div>

               {/* Live Changes Preview / Summary Comparison */}
               <div className="mt-6 p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100 text-left space-y-4">
                 <div className="flex items-center gap-2">
                   <ShieldCheck className="w-4 h-4 text-emerald-600" />
                   <span className="text-[9px] font-black uppercase text-emerald-700 tracking-[0.15em]">Ringkasan Perubahan</span>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                   {/* Bio comparison summary */}
                   <div className="space-y-1">
                     <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Bio Summary:</span>
                     <p className="text-slate-705 font-bold italic break-words pr-2 text-slate-755">
                       "{editData.bio || 'HALOOO COERRRR'}"
                     </p>
                   </div>

                   {/* Username Change summary comparison */}
                   <div className="space-y-1">
                     <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Username Change:</span>
                     <div className="flex items-center gap-1.5 font-bold flex-wrap">
                       <span className="text-slate-400 line-through">@{profile?.username || 'dhevv'}</span>
                       <span className="text-emerald-600 text-[10px] font-black shrink-0">➔</span>
                       <span className="text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-lg font-black">
                         @{editData.username || 'dhevv_coer'}
                       </span>
                     </div>
                   </div>
                 </div>

                 {/* Display Name Preview */}
                 <div className="text-[10px] text-slate-500 border-t border-emerald-100/60 pt-2.5 flex items-center gap-2">
                   <span>Display Name:</span>
                   <span className="font-extrabold text-slate-700">{editData.displayName || 'Daffa Ramdhani'}</span>
                 </div>
               </div>

                {/* Reorganized Actions - Balanced & proportional without overlapping */}
                <div className="grid grid-cols-2 gap-4 mt-8 pt-4 border-t border-slate-100 shrink-0">
                  <button
                    onClick={() => setIsEditingProfile(false)}
                    className="h-12 border border-slate-200 text-slate-500 hover:bg-slate-50 rounded-2xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all text-center cursor-pointer flex items-center justify-center gap-2"
                  >
                    <X size={14} className="shrink-0" />
                    <span>{t('cancel')}</span>
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    className="h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all text-center cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/10"
                  >
                    <Check size={14} className="shrink-0" />
                    <span>SIMPAN</span>
                  </button>
                </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

