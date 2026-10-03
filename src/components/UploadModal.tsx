import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  Trash2,
  Plus,
  Star,
  Loader2,
  Calendar,
  MapPin,
  Users,
  Award,
} from 'lucide-react';
import { Activity, ActivityCategory, ActivityPhoto, CATEGORIES_LIST, EducationalStage, STAGE_CONFIG } from '../types';
import { processImageFile } from '../lib/imageUtils';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (activity: Activity) => Promise<void>;
  initialStage?: EducationalStage;
}

interface PendingPhoto {
  id: string;
  dataUrl: string;
  caption: string;
  isCover: boolean;
  fileName: string;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialStage = 'high',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [stage, setStage] = useState<EducationalStage>(initialStage);
  const [category, setCategory] = useState<ActivityCategory>('النشاط الطلابي والفعاليات');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [hijriDate, setHijriDate] = useState('1446هـ');
  const [semester, setSemester] = useState<'1' | '2' | '3'>('2');
  const [supervisor, setSupervisor] = useState('أ/ أحمد محمد فقيه (رائد النشاط الطلابي)');
  const [location, setLocation] = useState('مسرح ومرافق مجمع الشريعة التعليمي');
  const [participantsCount, setParticipantsCount] = useState<number>(50);
  const [description, setDescription] = useState('');
  const [objectives, setObjectives] = useState<string[]>([
    'تنمية مهارات وقدرات الطلاب في البيئة التعليمية',
    'تعزيز التفاعل الإيجابي والمشاركة المدرسية',
  ]);
  const [newObjective, setNewObjective] = useState('');

  // Uploaded photos
  const [photos, setPhotos] = useState<PendingPhoto[]>([]);

  if (!isOpen) return null;

  const handleFilesSelected = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsProcessing(true);
    setErrorMsg(null);

    const newPhotosList: PendingPhoto[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) continue;

