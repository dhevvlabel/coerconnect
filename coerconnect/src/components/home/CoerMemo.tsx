import React, { useState, useEffect, useRef } from 'react';
// @ts-ignore
import HTMLPageFlip from 'react-pageflip';
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../../hooks/useAuth";
import { useLanguage } from "../../contexts/LanguageContext";
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
  Pause,
  Edit2,
  Trash2,
  AlertTriangle
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
    id: "album-cortis",
    title: "CORTIS PRESENT: EXAMPLE ALBUM",
    location: "Seoul, Korea",
    date: "28 December 2026",
    coverUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80", // image_8175 representation
    description: "Welcome to your default example album! Travel to Seoul, Korea for the unforgettable CORTIS PRESENT main stage. Deep blue lightsticks filling the giant arena, echoes of the gorgeous intro performance, and our special memory captured under the spotlight.",
    color: "from-[#2A3B31]/40 to-[#1D2A22]/70",
    photos: [
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80"
    ]
  }
];

const BookPage = React.forwardRef<HTMLDivElement, { children: React.ReactNode; className?: string }>(
  ({ children, className = "" }, ref) => {
    return (
      <div 
        ref={ref} 
        className={`w-full h-full bg-[#FDFCF7] overflow-hidden shadow-md ${className}`}
        style={{ boxSizing: "border-box" }}
      >
        {children}
      </div>
    );
  }
);
BookPage.displayName = "BookPage";

interface CoerMemoProps {
  onBack: () => void;
}

