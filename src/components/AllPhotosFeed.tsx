import React, { useState } from 'react';
import { Activity, EducationalStage, STAGE_CONFIG } from '../types';
import { downloadImage, formatArabicDate } from '../lib/imageUtils';
import { Download, Maximize2, Calendar, User, Search, Filter } from 'lucide-react';

interface AllPhotosFeedProps {
  activities: Activity[];
  onOpenLightbox: (activity: Activity, photoIndex: number) => void;
  onOpenDetails: (activity: Activity) => void;
}

export const AllPhotosFeed: React.FC<AllPhotosFeedProps> = ({
  activities,
  onOpenLightbox,
  onOpenDetails,
}) => {
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Extract all photos with their parent activity metadata
  const allPhotosWithActivity = activities.flatMap((act) =>
    act.photos.map((photo, photoIndex) => ({
      photo,
      photoIndex,
      activity: act,
    }))
  );

  const filtered = allPhotosWithActivity.filter(({ photo, activity }) => {
    if (selectedStage !== 'all' && activity.stage !== selectedStage) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = activity.title.toLowerCase().includes(q);
      const matchCaption = (photo.caption || '').toLowerCase().includes(q);
      const matchSupervisor = activity.supervisor.toLowerCase().includes(q);
      const matchCategory = activity.category.toLowerCase().includes(q);
      if (!matchTitle && !matchCaption && !matchSupervisor && !matchCategory) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 bg-white rounded-2xl border border-slate-200">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="بحث في الصور والتعليقات والبرامج..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-3 pr-10 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-emerald-600 bg-slate-50/50"
          />
        </div>

        {/* Stage Filter Segmented control */}
        <div className="flex items-center gap-1 overflow-x-auto p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setSelectedStage('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              selectedStage === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            الكل ({allPhotosWithActivity.length})
          </button>
          {(['high', 'middle', 'primary', 'general'] as const).map((stg) => {
            const cfg = STAGE_CONFIG[stg];
            const count = allPhotosWithActivity.filter((p) => p.activity.stage === stg).length;
            return (
              <button
                key={stg}
                onClick={() => setSelectedStage(stg)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  selectedStage === stg
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cfg.shortLabel} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Photos Masonry / Grid */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-slate-200">
          <p className="text-slate-500 text-sm">لا توجد صور مطابقة لخيارات البحث المحددة.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(({ photo, photoIndex, activity }) => {
            const stageCfg = STAGE_CONFIG[activity.stage] || STAGE_CONFIG.general;
            return (
              <div
                key={photo.id}
                className="group relative bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                {/* Media Container */}
                <div
                  onClick={() => onOpenLightbox(activity, photoIndex)}
                  className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 cursor-pointer"
                >
                  <img
                    src={photo.url}
                    alt={photo.caption || activity.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3 text-white">
                    <span className="text-xs font-semibold line-clamp-1">
                      {photo.caption || activity.title}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadImage(
                          photo.url,
                          `${activity.title}_${photoIndex + 1}.jpg`
                        );
                      }}
                      className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white backdrop-blur-xs transition-colors shrink-0"
                      title="تحميل الصورة"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Stage tag overlay */}
                  <span className="absolute top-2.5 right-2.5 text-[10px] font-bold px-2 py-0.5 rounded bg-black/60 text-white backdrop-blur-xs">
                    {stageCfg.shortLabel}
                  </span>
                </div>

                {/* Footer caption */}
                <div className="p-3 bg-white">
                  <div
                    onClick={() => onOpenDetails(activity)}
                    className="text-xs font-bold text-slate-900 hover:text-emerald-700 transition-colors line-clamp-1 cursor-pointer mb-1"
                  >
                    {activity.title}
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="truncate max-w-[130px]">{activity.supervisor}</span>
                    <span>{activity.hijriDate || formatArabicDate(activity.date)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
