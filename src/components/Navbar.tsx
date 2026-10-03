import React from 'react';
import { Camera, PlusCircle, BarChart3, Database, Image as ImageIcon } from 'lucide-react';

interface NavbarProps {
  onOpenUpload: () => void;
  onOpenStats: () => void;
  currentView: 'gallery' | 'allPhotos';
  onViewChange: (view: 'gallery' | 'allPhotos') => void;
  totalActivities: number;
  totalPhotos: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenUpload,
  onOpenStats,
  currentView,
  onViewChange,
  totalActivities,
  totalPhotos,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Single text element Brand Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center text-white shadow-sm shrink-0">
              <Camera className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-slate-900 leading-tight">
                مجمع الشريعة التعليمي
              </span>
              <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                منصة توثيق وأرشفة البرامج والأنشطة
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <button
              onClick={() => onViewChange('gallery')}
              className={`transition-colors flex items-center gap-1.5 ${
                currentView === 'gallery'
                  ? 'text-emerald-700 font-bold border-b-2 border-emerald-700 pb-1 pt-1 -mb-1'
                  : 'hover:text-slate-900'
              }`}
            >
              <span>ألبومات البرامج</span>
              <span className="text-xs text-slate-400">({totalActivities})</span>
            </button>

            <button
              onClick={() => onViewChange('allPhotos')}
              className={`transition-colors flex items-center gap-1.5 ${
                currentView === 'allPhotos'
                  ? 'text-emerald-700 font-bold border-b-2 border-emerald-700 pb-1 pt-1 -mb-1'
                  : 'hover:text-slate-900'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>معرض الصور الشامل</span>
              <span className="text-xs text-slate-400">({totalPhotos})</span>
            </button>

            <button
              onClick={onOpenStats}
              className="hover:text-slate-900 transition-colors flex items-center gap-1.5"
            >
              <BarChart3 className="w-4 h-4" />
              <span>التقارير والأرشيف</span>
            </button>
          </nav>

          {/* Zone 3: Primary Action */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenStats}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              title="الإحصائيات والأرشيف"
            >
              <Database className="w-5 h-5" />
            </button>

            <button
              onClick={onOpenUpload}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-emerald-700 rounded-lg hover:bg-emerald-800 transition-colors shadow-sm whitespace-nowrap"
            >
              <PlusCircle className="w-4 h-4 shrink-0" />
              <span>رفع توثيق جديد</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
