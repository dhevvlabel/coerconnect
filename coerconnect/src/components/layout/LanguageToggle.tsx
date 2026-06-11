import React, { useState, useEffect, useRef } from 'react';
import { Globe, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../../contexts/LanguageContext';
import { cn } from '../../lib/utils';

export function LanguageToggle({ mobile = false }: { mobile?: boolean }) {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'KR', label: '한국어', flag: '🇰🇷' },
    { code: 'ID', label: 'BAHASA', flag: '🇮🇩' },
    { code: 'EN', label: 'ENGLISH', flag: '🇺🇸' }
  ] as const;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleSelect = (code: 'KR' | 'ID' | 'EN') => {
    setLanguage(code);
    setIsOpen(false);
  };

  if (mobile) {
    return (
      <div className="relative" ref={containerRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="relative flex flex-col items-center justify-center p-2 active:scale-90 transition-transform cursor-pointer z-[100]"
        >
          <div className={cn(
            "w-12 h-8 rounded-full flex items-center justify-center transition-all duration-300",
            isOpen ? "bg-accent text-surface shadow-lg" : "text-accent/60"
          )}>
            <Globe className="w-5 h-5" />
          </div>
          <span className={cn(
            "text-[8px] font-black uppercase tracking-widest mt-1 transition-colors",
            isOpen ? "text-accent" : "text-accent/40"
          )}>
            {language}
          </span>
        </button>

        <AnimatePresence>
          {isOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.9 }}
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-6 w-48 bg-surface border-2 border-accent/20 rounded-[32px] shadow-[0_30px_60px_rgba(0,0,0,0.5)] z-[1000] overflow-hidden p-2"
              >
                <div className="space-y-1">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => handleSelect(lang.code)}
                      className={cn(
                        "w-full flex items-center justify-between px-6 py-4 rounded-2xl text-[10px] font-black transition-all uppercase tracking-widest active:scale-95 cursor-pointer",
                        language === lang.code 
                          ? "bg-accent text-surface" 
                          : "text-accent/50 hover:bg-accent/5 hover:text-accent"
                      )}
                    >
                      <span>{lang.label}</span>
                      <span className="text-xl">{lang.flag}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="relative" ref={containerRef}>
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-6 py-3 rounded-2xl border-2 border-accent/10 bg-surface hover:border-accent/30 transition-all duration-300 uppercase tracking-widest text-[10px] font-black text-accent/80 active:scale-95 cursor-pointer z-[100]"
      >
        <Globe className="w-4 h-4" />
        <span>{language}</span>
        <ChevronUp className={cn("w-3 h-3 transition-transform duration-500", isOpen && "rotate-180")} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="absolute right-0 mt-4 w-52 bg-surface border-2 border-accent/20 rounded-[36px] shadow-[0_40px_80px_rgba(0,0,0,0.4)] z-[1000] overflow-hidden p-2"
          >
            <div className="space-y-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleSelect(lang.code)}
                  className={cn(
                    "w-full flex items-center justify-between px-6 py-4 rounded-2xl text-[10px] font-black transition-all uppercase tracking-widest active:scale-95 cursor-pointer",
                    language === lang.code 
                      ? "bg-accent text-surface" 
                      : "text-accent/50 hover:bg-accent/5 hover:text-accent"
                  )}
                >
                  <span>{lang.label}</span>
                  <span className="text-xl">{lang.flag}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
