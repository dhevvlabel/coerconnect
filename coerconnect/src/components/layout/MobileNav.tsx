import React from 'react';
import { 
  Home,
  MapPin, 
  Users, 
  Settings 
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useLanguage } from "../../contexts/LanguageContext";

interface MobileNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function MobileNav({ activeTab, setActiveTab }: MobileNavProps) {
  const { t } = useLanguage();
  const menuItems = [
    { id: 'home', label: t('home'), icon: Home },
    { id: 'planner', label: t('planner'), icon: MapPin },
    { id: 'mutuals', label: t('mutuals'), icon: Users },
    { id: 'settings', label: t('settings'), icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-20 bg-surface/80 backdrop-blur-xl border-t border-accent/5 flex items-center justify-around px-6 z-[100] lg:hidden text-accent">
      {menuItems.map((item) => {
        const isActive = activeTab === item.id;
        const Icon = item.icon;
        
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className="relative flex flex-col items-center justify-center p-2 group"
          >
            <div className={cn(
              "w-12 h-8 rounded-full flex items-center justify-center transition-all duration-300",
              isActive ? "bg-accent text-surface" : "text-accent/40"
            )}>
              <Icon className="w-5 h-5" />
            </div>
            <span className={cn(
              "text-[8px] font-black uppercase tracking-widest mt-1",
              isActive ? "text-accent" : "text-accent/20"
            )}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