      try {
        const { dataUrl, fileName } = await processImageFile(file, 1600, 1200, 0.85);
        newPhotosList.push({
          id: `photo-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
          dataUrl,
          caption: '',
          isCover: photos.length === 0 && newPhotosList.length === 0,
          fileName,
        });
      } catch (err) {
        console.error('Error processing image:', err);
      }
    }

    if (newPhotosList.length === 0 && files.length > 0) {
      setErrorMsg('تعذر معالجة بعض الصور المختارة، يرجى التأكد من صيغة الملفات.');
    } else {
      setPhotos((prev) => {
        const combined = [...prev, ...newPhotosList];
        // Ensure at least one cover exists
        if (!combined.some((p) => p.isCover) && combined.length > 0) {
          combined[0].isCover = true;
        }
        return combined;
      });
    }

    setIsProcessing(false);
  };

  const setCoverPhoto = (photoId: string) => {
    setPhotos((prev) =>
      prev.map((p) => ({
        ...p,
        isCover: p.id === photoId,
      }))
    );
  };

  const updateCaption = (photoId: string, caption: string) => {
    setPhotos((prev) =>
      prev.map((p) => (p.id === photoId ? { ...p, caption } : p))
    );
  };

  const removePhoto = (photoId: string) => {
    setPhotos((prev) => {
      const filtered = prev.filter((p) => p.id !== photoId);
      if (filtered.length > 0 && !filtered.some((p) => p.isCover)) {
        filtered[0].isCover = true;
      }
      return filtered;
    });
  };

  const addObjective = () => {
    if (!newObjective.trim()) return;
    setObjectives((prev) => [...prev, newObjective.trim()]);
    setNewObjective('');
  };

  const removeObjective = (index: number) => {
    setObjectives((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('يرجى إدخال عنوان الفعالية أو البرنامج.');
      return;
    }

    if (photos.length === 0) {
      setErrorMsg('يرجى إرفاق صورة واحدة على الأقل لتوثيق الفعالية.');
      return;
    }

    setIsSaving(true);
    setErrorMsg(null);

    try {
      const coverPhoto = photos.find((p) => p.isCover) || photos[0];
      const activityPhotos: ActivityPhoto[] = photos.map((p) => ({
        id: p.id,
        url: p.dataUrl,
        caption: p.caption.trim() || title.trim(),
        isCover: p.id === coverPhoto.id,
        uploadedAt: new Date().toISOString(),
      }));

      const newActivity: Activity = {
        id: `act-${Date.now()}`,
        title: title.trim(),
        stage,
        category,
        date,
        hijriDate: hijriDate.trim() || undefined,
        semester,
        supervisor: supervisor.trim() || 'أ/ أحمد محمد فقيه (رائد النشاط الطلابي)',
        location: location.trim() || 'مجمع الشريعة التعليمي',
        participantsCount: Number(participantsCount) || 30,
        description: description.trim() || `توثيق فعاليات ${title} بمجمع الشريعة التعليمي.`,
        objectives: objectives.length > 0 ? objectives : ['تحقيق أهداف النشاط الطلابي ورعاية الموهوبين'],
        photos: activityPhotos,
        coverPhotoId: coverPhoto.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await onSave(newActivity);
      onClose();
    } catch (err) {
      console.error('Save error:', err);
      setErrorMsg('حدث خطأ أثناء حفظ الفعالية، يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                رفع وتوثيق فعالية جديدة
              </h2>
              <p className="text-xs text-slate-500">
                مجمع الشريعة التعليمي · سجل البرامج والأنشطة
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

        {errorMsg && (
          <div className="mx-6 mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Photos Upload Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-bold text-slate-900">
                صور وتوثيق الفعالية <span className="text-red-500">*</span>
              </label>
              <span className="text-xs text-slate-500">
                {photos.length} صورة محددة (انقر على النجمة لتحديد صورة الغلاف)
              </span>
            </div>

            {/* Dropzone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-emerald-600 bg-slate-50 hover:bg-emerald-50/40 rounded-xl p-6 text-center cursor-pointer transition-colors"
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFilesSelected(e.target.files)}
              />
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  {isProcessing ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <ImageIcon className="w-6 h-6" />
                  )}
                </div>
                <div className="text-sm font-semibold text-slate-800">
                  انقر هنا لاختيار الصور أو اسحبها وأفلتها مباشرة
                </div>
                <div className="text-xs text-slate-500">
                  يدعم صور الكاميرا، وJPG وPNG وWebP (يتم ضغطها تلقائياً لجودة عالية وسرعة فائقة)
                </div>
              </div>
            </div>

            {/* Uploaded Photos Thumbnails */}
            {photos.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                {photos.map((photo) => (
                  <div
                    key={photo.id}
                    className={`relative group rounded-xl overflow-hidden border ${
                      photo.isCover
                        ? 'border-emerald-600 ring-2 ring-emerald-500/30'
                        : 'border-slate-200'
                    } bg-slate-100`}
                  >
                    <div className="aspect-[4/3] w-full overflow-hidden bg-slate-200">
                      <img
                        src={photo.dataUrl}
                        alt="معاينة الصورة"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Cover Star Button */}
                    <button
                      type="button"
                      onClick={() => setCoverPhoto(photo.id)}
                      className={`absolute top-2 right-2 p-1.5 rounded-lg shadow-sm transition-colors ${
                        photo.isCover
                          ? 'bg-emerald-600 text-white'
                          : 'bg-black/60 text-white/80 hover:text-white hover:bg-black/80'
                      }`}
                      title={photo.isCover ? 'صورة الغلاف الحالية' : 'تعيين كصورة غلاف'}
                    >
                      <Star className={`w-3.5 h-3.5 ${photo.isCover ? 'fill-current' : ''}`} />
                    </button>

                    {/* Delete Photo Button */}
                    <button
                      type="button"
                      onClick={() => removePhoto(photo.id)}
                      className="absolute top-2 left-2 p-1.5 rounded-lg bg-black/60 text-white/80 hover:text-red-400 hover:bg-black/80 shadow-sm transition-colors"
                      title="حذف الصورة"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Caption input */}
                    <div className="p-2 bg-white">
                      <input
                        type="text"
                        placeholder="تعليق على الصورة (اختياري)..."
                        value={photo.caption}
                        onChange={(e) => updateCaption(photo.id, e.target.value)}
                        className="w-full text-xs px-2 py-1 border border-slate-200 rounded-md focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Activity Metadata Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-800 mb-1">
                عنوان البرنامج أو الفعالية <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="مثال: احتفال اليوم الوطني، معرض الابتكارات العلمية..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600"
              />
            </div>

            {/* Stage */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1">
                المرحلة التعليمية <span className="text-red-500">*</span>
              </label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value as EducationalStage)}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:border-emerald-600"
              >
                <option value="high">{STAGE_CONFIG.high.label}</option>
                <option value="middle">{STAGE_CONFIG.middle.label}</option>
                <option value="primary">{STAGE_CONFIG.primary.label}</option>
                <option value="general">{STAGE_CONFIG.general.label}</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1">
                مجال / تصنيف النشاط <span className="text-red-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ActivityCategory)}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:border-emerald-600"
              >
                {CATEGORIES_LIST.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Date & Hijri */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>تاريخ التنفيذ (ميلادي)</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1">
                التاريخ الهجري (مرجعي)
              </label>
              <input
                type="text"
                placeholder="مثال: 19 ربيع الأول 1446هـ"
                value={hijriDate}
                onChange={(e) => setHijriDate(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-emerald-600"
              />
            </div>

            {/* Supervisor & Semester */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1">
                المشرف على البرنامج / رائد النشاط
              </label>
              <input
                type="text"
                placeholder="أ/ أحمد محمد فقيه (رائد النشاط الطلابي)"
                value={supervisor}
                onChange={(e) => setSupervisor(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1">
                الفصل الدراسي
              </label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value as '1' | '2' | '3')}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:border-emerald-600"
              >
                <option value="1">الفصل الدراسي الأول</option>
                <option value="2">الفصل الدراسي الثاني</option>
                <option value="3">الفصل الدراسي الثالث</option>
              </select>
            </div>

            {/* Location & Participants */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>مقر التنفيذ بالمجمع</span>
              </label>
              <input
                type="text"
                placeholder="المسرح، الصالة الرياضية، المعامل..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                <span>عدد الطلاب المشاركين</span>
              </label>
              <input
                type="number"
                min="1"
                max="2000"
                value={participantsCount}
                onChange={(e) => setParticipantsCount(Number(e.target.value))}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-emerald-600"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-800 mb-1">
                وصف موجز للبرنامج والفعاليات المنفذة
              </label>
              <textarea
                rows={3}
                placeholder="اكتب نبذة عن تفاصيل البرنامج وفقراته ومشاركات الطلاب..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-emerald-600"
              />
            </div>

            {/* Objectives */}
            <div className="md:col-span-2 space-y-2">
              <label className="block text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-slate-400" />
                <span>أهداف ومخرجات البرنامج (للتوثيق الرسمي)</span>
              </label>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="أضف هدفاً أو مخرجاً للبرنامج..."
                  value={newObjective}
                  onChange={(e) => setNewObjective(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addObjective();
                    }
                  }}
                  className="flex-1 px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-emerald-600"
                />
                <button
                  type="button"
                  onClick={addObjective}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-colors flex items-center gap-1 shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة</span>
                </button>
              </div>

              {objectives.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  {objectives.map((obj, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700"
                    >
                      <span className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{obj}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => removeObjective(idx)}
                        className="text-slate-400 hover:text-red-500 p-0.5"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-5 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSaving || isProcessing}
              className="flex items-center gap-2 px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>جاري الحفظ في الأرشيف...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>حفظ وتوثيق الفعالية</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
