import React, { useEffect, useState, useMemo } from 'react';
import { Activity, ActivityCategory, ActivityPhoto, CATEGORIES_LIST, EducationalStage, STAGE_CONFIG } from './types';
import {
  getAllActivities,
  saveActivity,
  deleteActivity,
  addPhotosToActivity,
} from './lib/storage';
import { Navbar } from './components/Navbar';
import { ActivityCard } from './components/ActivityCard';
import { UploadModal } from './components/UploadModal';
import { ActivityDetailModal } from './components/ActivityDetailModal';
import { LightboxModal } from './components/LightboxModal';
import { PrintableReportModal } from './components/PrintableReportModal';
import { StatsAndArchiveModal } from './components/StatsAndArchiveModal';
import { AllPhotosFeed } from './components/AllPhotosFeed';
import {
  Search,
  PlusCircle,
  Filter,
  GraduationCap,
  Calendar,
  Layers,
  Sparkles,
  Camera,
  FolderOpen,
  ArrowUpDown,
  BookOpen,
} from 'lucide-react';

export default function App() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState<'gallery' | 'allPhotos'>('gallery');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSemester, setSelectedSemester] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'photosCount' | 'participants'>('newest');

  // Modals
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [printableActivity, setPrintableActivity] = useState<Activity | null>(null);
  const [lightboxState, setLightboxState] = useState<{
    isOpen: boolean;
    activity: Activity | null;
    photoIndex: number;
  }>({
    isOpen: false,
    activity: null,
    photoIndex: 0,
  });

  // Load activities from IndexedDB
  const loadData = async () => {
    try {
      setIsLoading(true);
      const data = await getAllActivities();
      setActivities(data);
    } catch (err) {
      console.error('Error loading activities from IndexedDB:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Compute metrics
  const totalPhotos = useMemo(
    () => activities.reduce((acc, curr) => acc + curr.photos.length, 0),
    [activities]
  );

  // Filtered and sorted activities
  const filteredActivities = useMemo(() => {
    return activities
      .filter((act) => {
        if (selectedStage !== 'all' && act.stage !== selectedStage) {
          return false;
        }
        if (selectedCategory !== 'all' && act.category !== selectedCategory) {
          return false;
        }
        if (selectedSemester !== 'all' && act.semester !== selectedSemester) {
          return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = act.title.toLowerCase().includes(q);
          const matchDesc = act.description.toLowerCase().includes(q);
          const matchSup = act.supervisor.toLowerCase().includes(q);
          const matchLoc = act.location.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchSup && !matchLoc) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
        if (sortBy === 'photosCount') {
          return b.photos.length - a.photos.length;
        }
        if (sortBy === 'participants') {
          return (b.participantsCount || 0) - (a.participantsCount || 0);
        }
        return 0;
      });
  }, [activities, selectedStage, selectedCategory, selectedSemester, searchQuery, sortBy]);

  // Handlers
  const handleSaveActivity = async (newActivity: Activity) => {
    await saveActivity(newActivity);
    await loadData();
  };

  const handleDeleteActivity = async (activityId: string) => {
    await deleteActivity(activityId);
    if (selectedActivity?.id === activityId) setSelectedActivity(null);
    if (lightboxState.activity?.id === activityId) {
      setLightboxState({ isOpen: false, activity: null, photoIndex: 0 });
    }
    await loadData();
  };

  const handleAddPhotosToActivity = async (activityId: string, newPhotos: ActivityPhoto[]) => {
    const updated = await addPhotosToActivity(activityId, newPhotos);
    setSelectedActivity(updated);
    await loadData();
  };

  const handleOpenLightbox = (activity: Activity, photoIndex: number) => {
    setLightboxState({
      isOpen: true,
      activity,
      photoIndex,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Navbar with 3-zone contract */}
      <Navbar
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenStats={() => setIsStatsOpen(true)}
        currentView={currentView}
        onViewChange={setCurrentView}
        totalActivities={activities.length}
        totalPhotos={totalPhotos}
      />

      {/* Hero Header Section */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
                <GraduationCap className="w-4 h-4 text-emerald-700" />
                <span>وزارة التعليم · مجمع الشريعة التعليمي</span>
                <span aria-hidden="true">·</span>
                <span>العام الدراسي 1446هـ</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                منصة توثيق وأرشفة برامج وأنشطة مجمع الشريعة
              </h1>
              <p className="text-sm text-slate-600 leading-relaxed">
                منظومة إلكترونية متكاملة لرفع وتوثيق صور الفعاليات المدرسية، المعارض العلمية، الأنشطة الطلابية والرياضية لمراحل المجمع (الابتدائية، المتوسطة، الثانوية)، مع إمكانية إصدار استمارات التوثيق الرسمية.
              </p>
            </div>

            {/* Quick Stats Summary & Primary CTA */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center gap-4 text-center">
                <div>
                  <div className="text-xl font-bold text-slate-900 tabular-nums">
                    {activities.length}
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">برنامج موثق</div>
                </div>
                <div className="w-px h-8 bg-slate-200" />
                <div>
                  <div className="text-xl font-bold text-emerald-800 tabular-nums">
                    {totalPhotos}
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">صورة بالأرشيف</div>
                </div>
              </div>

              <button
                onClick={() => setIsUploadOpen(true)}
                className="hidden sm:flex items-center gap-2 px-5 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-sm font-bold shadow-sm transition-colors whitespace-nowrap"
              >
                <PlusCircle className="w-4 h-4" />
                <span>توثيق فعالية جديدة</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {currentView === 'gallery' ? (
          <>
            {/* Filter and Search Bar */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
              {/* Top Filter Row: Search & Stage Segmented Controls */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="ابحث بالعنوان، المشرف، مقر التنفيذ، أو الكلمات المفتاحية..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-3 pr-10 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-emerald-600 bg-slate-50/50"
                  />
                </div>

                {/* Stage Filters Segmented Tabs */}
                <div className="flex items-center gap-1 overflow-x-auto p-1 bg-slate-100 rounded-xl max-w-full">
                  <button
                    onClick={() => setSelectedStage('all')}
                    className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                      selectedStage === 'all'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    كل المراحل ({activities.length})
                  </button>
                  {(['high', 'middle', 'primary', 'general'] as const).map((stg) => {
                    const cfg = STAGE_CONFIG[stg];
                    const count = activities.filter((a) => a.stage === stg).length;
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

              {/* Secondary Filter Row: Category & Semester & Sort */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
                <div className="flex flex-wrap items-center gap-2">
                  {/* Category Dropdown */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500 font-medium">مجال النشاط:</span>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:border-emerald-600"
                    >
                      <option value="all">كافة المجالات والتصنيفات</option>
                      {CATEGORIES_LIST.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Semester Dropdown */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500 font-medium">الفصل الدراسي:</span>
                    <select
                      value={selectedSemester}
                      onChange={(e) => setSelectedSemester(e.target.value)}
                      className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:border-emerald-600"
                    >
                      <option value="all">كافة الفصول</option>
                      <option value="1">الفصل الأول</option>
                      <option value="2">الفصل الثاني</option>
                      <option value="3">الفصل الثالث</option>
                    </select>
                  </div>
                </div>

                {/* Sort selector */}
                <div className="flex items-center gap-1.5 mr-auto">
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-slate-500 font-medium">الترتيب:</span>
                  <select
                    value={sortBy}
                    onChange={(e) =>
                      setSortBy(e.target.value as 'newest' | 'photosCount' | 'participants')
                    }
                    className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:border-emerald-600"
                  >
                    <option value="newest">الأحدث تنفيذاً</option>
                    <option value="photosCount">الأكثر صوراً</option>
                    <option value="participants">الأكثر مشاركة للطلاب</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Activities Bento / Grid */}
            {isLoading ? (
              <div className="py-20 text-center text-slate-500 text-sm">
                جاري تحميل أرشيف مجمع الشريعة التعليمي...
              </div>
            ) : filteredActivities.length === 0 ? (
              <div className="py-16 text-center bg-white rounded-2xl border border-slate-200 p-8 space-y-4">
                <FolderOpen className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-800">
                  لا توجد برامج مطابقة لخيارات البحث
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  لم يتم العثور على أي برامج أو فعاليات وفق التصنيفات المحددة. يمكنك تعديل خيارات التصفية أو رفع توثيق جديد.
                </p>
                <button
                  onClick={() => setIsUploadOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-700 text-white rounded-lg text-xs font-semibold hover:bg-emerald-800 transition-colors"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>رفع وتوثيق فعالية الآن</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredActivities.map((activity) => (
                  <ActivityCard
                    key={activity.id}
                    activity={activity}
                    onOpenDetails={(act) => setSelectedActivity(act)}
                    onOpenLightbox={(act, pIdx) => handleOpenLightbox(act, pIdx)}
                    onAddMorePhotos={(act) => setSelectedActivity(act)}
                    onPrintReport={(act) => setPrintableActivity(act)}
                    onDelete={handleDeleteActivity}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          /* Comprehensive All Photos Masonry View */
          <AllPhotosFeed
            activities={activities}
            onOpenLightbox={(act, pIdx) => handleOpenLightbox(act, pIdx)}
            onOpenDetails={(act) => setSelectedActivity(act)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="no-print mt-auto border-t border-slate-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            مجمع الشريعة التعليمي · قسم النشاط الطلابي والإعلام المدرسي © 1446 - 1447هـ
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsStatsOpen(true)}
              className="hover:text-slate-900 transition-colors"
            >
              التقارير والإحصائيات
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setIsUploadOpen(true)}
              className="hover:text-emerald-800 font-semibold transition-colors"
            >
              رفع توثيق جديد
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSave={handleSaveActivity}
      />

      <ActivityDetailModal
        activity={selectedActivity}
        isOpen={!!selectedActivity}
        onClose={() => setSelectedActivity(null)}
        onOpenLightbox={(act, pIdx) => handleOpenLightbox(act, pIdx)}
        onAddPhotos={handleAddPhotosToActivity}
        onPrintReport={(act) => setPrintableActivity(act)}
      />

      <LightboxModal
        activity={lightboxState.activity}
        photoIndex={lightboxState.photoIndex}
        isOpen={lightboxState.isOpen}
        onClose={() =>
          setLightboxState({ isOpen: false, activity: null, photoIndex: 0 })
        }
        onNavigate={(newIdx) =>
          setLightboxState((prev) => ({ ...prev, photoIndex: newIdx }))
        }
      />

      <PrintableReportModal
        activity={printableActivity}
        isOpen={!!printableActivity}
        onClose={() => setPrintableActivity(null)}
      />

      <StatsAndArchiveModal
        activities={activities}
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        onDataChanged={loadData}
      />
    </div>
  );
}
