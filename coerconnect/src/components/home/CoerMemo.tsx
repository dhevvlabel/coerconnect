import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowLeft, 
  Plus, 
  BookOpen, 
  Calendar, 
  MapPin, 
  FolderHeart, 
  Sparkles, 
  X, 
  RotateCcw, 
  Layers, 
  Image as ImageIcon,
  Heart,
  ChevronRight,
  Maximize2,
  ChevronLeft,
  Play,
  Pause
} from "lucide-react";

interface Album {
  id: string;
  title: string;
  location: string;
  date: string;
  coverUrl: string;
  description: string;
  photos: string[];
  color: string;
}

const DEFAULT_ALBUMS: Album[] = [
  {
    id: "album-1",
    title: "COER WORLD TOUR: JAKARTA 2026",
    location: "Gelora Bung Karno, ID",
    date: "12 June 2026",
    coverUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80",
    description: "Our historic opening stage of the Asia leg. The ocean of blue glow sticks, the screams of ten thousand Coers, and that emotional final encore stage under the starlight.",
    color: "from-emerald-900/40 to-emerald-950/70",
    photos: [
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=80"
    ]
  },
  {
    id: "album-2",
    title: "ENCORE IN SEOUL: SPECIAL STAGE",
    location: "KSPO Dome, KR",
    date: "24 May 2026",
    coverUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&auto=format&fit=crop&q=80",
    description: "A special encore concert packed with custom dance routines, surprise solo releases, and a heartfelt fansign ceremony. Celebrating five beautiful years of the fandom.",
    color: "from-sky-900/40 to-sky-950/70",
    photos: [
      "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80"
    ]
  },
  {
    id: "album-3",
    title: "JAPAN DOME TOUR: CHERRY BLOSSOMS",
    location: "Tokyo Dome, JP",
    date: "08 April 2026",
    coverUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80",
    description: "Concert stage surrounded by breathtaking spring aesthetics. The pink-themed cherry blossom projection mapping synchronized perfectly with the live orchestral setlist.",
    color: "from-rose-900/40 to-rose-950/70",
    photos: [
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&auto=format&fit=crop&q=80"
    ]
  }
];

interface CoerMemoProps {
  onBack: () => void;
}

