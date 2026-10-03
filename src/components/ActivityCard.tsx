import React from 'react';
import { Activity, STAGE_CONFIG } from '../types';
import { formatArabicDate } from '../lib/imageUtils';
import { Images, Calendar, User, Printer, Trash2, Plus, Sparkles } from 'lucide-react';

interface ActivityCardProps {
  activity: Activity;
  onOpenDetails: (activity: Activity) => void;
  onOpenLightbox: (activity: Activity, photoIndex: number) => void;
  onAddMorePhotos: (activity: Activity) => void;
  onPrintReport: (activity: Activity) => void;
  onDelete: (activityId: string) => void;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  onOpenDetails,
  onOpenLightbox,
  onAddMorePhotos,
  onPrintReport,
  onDelete,
}) => {
  const stageInfo = STAGE_CONFIG[activity.stage] || STAGE_CONFIG.general;
  const coverPhoto =
    activity.photos.find((p) => p.id === activity.coverPhotoId) ||
    activity.photos.find((p) => p.isCover) ||
    activity.photos[0];

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden hover:border-slate-300 transition-all hover:shadow-md flex flex-col">
      {/* Cover Media Container */}
      <div
        onClick={() => onOpenLightbox(activity, 0)}
        className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 cursor-pointer"
      >
        {coverPhoto ? (
          <img
            src={coverPhoto.url}
            alt={activity.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400">
            <Images className="w-10 h-10 mb-2 opacity-50" />
            <span className="text-xs">لا توجد صور متاحة</span>
          </div>
        )}

        {/* Measured dark scrim for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent pointer-events-none" />

        {/* Top Floating Badge info (clean subtle container) */}
        <div className="absolute top-3 right-3 flex items-center gap-2 pointer-events-none">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-white/95 text-slate-800 shadow-sm backdrop-blur-sm">
            {stageInfo.shortLabel}
          </span>
        </div>

        {/* Bottom Floating Stats on Cover */}
        <div className="absolute bottom-3 right-3 left-3 flex items-center justify-between text-white text-xs pointer-events-none">
          <div className="flex items-center gap-1.5 font-medium drop-shadow">
            <Images className="w-3.5 h-3.5" />
            <span>{activity.photos.length} صور</span>
          </div>
          <span className="text-white/90 drop-shadow">
            {activity.hijriDate || formatArabicDate(activity.date)}
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata Bar (Zero-pill discipline: unboxed text with typographic separators) */}
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-2 flex-wrap">
            <span className="font-semibold text-emerald-800">{activity.category}</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>الفصل {activity.semester}</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>{activity.participantsCount} مشارك</span>
          </div>

          {/* Activity Title */}
          <h3
            onClick={() => onOpenDetails(activity)}
            className="text-base font-bold text-slate-900 group-hover:text-emerald-800 transition-colors line-clamp-2 cursor-pointer leading-snug mb-2"
          >
            {activity.title}
          </h3>

          {/* Description Snippet */}
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
            {activity.description}
          </p>
        </div>

        {/* Footer info & Actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          {/* Supervisor attribution */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 min-w-0">
            <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{activity.supervisor}</span>
          </div>

          {/* Quick Action buttons */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => onAddMorePhotos(activity)}
              title="إضافة صور إضافية إلى هذا الألبوم"
              className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>

            <button
              onClick={() => onPrintReport(activity)}
              title="طباعة استمارة توثيق النشاط الرسمية"
              className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={() => onOpenDetails(activity)}
              className="px-2.5 py-1 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-md transition-colors"
            >
              استعراض
            </button>

            <button
              onClick={() => {
                if (window.confirm(`هل أنت متأكد من حذف فعالية "${activity.title}"؟`)) {
                  onDelete(activity.id);
                }
              }}
              title="حذف الفعالية"
              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
