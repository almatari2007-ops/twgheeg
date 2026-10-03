export type EducationalStage = 'primary' | 'middle' | 'high' | 'general';

export type ActivityCategory =
  | 'النشاط الطلابي والفعاليات'
  | 'اليوم الوطني ويوم التأسيس'
  | 'المعارض العلمية والابتكار'
  | 'النشاط الرياضي والكشفي'
  | 'التوجيه والإرشاد والتفوق'
  | 'الإذاعة المدرسية والمسابقات'
  | 'الرحلات والزيارات الميدانية'
  | 'التطوع وخدمة المجتمع';

export interface ActivityPhoto {
  id: string;
  url: string; // Base64 data URL or SVG data URL
  caption: string;
  isCover?: boolean;
  uploadedAt: string;
}

export interface Activity {
  id: string;
  title: string;
  stage: EducationalStage;
  category: ActivityCategory;
  date: string; // YYYY-MM-DD
  hijriDate?: string;
  semester: '1' | '2' | '3';
  supervisor: string;
  location: string;
  participantsCount: number;
  description: string;
  objectives: string[];
  photos: ActivityPhoto[];
  coverPhotoId?: string;
  createdAt: string;
  updatedAt: string;
}

export const STAGE_CONFIG: Record<EducationalStage, { label: string; shortLabel: string; color: string; bg: string }> = {
  primary: {
    label: 'المرحلة الابتدائية',
    shortLabel: 'الابتدائية',
    color: 'text-amber-800',
    bg: 'bg-amber-50 border-amber-200',
  },
  middle: {
    label: 'المرحلة المتوسطة',
    shortLabel: 'المتوسطة',
    color: 'text-sky-800',
    bg: 'bg-sky-50 border-sky-200',
  },
  high: {
    label: 'المرحلة الثانوية',
    shortLabel: 'الثانوية',
    color: 'text-emerald-800',
    bg: 'bg-emerald-50 border-emerald-200',
  },
  general: {
    label: 'المجمع العام (مشترك)',
    shortLabel: 'المجمع العام',
    color: 'text-indigo-800',
    bg: 'bg-indigo-50 border-indigo-200',
  },
};

export const CATEGORIES_LIST: ActivityCategory[] = [
  'النشاط الطلابي والفعاليات',
  'اليوم الوطني ويوم التأسيس',
  'المعارض العلمية والابتكار',
  'النشاط الرياضي والكشفي',
  'التوجيه والإرشاد والتفوق',
  'الإذاعة المدرسية والمسابقات',
  'الرحلات والزيارات الميدانية',
  'التطوع وخدمة المجتمع',
];
