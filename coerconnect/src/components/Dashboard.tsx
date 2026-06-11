import { useState, useEffect } from "react";
import { Sidebar } from "./layout/Sidebar";
import { MobileNav } from "./layout/MobileNav";
import { HomeFeed } from "./home/HomeFeed";
import { CoerSpace } from "./planner/CoerSpace";
import { useAuth } from "../hooks/useAuth";
import { useLanguage } from "../contexts/LanguageContext";
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
  doc 
} from "firebase/firestore";
import { ConcertPlan, SavedPlan } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { Users } from "lucide-react";

export function Dashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('home');
  const [generatedPlan, setGeneratedPlan] = useState<ConcertPlan | null>(null);
  const [savedPlans, setSavedPlans] = useState<SavedPlan[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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
      await addDoc(collection(db, "plans"), {
        userId: user.uid,
        city,
        budget,
        duration,
        planData: plan,
        createdAt: new Date().toISOString()
      });
      alert(t('planArchivedAlert') || "Plan archived in your vault!");
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, "plans");
    }
  };

  const deletePlan = async (id: string) => {
    try {
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
            }}
            startPlanning={() => setActiveTab('planner')}
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
          <div className="max-w-2xl px-4">
            <h2 className="text-6xl font-black mb-12 uppercase tracking-tighter">{t('settings')}</h2>
             <div className="space-y-4">
                <div className="p-10 rounded-[40px] bg-surface border border-accent/5 flex items-center justify-between shadow-2xl shadow-accent/5">
                   <div>
                     <p className="font-black uppercase tracking-tight text-xl">PRO ACTIVE SYNC</p>
                     <p className="text-[10px] text-accent/30 font-black uppercase tracking-[0.4em] mt-2">Experimental real-time updates enabled</p>
                   </div>
                   <div className="w-14 h-7 rounded-full bg-accent relative">
                      <div className="absolute right-1.5 top-1.5 w-4 h-4 rounded-full bg-surface shadow-lg" />
                   </div>
                </div>
             </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-sage text-accent font-['Urbanist'] tracking-tight">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />
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
    </div>
  );
}

