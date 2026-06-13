/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AuthProvider, useAuth } from "./hooks/useAuth";
import { LanguageProvider, useLanguage } from "./contexts/LanguageContext";
import { LandingPage } from "./components/LandingPage";
import { Dashboard } from "./components/Dashboard";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

function AppContent() {
  const { user, loading } = useAuth();
  const { isChangingLanguage, t } = useLanguage();

  if (loading) {
    return (
      <div className="min-h-screen bg-sage flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sage text-accent font-sans selection:bg-accent selection:text-white">
      <AnimatePresence>
        {isChangingLanguage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-sage/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-20 h-20 bg-accent rounded-[32px] flex items-center justify-center mb-10 shadow-2xl shadow-accent/20"
            >
              <div className="w-10 h-10 border-4 border-surface border-t-transparent rounded-full animate-spin" />
            </motion.div>
            <h3 className="text-2xl font-black uppercase tracking-tight mb-4">{t('changingLanguage')}</h3>
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-accent/30 animate-pulse">CoerConnect System v2.0</p>
          </motion.div>
        )}
      </AnimatePresence>
      {user ? <Dashboard /> : <LandingPage />}
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LanguageProvider>
  );
}