const memoTranslations: Record<'KR' | 'ID' | 'EN', Record<string, string>> = {
  KR: {
    albumCapsule: "ALBUM CAPSULE",
    coerMemo: "COER MEMO",
    boxDesc: "3D 실물 추억 보관함",
    editAlbum: "앨범 수정",
    deleteAlbum: "앨범 삭제",
    addAlbum: "앨범 추가",
    keepsakes: "상호작용 추억",
    vaultTitle: "나만의 3D 메모리 캡슐 보관소",
    vaultDesc: "콘서트 투어, 포토북 및 라이브 이벤트 이정표를 생생하게 간직하세요. 앨범 위로 마우스를 가져가면 원근감을 조정하고 클릭하여 실물 포토북 상세 보기를 열 수 있습니다.",
    storedCapsules: "개 캡슐 저장됨",
    emptyVault: "보관함이 비어 있습니다",
    emptyVaultDesc: "새 앨범을 눌러 첫 번째 음원 여정을 기록해 보세요",
    location: "위치",
    date: "콘서트 날짜",
    photos: "사진",
    verified: "캡슐 인증됨",
    open3DTitle: "3D COER MEMO 열기",
    collectedPhotos: "수집된 사진",
    aestheticCaptures: "감각적인 사진들",
    editHeading: "앨범 수정",
    createHeading: "앨범 생성",
    formTitle: "투어 앨범 수정",
    catalogCaption: "실물 포토북 카탈로그",
    albumTitleLabel: "앨범 제목 *",
    albumTitlePlaceholder: "예: COER FESTIVAL: BALI INDIE 2026",
    locationPlaceholder: "예: Bali, Indonesia",
    datePlaceholder: "예: 2026년 7월 15일",
    recapLabel: "앨범 설명 (추억 회상)",
    recapPlaceholder: "별빛, 응원봉, 무대 배치, 감동의 눈물을 담아보세요...",
    uploadLocalLabel: "로컬 추억 업로드",
    dragDropLabel: "투어 사진을 이곳에 끌어다 놓으세요",
    clickFileExplorer: "또는 파일 탐색기 열기",
    imagesSelected: "장 이미지 선택됨",
    removeAll: "모두 삭제",
    setFirstCoverLabel: "첫 번째 업로드된 사진을 앨범 커버로 설정",
    coverPictureLabel: "커버 사진",
    coverAutoAssigned: "업로드된 항목에서 자동 지정",
    changeCover: "커버 변경",
    uploadCover: "커버 업로드",
    optionalPhotosLabel: "기타 사진 URL (줄바꿈 구분, 선택 사항)",
    saveChanges: "앨범 수정사항 저장",
    confirmCatalog: "확인 및 앨범 카탈로그화",
    deleteTitle: "앨범 캡슐을 삭제하시겠습니까?",
    deleteDesc: "이 메모리 앨범을 물리적인 Coer Memo 아카이브에서 영구적으로 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.",
    cancel: "취소",
    deleteConfirmBtn: "삭제하기",
    autoplay: "자동 재생",
    active: "활성화됨",
    rewind: "처음으로",
    closeBook: "닫기",
    coverSealed: "커버 밀봉됨",
    backCover: "뒷면 커버",
    pagesOpen: "페이지 펼침",
    chapterOpening: "1장: 오프닝 스테이지",
    chapterHighMoment: "장: 영광의 순간",
    visitorDiary: "COER 방명록",
    recordedSignatures: "기록된 서명",
    ownerSignature: "소유자 서명",
    signatureRecord: "서명 기록",
    guestbookPage: "방명록",
    alertTitleEmpty: "앨범 제목을 입력해 주세요.",
    alertCoverRequired: "커버 사진을 업로드하거나 최소 1장 이상의 로컬 사진을 선택해 주세요.",
    alertQuotaFull: "용량 초과! 업로드한 일부 사진의 크기가 너무 큽니다. 더 적은 수의 사진을 업로드하거나 외부 이미지 URL을 대신 사용해 주세요."
  },
  ID: {
    albumCapsule: "ALBUM CAPSULE",
    coerMemo: "COER MEMO",
    boxDesc: "Kotak Kenangan Fisik 3D",
    editAlbum: "Edit Album",
    deleteAlbum: "Hapus Album",
    addAlbum: "Tambah Album",
    keepsakes: "Interactive Keepsakes",
    vaultTitle: "Vault Kapsul Memori 3D Anda",
    vaultDesc: "Abadikan rangkaian konser tur, buku foto, dan momen berharga acara langsung Anda secara nyata. Arahkan kursor pada album untuk menyesuaikan perspektif, atau klik untuk membuka detail buku foto fisik.",
    storedCapsules: "Kapsul Tersimpan",
    emptyVault: "Vault Anda Kosong",
    emptyVaultDesc: "Ketuk 'Tambah Album' untuk membuat buku perjalanan musik pertama Anda",
    location: "Lokasi",
    date: "Tanggal Konser",
    photos: "foto",
    verified: "Kapsul Terverifikasi",
    open3DTitle: "Buka 3D COER MEMO",
    collectedPhotos: "Foto Terkumpul",
    aestheticCaptures: "Tangkapan Estetis",
    editHeading: "Edit Album",
    createHeading: "Tambah Album",
    catalogCaption: "Katalog Buku Foto Fisik",
    albumTitleLabel: "Judul Album *",
    albumTitlePlaceholder: "c/o: COER FESTIVAL: BALI INDIE 2026",
    locationPlaceholder: "c/o: Bali, Indonesia",
    datePlaceholder: "c/o: 15 Juli 2026",
    recapLabel: "Deskripsi Album (Catatan Kenangan)",
    recapPlaceholder: "Tuliskan tentang gemerlap bintang, lightstick, tata panggung, atau air mata kebahagiaan...",
    uploadLocalLabel: "Unggah Kenangan Lokal",
    dragDropLabel: "Tarik & lepas foto tur Anda di sini",
    clickFileExplorer: "atau klik untuk membuka file explorer",
    imagesSelected: "Gambar Terpilih",
    removeAll: "Hapus Semua",
    setFirstCoverLabel: "Jadikan foto pertama yang diunggah sebagai Cover Album",
    coverPictureLabel: "Foto Sampul (Cover)",
    coverAutoAssigned: "Otomatis diatur dari foto pertama",
    changeCover: "Ubah Sampul",
    uploadCover: "Unggah Sampul",
    optionalPhotosLabel: "URL Foto Tambahan (Satu URL per baris, opsional)",
    saveChanges: "Simpan Perubahan Album",
    confirmCatalog: "Konfirmasi dan Catat Album",
    deleteTitle: "Hapus Kapsul Album?",
    deleteDesc: "Apakah Anda yakin ingin menghapus album kenangan ini secara permanen dari arsip fisik Coer Memo Anda? Tindakan ini tidak dapat dibatalkan.",
    cancel: "Batal",
    deleteConfirmBtn: "Hapus Album",
    autoplay: "Autoplay",
    active: "Aktif",
    rewind: "Ulangi",
    closeBook: "Tutup",
    coverSealed: "SAMPUL TERTUTUP",
    backCover: "SAMPUL BELAKANG",
    pagesOpen: "HALAMAN TERBUKA",
    chapterOpening: "BAB 1: TAHAP PEMBUKAAN",
    chapterHighMoment: "BAB {index}: MOMEN INDAH",
    visitorDiary: "COER BUKU TAMU",
    recordedSignatures: "Tanda Tangan Tercatat",
    ownerSignature: "Tanda Tangan Pemilik",
    signatureRecord: "REKAM TANDA TANGAN",
    guestbookPage: "BUKU TAMU",
    alertTitleEmpty: "Harap masukkan sekurang-kurangnya Judul Album.",
    alertCoverRequired: "Harap unggah gambar sampul atau pilih sekurang-kurangnya satu foto lokal sebagai sampul.",
    alertQuotaFull: "Kuota penyimpanan penuh! Beberapa foto yang Anda unggah terlalu besar untuk disimpan. Silakan coba unggah lebih sedikit foto atau gunakan URL gambar eksternal."
  },
  EN: {
    albumCapsule: "ALBUM CAPSULE",
    coerMemo: "COER MEMO",
    boxDesc: "3D Physical Memories Box",
    editAlbum: "Edit Album",
    deleteAlbum: "Delete Album",
    addAlbum: "Add Album",
    keepsakes: "Interactive Keepsakes",
    vaultTitle: "Your 3D Memory Capsule Vault",
    vaultDesc: "Preserve your high-fidelity concert tours, photobooks, and live event milestones directly. Hover on any album to adjust perspective, or click to open the physical photobook detail view.",
    storedCapsules: "Capsules Stored",
    emptyVault: "Your Vault is Empty",
    emptyVaultDesc: "Tap 'Add Album' to create your first music journey book",
    location: "Location",
    date: "Concert Date",
    photos: "photos",
    verified: "Capsule Verified",
    open3DTitle: "Open 3D COER MEMO",
    collectedPhotos: "Collected Photos",
    aestheticCaptures: "Aesthetic Captures",
    editHeading: "Edit Tour Album",
    createHeading: "Create Tour Album",
    catalogCaption: "Physical Photobook Catalog",
    albumTitleLabel: "Album Title *",
    albumTitlePlaceholder: "e.g. COER FESTIVAL: BALI INDIE 2026",
    locationPlaceholder: "e.g. Bali, Indonesia",
    datePlaceholder: "e.g. 15 July 2026",
    recapLabel: "Album Description (Memories Recap)",
    recapPlaceholder: "Recount the stars, lightsticks, stage setup, or happy tears...",
    uploadLocalLabel: "Upload Local Memories",
    dragDropLabel: "Drag & drop your tour photos here",
    clickFileExplorer: "or click to open file explorer",
    imagesSelected: "Images Selected",
    removeAll: "Remove All",
    setFirstCoverLabel: "Set first uploaded photo as Album Cover",
    coverPictureLabel: "Cover Photo",
    coverAutoAssigned: "Auto-assigned from uploads",
    changeCover: "Change Cover",
    uploadCover: "Upload Cover",
    optionalPhotosLabel: "More Photo URLs (One URL per line, optional fallback)",
    saveChanges: "Save Album Changes",
    confirmCatalog: "Confirm and Catalog Album",
    deleteTitle: "Delete Album Capsule?",
    deleteDesc: "Are you sure you want to permanently delete this memory album from your physical Coer Memo archive? This action cannot be undone.",
    cancel: "Cancel",
    deleteConfirmBtn: "Delete Action",
    autoplay: "Autoplay",
    active: "Active",
    rewind: "Rewind",
    closeBook: "Close",
    coverSealed: "COVER SEALED",
    backCover: "BACK COVER",
    pagesOpen: "PAGES OPEN",
    chapterOpening: "CHAPTER 1: THE OPENING STAGE",
    chapterHighMoment: "CHAPTER {index}: HIGH MOMENT",
    visitorDiary: "COER VISITOR DIARY",
    recordedSignatures: "Recorded Signatures",
    ownerSignature: "Owner Signature",
    signatureRecord: "SIGNATURE RECORD",
    guestbookPage: "GUESTBOOK",
    alertTitleEmpty: "Please provide at least an Album Title.",
    alertCoverRequired: "Please upload a cover image or choose at least one local photo to use as cover.",
    alertQuotaFull: "Storage quota full! Some of your uploaded photos are too large to store. Please try uploading fewer photos, or use external image URLs instead."
  }
};

