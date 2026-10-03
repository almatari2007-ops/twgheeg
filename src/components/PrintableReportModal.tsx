import React from 'react';
import { Activity, STAGE_CONFIG } from '../types';
import { formatArabicDate } from '../lib/imageUtils';
import { Printer, X, Award, CheckCircle } from 'lucide-react';

interface PrintableReportModalProps {
  activity: Activity | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PrintableReportModal: React.FC<PrintableReportModalProps> = ({
  activity,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !activity) return null;

  const stageInfo = STAGE_CONFIG[activity.stage] || STAGE_CONFIG.general;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Controls Bar (no-print) */}
        <div className="no-print px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="text-sm font-bold text-slate-800">
            معاينة استمارة توثيق الفعالية الرسمية للطباعة
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة الاستمارة (أو حفظ PDF)</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Paper Area (A4 style) */}
        <div className="p-8 sm:p-12 bg-white text-slate-900 max-w-[850px] mx-auto text-right font-sans">
          {/* Official Letterhead */}
          <div className="border-b-2 border-slate-800 pb-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="text-xs space-y-1 font-semibold text-slate-700">
                <div>المملكة العربية السعودية</div>
                <div>وزارة التعليم</div>
                <div>الإدارة العامة للتعليم</div>
                <div className="text-emerald-900 font-bold">مجمع الشريعة التعليمي</div>
                <div>قسم النشاط الطلابي والتوثيق</div>
              </div>

              {/* Center Emblem / Title */}
              <div className="text-center">
                <div className="w-14 h-14 mx-auto rounded-full border-2 border-emerald-800 flex items-center justify-center text-emerald-800 font-bold mb-1">
                  <Award className="w-7 h-7" />
                </div>
                <h2 className="text-base font-bold text-slate-900">
                  استمارة توثيق برنامج / نشاط مدرسي
                </h2>
                <div className="text-xs text-slate-500 font-medium">
                  العام الدراسي 1446 - 1447هـ
                </div>
              </div>

              <div className="text-xs space-y-1 text-slate-600 text-left font-sans">
                <div>رقم التوثيق: {activity.id.replace('act-', 'DOC-')}</div>
                <div>التاريخ: {activity.hijriDate || formatArabicDate(activity.date)}</div>
                <div>الفصل الدراسي: {activity.semester}</div>
              </div>
            </div>
          </div>

          {/* Program Information Table */}
          <div className="mb-6">
            <table className="w-full border-collapse border border-slate-300 text-xs">
              <tbody>
                <tr className="bg-slate-50">
                  <td className="border border-slate-300 p-2 font-bold w-1/4 text-slate-800">
                    عنوان البرنامج:
                  </td>
                  <td className="border border-slate-300 p-2 font-semibold text-slate-900" colSpan={3}>
                    {activity.title}
                  </td>
                </tr>
                <tr>
                  <td className="border border-slate-300 p-2 font-bold text-slate-800">
                    المرحلة التعليمية:
                  </td>
                  <td className="border border-slate-300 p-2 text-slate-700 font-medium">
                    {stageInfo.label}
                  </td>
                  <td className="border border-slate-300 p-2 font-bold text-slate-800">
                    مجال النشاط:
                  </td>
                  <td className="border border-slate-300 p-2 text-slate-700 font-medium">
                    {activity.category}
                  </td>
                </tr>
                <tr className="bg-slate-50">
                  <td className="border border-slate-300 p-2 font-bold text-slate-800">
                    تاريخ التنفيذ:
                  </td>
                  <td className="border border-slate-300 p-2 text-slate-700 font-medium">
                    {activity.date} ({activity.hijriDate || '1446هـ'})
                  </td>
                  <td className="border border-slate-300 p-2 font-bold text-slate-800">
                    مقر التنفيذ بالمجمع:
                  </td>
                  <td className="border border-slate-300 p-2 text-slate-700 font-medium">
                    {activity.location}
                  </td>
                </tr>
                <tr>
                  <td className="border border-slate-300 p-2 font-bold text-slate-800">
                    المشرف على التنفيذ:
                  </td>
                  <td className="border border-slate-300 p-2 text-slate-700 font-medium">
                    {activity.supervisor}
                  </td>
                  <td className="border border-slate-300 p-2 font-bold text-slate-800">
                    عدد الطلاب المشاركين:
                  </td>
                  <td className="border border-slate-300 p-2 text-slate-700 font-bold">
                    {activity.participantsCount} طالب
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Description & Objectives */}
          <div className="space-y-4 mb-6 text-xs">
            <div className="border border-slate-300 rounded-lg p-3">
              <div className="font-bold text-slate-900 mb-1">وصف موجز للبرنامج المنفذ:</div>
              <p className="text-slate-700 leading-relaxed">{activity.description}</p>
            </div>

            {activity.objectives && activity.objectives.length > 0 && (
              <div className="border border-slate-300 rounded-lg p-3">
                <div className="font-bold text-slate-900 mb-2">الأهداف والمخرجات المحققة:</div>
                <ul className="space-y-1 pr-4 list-disc text-slate-700">
                  {activity.objectives.map((obj, i) => (
                    <li key={i}>{obj}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Evidence / Photos Grid */}
          <div className="mb-8">
            <div className="font-bold text-xs text-slate-900 mb-2 border-b border-slate-200 pb-1">
              شواهد التوثيق الفوتوغرافي للبرنامج:
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {activity.photos.slice(0, 6).map((p, idx) => (
                <div
                  key={p.id}
                  className="border border-slate-300 rounded-lg overflow-hidden bg-slate-50 p-1 flex flex-col justify-between"
                >
                  <div className="aspect-[4/3] w-full overflow-hidden rounded bg-slate-100 mb-1">
                    <img
                      src={p.url}
                      alt={p.caption}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-[10px] text-slate-600 line-clamp-1 text-center font-medium">
                    {p.caption || `شاهد رقم (${idx + 1})`}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Signatures & Approvals */}
          <div className="pt-6 border-t-2 border-slate-800">
            <div className="grid grid-cols-2 gap-8 text-center text-xs">
              <div>
                <div className="font-bold text-slate-900 mb-12">رائد النشاط الطلابي بالمجمع</div>
                <div className="font-semibold text-slate-800">{activity.supervisor || 'أ/ أحمد محمد فقيه (رائد النشاط الطلابي)'}</div>
                <div className="text-[10px] text-slate-500">التوقيع: ................................</div>
              </div>

              <div>
                <div className="font-bold text-slate-900 mb-12">مدير مجمع الشريعة التعليمي</div>
                <div className="font-semibold text-slate-800">إدارة مجمع الشريعة التعليمي</div>
                <div className="text-[10px] text-slate-500">الختم والتوقيع: ................................</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
