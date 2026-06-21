import React, { useState, useEffect, useRef, useMemo } from "react";
import { 
  db, 
  handleFirestoreError, 
  OperationType 
} from "../../lib/firebase";
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  setDoc,
  deleteDoc,
  doc, 
  getDocs,
  limit,
  orderBy
} from "firebase/firestore";
import { useAuth } from "../../hooks/useAuth";
import { useLanguage } from "../../contexts/LanguageContext";
import { motion, AnimatePresence } from "motion/react";
import { 
  Users, 
  MessageSquare, 
  Heart, 
  X, 
  Sparkles, 
  Instagram, 
  Twitter, 
  Send, 
  MapPin, 
  User as UserIcon, 
  Check, 
  Calendar,
  Share2,
  ChevronRight,
  ShieldAlert,
  ArrowLeft,
  Search,
  UserPlus
} from "lucide-react";
import { cn } from "../../lib/utils";
import { UserProfile, SavedPlan } from "../../types";

interface MutualMatchProps {
  onBack?: () => void;
}

interface LikeLog {
  id: string;
  fromId: string;
  toId: string;
  status: "like" | "pass";
  createdAt: string;
}

interface Msg {
  id: string;
  matchId: string;
  senderId: string;
  text: string;
  createdAt: string;
}

export function MutualMatch({ onBack }: MutualMatchProps) {
  const { user, profile } = useAuth();
  const { t, language } = useLanguage();

  const [usersList, setUsersList] = useState<UserProfile[]>([]);
  const [plansList, setPlansList] = useState<SavedPlan[]>([]);
  const [likesSent, setLikesSent] = useState<LikeLog[]>([]);
  const [likesReceived, setLikesReceived] = useState<LikeLog[]>([]);
  
  // Real-time chat messages
  const [activeMatch, setActiveMatch] = useState<UserProfile | null>(null);
  const [chatMessages, setChatMessages] = useState<Msg[]>([]);
  const [newMessageText, setNewMessageText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Loading and Filtering
  const [loading, setLoading] = useState(true);
  const [activeFilterStop, setActiveFilterStop] = useState<string>("ALL");
  const [showConfetti, setShowConfetti] = useState(false);
  const [newlyMatchedUser, setNewlyMatchedUser] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<"discover" | "matches">("discover");

  const [searchQuery, setSearchQuery] = useState("");

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    let queryClean = searchQuery.trim().toLowerCase();
    
    // Support searching with or without leading "@" gracefully
    if (queryClean.startsWith('@')) {
      queryClean = queryClean.substring(1);
    }
    
    if (!queryClean) return [];

    return usersList.filter(u => {
      if (!u.username) return false;
      let targetUsername = u.username.toLowerCase().trim();
      if (targetUsername.startsWith('@')) {
        targetUsername = targetUsername.substring(1);
      }
      // Exact match with the target username only
      return targetUsername === queryClean;
    });
  }, [usersList, searchQuery]);

  // 1. Listen to all Users profiles
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "users"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const users: UserProfile[] = [];
      snapshot.forEach(doc => {
        const u = doc.data() as UserProfile;
        if (u.uid !== user.uid) {
          users.push(u);
        }
      });
      setUsersList(users);
      setLoading(false);
    }, (error) => {
      console.warn("Error fetching users for discovery:", error);
    });
    return () => unsubscribe();
  }, [user]);

  // 2. Listen to all Plans
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "plans"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const plans: SavedPlan[] = [];
      snapshot.forEach(doc => {
        plans.push({ id: doc.id, ...doc.data() } as SavedPlan);
      });
      setPlansList(plans);
    }, (error) => {
      console.warn("Error fetching other plans:", error);
    });
    return () => unsubscribe();
  }, [user]);

  // 3. Listen to Likes sent by current user
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "likes"), where("fromId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const likes: LikeLog[] = [];
      snapshot.forEach(doc => {
        likes.push({ id: doc.id, ...doc.data() } as LikeLog);
      });
      setLikesSent(likes);
    }, (error) => {
      console.warn("Likes sent subscription error:", error);
    });
    return () => unsubscribe();
  }, [user]);

  // 4. Listen to Likes received by current user
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "likes"), where("toId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const likes: LikeLog[] = [];
      snapshot.forEach(doc => {
        likes.push({ id: doc.id, ...doc.data() } as LikeLog);
      });
      setLikesReceived(likes);
    }, (error) => {
      console.warn("Likes received subscription error:", error);
    });
    return () => unsubscribe();
  }, [user]);

  // 5. Subscribe to Chat messages if activeMatch exists
  useEffect(() => {
    if (!user || !activeMatch) {
      setChatMessages([]);
      return;
    }
    const matchId = getMatchId(user.uid, activeMatch.uid);
    const q = query(
      collection(db, "messages"),
      where("matchId", "==", matchId),
      orderBy("createdAt", "asc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: Msg[] = [];
      snapshot.forEach(doc => {
        msgs.push({ id: doc.id, ...doc.data() } as Msg);
      });
      setChatMessages(msgs);
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }, (error) => {
      console.error("Error subscribing to messages:", error);
    });
    return () => unsubscribe();
  }, [user, activeMatch]);

  const getMatchId = (uid1: string, uid2: string) => {
    return uid1 < uid2 ? `${uid1}_${uid2}` : `${uid2}_${uid1}`;
  };

  const isLikedByMe = (targetUid: string) => {
    return likesSent.some(l => l.toId === targetUid && l.status === "like");
  };

  const isPassedByMe = (targetUid: string) => {
    return likesSent.some(l => l.toId === targetUid && l.status === "pass");
  };

  const isLikingMe = (targetUid: string) => {
    return likesReceived.some(l => l.fromId === targetUid && l.status === "like");
  };

  // Identify real mutual matches
  const mutualMatches = usersList.filter(u => isLikedByMe(u.uid) && isLikingMe(u.uid));

  // Filter possible discoverable users
  const myPlans = plansList.filter(p => p.userId === user?.uid);
  const myDestinations = Array.from(new Set(myPlans.map(p => p.city.toLowerCase())));

  const getStopsForUser = (targetUid: string) => {
    return plansList.filter(p => p.userId === targetUid);
  };

  const getsSameStopOfUser = (targetUid: string) => {
    const targets = getStopsForUser(targetUid).map(p => p.city.toLowerCase());
    return targets.filter(city => myDestinations.includes(city));
  };

  const discoverableUsers = usersList.filter(u => {
    // Exclude users already liked or passed
    const alreadySwiped = likesSent.some(l => l.toId === u.uid);
    if (alreadySwiped) return false;

    // Must have registered concert plan to be discoverable
    const targetPlans = getStopsForUser(u.uid);
    if (targetPlans.length === 0) return false;

    // Apply Filter selection
    if (activeFilterStop !== "ALL") {
      const hasSelectedStop = targetPlans.some(p => p.city.toLowerCase() === activeFilterStop.toLowerCase());
      if (!hasSelectedStop) return false;
    }

    return true;
  });

  // Handle Match Likes
  const handleLikeUser = async (targetUser: UserProfile) => {
    if (!user) return;
    try {
      const likeId = `${user.uid}_${targetUser.uid}`;
      const likeDocRef = doc(db, "likes", likeId);
      
      await setDoc(likeDocRef, {
        id: likeId,
        fromId: user.uid,
        toId: targetUser.uid,
        status: "like",
        createdAt: new Date().toISOString()
      });

      // Check if it's mutual match!
      if (isLikingMe(targetUser.uid)) {
        setNewlyMatchedUser(targetUser);
        setShowConfetti(true);
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, "likes");
    }
  };

  const handlePassUser = async (targetUser: UserProfile) => {
    if (!user) return;
    try {
      const likeId = `${user.uid}_${targetUser.uid}`;
      const likeDocRef = doc(db, "likes", likeId);

      await setDoc(likeDocRef, {
        id: likeId,
        fromId: user.uid,
        toId: targetUser.uid,
        status: "pass",
        createdAt: new Date().toISOString()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, "likes");
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !activeMatch || !newMessageText.trim()) return;

    try {
      const matchId = getMatchId(user.uid, activeMatch.uid);
      await addDoc(collection(db, "messages"), {
        matchId,
        senderId: user.uid,
        text: newMessageText.trim(),
        createdAt: new Date().toISOString()
      });
      setNewMessageText("");
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, "messages");
    }
  };

  const activeUserCard = discoverableUsers[0];

  const getTranslatedStopLabel = (stopCode: string) => {
    const stopsDict: Record<string, string> = {
      INCHEON: language === "ID" ? "Incheon, KR" : "Incheon, KR",
      TORONTO: "Toronto, CA",
      NEW_YORK: "New York, US",
      ATLANTA: "Atlanta, US",
      IRVING: "Irving, US",
      LOS_ANGELES: "Los Angeles, US",
      SAN_FRANCISCO: "San Francisco, US",
      SEOUL: "Seoul, KR",
      KANAWAGA: "Kanagawa, JP",
    };
    return stopsDict[stopCode] || stopCode;
  };

  return (
    <div className="w-full text-slate-800" id="mutual-match-module">
      {/* Newly Matched overlay celebration screen */}
      <AnimatePresence>
        {showConfetti && newlyMatchedUser && (
          <div className="fixed inset-0 z-[10020] flex items-center justify-center p-6 bg-black/85 backdrop-blur-xl">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="w-full max-w-md bg-zinc-950 text-white border border-emerald-500/20 rounded-[48px] p-10 text-center relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 to-transparent pointer-events-none" />
              <div className="mx-auto w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mb-6 animate-pulse">
                <Sparkles className="w-10 h-10 animate-spin" style={{ animationDuration: '4s' }} />
              </div>
              
              <h3 className="text-3xl font-black tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
                MUTUAL MATCH!
              </h3>
              <p className="text-zinc-400 text-xs font-semibold uppercase tracking-widest mt-2">
                {language === "ID" ? "Kalian berdua saling menyukai!" : language === "KR" ? "서로의 매칭이 이루어졌습니다!" : "You both connected with each other!"}
              </p>

              {/* Match Avatars representation */}
              <div className="flex items-center justify-center gap-6 my-10 relative">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full border-4 border-emerald-400 bg-zinc-805 overflow-hidden shadow-2xl">
                    {profile?.photoURL ? (
                      <img src={profile.photoURL} alt="Me" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-2xl font-black">
                        {profile?.displayName?.trim().charAt(0) || "Y"}
                      </div>
                    )}
                  </div>
                  <span className="absolute -bottom-2 -right-1 bg-emerald-500 text-zinc-950 px-2 py-0.5 rounded-full text-[8px] font-black">ME</span>
                </div>

                <div className="w-8 h-8 rounded-full bg-emerald-500 text-zinc-950 flex items-center justify-center font-black text-lg shadow-xl shrink-0 z-10 animate-bounce">
                  💚
                </div>

                <div className="relative">
                  <div className="w-20 h-20 rounded-full border-4 border-emerald-400 bg-zinc-805 overflow-hidden shadow-2xl animate-pulse">
                    {newlyMatchedUser.photoURL ? (
                      <img src={newlyMatchedUser.photoURL} alt="Match" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-2xl font-black">
                        {newlyMatchedUser.displayName?.trim().charAt(0) || "C"}
                      </div>
                    )}
                  </div>
                  <span className="absolute -bottom-2 -left-1 bg-emerald-500 text-zinc-950 px-2 py-0.5 rounded-full text-[8px] font-black">COER</span>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xl font-bold">{newlyMatchedUser.displayName}</h4>
                <p className="text-xs text-zinc-400 italic font-mono px-4 line-clamp-2">" {newlyMatchedUser.bio || "Hi, let's watch the concert!"} "</p>
              </div>

              <div className="border-t border-zinc-800/60 pt-6 mt-8 space-y-3">
                <button
                  onClick={() => {
                    setActiveMatch(newlyMatchedUser);
                    setActiveTab("matches");
                    setShowConfetti(false);
                    setNewlyMatchedUser(null);
                  }}
                  className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-zinc-950 text-xs font-black uppercase tracking-widest rounded-2xl active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{language === "ID" ? "KIRIM PESAN SEKARANG" : language === "KR" ? "지금 메시지 보내기" : "SEND MESSAGE NOW"}</span>
                </button>
                
                <button
                  onClick={() => {
                    setShowConfetti(false);
                    setNewlyMatchedUser(null);
                  }}
                  className="w-full h-12 border border-zinc-800 text-zinc-500 hover:text-white rounded-2xl text-xs font-black uppercase tracking-widest active:scale-95 transition-all cursor-pointer"
                >
                  {language === "ID" ? "NANTI SAJA" : language === "KR" ? "나중에 하기" : "LATER"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Container */}
      <div className="flex flex-col lg:flex-row gap-8 lg:items-start">
        
        {/* Left Side: Layout Navigation & Stats summary */}
        <div className="w-full lg:w-80 shrink-0 space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <button 
              onClick={onBack}
              className="lg:hidden text-[11px] font-black uppercase tracking-widest text-slate-400 mr-2 flex items-center gap-1 active:scale-95"
            >
              ← Back
            </button>
            <h2 className="text-4xl font-black uppercase tracking-tighter">{t('mutuals')}</h2>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed text-left">
            {t('mutualMatchDesc') || "Connect with other Coers heading to the same city and concert date."}
          </p>

          <div className="p-1 rounded-2xl bg-slate-100 border border-slate-200/60 grid grid-cols-2">
            <button
              onClick={() => setActiveTab("discover")}
              className={cn(
                "py-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer",
                activeTab === "discover" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
              )}
            >
              {language === "ID" ? "Tinjau (Discover)" : language === "KR" ? "탐색 (Discover)" : "Discover"}
            </button>
            <button
              onClick={() => setActiveTab("matches")}
              className={cn(
                "py-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all relative cursor-pointer",
                activeTab === "matches" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
              )}
            >
              Match ({mutualMatches.length})
              {mutualMatches.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              )}
            </button>
          </div>

          {/* Quick Stats Panel */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 text-left space-y-4 shadow-sm">
            <h5 className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
              <Users size={12} className="text-slate-400" /> Connecting Activity
            </h5>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Likes Sent:</span>
                <span className="font-extrabold text-slate-800">{likesSent.filter(l => l.status === "like").length}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Likes Received:</span>
                <span className="font-extrabold text-slate-800">{likesReceived.filter(l => l.status === "like").length}</span>
              </div>
              <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-100 font-bold text-emerald-600">
                <span>Mutual Couples:</span>
                <span>{mutualMatches.length} Coer{mutualMatches.length !== 1 ? "s" : ""}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Tab Contents rendering */}
        <div className="flex-1 min-h-[50vh]">
          
          {/* TAB 1: DISCOVER FLOW */}
          {activeTab === "discover" && (
            <div className="space-y-6">

              {/* Search Bar section */}
              <div className="bg-slate-50 p-5 rounded-[28px] border border-slate-200/50 space-y-3">
                <div className="flex flex-col gap-1.5 text-left">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-705">
                    {language === "ID" ? "Cari Username Coer" : "Search Coer Username"}
                  </h4>
                  <p className="text-[10px] text-slate-500 leading-relaxed">
                    {language === "ID" 
                      ? "Cari pengguna lain dengan memasukkan username mereka yang tepat secara lengkap."
                      : "Search for other users by typing their exact username."}
                  </p>
                </div>
                <div className="relative text-left">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Search size={16} />
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={language === "ID" ? "Ketik username lengkap... (contoh: john_doe)" : "Type exact username... (e.g. john_doe)"}
                    className="w-full pl-10 pr-10 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent placeholder-slate-400 text-slate-700 shadow-sm"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>

              {searchQuery.trim() !== "" ? (
                /* SEARCH RESULTS LIST VIEW */
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      {language === "ID" ? `Hasil pencarian untuk "${searchQuery}"` : `Search results for "${searchQuery}"`} ({searchResults.length})
                    </span>
                    <button
                      onClick={() => setSearchQuery("")}
                      className="text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:text-emerald-700 cursor-pointer"
                    >
                      Clear Search
                    </button>
                  </div>

                  {searchResults.length === 0 ? (
                    <div className="bg-white border border-slate-200/80 rounded-[32px] p-12 text-center space-y-3">
                      <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto text-lg">
                        🔍
                      </div>
                      <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">
                        {language === "ID" ? "Coer Tidak Ditemukan" : "No Coer Found"}
                      </h4>
                      <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed text-center">
                        {language === "ID" 
                          ? "Kami tidak menemukan pengguna dengan username atau nama tersebut. Cek kembali ejaan atau cari username lainnya!"
                          : "We couldn't find any users matching that search. Check the spelling or try searching another username!"}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {searchResults.map((u) => {
                        const isMutual = isLikedByMe(u.uid) && isLikingMe(u.uid);
                        const hasLikedMe = isLikingMe(u.uid);
                        const iSentLike = isLikedByMe(u.uid);
                        const userPlans = getStopsForUser(u.uid);

                        return (
                          <div 
                            key={u.uid}
                            className="bg-white border border-slate-200/85 hover:border-slate-300 rounded-[28px] p-5 shadow-sm space-y-4 transition-all flex flex-col justify-between text-left relative overflow-hidden"
                          >
                            {/* Special Sparkle badge if mutual match or likes you */}
                            {hasLikedMe && !isMutual && (
                              <div className="absolute top-3 right-3 bg-rose-50 text-rose-500 px-2.5 py-0.5 rounded-full text-[8px] font-black tracking-widest uppercase flex items-center gap-1 border border-rose-100">
                                <Heart size={8} fill="currentColor" /> LIKES YOU!
                              </div>
                            )}
                            {isMutual && (
                              <div className="absolute top-3 right-3 bg-emerald-50 text-emerald-600 px-2.5 py-0.5 rounded-full text-[8px] font-black tracking-widest uppercase flex items-center gap-1 border border-emerald-100">
                                <Sparkles size={8} className="animate-spin" /> MUTUAL!
                              </div>
                            )}

                            <div className="flex gap-3">
                              <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 border border-slate-100 shrink-0 flex items-center justify-center">
                                {u.photoURL ? (
                                  <img src={u.photoURL} alt={u.displayName || ""} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                ) : (
                                  <span className="text-sm font-black text-slate-600">
                                    {(u.displayName || "C").charAt(0).toUpperCase()}
                                  </span>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h5 className="text-xs font-black uppercase text-slate-800 truncate tracking-tight">{u.displayName}</h5>
                                <p className="text-[10px] text-slate-500 font-bold truncate">@{u.username || "username"}</p>
                                <p className="text-[10px] text-slate-600 italic line-clamp-2 mt-1 leading-relaxed">
                                  "{u.bio || (language === "ID" ? "Haii! Mari menonton konser bersama..." : "Hi there, let's watch the tour!")}"
                                </p>
                              </div>
                            </div>

                            {/* Plans line if any */}
                            {userPlans.length > 0 && (
                              <div className="pt-2 border-t border-slate-100">
                                <span className="text-[8px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                                  Concert Stops:
                                </span>
                                <div className="flex flex-wrap gap-1">
                                  {userPlans.slice(0, 3).map((plan) => (
                                    <span 
                                      key={plan.id}
                                      className="text-[8px] font-black bg-slate-50 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200/50 uppercase"
                                    >
                                      📍 {plan.city}
                                    </span>
                                  ))}
                                  {userPlans.length > 3 && (
                                    <span className="text-[8px] font-black text-slate-400 self-center">
                                      +{userPlans.length - 3} more
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Buttons and Actions */}
                            <div className="pt-3 border-t border-slate-50">
                              {isMutual ? (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveMatch(u);
                                    setActiveTab("matches");
                                    setSearchQuery("");
                                  }}
                                  className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-zinc-950 rounded-xl text-[9px] font-black uppercase tracking-widest active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                                >
                                  <MessageSquare size={10} />
                                  <span>{language === "ID" ? "Ngobrol Sekarang" : "Chat Now"}</span>
                                </button>
                              ) : iSentLike ? (
                                <button
                                  type="button"
                                  disabled
                                  className="w-full py-2 bg-slate-100 text-slate-400 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5"
                                >
                                  <Check size={10} />
                                  <span>{language === "ID" ? "Permintaan Dikirim" : "Friend Request Sent"}</span>
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleLikeUser(u)}
                                  className="w-full py-2 bg-slate-900 hover:bg-emerald-500 hover:text-zinc-950 text-emerald-400 rounded-xl text-[9px] font-black uppercase tracking-widest active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                                >
                                  <UserPlus size={10} />
                                  <span>
                                    {hasLikedMe 
                                      ? (language === "ID" ? "Terima Friend Request" : "Accept & Friend")
                                      : (language === "ID" ? "Tambah Teman" : "Add Friend")}
                                  </span>
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6">

                  {/* Filter stop row */}
                  <div className="flex items-center gap-2 flex-wrap text-left">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 mr-2">Filter Stop:</span>
                
                {/* Auto filter select button list */}
                {["ALL", "Seoul", "Incheon", "Kanagawa", "New York", "Los Angeles"].map((stop) => (
                  <button
                    key={stop}
                    onClick={() => setActiveFilterStop(stop)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider transition-all border cursor-pointer",
                      activeFilterStop === stop 
                        ? "bg-slate-900 border-slate-900 text-white shadow-sm" 
                        : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                    )}
                  >
                    {stop === "ALL" ? (language === "ID" ? "Semua Stop" : "All Stops") : stop}
                  </button>
                ))}
              </div>

              {loading ? (
                <div className="h-[40vh] flex flex-col items-center justify-center">
                  <span className="animate-spin text-2xl">⏳</span>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-4">Loading match coordinates...</p>
                </div>
              ) : activeUserCard ? (
                <div className="max-w-md mx-auto relative mt-4">
                  
                  {/* Outer Framer Motion Wrap for swipes */}
                  <AnimatePresence mode="popLayout">
                    <motion.div
                      key={activeUserCard.uid}
                      initial={{ scale: 0.96, opacity: 0, y: 15 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      exit={{ scale: 0.95, opacity: 0, x: likesSent.some(l => l.toId === activeUserCard.uid && l.status === "like") ? 180 : -180 }}
                      transition={{ type: "spring", stiffness: 350, damping: 25 }}
                      className="w-full bg-white border border-slate-200/80 rounded-[40px] shadow-2xl overflow-hidden text-left relative"
                    >
                      {/* Badge Same Stop Indicator */}
                      {getsSameStopOfUser(activeUserCard.uid).length > 0 && (
                        <div className="absolute top-6 left-6 z-10 bg-emerald-500 text-zinc-950 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-lg">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>SAME DESTINATION STAGE!</span>
                        </div>
                      )}

                      {/* Header Avatar and Identification background section */}
                      <div className="h-44 bg-gradient-to-r from-[#2A3B31]/30 to-[#1D2A22]/30 relative flex items-end p-8">
                        <div className="absolute inset-0 bg-slate-905 opacity-10" />
                        <div className="z-10 flex items-center gap-4 translate-y-4">
                          <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-xl bg-slate-200 shrink-0">
                            {activeUserCard.photoURL ? (
                              <img src={activeUserCard.photoURL} alt={activeUserCard.displayName || ""} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-slate-800 text-white text-3xl font-black">
                                {(activeUserCard.displayName || "C").charAt(0)}
                              </div>
                            )}
                          </div>
                          
                          <div className="text-slate-800">
                            <h4 className="text-2xl font-black uppercase tracking-tight text-slate-800 flex items-center gap-1.5 drop-shadow-sm">
                              {activeUserCard.displayName}
                            </h4>
                            <p className="text-xs font-bold text-slate-600">@{activeUserCard.username || "username"}</p>
                          </div>
                        </div>
                      </div>

                      {/* Body details of matching Card */}
                      <div className="p-8 pt-10 space-y-6 text-left">
                        {/* Bio box */}
                        <div className="space-y-2">
                          <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 pl-1 block">Bio Description</span>
                          <p className="text-xs text-slate-600 bg-slate-50/50 p-4 rounded-2xl italic leading-relaxed border border-slate-100">
                            "{activeUserCard.bio || (language === "ID" ? "Haii! Mari menonton konser Cortis bersama..." : "Hi there, let's watch the 2026 tour!")}"
                          </p>
                        </div>

                        {/* Plans registered stop info representation */}
                        <div className="pt-2 border-t border-slate-100 space-y-4">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Plan & Destination Coordinate</span>
                          </div>

                          <div className="space-y-3">
                            {getStopsForUser(activeUserCard.uid).map((plan) => {
                              const isSame = myDestinations.includes(plan.city.toLowerCase());
                              return (
                                <div 
                                  key={plan.id}
                                  className={cn(
                                    "p-4 rounded-2xl border text-xs text-left relative flex items-center justify-between",
                                    isSame 
                                      ? "bg-emerald-50/40 border-emerald-500/10 text-slate-705" 
                                      : "bg-slate-50 border-slate-100 text-slate-600"
                                  )}
                                >
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-1.5">
                                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                      <span className="font-extrabold uppercase text-[11px] tracking-tight">{plan.city}</span>
                                    </div>
                                    <p className="text-[10px] text-slate-400">
                                      {plan.duration} Days • Budget: Rp {plan.budget.toLocaleString("id-ID")}
                                    </p>
                                  </div>
                                  
                                  {isSame && (
                                    <span className="text-[8px] font-black uppercase tracking-widest bg-emerald-600/10 text-emerald-700 px-2 py-1 rounded-md shrink-0">
                                      MATCH STOP!
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* CTA Swiping control panel */}
                      <div className="p-6 md:p-8 bg-slate-50 border-t border-slate-100 grid grid-cols-2 gap-4">
                        <button
                          onClick={() => handlePassUser(activeUserCard)}
                          className="h-14 bg-white hover:bg-red-50 text-red-500 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-slate-200/60 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm group"
                        >
                          <X size={16} className="text-red-400 group-hover:scale-110 transition-transform" />
                          <span>{language === "ID" ? "LEWATI" : language === "KR" ? "넘어가기" : "SKIP"}</span>
                        </button>
                        
                        <button
                          onClick={() => handleLikeUser(activeUserCard)}
                          className="h-14 bg-slate-900 hover:bg-emerald-600 hover:text-white text-emerald-400 rounded-2xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md group border border-slate-800"
                        >
                          <Heart size={16} className="text-emerald-400 transition-transform group-hover:scale-110" />
                          <span>{language === "ID" ? "SAMBUNGKAN" : language === "KR" ? "연결하기" : "CONNECT"}</span>
                        </button>
                      </div>

                    </motion.div>
                  </AnimatePresence>

                </div>
              ) : (
                <div className="h-[45vh] flex flex-col items-center justify-center text-center p-8 bg-white border border-slate-200/60 rounded-[40px] shadow-sm max-w-md mx-auto">
                  <div className="w-16 h-16 bg-slate-50 border border-slate-200/60 rounded-full flex items-center justify-center text-2xl mb-6 shadow-inner">
                    🏁
                  </div>
                  <h4 className="text-lg font-black uppercase tracking-tight mb-2">
                    {language === "ID" ? "Kordinasi Selesai" : language === "KR" ? "탐색 완료" : "Discovery Exhausted"}
                  </h4>
                  <p className="text-xs text-slate-400 max-w-xs leading-relaxed mb-6 italic">
                    {language === "ID" 
                      ? "Kamu sudah meninjau seluruh Coer. Silakan tambahkan stop konser baru di Coer Space atau cari lagi nanti!"
                      : language === "KR"
                        ? "현재 탐색 가능한 모든 코어를 확인했습니다. 나만의 코어 스페이스를 확장해 보거나 나중에 다시 검색해주세요!"
                        : "You have reviewed all available Coers on these filters. Expand your plans or check back later!"}
                  </p>
                  
                  {/* Reset/clear swipes helper button */}
                  {likesSent.length > 0 && (
                    <button
                      onClick={async () => {
                        if (confirm(language === "ID" ? "Reset seluruh swipe kamu?" : "Reset all your swipes?")) {
                          try {
                            const q = query(collection(db, "likes"), where("fromId", "==", user?.uid));
                            const snap = await getDocs(q);
                            const deletePromises = snap.docs.map(d => deleteDoc(doc(db, "likes", d.id)));
                            await Promise.all(deletePromises);
                          } catch (e) {
                            console.error("Error resetting swipes:", e);
                          }
                          window.location.reload();
                        }
                      }}
                      className="px-6 py-3 border border-slate-200 text-slate-500 hover:text-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer active:scale-95 transition-all shadow-sm"
                    >
                      {language === "ID" ? "RESET SWIPE SEBELUMNYA" : "RESET SWIPES HISTORY"}
                    </button>
                  )}
                </div>
              )}

                </div>
              )}

            </div>
          )}

          {/* TAB 2: ACTIVE MATCHES & INTEGRATED REAL-TIME CHAT PANEL */}
          {activeTab === "matches" && (
            <div className="flex flex-col lg:flex-row gap-6">
              
              {/* List of matches */}
              <div className={cn(
                "w-full lg:w-72 shrink-0 space-y-3",
                activeMatch ? "hidden lg:block" : "block"
              )}>
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 text-left block pl-2">
                  My Mutual Couples ({mutualMatches.length})
                </span>

                {mutualMatches.length === 0 ? (
                  <div className="p-8 text-center bg-white border border-slate-200/60 rounded-[32px] shadow-sm">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-relaxed">No Matches yet.</p>
                    <p className="text-[10px] text-slate-400/80 mt-2 leading-relaxed italic">
                      {language === "ID" ? "Yuk, sambungkan lebih banyak Coer di tab Discover!" : "Try connects other Coers in Discover tab!"}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {mutualMatches.map((m) => (
                      <button
                        key={m.uid}
                        onClick={() => setActiveMatch(m)}
                        className={cn(
                          "w-full p-4 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer relative shadow-sm",
                          activeMatch?.uid === m.uid 
                            ? "bg-slate-900 border-slate-900 text-white" 
                            : "bg-white border-slate-100 hover:bg-slate-50 text-slate-800"
                        )}
                      >
                        <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-slate-200 border border-slate-300">
                          {m.photoURL ? (
                            <img src={m.photoURL} alt={m.displayName || ""} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-slate-800 text-white font-extrabold text-sm">
                              {(m.displayName || "C").charAt(0)}
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h6 className="font-extrabold text-xs truncate uppercase tracking-tight">{m.displayName}</h6>
                          <p className={cn(
                            "text-[10px] truncate",
                            activeMatch?.uid === m.uid ? "text-slate-400" : "text-slate-500"
                          )}>
                            @{m.username || "username"}
                          </p>
                        </div>
                        
                        <ChevronRight size={14} className="opacity-40 shrink-0" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Chat Viewport Area */}
              <div className={cn(
                "flex-1 min-h-[450px]",
                activeMatch ? "block" : "hidden lg:block"
              )}>
                {activeMatch ? (
                  <div className="w-full bg-white border border-slate-200/80 rounded-[40px] shadow-xl flex flex-col h-[500px] overflow-hidden text-left">
                    
                    {/* Active Match Chat Header */}
                    <div className="h-16 border-b border-slate-100 px-6 flex items-center justify-between bg-slate-50 shrink-0">
                      <div className="flex items-center gap-3">
                        {/* WhatsApp-style Back Arrow for Mobile screen view */}
                        <button
                          type="button"
                          onClick={() => setActiveMatch(null)}
                          className="lg:hidden p-1.5 -ml-2 rounded-full hover:bg-slate-200 text-slate-600 transition-colors flex items-center justify-center cursor-pointer"
                        >
                          <ArrowLeft size={18} />
                        </button>

                        <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200">
                          {activeMatch.photoURL ? (
                            <img src={activeMatch.photoURL} alt={activeMatch.displayName || ""} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-slate-800 text-white font-bold text-xs">
                              {(activeMatch.displayName || "C").charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <h6 className="text-[11px] font-black uppercase tracking-tight text-slate-800">{activeMatch.displayName}</h6>
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Mutual Connected</span>
                          </div>
                        </div>
                      </div>

                      {/* Social handles dropdown popup / contact tags */}
                      <div className="flex items-center gap-2">
                        {activeMatch.instagram && (
                          <a 
                            href={`https://instagram.com/${activeMatch.instagram.replace('@', '')}`}
                            target="_blank" 
                            rel="noreferrer"
                            className="p-2 rounded-full hover:bg-slate-200 text-slate-500 hover:text-rose-600 transition-colors"
                            title="Instagram"
                          >
                            <Instagram size={14} />
                          </a>
                        )}
                        {activeMatch.twitter && (
                          <a 
                            href={`https://twitter.com/${activeMatch.twitter.replace('@', '')}`}
                            target="_blank" 
                            rel="noreferrer"
                            className="p-2 rounded-full hover:bg-slate-200 text-slate-500 hover:text-sky-500 transition-colors"
                            title="X / Twitter"
                          >
                            <Twitter size={14} />
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Messages Stack */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/40">
                      {chatMessages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center max-w-xs mx-auto space-y-3">
                          <span className="text-2xl">👋</span>
                          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
                            {language === "ID" ? "Kirim sapaan bersamamu!" : "Start a conversation!"}
                          </p>
                          <p className="text-[9px] text-slate-400 italic">
                            {language === "ID" 
                              ? "Diskusikan detail penerbangan, hotel, konser setlist, atau cari soundcheck buddy bareng!" 
                              : "Coordinate flight details, budget splits, shared rooms or just chat about the tour!"}
                          </p>
                        </div>
                      ) : (
                        chatMessages.map((msg) => {
                          const isSentByMe = msg.senderId === user?.uid;
                          return (
                            <div 
                              key={msg.id}
                              className={cn(
                                "flex flex-col max-w-[80%] space-y-1 text-xs",
                                isSentByMe ? "ml-auto items-end" : "mr-auto items-start"
                              )}
                            >
                              <div 
                                className={cn(
                                  "p-3.5 rounded-2xl leading-relaxed text-left",
                                  isSentByMe 
                                    ? "bg-slate-900 text-white rounded-tr-none" 
                                    : "bg-white text-slate-800 border border-slate-100 rounded-tl-none shadow-sm"
                                )}
                              >
                                {msg.text}
                              </div>
                              <span className="text-[8px] text-slate-400/80 font-mono tracking-wide">
                                {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                              </span>
                            </div>
                          );
                        })
                      )}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Chat footer input bar */}
                    <form 
                      onSubmit={handleSendMessage}
                      className="h-16 border-t border-slate-100 px-4 flex items-center gap-3 bg-white shrink-0"
                    >
                      <input
                        value={newMessageText}
                        onChange={(e) => setNewMessageText(e.target.value)}
                        placeholder={language === "ID" ? "Ketik pesan anda..." : "Type a message..."}
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl py-2.5 px-4 text-xs font-medium text-slate-800 focus:outline-none focus:border-slate-800 transition-all"
                      />
                      <button
                        type="submit"
                        disabled={!newMessageText.trim()}
                        className="h-10 w-10 bg-slate-950 text-emerald-400 hover:bg-emerald-500 hover:text-zinc-950 rounded-xl flex items-center justify-center transition-all cursor-pointer active:scale-90 shadow-sm disabled:opacity-30 disabled:pointer-events-none"
                      >
                        <Send size={14} />
                      </button>
                    </form>

                  </div>
                ) : (
                  <div className="h-full bg-white border border-slate-200/60 rounded-[40px] shadow-sm flex flex-col items-center justify-center text-center p-8">
                    <MessageSquare size={36} className="text-slate-300 mb-4 animate-bounce" />
                    <h5 className="font-extrabold text-sm uppercase tracking-tight text-slate-800 mb-1">
                      {language === "ID" ? "Klik Mutual Pasangan" : "Select a Match"}
                    </h5>
                    <p className="text-[10px] text-slate-400/80 leading-relaxed italic max-w-xs">
                      {language === "ID" 
                        ? "Pilih Coer untuk mulai ngobrol santai & merencanakan tur bareng!"
                        : "Click on any mutual matched Coer from the left panel to begin real-time chats!"}
                    </p>
                  </div>
                )}
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
