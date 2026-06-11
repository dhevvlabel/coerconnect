import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'KR' | 'ID' | 'EN';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  KR: {
    home: '홈',
    planner: '코어 스페이스',
    mutuals: '뮤추얼 매치',
    settings: '설정',
    language: '언어',
    login: '로그인',
    logout: '로그아웃',
    explore: '탐색',
    dashboard: '대시보드',
    welcome: '안녕하세요',
    concertKit: '콘서트 키트',
    budget: '예산',
    itinerary: '일정',
    dresscode: '드레스코드',
    checklist: '체크리스트',
    calculate: '계산하기',
    location: '위치',
    days: '일수',
    estimatedTotal: '예상 총 비용',
    heroTitle: '지갑을 내려놔...',
    heroSubtitle: '코어(Coer)를 위한 최고의 콘서트 플래너',
    startPlanning: '계획 시작하기',
    exclusiveFandom: '코어 팬덤 전용',
    heroDescription: '한 프리미엄 공간에서 다음 Cortis 투어를 계획하고, 뮤추얼을 찾고, 콘서트 장비를 정리하세요.',
    joinWithGoogle: 'Google로 코어커넥트 가입하기',
    aiAssistantTitle: '코어 스페이스 어시스턴트',
    aiAssistantDesc: 'Cortis 세계관과 콘서트 히스토리를 모두 알고 있는 AI 기반 콘서트 플래너.',
    mutualMatchTitle: '뮤추얼 매치',
    mutualMatchDesc: '같은 도시와 콘서트 날짜로 향하는 다른 코어들과 연결하세요.',
    secureVaultTitle: '보안 금고',
    secureVaultDesc: '여행 계획과 개인 팬덤 데이터는 암호화되어 안전하게 보호됩니다.',
    planArchivedAlert: '계획이 보관함에 저장되었습니다!',
    comingSoon: '곧 출시됩니다! 같은 공연장에 가는 코어들과 연결하세요.',
    hello: '안녕,',
    concertHub: '콘서트 허브 & 소셜 피드',
    communityFeed: '코어 커뮤니티 피드',
    viewAll: '모두 보기',
    trendingDiscussions: '트렌딩 토크',
    savedPlans: '저장된 콘서트 계획',
    viewJourney: '여정 보기',
    cortisSchedule: 'Cortis 일정',
    createYourKit: '나만의 키트 만들기',
    joinDiscussion: '실시간 토론에 참여하세요',
    noPlansDesc: '코어가 코어를 위해 만든 단 몇 번의 클릭으로 나만의 콘서트 여정을 완성하세요.',
    journeyStarts: 'Cortis 월드에서의 고품격 큐레이팅 여정이 여기서 시작됩니다.',
    premiumJourney: '프리미엄 여정',
    algocuration: '을(를) 위한 알고리즘 큐레이팅',
    editInput: '정보 수정',
    archivePlan: '계획 보관하기',
    targetLocation: '목적지 설정',
    budgetLabel: '예산 (KRW)',
    durationLabel: '기간 (일)',
    summoningAssistant: '어시스턴트 소환 중...',
    generateMyPlan: '계획 생성하기',
    totalBudget: '총 예산',
    day: '일차'
  },
  ID: {
    home: 'Beranda',
    planner: 'Coer Space',
    mutuals: 'Mutual Match',
    settings: 'Pengaturan',
    language: 'Bahasa',
    login: 'Masuk',
    logout: 'Keluar',
    explore: 'Jelajah',
    dashboard: 'Dasbor',
    welcome: 'Selamat Datang',
    concertKit: 'Kit Konser',
    budget: 'Anggaran',
    itinerary: 'Rencana Perjalanan',
    dresscode: 'Dresscode',
    checklist: 'Daftar Periksa',
    calculate: 'Hitung Sekarang',
    location: 'Lokasi',
    days: 'Jumlah Hari',
    estimatedTotal: 'Total Estimasi',
    heroTitle: 'Put your phone down...',
    heroSubtitle: 'Asisten rencana konser terbaik untuk Coer',
    startPlanning: 'Mulai Merencana',
    exclusiveFandom: 'EKSKLUSIF UNTUK FANDOM COER',
    heroDescription: 'Rencanakan tur Cortis berikutnya, cari mutual, dan atur perlengkapan konser Anda dalam satu ruang minimalis premium.',
    joinWithGoogle: 'Bergabung dengan Google',
    aiAssistantTitle: 'Coer Space Assistant',
    aiAssistantDesc: 'Perencana konser berbasis AI yang tahu segalanya tentang lore Cortis dan sejarah konser.',
    mutualMatchTitle: 'Mutual Match',
    mutualMatchDesc: 'Terhubung dengan Coer lain yang pergi ke kota dan tanggal konser yang sama.',
    secureVaultTitle: 'Secure Vault',
    secureVaultDesc: 'Rencana perjalanan dan data fandom pribadi Anda dienkripsi dan dilindungi.',
    planArchivedAlert: 'Rencana berhasil disimpan di vault Anda!',
    comingSoon: 'Fitur segera hadir! Terhubung dengan sesama Coer di lokasi yang sama.',
    hello: 'HALO,',
    concertHub: 'CONCERT HUB & SOCIAL FEED',
    communityFeed: 'COER COMMUNITY FEED',
    viewAll: 'Lihat Semua',
    trendingDiscussions: 'TRENDING DISCUSSIONS',
    savedPlans: 'RENCANA KONSERT TERSIMPAN',
    viewJourney: 'Lihat Detail',
    cortisSchedule: 'JADWAL CORTIS',
    createYourKit: 'Buat Kit Konser',
    joinDiscussion: 'Ikuti diskusi secara real-time',
    noPlansDesc: 'Perjalanan konser impian Anda hanya dalam beberapa klik saja, oleh Coer, untuk Coer.',
    journeyStarts: 'Perjalanan terkurasi kelas atas Anda di dunia Cortis dimulai di sini.',
    premiumJourney: 'PREMIUM JOURNEY',
    algocuration: 'Dikurasi secara algoritmik untuk',
    editInput: 'Edit Input',
    archivePlan: 'Simpan Rencana',
    targetLocation: 'Lokasi Tujuan',
    budgetLabel: 'Anggaran (IDR)',
    durationLabel: 'Durasi (Hari)',
    summoningAssistant: 'Memanggil Assistant...',
    generateMyPlan: 'BUAT RENCANAKU',
    totalBudget: 'Total Anggaran',
    day: 'Hari'
  },
  EN: {
    home: 'Home',
    planner: 'Coer Space',
    mutuals: 'Mutual Match',
    settings: 'Settings',
    language: 'Language',
    login: 'Login',
    logout: 'Logout',
    explore: 'Explore',
    dashboard: 'Dashboard',
    welcome: 'Welcome',
    concertKit: 'Concert Kit',
    budget: 'Budget',
    itinerary: 'Itinerary',
    dresscode: 'Dresscode',
    checklist: 'Checklist',
    calculate: 'Calculate Now',
    location: 'Location',
    days: 'Total Days',
    estimatedTotal: 'Estimated Total',
    heroTitle: 'Put your phone down...',
    heroSubtitle: 'The ultimate concert planning assistant for Coer',
    startPlanning: 'Start Planning',
    exclusiveFandom: 'EXCLUSIVE FOR COER FANDOM',
    heroDescription: 'Plan your next Cortis tour, find mutuals, and organize your concert gear in one premium minimalist space.',
    joinWithGoogle: 'Join CoerConnect with Google',
    aiAssistantTitle: 'Coer Space Assistant',
    aiAssistantDesc: 'AI-powered concert planner that knows everything about Cortis lore and concert history.',
    mutualMatchTitle: 'Mutual Match',
    mutualMatchDesc: 'Connect with other Coers heading to the same city and concert date.',
    secureVaultTitle: 'Secure Vault',
    secureVaultDesc: 'Your travel plans and personal fandom data are encrypted and protected.',
    planArchivedAlert: 'Plan archived in your vault!',
    comingSoon: 'Feature coming soon! Connect with fellow Coers heading to the same venue.',
    hello: 'HELLO,',
    concertHub: 'CONCERT HUB & SOCIAL FEED',
    communityFeed: 'COER COMMUNITY FEED',
    viewAll: 'View All',
    trendingDiscussions: 'TRENDING DISCUSSIONS',
    savedPlans: 'SAVED CONCERT PLANS',
    viewJourney: 'View Journey',
    cortisSchedule: 'CORTIS SCHEDULE',
    createYourKit: 'Create Your Kit',
    joinDiscussion: 'Join the discussion in real-time',
    noPlansDesc: 'Your generated concert journey is just a few clicks away, by Coer, for Coer.',
    journeyStarts: 'Your high-end curated journey through the Cortis world begins here.',
    premiumJourney: 'PREMIUM JOURNEY',
    algocuration: 'Algorithmically curated for',
    editInput: 'Edit Input',
    archivePlan: 'Archive Plan',
    targetLocation: 'Target Location',
    budgetLabel: 'Budget (IDR)',
    durationLabel: 'Duration (Days)',
    summoningAssistant: 'Summoning Assistant...',
    generateMyPlan: 'GENERATE MY PLAN',
    totalBudget: 'Total Budget',
    day: 'Day'
  }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('ID');

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
