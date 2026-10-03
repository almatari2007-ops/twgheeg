import React, { useRef, useState } from 'react';
import { Activity, STAGE_CONFIG } from '../types';
import { exportActivitiesJson, importActivitiesJson, resetDatabaseToDefault } from '../lib/storage';
import {
  X,
  Download,
  Upload,
  RotateCcw,
  BarChart2,
  Images,
  FolderKanban,
  Users,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Building2,
} from 'lucide-react';

interface StatsAndArchiveModalProps {
  activities: Activity[];
  isOpen: boolean;
  onClose: () => void;
  onDataChanged: () => void;
}

export const StatsAndArchiveModal: React.FC<StatsAndArchiveModalProps> = ({
  activities,
  isOpen,
  onClose,
  onDataChanged,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const totalPhotos = activities.reduce((acc, curr) => acc + curr.photos.length, 0);
  const totalStudents = activities.reduce((acc, curr) => acc + (curr.participantsCount || 0), 0);

  // Group by stage
  const stageCounts: Record<string, number> = {
    primary: 0,
    middle: 0,
    high: 0,
    general: 0,
  };
  activities.forEach((act) => {
    if (stageCounts[act.stage] !== undefined) {
      stageCounts[act.stage]++;
    }
  });

  const handleExport = async () => {
    try {
      const json = await exportActivitiesJson();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ارشيف_مجمع_الشريعة_التعليمي_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setStatusMsg({ type: 'success', text: 'تم تصدير النسخة الاحتياطية بنجاح.' });
    } catch {
      setStatusMsg({ type: 'error', text: 'حدث خطأ أثناء تصدير البيانات.' });
    }
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setStatusMsg(null);
    try {
      const text = await file.text();
      const count = await importActivitiesJson(text);
      setStatusMsg({ type: 'success', text: `تم استيراد ${count} فعالية بنجاح إلى الأرشيف.` });
      onDataChanged();
    } catch {
      setStatusMsg({ type: 'error', text: 'صيغة ملف النسخة الاحتياطية غير صحيحة.' });
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleReset = async () => {
    if (
      !window.confirm(
        'هل تريد استعادة البيانات النموذجية الأولية لمجمع الشريعة التعليمي؟ (سيتم الاحتفاظ بالأنشطة الافتراضية)'
      )
    ) {
      return;
    }

    setIsProcessing(true);
    setStatusMsg(null);
    try {
      await resetDatabaseToDefault();
      setStatusMsg({ type: 'success', text: 'تمت استعادة البيانات النموذجية بنجاح.' });
      onDataChanged();
    } catch {
      setStatusMsg({ type: 'error', text: 'حدث خطأ أثناء استعادة البيانات.' });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center">
              <BarChart2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                تقارير وإدارة أرشيف مجمع الشريعة
              </h2>
              <p className="text-xs text-slate-500">
                إحصائيات الفعاليات والنسخ الاحتياطي
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {statusMsg && (
          <div
            className={`mx-6 mt-4 p-3 rounded-lg flex items-center gap-2 text-xs ${
              statusMsg.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {statusMsg.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{statusMsg.text}</span>
          </div>
        )}

        <div className="p-6 space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-center">
              <FolderKanban className="w-5 h-5 text-emerald-700 mx-auto mb-1.5" />
              <div className="text-2xl font-bold text-slate-900 font-sans tabular-nums">
                {activities.length}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">برنامج موثق</div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-center">
              <Images className="w-5 h-5 text-sky-700 mx-auto mb-1.5" />
              <div className="text-2xl font-bold text-slate-900 font-sans tabular-nums">
                {totalPhotos}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">صورة مؤرشفة</div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-center">
              <Users className="w-5 h-5 text-amber-700 mx-auto mb-1.5" />
              <div className="text-2xl font-bold text-slate-900 font-sans tabular-nums">
                {totalStudents}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">مشارك ومستفيد</div>
            </div>
          </div>

          {/* Breakdown by Stage */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-3">
              توزيع البرامج حسب المراحل التعليمية
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {(['high', 'middle', 'primary', 'general'] as const).map((stg) => {
                const cfg = STAGE_CONFIG[stg];
                return (
                  <div
                    key={stg}
                    className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex flex-col justify-between"
                  >
                    <span className="text-xs text-slate-600 font-medium">{cfg.shortLabel}</span>
                    <span className="text-xl font-bold text-slate-900 tabular-nums mt-1">
                      {stageCounts[stg] || 0}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Archive & Backup Controls */}
          <div className="pt-4 border-t border-slate-200 space-y-3">
            <h3 className="text-sm font-bold text-slate-900">
              إدارة النسخ الاحتياطي والأرشيف
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              يمكنك تصدير كافة فعاليات المجمع وصورها في ملف احتياطي لحفظها أو نقلها، أو استيراد أرشيف سابق.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>تصدير نسخة احتياطية (JSON)</span>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleImportFile}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
                className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-lg text-xs font-semibold shadow-xs transition-colors disabled:opacity-50"
              >
                <Upload className="w-4 h-4" />
                <span>استيراد نسخة سابقة</span>
              </button>

              <button
                onClick={handleReset}
                disabled={isProcessing}
                className="flex items-center gap-1.5 px-3 py-2 text-slate-600 hover:text-red-700 hover:bg-red-50 rounded-lg text-xs font-medium transition-colors mr-auto"
                title="إعادة تعيين للبيانات النموذجية"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>استعادة البيانات النموذجية</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
