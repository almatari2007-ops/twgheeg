import React, { useEffect, useCallback } from 'react';
import { Activity } from '../types';
import { downloadImage, formatArabicDate } from '../lib/imageUtils';
import { X, ChevronRight, ChevronLeft, Download, Maximize2, Minimize2, Calendar, User } from 'lucide-react';

interface LightboxModalProps {
  activity: Activity | null;
  photoIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  activity,
  photoIndex,
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen || !activity) return;
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        // In RTL, ArrowRight usually goes to previous, or next
        if (photoIndex > 0) {
          onNavigate(photoIndex - 1);
        }
      } else if (e.key === 'ArrowLeft') {
        if (photoIndex < activity.photos.length - 1) {
          onNavigate(photoIndex + 1);
        }
      }
    },
    [isOpen, activity, photoIndex, onClose, onNavigate]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!isOpen || !activity || activity.photos.length === 0) return null;

  const currentPhoto = activity.photos[photoIndex] || activity.photos[0];

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleDownload = () => {
    const filename = `${activity.title.replace(/[\s/\\?%*:|"<>]/g, '_')}_صورة_${photoIndex + 1}.jpg`;
    downloadImage(currentPhoto.url, filename);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between select-none">
      {/* Top Bar */}
      <div className="flex items-center justify-between p-4 px-6 text-white border-b border-white/10 z-10">
        <div className="flex items-center gap-3">
          <div className="text-sm font-bold text-white/90 truncate max-w-md">
            {activity.title}
          </div>
          <span className="text-xs text-white/50 bg-white/10 px-2 py-0.5 rounded">
            {photoIndex + 1} / {activity.photos.length}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDownload}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors flex items-center gap-1.5 text-xs"
            title="تحميل الصورة بجودة عالية"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">تحميل الصورة</span>
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="ملء الشاشة"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="إغلاق (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Image Stage */}
      <div className="relative flex-1 flex items-center justify-center p-4 min-h-0 overflow-hidden">
        {/* Previous Button */}
        {photoIndex > 0 && (
          <button
            onClick={() => onNavigate(photoIndex - 1)}
            className="absolute right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-sm z-10 hover:scale-105"
            title="الصورة السابقة (سهم يمين)"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

        {/* Next Button */}
        {photoIndex < activity.photos.length - 1 && (
          <button
            onClick={() => onNavigate(photoIndex + 1)}
            className="absolute left-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-sm z-10 hover:scale-105"
            title="الصورة التالية (سهم يسار)"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* The Image */}
        <div className="max-w-full max-h-full flex items-center justify-center">
          <img
            src={currentPhoto.url}
            alt={currentPhoto.caption || activity.title}
            referrerPolicy="no-referrer"
            className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl transition-all duration-300"
          />
        </div>
      </div>

      {/* Bottom Information & Thumbnails Bar */}
      <div className="p-4 px-6 bg-black/60 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 z-10">
        <div className="text-white text-xs max-w-xl text-center sm:text-right">
          <p className="font-medium text-white/95 text-sm mb-1">
            {currentPhoto.caption || 'صورة توثيقية من فعاليات البرنامج'}
          </p>
          <div className="flex items-center gap-3 text-white/60 text-xs flex-wrap justify-center sm:justify-start">
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5" />
              <span>{activity.supervisor}</span>
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{activity.hijriDate || formatArabicDate(activity.date)}</span>
            </span>
          </div>
        </div>

        {/* Thumbnail Filmstrip */}
        {activity.photos.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto max-w-md py-1 px-1">
            {activity.photos.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => onNavigate(idx)}
                className={`relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                  idx === photoIndex
                    ? 'border-emerald-500 scale-105 ring-2 ring-emerald-500/50'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img
                  src={p.url}
                  alt={`مصغرة ${idx + 1}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