export function CoerMemo({ onBack }: CoerMemoProps) {
  const [albums, setAlbums] = useState<Album[]>(() => {
    const saved = localStorage.getItem('coer_memo_albums');
    return saved ? JSON.parse(saved) : DEFAULT_ALBUMS;
  });

  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [is3DViewerOpen, setIs3DViewerOpen] = useState(false);
  
  // Immersive 3D Flippable Book State variables
  const [currentSpread, setCurrentSpread] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev'>('next');
  const [isSlideshowActive, setIsSlideshowActive] = useState(false);

  // Auto-flipping interval effect
  useEffect(() => {
    let timer: any;
    if (isSlideshowActive && is3DViewerOpen && selectedAlbum) {
      const spreadsCount = getBookSpreads(selectedAlbum).length;
      timer = setInterval(() => {
        if (!isFlipping) {
          if (currentSpread < spreadsCount - 1) {
            handleNextSpread();
          } else {
            // Loop back to start Cover
            setIsFlipping(true);
            setFlipDirection('prev');
            setTimeout(() => {
              setCurrentSpread(0);
              setIsFlipping(false);
            }, 600);
          }
        }
      }, 4000); // turn page every 4 seconds
    }
    return () => clearInterval(timer);
  }, [isSlideshowActive, is3DViewerOpen, currentSpread, isFlipping, selectedAlbum]);

  // Create form state
  const [newAlbum, setNewAlbum] = useState({
    title: '',
    location: '',
    date: '',
    coverUrl: '',
    description: '',
    photosInput: ''
  });

  const saveAlbums = (updated: Album[]) => {
    setAlbums(updated);
    localStorage.setItem('coer_memo_albums', JSON.stringify(updated));
  };

  const handleCreateAlbum = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlbum.title || !newAlbum.coverUrl) {
      alert("Please provide at least a title and a cover image URL.");
      return;
    }

    const previewPhotos = newAlbum.photosInput
      ? newAlbum.photosInput.split('\n').map(p => p.trim()).filter(Boolean)
      : [newAlbum.coverUrl];

    const colors = [
      "from-teal-900/40 to-teal-950/70",
      "from-fuchsia-900/40 to-fuchsia-950/70",
      "from-amber-900/40 to-amber-950/70",
      "from-violet-900/40 to-violet-950/70"
    ];
    const pickedColor = colors[Math.floor(Math.random() * colors.length)];

    const created: Album = {
      id: `album-${Date.now()}`,
      title: newAlbum.title.toUpperCase(),
      location: newAlbum.location || "Coer Stage, Global",
      date: newAlbum.date || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }),
      coverUrl: newAlbum.coverUrl,
      description: newAlbum.description || "No custom description cataloged. This is a special memory capsule compiled into the vault.",
      color: pickedColor,
      photos: previewPhotos.length > 0 ? previewPhotos : [newAlbum.coverUrl]
    };

    const final = [created, ...albums];
    saveAlbums(final);
    setIsCreating(false);
    setNewAlbum({
      title: '',
      location: '',
      date: '',
      coverUrl: '',
      description: '',
      photosInput: ''
    });
  };

  const handleDeleteAlbum = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Delete this physical album book from your Coer Memo vault?")) {
      const filtered = albums.filter(a => a.id !== id);
      saveAlbums(filtered);
      if (selectedAlbum?.id === id) {
        setSelectedAlbum(null);
      }
    }
  };

  // Build Pages & spreads dynamic mapper
  const getBookSpreads = (album: Album) => {
    const list: any[] = [];
    
    // Spread 0: Covered state (Closed front cover)
    list.push({
      left: null,
      right: {
        type: 'cover',
        title: album.title,
        url: album.coverUrl,
        location: album.location,
        date: album.date,
        description: album.description
      }
    });

    // Spread 1: Left: Journal Intro Info, Right: Spotlight stage Photo 0
    list.push({
      left: {
        type: 'intro',
        title: album.title,
        description: album.description,
        location: album.location,
        date: album.date
      },
      right: {
        type: 'photo',
        url: album.photos[0] || album.coverUrl,
        caption: `CHAPTER 1: THE OPENING STAGE`
      }
    });

    // Subsequent photo pages grouped into spreads
    const restPhotos = album.photos.slice(1);
    for (let i = 0; i < restPhotos.length; i += 2) {
      list.push({
        left: {
          type: 'photo',
          url: restPhotos[i],
          caption: `CHAPTER ${Math.floor(i / 2) + 2}: HIGH MOMENT A`
        },
        right: restPhotos[i + 1] ? {
          type: 'photo',
          url: restPhotos[i + 1],
          caption: `CHAPTER ${Math.floor(i / 2) + 2}: HIGH MOMENT B`
        } : {
          type: 'guestbook',
          title: album.title,
          date: album.date
        }
      });
    }

    // Last Spread: Back Cover closed (Left: Back, Right: null)
    list.push({
      left: {
        type: 'back',
        title: album.title,
        date: album.date
      },
      right: null
    });

    return list;
  };

  const handleNextSpread = () => {
    if (!selectedAlbum) return;
    const spreadsCount = getBookSpreads(selectedAlbum).length;
    if (currentSpread < spreadsCount - 1 && !isFlipping) {
      setIsFlipping(true);
      setFlipDirection('next');
      setTimeout(() => {
        setCurrentSpread(prev => prev + 1);
        setIsFlipping(false);
      }, 600);
    }
  };

  const handlePrevSpread = () => {
    if (currentSpread > 0 && !isFlipping) {
      setIsFlipping(true);
      setFlipDirection('prev');
      setTimeout(() => {
        setCurrentSpread(prev => prev - 1);
        setIsFlipping(false);
      }, 600);
    }
  };

  // Launch the gorgeous interactive 3D Book reader
  const open3DMemo = () => {
    if (!selectedAlbum) return;
    setCurrentSpread(0);
    setIsFlipping(false);
    setIsSlideshowActive(false);
    setIs3DViewerOpen(true);
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Navigation and Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={selectedAlbum ? () => setSelectedAlbum(null) : onBack}
            className="p-3 bg-white border border-accent/10 rounded-2xl text-accent hover:bg-accent hover:text-surface transition-all active:scale-95"
            id="memo-back-btn"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase">
              {selectedAlbum ? "ALBUM CAPSULE" : "COER MEMO"}
            </h2>
            <p className="text-[10px] text-accent/40 font-black uppercase tracking-[0.3em] flex items-center gap-2 mt-1">
              <FolderHeart className="w-3.5 h-3.5 text-accent/30" />
              {selectedAlbum ? selectedAlbum.title : "3D Physical Memories Box"}
            </p>
          </div>
        </div>

        {!selectedAlbum && (
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2.5 px-6 py-4 bg-accent text-surface text-xs font-black uppercase tracking-widest rounded-3xl hover:bg-accent/95 shadow-xl shadow-accent/15 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
            id="memo-create-btn"
          >
            <Plus className="w-4 h-4 text-surface" />
            Add Album
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!selectedAlbum ? (
          /* ============================================================== */
          /* 1. LIBRARY VIEW WITH 3D PERSPECTIVE BOOK COVERS                 */
          /* ============================================================== */
          <motion.div
            key="library-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* Intro card */}
            <div className="p-8 rounded-[36px] bg-white border border-accent/5 shadow-2xl shadow-accent/5 flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden relative">
              <div className="absolute right-[-10%] top-[-30%] w-64 h-64 rounded-full bg-accent/3 blur-2xl pointer-events-none" />
              <div className="space-y-2 max-w-xl">
                <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-accent/5 rounded-full text-accent">Interactive Keepsakes</span>
                <h3 className="text-xl font-black uppercase tracking-tight text-accent pt-2">Your 3D Memory Capsule Vault</h3>
                <p className="text-xs text-accent/60 leading-relaxed font-semibold">
                  Preserve your high-fidelity concert tours, photobooks, and live event milestones directly. Hover on any album to adjust perspective, or click to open the physical photobook detail view.
                </p>
              </div>
              <div className="flex items-center gap-2 px-4 py-3 border border-accent/10 rounded-2xl bg-sage/5">
                <BookOpen className="w-5 h-5 text-accent/40" />
                <span className="text-[10px] font-black uppercase tracking-widest text-accent/60">{albums.length} Capsules Stored</span>
              </div>
            </div>

            {/* Grid of 3D Books */}
            {albums.length === 0 ? (
              <div className="py-20 text-center flex flex-col items-center justify-center">
                <FolderHeart className="w-16 h-16 text-accent/10 mb-4" />
                <h4 className="text-lg font-black uppercase tracking-tight text-accent/50">Your Vault is Empty</h4>
                <p className="text-xs text-accent/40 uppercase tracking-widest mt-1">Tap 'Add Album' to create your first music journey book</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 pt-4">
                {albums.map((album) => (
                  <motion.div
                    key={album.id}
                    onClick={() => setSelectedAlbum(album)}
                    className="group cursor-pointer flex flex-col"
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    {/* Perspective card base */}
                    <div className="relative w-full aspect-[4/3] rounded-[28px] overflow-visible [perspective:1000px] mb-5">
                      {/* Album spine and body structure to mimic a thick deluxe physical box/book */}
                      <div className="absolute inset-0 w-full h-full rounded-[28px] transition-all duration-500 ease-out [transform-style:preserve-3d] group-hover:[transform:rotateY(-18deg)_rotateX(12deg)_translateZ(10px)] shadow-[0_15px_30px_-10px_rgba(0,0,0,0.15)] group-hover:shadow-[20px_25px_45px_rgba(0,0,0,0.25)]">
                        
                        {/* Book Spine reflection accent */}
                        <div className="absolute left-0 top-0 bottom-0 w-[14px] bg-black/10 rounded-l-[28px] z-20 backdrop-blur-[1px] shadow-inner" />
                        <div className="absolute left-[14px] top-0 bottom-0 w-[1px] bg-white/20 z-20" />
                        
                        {/* Inner photo cover */}
                        <img 
                          src={album.coverUrl} 
                          alt={album.title}
                          className="w-full h-full object-cover rounded-[28px]" 
                          referrerPolicy="no-referrer"
                        />
                        
                        {/* Shimmer gradient */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-accent/40 via-transparent to-white/10 rounded-[28px]" />

                        {/* Text Overlay inside book card cover (minimalist aesthetic) */}
                        <div className="absolute inset-x-6 bottom-6 z-10 space-y-1 text-white select-none">
                          <p className="text-[8px] font-black uppercase tracking-[0.2em] text-white/70 flex items-center gap-1.5 backdrop-blur-[2px] bg-black/10 px-2 py-0.5 rounded-md w-fit">
                            <MapPin className="w-2.5 h-2.5" /> {album.location}
                          </p>
                          <h4 className="text-base font-black tracking-tight uppercase leading-snug line-clamp-2 drop-shadow-md text-white">
                            {album.title}
                          </h4>
                        </div>

                        {/* Book pages thickness mockup block visible under perspective angle */}
                        <div className="absolute right-0 top-3 bottom-3 w-[8px] bg-neutral-100 rounded-r-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 origin-left border-y border-neutral-300 z-10 [transform:rotateY(90deg)_translateZ(2px)] shadow-inner" 
                             style={{ backgroundImage: "repeating-linear-gradient(90deg, #e5e5e5 0px, #e5e5e5 1px, transparent 1px, transparent 3px)" }} 
                        />
                      </div>
                    </div>

                    {/* Metadata line below */}
                    <div className="px-1 flex justify-between items-start">
                      <div className="space-y-1">
                        <h4 className="text-sm font-black uppercase tracking-tight text-accent group-hover:text-accent/80 transition-colors">
                          {album.title.length > 30 ? album.title.substring(0, 30) + '...' : album.title}
                        </h4>
                        <div className="flex items-center gap-3 text-[10px] text-accent/40 font-bold uppercase tracking-widest">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> {album.date}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <ImageIcon className="w-3 h-3" /> {album.photos.length} photos
                          </span>
                        </div>
                      </div>
                      
                      <button 
                        onClick={(e) => handleDeleteAlbum(album.id, e)}
                        className="p-2 text-accent/20 hover:text-red-500 hover:bg-neutral-100 rounded-xl transition-all"
                        title="Delete Album"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          /* ============================================================== */
          /* 2. DETAIL VIEW OF ALBUM CAPSULE                                */
          /* ============================================================== */
          <motion.div
            key="detail-view"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              
              {/* Left Column: Big Deluxe Cover art on the left */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                <div className="relative aspect-square w-full rounded-[40px] overflow-hidden shadow-2xl border border-accent/10 group">
                  <img 
                    src={selectedAlbum.coverUrl} 
                    alt={selectedAlbum.title} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  {/* Subtle vignette shade */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  
                  {/* Absolute visual badge */}
                  <div className="absolute top-6 left-6 px-4 py-2 bg-white/80 backdrop-blur-md rounded-2xl border border-white/40 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-accent animate-spin-slow" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-accent">Capsule Verified</span>
                  </div>
                </div>

                {/* Immersion CTA: Open 3D Memo button (Highly Prominent!) */}
                <button
                  onClick={open3DMemo}
                  className="w-full bg-accent text-surface py-5 px-8 rounded-3xl font-black text-xs uppercase tracking-[0.25em] shadow-xl shadow-accent/15 hover:bg-accent/90 hover:shadow-2xl hover:shadow-accent/25 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-3.5 group"
                  id="open-3d-memo-btn"
                >
                  <Layers className="w-5 h-5 text-surface group-hover:scale-110 transition-transform animate-pulse" />
                  Open 3D Memo Space
                </button>
              </div>

              {/* Right Column: Album description / metadata and mini photo list */}
              <div className="lg:col-span-7 space-y-8">
                
                {/* Header Information Box */}
                <div className="p-8 rounded-[36px] bg-white border border-accent/5 shadow-2xl shadow-accent/5 space-y-5">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-sage/10 rounded-full text-accent/70 text-[9px] font-black uppercase tracking-widest">
                      <MapPin className="w-3.5 h-3.5 text-accent/40" />
                      {selectedAlbum.location}
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-sage/10 rounded-full text-accent/70 text-[9px] font-black uppercase tracking-widest">
                      <Calendar className="w-3.5 h-3.5 text-accent/40" />
                      {selectedAlbum.date}
                    </div>
                  </div>

                  <h3 className="text-2xl md:text-4xl font-black uppercase tracking-tighter text-accent leading-none pt-1">
                    {selectedAlbum.title}
                  </h3>

                  <div className="h-px bg-accent/5 w-full" />

                  <p className="text-xs md:text-sm text-accent/70 leading-relaxed font-semibold italic">
                    "{selectedAlbum.description}"
                  </p>
                </div>

                {/* Photos Stack list inside album */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center px-1">
                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-accent/40 flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-accent/30" /> Collected Photos ({selectedAlbum.photos.length})
                    </h4>
                    <span className="text-[10px] font-bold text-accent/30 uppercase tracking-widest">Aesthetic Captures</span>
                  </div>

                  {/* Standard high resolution photo preview grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {selectedAlbum.photos.map((photoUrl, idx) => (
                      <div 
                        key={idx} 
                        className="relative aspect-square rounded-[24px] overflow-hidden border border-accent/5 bg-white shadow-md group cursor-zoom-in"
                        onClick={() => {
                          // Quick overlay enlarge placeholder
                          open3DMemo();
                        }}
                      >
                        <img 
                          src={photoUrl} 
                          alt="Album moment" 
                          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/10 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <Maximize2 className="w-6 h-6 text-white drop-shadow-md" />
                        </div>
                        <div className="absolute bottom-2.5 right-2.5 w-6 h-6 rounded-full bg-black/20 text-white text-[9px] font-bold flex items-center justify-center backdrop-blur-sm">
                          {idx + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================================================================== */}
      {/* 3. DYNAMIC ALBUM CREATOR MODAL (POPUP)                                */}
      {/* ================================================================== */}
      <AnimatePresence>
        {isCreating && (
          <div className="fixed inset-0 z-[10100] flex items-center justify-center p-4">
            {/* Backdrop slide-in */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCreating(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />

            {/* Modal Body container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-lg bg-white rounded-[40px] p-8 md:p-10 border border-accent/10 shadow-[0_45px_90px_rgba(0,0,0,0.3)] z-10"
              id="create-album-modal"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h4 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                    <FolderHeart className="w-5 h-5 text-accent" /> Create Tour Album
                  </h4>
                  <p className="text-[9px] text-accent/40 font-black uppercase tracking-widest mt-0.5">Physical Photobook Catalog</p>
                </div>
                <button 
                  onClick={() => setIsCreating(false)}
                  className="p-2.5 text-accent/40 hover:text-accent hover:bg-sage/10 rounded-full transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form elements */}
              <form onSubmit={handleCreateAlbum} className="space-y-5">
                <div className="space-y-1.5 text-left">
                  <label className="text-[9px] font-black uppercase text-accent/30 tracking-[0.25em]">Album Title *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. COER FESTIVAL: BALI INDIE 2026"
                    value={newAlbum.title}
                    onChange={e => setNewAlbum({...newAlbum, title: e.target.value})}
                    className="w-full bg-sage/5 border border-accent/10 rounded-2xl px-5 py-3.5 outline-none focus:border-accent/40 focus:ring-4 focus:ring-accent/5 transition-all text-xs font-bold text-accent uppercase"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5 text-left">
                    <label className="text-[9px] font-black uppercase text-accent/30 tracking-[0.25em]">Location (City/Country)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Bali, Indonesia"
                      value={newAlbum.location}
                      onChange={e => setNewAlbum({...newAlbum, location: e.target.value})}
                      className="w-full bg-sage/5 border border-accent/10 rounded-2xl px-5 py-3.5 outline-none focus:border-accent/40 focus:ring-4 focus:ring-accent/5 transition-all text-xs font-bold text-accent"
                    />
                  </div>
                  <div className="space-y-1.5 text-left">
                    <label className="text-[9px] font-black uppercase text-accent/30 tracking-[0.25em]">Concert Date</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 15 July 2026"
                      value={newAlbum.date}
                      onChange={e => setNewAlbum({...newAlbum, date: e.target.value})}
                      className="w-full bg-sage/5 border border-accent/10 rounded-2xl px-5 py-3.5 outline-none focus:border-accent/40 focus:ring-4 focus:ring-accent/5 transition-all text-xs font-bold text-accent"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-[9px] font-black uppercase text-accent/30 tracking-[0.25em]">Cover Picture URL *</label>
                  <input 
                    type="url" 
                    required
                    placeholder="e.g. https://images.unsplash.com/..."
                    value={newAlbum.coverUrl}
                    onChange={e => setNewAlbum({...newAlbum, coverUrl: e.target.value})}
                    className="w-full bg-sage/5 border border-accent/10 rounded-2xl px-5 py-3.5 outline-none focus:border-accent/40 focus:ring-4 focus:ring-accent/5 transition-all text-xs font-bold text-accent"
                  />
                  <p className="text-[8px] text-accent/30 font-bold uppercase tracking-wide">Enter an image URL or use Unsplash stock link. Highly recommended for covers!</p>
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-[9px] font-black uppercase text-accent/30 tracking-[0.25em]">Album Description (Memories Recap)</label>
                  <textarea 
                    rows={2}
                    placeholder="Recount the stars, lightsticks, stage setup, or happy tears..."
                    value={newAlbum.description}
                    onChange={e => setNewAlbum({...newAlbum, description: e.target.value})}
                    className="w-full bg-sage/5 border border-accent/10 rounded-2xl px-5 py-3 outline-none focus:border-accent/40 focus:ring-4 focus:ring-accent/5 transition-all text-xs font-medium text-accent"
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-[9px] font-black uppercase text-accent/30 tracking-[0.25em]">Album Photos (One high-res URL per line, max 5 recommended)</label>
                  <textarea 
                    rows={3}
                    placeholder="https://images.unsplash.com/photo-A&#10;https://images.unsplash.com/photo-B"
                    value={newAlbum.photosInput}
                    onChange={e => setNewAlbum({...newAlbum, photosInput: e.target.value})}
                    className="w-full bg-sage/5 border border-accent/10 rounded-2xl px-5 py-3 outline-none focus:border-accent/40 focus:ring-4 focus:ring-accent/5 transition-all text-xs font-mono text-accent"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-4 bg-accent text-surface text-xs font-black uppercase tracking-widest rounded-2xl hover:opacity-95 transition-all"
                >
                  Confirm and Catalog Album
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================================================================== */}
      {/* 4. IMMERSIVE 3D FLIPPABLE VIRTUAL BOOK READER OVERLAY              */}
      {/* ================================================================== */}
      <AnimatePresence>
        {is3DViewerOpen && selectedAlbum && (() => {
          const spreads = getBookSpreads(selectedAlbum);
          
          // Resting background pages during flip animation
          let leftVisiblePage = null;
          let rightVisiblePage = null;

          if (isFlipping) {
            if (flipDirection === 'next') {
              leftVisiblePage = spreads[currentSpread]?.left;
              rightVisiblePage = spreads[currentSpread + 1]?.right;
            } else {
              leftVisiblePage = spreads[currentSpread - 1]?.left;
              rightVisiblePage = spreads[currentSpread]?.right;
            }
          } else {
            leftVisiblePage = spreads[currentSpread]?.left;
            rightVisiblePage = spreads[currentSpread]?.right;
          }

          // Render a page according to its type
          const renderBookPage = (page: any, isLeftPage: boolean) => {
            if (!page) {
              return (
                <div className="w-full h-full bg-black/10 rounded-2xl border border-white/5 shadow-inner" />
              );
            }

            const creaseGradient = isLeftPage 
              ? "bg-gradient-to-r from-black/[0.12] via-transparent to-transparent" 
              : "bg-gradient-to-l from-black/[0.12] via-transparent to-transparent";

            switch (page.type) {
              case 'cover':
                return (
                  <div className="relative w-full h-full bg-[#2A3B31] text-[#FAF9F5] rounded-[24px] shadow-[inset_0_0_40px_rgba(0,0,0,0.8),10px_10px_25px_rgba(0,0,0,0.4)] flex flex-col justify-between p-8 md:p-10 overflow-hidden border border-[#3E5245]/50 select-none">
                    {/* Sage pattern leather grain background */}
                    <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-black to-white" />
                    
                    {/* Double gold borders */}
                    <div className="absolute inset-4 border-2 border-amber-300/10 rounded-[18px]" />
                    <div className="absolute inset-5 border border-amber-300/20 rounded-[14px]" />

                    <div className="space-y-4 pt-10 text-center relative z-10">
                      <span className="text-[8px] font-black tracking-[0.4em] text-amber-300/60 uppercase">
                        COER MEMOIR ARCHIVE
                      </span>
                      <h2 className="text-xl md:text-3xl font-black uppercase tracking-tighter text-amber-50 font-sans leading-tight">
                        {page.title}
                      </h2>
                      <div className="w-10 h-[1.5px] bg-amber-300/30 mx-auto" />
                    </div>

                    {/* Pressed emblem medallion */}
                    <div className="relative w-24 h-24 mx-auto rounded-full border border-amber-300/20 bg-[#1D2A22]/80 flex items-center justify-center shadow-[inset_0_3px_10px_rgba(0,0,0,0.6)]">
                      <BookOpen className="w-8 h-8 text-amber-200/80" />
                      <div className="absolute inset-1 border border-dashed border-amber-300/15 rounded-full" />
                    </div>

                    <div className="space-y-2 text-center pb-6 relative z-10">
                      <p className="text-[10px] font-black text-amber-300/70 uppercase tracking-widest flex items-center justify-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        {page.location}
                      </p>
                      <p className="text-[8px] font-bold text-amber-100/45 uppercase tracking-widest mt-1">
                        VAULTED PRE-STAGE • {page.date}
                      </p>
                    </div>

                    {/* Physical side shadow overlay */}
                    <div className="absolute top-0 bottom-0 right-0 w-10 bg-gradient-to-l from-black/30 via-transparent to-transparent pointer-events-none" />
                  </div>
                );

              case 'back':
                return (
                  <div className="relative w-full h-full bg-[#1D2A22] text-[#FAF9F5] rounded-[24px] shadow-[inset_0_0_40px_rgba(0,0,0,0.8),-10px_10px_25px_rgba(0,0,0,0.4)] flex flex-col justify-between p-10 overflow-hidden border border-[#243329] select-none">
                    <div className="absolute inset-4 border-2 border-amber-300/10 rounded-[18px]" />
                    
                    <div className="text-center pt-10 m-auto space-y-2">
                      <div className="w-14 h-14 rounded-full border border-dashed border-amber-300/20 flex items-center justify-center mx-auto mb-4 bg-emerald-950/40">
                        <Sparkles className="w-5 h-5 text-amber-200/50" />
                      </div>
                      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-300/60">Coer Memoir Vault</h4>
                      <p className="text-[7px] tracking-widest text-[#FAF9F5]/30 uppercase">SYSTEM ID: 121490CB-4E2F • STABLE BUILD</p>
                    </div>

                    <div className="text-center text-[8px] font-bold text-amber-200/30 uppercase tracking-widest pb-4">
                      © 2026 COERCONNECT CO.
                    </div>

                    {/* Physical outer edge shadow */}
                    <div className="absolute top-0 bottom-0 left-0 w-10 bg-gradient-to-r from-black/30 via-transparent to-transparent pointer-events-none" />
                  </div>
                );

              case 'intro':
                return (
                  <div className="relative w-full h-full bg-[#FDFCF7] text-accent p-8 md:p-10 flex flex-col justify-between border border-accent/10 rounded-l-[18px] shadow-[inset_-15px_0_30px_rgba(0,0,0,0.02)] select-none">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-accent/40">
                        <FolderHeart className="w-3.5 h-3.5 text-accent/30" />
                        <span className="text-[8px] font-black uppercase tracking-[0.2em]">MEMORIES ENVELOPE</span>
                      </div>
                      <h3 className="text-lg md:text-xl font-serif font-black uppercase tracking-tight text-accent pt-1 leading-snug">
                        {page.title}
                      </h3>
                      <div className="h-0.5 bg-accent/10 w-12" />
                      
                      <div className="py-2">
                        <p className="text-xs text-accent/70 font-semibold italic font-serif leading-relaxed">
                          "{page.description}"
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-accent/5">
                      <div className="grid grid-cols-2 gap-4 text-left">
                        <div className="space-y-0.5">
                          <span className="text-[7.5px] font-black uppercase text-accent/30 tracking-widest">RECORD SEC</span>
                          <p className="text-[9.5px] font-black text-accent/60 uppercase tracking-wide flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-accent/40" />
                            {page.location}
                          </p>
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[7.5px] font-black uppercase text-accent/30 tracking-widest">STATION DATE</span>
                          <p className="text-[9.5px] font-black text-accent/60 uppercase tracking-wide flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-accent/40" />
                            {page.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-[9px] font-black italic font-serif text-accent/50">Stored in vaults</span>
                        <span className="text-[8px] font-mono text-accent/30">BOOK PAGE 01</span>
                      </div>
                    </div>

                    {/* Paper Spine inner crease shadow */}
                    <div className={`absolute top-0 bottom-0 right-0 w-8 z-20 pointer-events-none ${creaseGradient}`} />
                  </div>
                );

              case 'photo':
                return (
                  <div className={`relative w-full h-full bg-[#FDFCF7] text-accent p-6 flex flex-col justify-between border border-accent/10 rounded-[18px] select-none shadow-[inset_15px_0_30px_rgba(0,0,0,0.01)]`}>
                    {/* Polaroid simulated white block photo card hanging inside */}
                    <div className="flex-1 w-full bg-white p-3 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.04),_0_1px_3px_rgba(0,0,0,0.08)] flex flex-col justify-between border border-neutral-100">
                      <div className="relative flex-1 w-full rounded-xl overflow-hidden bg-neutral-100/50">
                        <img 
                          src={page.url} 
                          alt="Moment slide" 
                          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10" />
                      </div>
                      <div className="mt-2.5 text-center px-1">
                        <p className="font-serif italic text-neutral-800 text-[10px] tracking-wide line-clamp-1">
                          {page.caption || "A concert visual frame preserved."}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 flex justify-between items-center text-[8px] text-accent/30 font-black tracking-widest pl-1">
                      <span>GALLERY CAPSULE</span>
                      <span>PAGE {page.index}</span>
                    </div>

                    {/* Spine internal shadows */}
                    <div className={`absolute top-0 bottom-0 w-8 z-20 pointer-events-none ${creaseGradient}`} />
                  </div>
                );

              case 'guestbook':
                return (
                  <div className="relative w-full h-full bg-[#FDFCF7] text-accent p-8 flex flex-col justify-between border border-accent/10 rounded-r-[18px] shadow-[inset_15px_0_30px_rgba(0,0,0,0.02)] select-none">
                    <div className="space-y-4">
                      <div className="flex items-center gap-1.5 text-accent/50 pb-1">
                        <Heart className="w-3.5 h-3.5 text-red-400" />
                        <span className="text-[8px] font-black uppercase tracking-widest">COER VISITOR DIARY</span>
                      </div>
                      <h3 className="text-base font-black uppercase tracking-tight text-accent">Recorded Signatures</h3>
                      <div className="h-[2px] bg-accent/10 w-10" />
                      
                      <div className="space-y-2 pt-2">
                        <div className="p-2 border-b border-dashed border-accent/10 flex justify-between items-center text-[10.5px]">
                          <span className="font-serif italic text-accent/80 font-bold">"Semoga ada konser lagi!" - dffaseptember</span>
                          <span className="text-[8px] text-accent/30 font-mono">12:15 WIB</span>
                        </div>
                        <div className="p-2 border-b border-dashed border-accent/10 flex justify-between items-center text-[10.5px]">
                          <span className="font-serif italic text-accent/80 font-bold">"Best live show in my entire life!" - Coer_ID</span>
                          <span className="text-[8px] text-accent/30 font-mono">13:40 WIB</span>
                        </div>
                        <div className="p-2 border-b border-dashed border-accent/10 flex justify-between items-center text-[10.5px]">
                          <span className="font-serif italic text-accent/80 font-bold">"Love the 3D fanlights!" - MelodiGlow</span>
                          <span className="text-[8px] text-accent/30 font-mono">15:10 WIB</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 flex justify-between items-center text-[8px] text-accent/30 font-black tracking-widest pl-1 mt-4">
                      <span>SIGNATURE RECORD</span>
                      <span>GUESTBOOK</span>
                    </div>

                    {/* Crease inner shadow */}
                    <div className={`absolute top-0 bottom-0 left-0 w-8 z-20 pointer-events-none ${creaseGradient}`} />
                  </div>
                );

              default:
                return null;
            }
          };

          // Render flipping page overlay
          const renderFlippingSheet = () => {
            let frontPage = null;
            let backPage = null;

            if (flipDirection === 'next') {
              frontPage = spreads[currentSpread]?.right;
              backPage = spreads[currentSpread + 1]?.left;
            } else {
              frontPage = spreads[currentSpread]?.left;
              backPage = spreads[currentSpread - 1]?.right;
            }

            return (
              <motion.div
                key={`flip-sheet-${currentSpread}-${flipDirection}`}
                className="absolute top-0 bottom-0 w-[50%] h-full z-[35]"
                style={{
                  originX: flipDirection === 'next' ? 0 : 1,
                  left: flipDirection === 'next' ? '50%' : 0,
                  transformStyle: 'preserve-3d',
                }}
                initial={{ rotateY: flipDirection === 'next' ? 0 : -180 }}
                animate={{ rotateY: flipDirection === 'next' ? -180 : 0 }}
                transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }} // smooth paper flip cubic-bezier
              >
                {/* Front face of flipping page */}
                <div 
                  className="absolute inset-0 w-full h-full"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  {renderBookPage(frontPage, flipDirection === 'prev')}
                </div>

                {/* Back face of flipping page (needs scaling on Y axis to look correct) */}
                <div 
                  className="absolute inset-0 w-full h-full"
                  style={{ 
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)'
                  }}
                >
                  {renderBookPage(backPage, flipDirection === 'next')}
                </div>
              </motion.div>
            );
          };

          return (
            <div className="fixed inset-0 z-[10200] flex flex-col items-center justify-between p-4 md:p-6 select-none">
              
              {/* Dark blurred environment overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIs3DViewerOpen(false)}
                className="absolute inset-0 bg-[#0F1310]/95 backdrop-blur-xl"
              />

              {/* Theater Mode Action Bar */}
              <div className="relative z-10 w-full max-w-5xl flex flex-col sm:flex-row justify-between items-center gap-3 pt-2 text-white">
                <div className="space-y-1 text-center sm:text-left">
                  <span className="text-[8px] font-black uppercase tracking-[0.4em] bg-white/10 px-3 py-1 rounded-full text-white/75">
                    COER 3D BOOK EMULATOR
                  </span>
                  <h3 className="text-lg md:text-xl font-black uppercase tracking-tight text-white pt-1">
                    {selectedAlbum.title}
                  </h3>
                  <p className="text-[9px] text-[#FAF9F5]/45 font-bold uppercase tracking-widest leading-none">
                    Slide page progress at bottom or swipe back & forth like a physical photobook!
                  </p>
                </div>

                {/* Top Quick Actions */}
                <div className="flex items-center gap-2">
                  {/* Play Slideshow Button */}
                  <button
                    onClick={() => setIsSlideshowActive(!isSlideshowActive)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/15 text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 ${
                      isSlideshowActive ? "bg-amber-300 text-black border-amber-300 hover:bg-amber-400" : "bg-white/5 hover:bg-white/10 text-white"
                    }`}
                    title="Toggle Slideshow turn pages"
                  >
                    {isSlideshowActive ? (
                      <>
                        <Pause className="w-3.5 h-3.5 fill-black" />
                        Autoplay Active
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5" />
                        Autoplay Slideshow
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setCurrentSpread(0);
                      setIsFlipping(false);
                      setIsSlideshowActive(false);
                    }}
                    className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white transition-all active:scale-95"
                    title="Rewind to Cover"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setIs3DViewerOpen(false)}
                    className="p-2.5 bg-white/5 hover:bg-red-500 hover:bg-opacity-20 border border-white/10 rounded-xl text-white transition-all active:scale-95"
                    title="Close book viewer"
                  >
                    <X className="w-4.5 h-4.5" />
                  </button>
                </div>
              </div>

              {/* 3D BOOK STAGE CENTER */}
              <div className="relative w-full max-w-4xl h-[55vh] flex items-center justify-center overflow-visible my-3">
                
                {/* Simulated table shadow depth backing */}
                <div className="absolute w-[95%] h-[8%] bottom-[-5%] bg-black/40 blur-2xl rounded-full pointer-events-none" />

                {/* Left flipping manual arrow trigger */}
                <button
                  onClick={handlePrevSpread}
                  disabled={currentSpread === 0 || isFlipping}
                  className="absolute left-[-20px] md:left-[-60px] z-[50] p-4 bg-[#FAF9F5] hover:bg-amber-100 disabled:opacity-10 border border-neutral-300 shadow-xl rounded-full text-accent transition-all active:scale-90 hover:-translate-x-1 duration-200"
                >
                  <ChevronLeft className="w-6 h-6 stroke-[3px]" />
                </button>

                {/* BOOK CONTAINER WITH 3D CHAMFER & PERSPECTIVE CAMERA DEPTH */}
                <div 
                  className="relative w-full max-w-[840px] h-[400px] md:h-[460px] flex items-center justify-center overflow-visible"
                  style={{
                    perspective: '1400px', // key camera depth for Y-rotations
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {/* STACKED PHYSICAL THICKNESS EFFECTS (Faux side papers behind) */}
                  {currentSpread > 0 && currentSpread < spreads.length - 1 && (
                    <>
                      {/* Left stack depth sheets */}
                      <div className="absolute left-[3px] top-[3px] bottom-[3px] w-[50%] bg-[#FAF9F5]/70 rounded-l-[18px] border-y border-l border-accent/5 opacity-50 z-[1] transform -translate-z-2 translate-x-[-2px]" />
                      <div className="absolute left-[6px] top-[6px] bottom-[6px] w-[50%] bg-[#FAF9F5]/40 rounded-l-[18px] border-y border-l border-accent/5 opacity-30 z-[0] transform -translate-z-4 translate-x-[-4px]" />
                      
                      {/* Right stack depth sheets */}
                      <div className="absolute right-[3px] top-[3px] bottom-[3px] w-[50%] bg-[#FAF9F5]/70 rounded-r-[18px] border-y border-r border-accent/5 opacity-50 z-[1] transform -translate-z-2 translate-x-[2px]" />
                      <div className="absolute right-[6px] top-[6px] bottom-[6px] w-[50%] bg-[#FAF9F5]/40 rounded-r-[18px] border-y border-r border-accent/5 opacity-30 z-[0] transform -translate-z-4 translate-x-[4px]" />
                    </>
                  )}

                  {/* LEFT PAGES CONTAINER PANEL */}
                  <div 
                    className="absolute left-0 top-0 w-[50%] h-full z-10 origin-right"
                    style={{
                      transform: 'rotateY(6deg)', // subtle physical tilt inward
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    {renderBookPage(leftVisiblePage, true)}
                  </div>

                  {/* RIGHT PAGES CONTAINER PANEL */}
                  <div 
                    className="absolute right-0 top-0 w-[50%] h-full z-10 origin-left"
                    style={{
                      transform: 'rotateY(-6deg)', // subtle physical tilt inward
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    {renderBookPage(rightVisiblePage, false)}
                  </div>

                  {/* CENTRAL SPINE BINDING CREASE VERTICAL RAIL */}
                  <div className="absolute top-0 bottom-0 left-[50%] -translate-x-[50%] w-[14px] bg-gradient-to-r from-[#172019] via-[#0D130E] to-[#172019] border-x border-[#0A0D0B] shadow-[0_0_15px_rgba(0,0,0,0.6)] z-[45]" />

                  {/* DYNAMIC SWINGING 3D PAGE IF FLIPPING */}
                  {isFlipping && renderFlippingSheet()}

                </div>

                {/* Right flipping manual arrow trigger */}
                <button
                  onClick={handleNextSpread}
                  disabled={currentSpread === spreads.length - 1 || isFlipping}
                  className="absolute right-[-20px] md:right-[-60px] z-[50] p-4 bg-[#FAF9F5] hover:bg-amber-100 disabled:opacity-10 border border-neutral-300 shadow-xl rounded-full text-accent transition-all active:scale-90 hover:translate-x-1 duration-200"
                >
                  <ChevronRight className="w-6 h-6 stroke-[3px]" />
                </button>

              </div>

              {/* DYNAMIC PROGRESS CONTROLS SYSTEM (Seeker Slider & Spread Indicators) */}
              <div className="relative z-10 w-full max-w-2xl bg-white/5 border border-white/15 backdrop-blur-md px-6 py-4 md:py-5 rounded-3xl flex flex-col items-center gap-3">
                
                {/* Labeling of visible spreads */}
                <div className="w-full flex justify-between items-center text-[10px] text-white/55 font-bold uppercase tracking-widest px-1">
                  <span>
                    {currentSpread === 0 ? "FRONT COVER" : currentSpread === spreads.length - 1 ? "BACK COVER" : `SPREAD ${currentSpread} OF ${spreads.length - 2}`}
                  </span>
                  <span className="flex items-center gap-1.5 bg-amber-300/10 text-amber-200 px-2.5 py-0.5 rounded-full border border-amber-300/15">
                    <BookOpen className="w-3.5 h-3.5" />
                    {currentSpread === 0 ? "CLOSED" : currentSpread === spreads.length - 1 ? "CLOSED" : "PAGES OPEN"}
                  </span>
                </div>

                {/* PHYSICAL SEEKER SLIDER TIMELINE (Satisfies 'slide' intent) */}
                <input 
                  type="range"
                  min="0"
                  max={spreads.length - 1}
                  step="1"
                  value={currentSpread}
                  disabled={isFlipping}
                  onChange={(e) => {
                    const nextVal = parseInt(e.target.value);
                    if (nextVal !== currentSpread) {
                      setIsFlipping(true);
                      setFlipDirection(nextVal > currentSpread ? 'next' : 'prev');
                      setTimeout(() => {
                        setCurrentSpread(nextVal);
                        setIsFlipping(false);
                      }, 500);
                    }
                  }}
                  className="w-full accent-amber-300 bg-white/10 rounded-lg h-2 py-1 outline-none cursor-pointer transition-all disabled:opacity-50"
                  title="Drag to slide pages directly"
                />

                {/* Dots index timeline locator */}
                <div className="flex items-center gap-2.5 pt-1.5">
                  {spreads.map((_, idx) => (
                    <button
                      key={idx}
                      disabled={isFlipping}
                      onClick={() => {
                        if (idx !== currentSpread) {
                          setIsFlipping(true);
                          setFlipDirection(idx > currentSpread ? 'next' : 'prev');
                          setTimeout(() => {
                            setCurrentSpread(idx);
                            setIsFlipping(false);
                          }, 500);
                        }
                      }}
                      className={`h-2.5 rounded-full transition-all duration-300 ${
                        idx === currentSpread ? "w-6 bg-amber-300 shadow-md" : "w-2.5 bg-white/20 hover:bg-white/40"
                      }`}
                    />
                  ))}
                </div>

              </div>

            </div>
          );
        })()}
      </AnimatePresence>

    </div>
  );
}
