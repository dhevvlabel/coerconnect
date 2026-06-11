import { motion } from "motion/react";
import { 
  Home, 
  MapPin, 
  Users, 
  Settings, 
  LogOut,
  User as UserIcon,
  ChevronRight
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { cn } from "../../lib/utils";
import { LanguageToggle } from "./LanguageToggle";
import { useLanguage } from "../../contexts/LanguageContext";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const { profile, logout } = useAuth();
  const { t } = useLanguage();

  const menuItems = [
    { id: 'home', label: t('home'), icon: Home },
    { id: 'planner', label: t('planner'), icon: MapPin },
    { id: 'mutuals', label: t('mutuals'), icon: Users },
    { id: 'settings', label: t('settings'), icon: Settings },
  ];

  return (
    <aside className="hidden lg:flex w-72 border-r border-accent/10 bg-surface flex-col h-screen fixed left-0 top-0 z-[100]">
      <div className="p-8 flex items-center gap-4">
        <div className="w-10 h-10 flex items-center justify-center">
          <img src="/src/assets/images/cortis_abstract_logo_1781202290639.jpg" alt="Cortis Logo" className="w-full h-full object-contain filter " />
        </div>
        <span className="text-xl font-black tracking-tighter text-accent uppercase">CoerConnect</span>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 group uppercase tracking-tight",
                isActive 
                  ? "bg-accent text-surface shadow-xl shadow-accent/20" 
                  : "text-accent/50 hover:bg-sage/10 hover:text-accent"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive ? "text-surface" : "text-accent/40 group-hover:text-accent")} />
              {item.label}
              {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
            </button>
          );
        })}
        <div className="pt-4 px-4">
          <LanguageToggle />
        </div>
      </nav>

      <div className="p-6">
        <div className="p-4 rounded-3xl bg-sage/5 border border-accent/5 mb-4 overflow-hidden">
          <div className="flex items-center gap-3">
            {profile?.photoURL ? (
              <img src={profile.photoURL} alt="Avatar" className="w-10 h-10 rounded-full border border-accent/10" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-accent/5 flex items-center justify-center">
                <UserIcon className="w-5 h-5 text-accent/40" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-accent truncate">{profile?.displayName}</p>
              <p className="text-[10px] text-accent/40 truncate font-bold uppercase tracking-widest">{profile?.email}</p>
            </div>
          </div>
        </div>
        <button 
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-red-500 hover:bg-red-500/5 transition-colors uppercase tracking-tight"
        >
          <LogOut className="w-4 h-4" />
          {t('logout')}
        </button>
      </div>
    </aside>
  );
}