export function CoerMemo({ onBack }: CoerMemoProps) {
  const { user, profile } = useAuth();
  const { language } = useLanguage();

  const activeLang = (language === 'KR' || language === 'ID' || language === 'EN') ? language : 'EN';
  const lt = (key: string) => {
    return memoTranslations[activeLang][key] || memoTranslations['EN'][key] || key;
  };
  const [albums, setAlbums] = useState<Album[]>(() => {
    const saved = localStorage.getItem('coer_memo_albums');
    if (saved) {
      const parsed = JSON.parse(saved);
      // If the saved list contains any of the old default albums, reset/migrate them to the new default
      const hasOldDefaults = parsed.some((a: Album) => a.id === 'album-1' || a.id === 'album-2' || a.id === 'album-3');
      if (hasOldDefaults) {
        localStorage.setItem('coer_memo_albums', JSON.stringify(DEFAULT_ALBUMS));
        return DEFAULT_ALBUMS;
      }
      return parsed;
    }
    return DEFAULT_ALBUMS;
  });

  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [editingAlbumId, setEditingAlbumId] = useState<string | null>(null);
  const [albumToDelete, setAlbumToDelete] = useState<Album | null>(null);
  const [is3DViewerOpen, setIs3DViewerOpen] = useState(false);
  
  // Immersive 3D Flippable Book State variables
  const bookRef = useRef<any>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isSlideshowActive, setIsSlideshowActive] = useState(false);

  // Auto-flipping interval effect with react-pageflip
  useEffect(() => {
    let timer: any;
    if (isSlideshowActive && is3DViewerOpen && selectedAlbum && bookRef.current) {
      const totalPages = getBookPages(selectedAlbum).length;
      timer = setInterval(() => {
        try {
          const pageFlipObj = bookRef.current.pageFlip();
          if (pageFlipObj) {
            const currentIdx = pageFlipObj.getCurrentPageIndex();
            if (currentIdx < totalPages - 1) {
              pageFlipObj.flipNext();
            } else {
              pageFlipObj.flip(0);
            }
          }
        } catch (e) {
          console.error("Autoplay error:", e);
        }
      }, 4000); // turn page every 4 seconds
    }
    return () => clearInterval(timer);
  }, [isSlideshowActive, is3DViewerOpen, selectedAlbum]);

  // Safely manage body overflow scroll lock when modals are open
  useEffect(() => {
    const shouldLock = isCreating || is3DViewerOpen || !!albumToDelete;
    if (shouldLock) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCreating, is3DViewerOpen, albumToDelete]);

  // Compress image before storage to avoid QuotaExceededError
  const compressImage = (dataUrl: string, maxW = 800, maxH = 800, quality = 0.6): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = dataUrl;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxW) {
            height = Math.round((height * maxW) / width);
            width = maxW;
          }
        } else {
          if (height > maxH) {
            width = Math.round((width * maxH) / height);
            height = maxH;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        } else {
          resolve(dataUrl);
        }
      };
      img.onerror = () => {
        resolve(dataUrl);
      };
    });
  };

  // Create form state
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [useFirstPhotoAsCover, setUseFirstPhotoAsCover] = useState(false);
  const [newAlbum, setNewAlbum] = useState({
    title: '',
    location: '',
    date: '',
    coverUrl: '',
    description: '',
    photosInput: ''
  });

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processUploadedFiles = (files: FileList) => {
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        if (dataUrl) {
          compressImage(dataUrl).then((compressed) => {
            setUploadedPhotos((prev) => [...prev, compressed]);
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      processUploadedFiles(e.dataTransfer.files);
    }
  };

  const removeUploadedPhoto = (indexToRemove: number) => {
    setUploadedPhotos((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const saveAlbums = (updated: Album[]) => {
    try {
      localStorage.setItem('coer_memo_albums', JSON.stringify(updated));
      setAlbums(updated);
    } catch (err) {
      console.error("Failed to save to localStorage:", err);
      alert(lt('alertQuotaFull'));
    }
  };

  const handleCloseForm = () => {
    setIsCreating(false);
    setEditingAlbumId(null);
    setUploadedPhotos([]);
    setUseFirstPhotoAsCover(false);
    setNewAlbum({
      title: '',
      location: '',
      date: '',
      coverUrl: '',
      description: '',
      photosInput: ''
    });
    // Safely unlock the scroll immediately
    document.body.style.overflow = "";
  };

  const handleStartEditAlbum = (album: Album, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingAlbumId(album.id);
    
    const localUploads = album.photos.filter(p => p.startsWith('data:'));
    const remoteUrls = album.photos.filter(p => !p.startsWith('data:'));
    setUploadedPhotos(localUploads);
    setUseFirstPhotoAsCover(album.coverUrl === localUploads[0]);
    
    setNewAlbum({
      title: album.title,
      location: album.location,
      date: album.date,
      coverUrl: album.coverUrl,
      description: album.description,
      photosInput: remoteUrls.join('\n')
    });
    setIsCreating(true);
  };

  const handleCreateAlbum = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Auto-calculate cover from first uploaded photo if enabled or if coverUrl is empty but we have uploads
    let finalCoverUrl = newAlbum.coverUrl;
    if ((useFirstPhotoAsCover || !finalCoverUrl) && uploadedPhotos.length > 0) {
      finalCoverUrl = uploadedPhotos[0];
    }

    if (!newAlbum.title) {
      alert(lt('alertTitleEmpty'));
      return;
    }

    if (!finalCoverUrl) {
      alert(lt('alertCoverRequired'));
      return;
    }

    // Parse typed URLs
    const typedPhotos = newAlbum.photosInput
      ? newAlbum.photosInput.split('\n').map(p => p.trim()).filter(Boolean)
      : [];

    // Combine uploaded photos and typed URLs
    const combinedPhotos = [...uploadedPhotos, ...typedPhotos];
    
    // Ensure we have at least one photo page in the pages block
    const finalPhotosList = combinedPhotos.length > 0 ? combinedPhotos : [finalCoverUrl];

    const colors = [
      "from-teal-900/40 to-teal-950/70",
      "from-fuchsia-900/40 to-fuchsia-950/70",
      "from-amber-900/40 to-amber-950/70",
      "from-violet-900/40 to-violet-950/70"
    ];
    const pickedColor = colors[Math.floor(Math.random() * colors.length)];

    if (editingAlbumId) {
      // EDIT MODE
      const updatedAlbums = albums.map(a => {
        if (a.id === editingAlbumId) {
          return {
            ...a,
            title: newAlbum.title.toUpperCase(),
            location: newAlbum.location || "Coer Stage, Global",
            date: newAlbum.date || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }),
            coverUrl: finalCoverUrl,
            description: newAlbum.description || "No custom description cataloged. This is a special memory capsule compiled into the vault.",
            photos: finalPhotosList
          };
        }
        return a;
      });
      saveAlbums(updatedAlbums);

      // Also update selectedAlbum state if the active album is edited, so the viewer gets instantaneous visual reload!
      if (selectedAlbum?.id === editingAlbumId) {
        const found = updatedAlbums.find(a => a.id === editingAlbumId);
        if (found) setSelectedAlbum(found);
      }
    } else {
      // CREATE MODE
      const created: Album = {
        id: `album-${Date.now()}`,
        title: newAlbum.title.toUpperCase(),
        location: newAlbum.location || "Coer Stage, Global",
        date: newAlbum.date || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }),
        coverUrl: finalCoverUrl,
        description: newAlbum.description || "No custom description cataloged. This is a special memory capsule compiled into the vault.",
        color: pickedColor,
        photos: finalPhotosList
      };

      const final = [created, ...albums];
      saveAlbums(final);
    }

    handleCloseForm();
  };

  const handleDeleteAlbumConfirm = () => {
    if (!albumToDelete) return;
    const id = albumToDelete.id;
    const filtered = albums.filter(a => a.id !== id);
    saveAlbums(filtered);
    if (selectedAlbum?.id === id) {
      setSelectedAlbum(null);
    }
    setAlbumToDelete(null);
  };

  // Build Pages dynamic flat mapper for HTMLPageFlip
  const getBookPages = (album: Album) => {
    const list: any[] = [];
    
    // Page 1: Front Cover
    list.push({
      type: 'cover',
      title: album.title,
      url: album.coverUrl,
      location: album.location,
      date: album.date,
      description: album.description
    });

    // Page 2: Intro info
    list.push({
      type: 'intro',
      title: album.title,
      description: album.description,
      location: album.location,
      date: album.date
    });

    // Page 3: Photo index 0
    list.push({
      type: 'photo',
      url: album.photos[0] || album.coverUrl,
      caption: `CHAPTER 1: THE OPENING STAGE`,
      index: 1
    });

    // Subsequent photo pages
    const restPhotos = album.photos.slice(1);
    restPhotos.forEach((url, idx) => {
      list.push({
        type: 'photo',
        url: url,
        caption: `CHAPTER ${idx + 2}: HIGH MOMENT`,
        index: idx + 2
      });
    });

    // Back Cover needs to land on a left page (even 1-based index).
    // If the next position is odd, we insert a guestbook page.
    if ((list.length + 1) % 2 !== 0) {
      list.push({
        type: 'guestbook',
        title: album.title,
        date: album.date
      });
    }

    // Back Cover Closed
    list.push({
      type: 'back',
      title: album.title,
      date: album.date
    });

    return list;
  };

  const handleNextPage = () => {
    if (bookRef.current) {
      try {
        bookRef.current.pageFlip().flipNext();
      } catch (err) {
        console.error("flipNext error:", err);
      }
    }
  };

  const handlePrevPage = () => {
    if (bookRef.current) {
      try {
        bookRef.current.pageFlip().flipPrev();
      } catch (err) {
        console.error("flipPrev error:", err);
      }
    }
  };

  // Launch the gorgeous interactive 3D Book reader
  const open3DMemo = () => {
    if (!selectedAlbum) return;
    setCurrentPage(0);
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
              {selectedAlbum ? lt('albumCapsule') : lt('coerMemo')}
            </h2>
            <p className="text-[10px] text-accent/40 font-black uppercase tracking-[0.3em] flex items-center gap-2 mt-1">
              <FolderHeart className="w-3.5 h-3.5 text-accent/30" />
              {selectedAlbum ? selectedAlbum.title : lt('boxDesc')}
            </p>
          </div>
        </div>

        {selectedAlbum ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleStartEditAlbum(selectedAlbum)}
              className="flex items-center gap-2 px-5 py-3.5 bg-white border border-accent/10 text-accent text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-amber-500 hover:text-white hover:border-amber-500 transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <Edit2 className="w-4 h-4" />
              {lt('editAlbum')}
            </button>
            <button
              onClick={() => setAlbumToDelete(selectedAlbum)}
              className="flex items-center gap-2 px-5 py-3.5 bg-white border border-accent/10 text-accent text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-red-500 hover:text-white hover:border-red-500 transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <Trash2 className="w-4 h-4" />
              {lt('deleteAlbum')}
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2.5 px-6 py-4 bg-accent text-surface text-xs font-black uppercase tracking-widest rounded-3xl hover:bg-accent/95 shadow-xl shadow-accent/15 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
            id="memo-create-btn"
          >
            <Plus className="w-4 h-4 text-surface" />
            {lt('addAlbum')}
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
                <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-accent/5 rounded-full text-accent">{lt('keepsakes')}</span>
                <h3 className="text-xl font-black uppercase tracking-tight text-accent pt-2">{lt('vaultTitle')}</h3>
                <p className="text-xs text-accent/60 leading-relaxed font-semibold">
                  {lt('vaultDesc')}
                </p>
              </div>
              <div className="flex items-center gap-2 px-4 py-3 border border-accent/10 rounded-2xl bg-sage/5">
                <BookOpen className="w-5 h-5 text-accent/40" />
                <span className="text-[10px] font-black uppercase tracking-widest text-accent/60">{albums.length} {lt('storedCapsules')}</span>
              </div>
            </div>

            {/* Grid of 3D Books */}
            {albums.length === 0 ? (
              <div className="py-20 text-center flex flex-col items-center justify-center">
                <FolderHeart className="w-16 h-16 text-accent/10 mb-4" />
                <h4 className="text-lg font-black uppercase tracking-tight text-accent/50">{lt('emptyVault')}</h4>
                <p className="text-xs text-accent/40 uppercase tracking-widest mt-1">{lt('emptyVaultDesc')}</p>
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
                            <ImageIcon className="w-3 h-3" /> {album.photos.length} {lt('photos')}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-0.5">
                        <button 
                          onClick={(e) => handleStartEditAlbum(album, e)}
                          className="p-2 text-accent/20 hover:text-amber-500 hover:bg-neutral-100 rounded-xl transition-all"
                          title={lt('editAlbum')}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setAlbumToDelete(album);
                          }}
                          className="p-2 text-accent/20 hover:text-[rgb(239,68,68)] hover:bg-neutral-100 rounded-xl transition-all"
                          title={lt('deleteAlbum')}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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
                    <span className="text-[8px] font-black uppercase tracking-widest text-accent">{lt('verified')}</span>
                  </div>
                </div>

                {/* Immersion CTA: Open 3D Memo button (Highly Prominent!) */}
                <button
                  onClick={open3DMemo}
                  className="w-full bg-accent text-surface py-5 px-8 rounded-3xl font-black text-xs uppercase tracking-[0.25em] shadow-xl shadow-accent/15 hover:bg-accent/90 hover:shadow-2xl hover:shadow-accent/25 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-3.5 group"
                  id="open-3d-memo-btn"
                >
                  <Layers className="w-5 h-5 text-surface group-hover:scale-110 transition-transform animate-pulse" />
                  {lt('open3DTitle')}
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
                      <ImageIcon className="w-4 h-4 text-accent/30" /> {lt('collectedPhotos')} ({selectedAlbum.photos.length})
                    </h4>
                    <span className="text-[10px] font-bold text-accent/30 uppercase tracking-widest">{lt('aestheticCaptures')}</span>
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
                onClick={handleCloseForm}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />

              {/* Modal Body container */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="relative w-full max-w-lg bg-white rounded-[32px] p-6 md:p-8 border border-accent/10 shadow-[0_45px_90px_rgba(0,0,0,0.3)] z-10 max-h-[90vh] flex flex-col"
                id="create-album-modal"
              >
                {/* Header */}
                <div className="flex justify-between items-center mb-4 flex-shrink-0">
                  <div>
                    <h4 className="text-lg font-black uppercase tracking-tight flex items-center gap-2 text-accent">
                      <FolderHeart className="w-5 h-5 text-accent" /> {editingAlbumId ? lt('editHeading') : lt('createHeading')}
                    </h4>
                    <p className="text-[9px] text-accent/40 font-black uppercase tracking-widest mt-0.5">{lt('catalogCaption')}</p>
                  </div>
                  <button 
                    onClick={handleCloseForm}
                    className="p-2 text-accent/40 hover:text-accent hover:bg-sage/10 rounded-full transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Form elements with local scroll */}
                <form onSubmit={handleCreateAlbum} className="space-y-4 overflow-y-auto pr-1 flex-1 scrollbar-none">
                  <div className="space-y-1.5 text-left">
                    <label className="text-[9px] font-black uppercase text-accent/40 tracking-[0.25em]">{lt('albumTitleLabel')}</label>
                    <input 
                      type="text" 
                      required
                      placeholder={lt('albumTitlePlaceholder')}
                      value={newAlbum.title}
                      onChange={e => setNewAlbum({...newAlbum, title: e.target.value})}
                      className="w-full bg-sage/5 border border-accent/10 rounded-xl px-4 py-3 outline-none focus:border-accent/40 focus:ring-4 focus:ring-accent/5 transition-all text-xs font-bold text-accent uppercase"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5 text-left">
                      <label className="text-[9px] font-black uppercase text-accent/40 tracking-[0.25em]">{lt('location')}</label>
                      <input 
                        type="text" 
                        placeholder={lt('locationPlaceholder')}
                        value={newAlbum.location}
                        onChange={e => setNewAlbum({...newAlbum, location: e.target.value})}
                        className="w-full bg-sage/5 border border-accent/10 rounded-xl px-4 py-3 outline-none focus:border-accent/40 focus:ring-4 focus:ring-accent/5 transition-all text-xs font-bold text-accent"
                      />
                    </div>
                    <div className="space-y-1.5 text-left">
                      <label className="text-[9px] font-black uppercase text-accent/40 tracking-[0.25em]">{lt('date')}</label>
                      <input 
                        type="text" 
                        placeholder={lt('datePlaceholder')}
                        value={newAlbum.date}
                        onChange={e => setNewAlbum({...newAlbum, date: e.target.value})}
                        className="w-full bg-sage/5 border border-accent/10 rounded-xl px-4 py-3 outline-none focus:border-accent/40 focus:ring-4 focus:ring-accent/5 transition-all text-xs font-bold text-accent"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label className="text-[9px] font-black uppercase text-accent/40 tracking-[0.25em]">{lt('recapLabel')}</label>
                    <textarea 
                      rows={2}
                      placeholder={lt('recapPlaceholder')}
                      value={newAlbum.description}
                      onChange={e => setNewAlbum({...newAlbum, description: e.target.value})}
                      className="w-full bg-sage/5 border border-accent/10 rounded-xl px-4 py-2.5 outline-none focus:border-accent/40 focus:ring-4 focus:ring-accent/5 transition-all text-xs font-semibold text-accent"
                    />
                  </div>

                  {/* DRAG & DROP PHOTO MEMORIES COMPONENT */}
                  <div className="space-y-2 text-left">
                    <label className="text-[9px] font-black uppercase text-accent/40 tracking-[0.25em]">{lt('uploadLocalLabel')}</label>
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`relative border-2 border-dashed rounded-2xl p-5 text-center transition-all cursor-pointer ${
                        isDragging 
                          ? "border-amber-400 bg-amber-500/5 scale-[1.01]" 
                          : "border-accent/15 bg-sage/5 hover:border-accent/30 hover:bg-sage/10"
                      }`}
                      onClick={() => {
                        const fileInput = document.getElementById("local-album-photos-uploader");
                        if (fileInput) fileInput.click();
                      }}
                    >
                      <input
                        type="file"
                        id="local-album-photos-uploader"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files) {
                            processUploadedFiles(e.target.files);
                          }
                        }}
                      />
                      <ImageIcon className="w-8 h-8 text-accent/30 mx-auto mb-2" />
                      <p className="text-xs font-bold text-accent/80">{lt('dragDropLabel')}</p>
                      <p className="text-[10px] text-accent/40 font-semibold mt-0.5">{lt('clickFileExplorer')}</p>
                    </div>

                    {/* Previews / Attachments listing */}
                    {uploadedPhotos.length > 0 && (
                      <div className="pt-2 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">
                            ✓ {uploadedPhotos.length} {lt('imagesSelected')}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setUploadedPhotos([]);
                              if (useFirstPhotoAsCover) {
                                setNewAlbum(prev => ({ ...prev, coverUrl: '' }));
                              }
                            }}
                            className="text-[8px] font-black text-red-500 uppercase hover:underline"
                          >
                            {lt('removeAll')}
                          </button>
                        </div>
                        
                        <div className="flex gap-2 flex-wrap items-center bg-gray-50 p-2.5 rounded-xl border border-dotted border-gray-200">
                          {uploadedPhotos.map((photo, index) => {
                            const isCurrentlyCover = !useFirstPhotoAsCover && newAlbum.coverUrl === photo;
                            const isFirstAndAutoCover = useFirstPhotoAsCover && index === 0;
                            const isCover = isCurrentlyCover || isFirstAndAutoCover;
                            return (
                              <div 
                                key={index}
                                onClick={() => {
                                  setUseFirstPhotoAsCover(false);
                                  setNewAlbum(prev => ({ ...prev, coverUrl: photo }));
                                }}
                                className={`relative w-12 h-12 rounded-lg overflow-hidden border transition-all cursor-pointer group/thumb ${
                                  isCover ? "border-amber-400 ring-2 ring-amber-300" : "border-gray-200"
                                }`}
                                title={useFirstPhotoAsCover ? "Auto-cover enabled" : "Click to set as custom Cover"}
                              >
                                <img src={photo} className="w-full h-full object-cover" />
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeUploadedPhoto(index);
                                  }}
                                  className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-all text-xs font-bold"
                                  title="Delete image"
                                >
                                  &times;
                                </button>
                                {isCover && (
                                  <div className="absolute top-0 right-0 bg-amber-400 text-[6px] text-black font-black px-1 rounded-bl">
                                    COVER
                                  </div>
                                )}
                                <div className="absolute bottom-0 inset-x-0 bg-black/30 text-white text-[7px] font-bold text-center leading-none py-0.5">
                                  #{index + 1}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Option to automatically bind cover page */}
                        <label className="flex items-center gap-2 p-2 bg-amber-300/5 hover:bg-amber-300/10 border border-amber-300/15 rounded-xl cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={useFirstPhotoAsCover}
                            onChange={(e) => setUseFirstPhotoAsCover(e.target.checked)}
                            className="rounded text-amber-500 focus:ring-amber-400"
                          />
                          <span className="text-[9px] text-[#553311] font-black uppercase tracking-wider">
                            {lt('setFirstCoverLabel')}
                          </span>
                        </label>
                      </div>
                    )}
                  </div>

                  {/* Cover Picture Uploader from Gallery (No URL input!) */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-[9px] font-black uppercase text-accent/40 tracking-[0.25em]">
                      {lt('coverPictureLabel')}
                    </label>
                    {useFirstPhotoAsCover ? (
                      <div className="p-3 bg-[#FCFBF7] rounded-xl border border-dashed border-accent/15 text-center text-[10px] font-bold text-accent/50 uppercase tracking-wider">
                        {lt('coverAutoAssigned')}
                      </div>
                    ) : (
                      <div className="flex items-center gap-4 bg-sage/5 p-3 rounded-xl border border-accent/5">
                        {newAlbum.coverUrl ? (
                          <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-accent/10">
                            <img src={newAlbum.coverUrl} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => setNewAlbum(prev => ({ ...prev, coverUrl: '' }))}
                              className="absolute top-1 right-1 w-4.5 h-4.5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-black shadow"
                              title="Remove Cover"
                            >
                              &times;
                            </button>
                          </div>
                        ) : (
                          <div className="w-16 h-16 rounded-xl bg-sage/5 border border-dashed border-accent/15 flex items-center justify-center text-accent/30 text-[9px] font-bold uppercase tracking-wider">
                            No Cover
                          </div>
                        )}
                        
                        <div className="flex flex-col gap-1.5 text-left">
                          <button
                            type="button"
                            onClick={() => {
                              const coverInput = document.getElementById("cover-photo-uploader");
                              if (coverInput) coverInput.click();
                            }}
                            className="px-4 py-2 bg-white border border-accent/10 hover:bg-accent/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-accent transition-all cursor-pointer shadow-sm active:scale-95 text-center"
                          >
                            {newAlbum.coverUrl ? lt('changeCover') : lt('uploadCover')}
                          </button>
                          <span className="text-[8px] text-accent/30 font-bold uppercase tracking-wider">Upload local cover photo</span>
                        </div>
                        <input
                          type="file"
                          id="cover-photo-uploader"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              const file = e.target.files[0];
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                const dataUrl = event.target?.result as string;
                                if (dataUrl) {
                                  compressImage(dataUrl).then((compressed) => {
                                    setNewAlbum(prev => ({ ...prev, coverUrl: compressed }));
                                  });
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label className="text-[9px] font-black uppercase text-accent/30 tracking-[0.25em]">{lt('optionalPhotosLabel')}</label>
                    <textarea 
                      rows={2}
                      placeholder="https://images.unsplash.com/photo-A&#10;https://images.unsplash.com/photo-B"
                      value={newAlbum.photosInput}
                      onChange={e => setNewAlbum({...newAlbum, photosInput: e.target.value})}
                      className="w-full bg-sage/5 border border-accent/10 rounded-xl px-4 py-2 outline-none focus:border-accent/40 focus:ring-4 focus:ring-accent/5 transition-all text-xs font-mono text-accent"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-3 py-4 bg-accent text-surface text-xs font-black uppercase tracking-widest rounded-2xl hover:opacity-95 transition-all"
                  >
                    {editingAlbumId ? lt('saveChanges') : lt('confirmCatalog')}
                  </button>
                </form>
              </motion.div>
            </div>
        )}
      </AnimatePresence>
      {/* 4. IMMERSIVE 3D FLIPPABLE VIRTUAL BOOK READER OVERLAY              */}
      {/* ================================================================== */}
      <AnimatePresence>
        {is3DViewerOpen && selectedAlbum && (() => {
          const pages = getBookPages(selectedAlbum);

          // Render a page according to its type
          const renderBookPage = (page: any, isLeftPage: boolean) => {
            if (!page) {
              return (
                <div className="w-full h-full bg-black/10 border border-white/5 shadow-inner" />
              );
            }

            const creaseGradient = isLeftPage 
              ? "bg-gradient-to-r from-black/[0.12] via-transparent to-transparent" 
              : "bg-gradient-to-l from-black/[0.12] via-transparent to-transparent";

            switch (page.type) {
              case 'cover':
                return (
                  <div className="relative w-full h-full bg-[#2A3B31] text-[#FAF9F5] flex flex-col justify-between p-8 md:p-10 overflow-hidden border border-[#3E5245]/50 select-none">
                    {/* Sage pattern leather grain background */}
                    <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-black to-white" />
                    
                    {/* Double gold borders */}
                    <div className="absolute inset-4 border-2 border-amber-300/10 rounded-[18px]" />
                    <div className="absolute inset-5 border border-amber-300/20 rounded-[14px]" />

                    {/* Luxurious Brass corner protectors */}
                    <div className="absolute top-0 left-0 w-8 h-8 bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 rounded-br-2xl shadow-md z-30 opacity-90 border-t border-l border-amber-300/40" />
                    <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-amber-400 via-amber-500 to-amber-600 rounded-bl-2xl shadow-md z-30 opacity-90 border-t border-r border-amber-300/40" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 bg-gradient-to-tr from-amber-400 via-amber-500 to-amber-600 rounded-tr-2xl shadow-md z-30 opacity-90 border-b border-l border-amber-300/40" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 bg-gradient-to-tl from-amber-400 via-amber-500 to-amber-600 rounded-tl-2xl shadow-md z-30 opacity-90 border-b border-r border-amber-300/40" />

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
                  <div className="relative w-full h-full bg-[#1D2A22] text-[#FAF9F5] flex flex-col justify-between p-10 overflow-hidden border border-[#243329] select-none">
                    <div className="absolute inset-4 border-2 border-amber-300/10 rounded-[18px]" />

                    {/* Luxurious Brass corner protectors */}
                    <div className="absolute top-0 left-0 w-8 h-8 bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 rounded-br-2xl shadow-md z-30 opacity-90 border-t border-l border-amber-300/40" />
                    <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-amber-400 via-amber-500 to-amber-600 rounded-bl-2xl shadow-md z-30 opacity-90 border-t border-r border-amber-300/40" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 bg-gradient-to-tr from-amber-400 via-amber-500 to-amber-600 rounded-tr-2xl shadow-md z-30 opacity-90 border-b border-l border-amber-300/40" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 bg-gradient-to-tl from-amber-400 via-amber-500 to-amber-600 rounded-tl-2xl shadow-md z-30 opacity-90 border-b border-r border-amber-300/40" />
                    
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
                  <div className="relative w-full h-full bg-[#FDFCF7] text-accent p-8 md:p-10 flex flex-col justify-between border border-accent/10 shadow-[inset_-15px_0_30px_rgba(0,0,0,0.02)] select-none">
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
                  <div className={`relative w-full h-full bg-[#FDFCF7] text-accent p-6 flex flex-col justify-between border border-accent/10 select-none shadow-[inset_15px_0_30px_rgba(0,0,0,0.01)]`}>
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

                        {/* Elegant vintage-style physical photo mounting corners */}
                        <div className="absolute top-2 left-2 w-4 h-4 border-t-4 border-l-4 border-amber-600/70 z-25 rounded-tl-[3px]" />
                        <div className="absolute top-2 right-2 w-4 h-4 border-t-4 border-r-4 border-amber-600/70 z-25 rounded-tr-[3px]" />
                        <div className="absolute bottom-2 left-2 w-4 h-4 border-b-4 border-l-4 border-amber-600/70 z-25 rounded-bl-[3px]" />
                        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-4 border-r-4 border-amber-600/70 z-25 rounded-br-[3px]" />
                        
                        {/* Inner photo gold line reflection */}
                        <div className="absolute inset-1.5 border border-amber-100/10 pointer-events-none" />
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
                  <div className="relative w-full h-full bg-[#FDFCF7] text-accent p-8 flex flex-col justify-between border border-accent/10 shadow-[inset_15px_0_30px_rgba(0,0,0,0.02)] select-none">
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

                      {/* Dynamic Owner Membership Stamp */}
                      <div className="mt-4 p-3 bg-amber-500/5 rounded-2xl border border-amber-500/10 flex items-center gap-2.5 shadow-sm">
                        <div className="w-8 h-8 rounded-full overflow-hidden border border-amber-400 bg-amber-50 flex-shrink-0">
                          {profile?.photoURL || user?.photoURL ? (
                            <img src={profile?.photoURL || user?.photoURL || ""} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            <div className="w-full h-full bg-amber-500 text-white font-black flex items-center justify-center text-xs">
                              {(profile?.displayName || user?.displayName || 'C').charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="text-left leading-tight min-w-0">
                          <p className="text-[8px] font-black uppercase text-amber-700 tracking-wide">{lt('ownerSignature')}</p>
                          <p className="font-serif italic font-bold text-neutral-800 text-[11px] truncate">
                            {profile?.displayName || user?.displayName || 'Daffa Ramdhani'}
                          </p>
                          <p className="text-[7.5px] text-accent/50 truncate font-semibold">
                            {profile?.bio || 'COER Live Connect Collector'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 flex justify-between items-center text-[8px] text-accent/30 font-black tracking-widest pl-1 mt-4">
                      <span>{lt('signatureRecord')}</span>
                      <span>{lt('guestbookPage')}</span>
                    </div>

                    {/* Crease inner shadow */}
                    <div className={`absolute top-0 bottom-0 left-0 w-8 z-20 pointer-events-none ${creaseGradient}`} />
                  </div>
                );

              default:
                return null;
            }
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

              {/* Theater Mode Action Bar - Optimized for minimal vertical footprint */}
              <div className="relative z-10 w-full max-w-5xl flex flex-row justify-between items-center gap-4 pt-1 pb-1 md:pt-2 border-b border-white/5 text-white">
                <div className="text-left flex items-center gap-3">
                  <span className="hidden sm:inline-block text-[8px] font-black uppercase tracking-[0.3em] bg-amber-300/10 text-amber-200 border border-amber-300/20 px-2.5 py-1 rounded-full">
                    3D BOOK
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-sm md:text-base font-black uppercase tracking-tight text-white truncate max-w-[180px] sm:max-w-xs md:max-w-md">
                      {selectedAlbum.title}
                    </h3>
                  </div>
                </div>

                {/* Top Quick Actions - Compact */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                  {/* Play Slideshow Button */}
                  <button
                    onClick={() => setIsSlideshowActive(!isSlideshowActive)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/10 text-[9px] font-black uppercase tracking-widest transition-all active:scale-95 ${
                      isSlideshowActive ? "bg-amber-300 text-black border-amber-300 hover:bg-amber-400" : "bg-white/5 hover:bg-white/10 text-white"
                    }`}
                    title={lt('autoplay')}
                  >
                    {isSlideshowActive ? (
                      <>
                        <Pause className="w-3 h-3 fill-current" />
                        <span>{lt('active')}</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3" />
                        <span>{lt('autoplay')}</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      if (bookRef.current) {
                        try {
                          bookRef.current.pageFlip().flip(0);
                        } catch (e) {}
                      }
                      setIsSlideshowActive(false);
                    }}
                    className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white transition-all active:scale-95"
                    title={lt('rewind')}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setIs3DViewerOpen(false)}
                    className="p-2 bg-white/5 hover:bg-red-500/20 border border-white/10 rounded-xl text-white transition-all active:scale-95"
                    title={lt('closeBook')}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 3D BOOK STAGE CENTER */}
              <div className="relative w-full max-w-4xl h-[50vh] sm:h-[55vh] flex items-center justify-center overflow-visible my-1 md:my-3">
                
                {/* Simulated table shadow depth backing */}
                <div className="absolute w-[95%] h-[8%] bottom-[-5%] bg-black/40 blur-2xl rounded-full pointer-events-none" />

                {/* Left flipping manual arrow trigger */}
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 0}
                  className="absolute left-[-15px] sm:left-[-40px] md:left-[-60px] z-[50] p-2.5 sm:p-3.5 bg-black/40 hover:bg-black/60 backdrop-blur-md disabled:opacity-10 border border-white/10 shadow-2xl rounded-full text-white transition-all active:scale-90 hover:-translate-x-0.5 duration-200"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5px]" />
                </button>

                {/* BOOK CONTAINER WITH 3D CHAMFER & ASPECT RATIO CONSTRAINT */}
                <div 
                  className="relative flex items-center justify-center overflow-visible max-h-full"
                  style={{
                    aspectRatio: "3/4",
                    width: "100%",
                    maxWidth: "680px"
                  }}
                >
                  <HTMLPageFlip
                    ref={bookRef}
                    width={400}
                    height={500}
                    size="fixed"
                    flippingTime={1000}
                    startPage={0}
                    showCover={true}
                    mobileScrollSupport={true}
                    onFlip={(e: any) => setCurrentPage(e.data)}
                    className="coer-memo-flip-book shadow-2xl rounded-2xl overflow-hidden"
                  >
                    {pages.map((page: any, index: number) => {
                      const isLeftPage = index % 2 !== 0;
                      return (
                        <BookPage key={index}>
                          {renderBookPage(page, isLeftPage)}
                        </BookPage>
                      );
                    })}
                  </HTMLPageFlip>
                </div>

                {/* Right flipping manual arrow trigger */}
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === pages.length - 1}
                  className="absolute right-[-15px] sm:right-[-40px] md:right-[-60px] z-[50] p-2.5 sm:p-3.5 bg-black/40 hover:bg-black/60 backdrop-blur-md disabled:opacity-10 border border-white/10 shadow-2xl rounded-full text-white transition-all active:scale-90 hover:translate-x-0.5 duration-200"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5px]" />
                </button>

              </div>

              {/* DYNAMIC PROGRESS CONTROLS SYSTEM - Slimmed down & dots removed for pristine elegance */}
              <div className="relative z-10 w-full max-w-xl bg-[#121813]/60 border border-white/10 backdrop-blur-md px-5 py-3 rounded-2xl flex flex-col items-center gap-2">
                
                {/* Labeling of visible pages */}
                <div className="w-full flex justify-between items-center text-[9px] text-white/50 font-bold uppercase tracking-widest px-0.5">
                  <span className="font-mono">
                    {"PAGE " + (currentPage + 1) + " OF " + pages.length}
                  </span>
                  <span className="flex items-center gap-1 bg-amber-300/10 text-amber-300 px-2 py-0.5 rounded-full border border-amber-300/10 text-[8px] font-black uppercase tracking-widest">
                    <BookOpen className="w-3 h-3" />
                    {currentPage === 0 ? lt('coverSealed') : currentPage === pages.length - 1 ? lt('backCover') : lt('pagesOpen')}
                  </span>
                </div>

                {/* PHYSICAL SEEKER SLIDER TIMELINE */}
                <input 
                  type="range"
                  min="0"
                  max={pages.length - 1}
                  step="1"
                  value={currentPage}
                  onChange={(e) => {
                    const nextVal = parseInt(e.target.value);
                    if (bookRef.current) {
                      try {
                        bookRef.current.pageFlip().turnToPage(nextVal);
                      } catch (err) {}
                    }
                  }}
                  className="w-full accent-amber-300 bg-white/10 rounded-lg h-1 hover:h-1.5 py-0.5 outline-none cursor-pointer transition-all duration-150 disabled:opacity-50"
                  title="Drag to slide pages directly"
                />
              </div>

            </div>
          );
        })()}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {albumToDelete && (
          <div className="fixed inset-0 z-[10150] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAlbumToDelete(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[40px] p-8 md:p-10 border border-accent/10 shadow-[0_50px_100px_rgba(0,0,0,0.5)] overflow-hidden text-center z-[10160]"
            >
              <div className="flex flex-col items-center gap-6">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 animate-pulse">
                  <AlertTriangle className="w-8 h-8" />
                </div>
                
                <div className="space-y-3">
                  <h4 className="text-xl font-black uppercase tracking-tight text-accent">
                    {lt('deleteTitle')}
                  </h4>
                  <p className="text-[10px] font-black text-accent/40 uppercase tracking-[0.2em] leading-relaxed">
                    "{albumToDelete.title}" &bull; {albumToDelete.location}
                  </p>
                  <p className="text-xs text-accent/60 font-semibold leading-relaxed px-2">
                    {lt('deleteDesc')}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 w-full mt-2">
                  <button
                    onClick={() => setAlbumToDelete(null)}
                    className="py-4 border border-accent/10 text-accent hover:bg-accent/5 rounded-2xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all text-center cursor-pointer"
                  >
                    {lt('cancel')}
                  </button>
                  <button
                    onClick={handleDeleteAlbumConfirm}
                    className="py-4 bg-red-500 text-white hover:bg-red-600 rounded-2xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all text-center cursor-pointer shadow-lg shadow-red-500/20"
                  >
                    {lt('deleteConfirmBtn')}
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
