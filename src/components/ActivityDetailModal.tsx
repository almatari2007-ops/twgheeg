import React, { useRef, useState } from 'react';
import { Activity, ActivityPhoto, STAGE_CONFIG } from '../types';
import { formatArabicDate, processImageFile } from '../lib/imageUtils';
import {
  X,
  Plus,
  Printer,
  Calendar,
  MapPin,
  Users,
  User,
  CheckCircle2,
  Trash2,
  Star,
  Loader2,
  Upload,
} from 'lucide-react';

interface ActivityDetailModalProps {
  activity: Activity | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenLightbox: (activity: Activity, photoIndex: number) => void;
  onAddPhotos: (activityId: string, photos: ActivityPhoto[]) => Promise<void>;
  onPrintReport: (activity: Activity) => void;
}

export const ActivityDetailModal: React.FC<ActivityDetailModalProps> = ({
  activity,
  isOpen,
  onClose,
  onOpenLightbox,
  onAddPhotos,
  onPrintReport,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen || !activity) return null;

  const stageInfo = STAGE_CONFIG[activity.stage] || STAGE_CONFIG.general;

  const handleFilesSelected = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);

    try {
      const newPhotos: ActivityPhoto[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith('image/')) continue;
        const { dataUrl, fileName } = await processImageFile(file, 1600, 1200, 0.85);
        newPhotos.push({
          id: `photo-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
          url: dataUrl,
          caption: `${activity.title} (${fileName})`,
          isCover: false,
          uploadedAt: new Date().toISOString(),
        });
      }

      if (newPhotos.length > 0) {
        await onAddPhotos(activity.id, newPhotos);
      }
    } catch (err) {
      console.error('Error adding photos:', err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800">
              {stageInfo.label}
            </span>
            <span className="text-xs text-slate-500 font-medium">{activity.category}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onPrintReport(activity)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>طباعة الاستمارة الرسمية</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Title & Metadata */}
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 leading-snug">
              {activity.title}
            </h1>

            {/* Metadata Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <div className="text-slate-400 text-[10px]">التاريخ</div>
                  <div className="font-semibold text-slate-800">
                    {activity.hijriDate || formatArabicDate(activity.date)}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <div className="text-slate-400 text-[10px]">رائد النشاط / المشرف</div>
                  <div className="font-semibold text-slate-800 truncate">{activity.supervisor}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <div className="text-slate-400 text-[10px]">مقر التنفيذ</div>
                  <div className="font-semibold text-slate-800">{activity.location}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <div className="text-slate-400 text-[10px]">المستفيدون / الطلاب</div>
                  <div className="font-semibold text-slate-800">
                    {activity.participantsCount} طالب (الفصل {activity.semester})
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-1.5">وصف الفعالية</h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50/50 p-4 rounded-xl border border-slate-100">
              {activity.description}
            </p>
          </div>

          {/* Objectives */}
          {activity.objectives && activity.objectives.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-2">أهداف ومخرجات البرنامج</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activity.objectives.map((obj, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 p-2.5 bg-emerald-50/50 border border-emerald-100 rounded-lg text-xs text-emerald-950"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <span>{obj}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Photos Grid Header */}
          <div className="border-t border-slate-200 pt-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  ألبوم صور البرنامج ({activity.photos.length} صورة)
                </h3>
                <p className="text-xs text-slate-500">
                  انقر على أي صورة لتكبيرها، أو قم برفع صور إضافية مباشرة
                </p>
              </div>

              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFilesSelected(e.target.files)}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors disabled:opacity-50"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>جاري الرفع...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>إضافة صور جديدة</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Photos Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {activity.photos.map((photo, index) => (
                <div
                  key={photo.id}
                  onClick={() => onOpenLightbox(activity, index)}
                  className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 border border-slate-200 cursor-pointer"
                >
                  <img
                    src={photo.url}
                    alt={photo.caption || `صورة ${index + 1}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2.5">
                    <p className="text-white text-xs font-medium line-clamp-2">
                      {photo.caption || `صورة رقم ${index + 1}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
