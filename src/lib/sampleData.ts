import { Activity } from '../types';

function createSvgDataUri(svgContent: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgContent.trim())}`;
}

// 1. National Day celebration vector
const nationalDayCover = createSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
  <defs>
    <linearGradient id="nd_bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#064e3b" />
      <stop offset="50%" stop-color="#047857" />
      <stop offset="100%" stop-color="#065f46" />
    </linearGradient>
    <pattern id="nd_pat" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 20,0 L 40,20 L 20,40 L 0,20 Z" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1.5"/>
    </pattern>
  </defs>
  <rect width="800" height="500" fill="url(#nd_bg)" />
  <rect width="800" height="500" fill="url(#nd_pat)" />
  
  <!-- Decorative Golden Arch & Palm Elements -->
  <circle cx="400" cy="240" r="160" fill="rgba(255,255,255,0.04)" stroke="rgba(217,119,6,0.3)" stroke-width="2" />
  <circle cx="400" cy="240" r="130" fill="none" stroke="rgba(217,119,6,0.2)" stroke-dasharray="6,6" stroke-width="2" />
  
  <!-- Palm & Swords Symbol -->
  <g transform="translate(400, 200) scale(1.1)">
    <!-- Palm trunk & fronds -->
    <path d="M-4,40 C-8,10 -15,-10 0,-30 C15,-10 8,10 4,40 Z" fill="#fef08a" opacity="0.9"/>
    <path d="M0,-25 C-30,-40 -50,-10 -60,10 C-40,0 -20,-10 0,-25 Z" fill="#fef08a" opacity="0.85"/>
    <path d="M0,-25 C30,-40 50,-10 60,10 C40,0 20,-10 0,-25 Z" fill="#fef08a" opacity="0.85"/>
    <path d="M0,-30 C-20,-60 -40,-45 -45,-30 C-30,-35 -15,-40 0,-30 Z" fill="#fef08a" opacity="0.9"/>
    <path d="M0,-30 C20,-60 40,-45 45,-30 C30,-35 15,-40 0,-30 Z" fill="#fef08a" opacity="0.9"/>
    <path d="M0,-30 C0,-65 -10,-75 0,-85 C10,-75 0,-65 0,-30 Z" fill="#fef08a" opacity="0.95"/>
    <!-- Swords -->
    <path d="M-50,55 L50,25" stroke="#fef08a" stroke-width="4" stroke-linecap="round"/>
    <path d="M50,55 L-50,25" stroke="#fef08a" stroke-width="4" stroke-linecap="round"/>
  </g>
  
  <!-- Typography / Banner -->
  <text x="400" y="340" font-family="'Tajawal', sans-serif" font-size="28" font-weight="bold" fill="#ffffff" text-anchor="middle">احتفال اليوم الوطني الـ 94</text>
  <text x="400" y="375" font-family="'Tajawal', sans-serif" font-size="16" fill="#a7f3d0" text-anchor="middle">نحلم ونحقق · مجمع الشريعة التعليمي</text>
  
  <!-- Subtle Badge Bottom -->
  <rect x="330" y="405" width="140" height="28" rx="14" fill="rgba(0,0,0,0.25)" />
  <text x="400" y="424" font-family="'Tajawal', sans-serif" font-size="13" fill="#ffffff" text-anchor="middle">المرحلة الثانوية</text>
</svg>
`);

// 2. Science & Robotics Fair
const scienceFairCover = createSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
  <defs>
    <linearGradient id="sc_bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="50%" stop-color="#1e293b" />
      <stop offset="100%" stop-color="#0284c7" />
    </linearGradient>
  </defs>
  <rect width="800" height="500" fill="url(#sc_bg)" />
  
  <!-- Tech Grid & Constellation -->
  <g stroke="rgba(56,189,248,0.25)" stroke-width="1.5">
    <line x1="100" y1="100" x2="300" y2="180" />
    <line x1="300" y1="180" x2="400" y2="120" />
    <line x1="400" y1="120" x2="520" y2="200" />
    <line x1="520" y1="200" x2="700" y2="150" />
    <line x1="300" y1="180" x2="350" y2="280" />
    <line x1="520" y1="200" x2="480" y2="300" />
  </g>
  <circle cx="100" cy="100" r="5" fill="#38bdf8" />
  <circle cx="300" cy="180" r="7" fill="#38bdf8" />
  <circle cx="400" cy="120" r="6" fill="#38bdf8" />
  <circle cx="520" cy="200" r="8" fill="#38bdf8" />
  <circle cx="700" cy="150" r="5" fill="#38bdf8" />
  <circle cx="350" cy="280" r="6" fill="#38bdf8" />
  <circle cx="480" cy="300" r="6" fill="#38bdf8" />
  
  <!-- Central Atom & Robotic Motif -->
  <g transform="translate(400, 220)">
    <circle cx="0" cy="0" r="45" fill="none" stroke="#38bdf8" stroke-width="3" />
    <ellipse cx="0" cy="0" rx="90" ry="32" fill="none" stroke="#7dd3fc" stroke-width="2" transform="rotate(30)" />
    <ellipse cx="0" cy="0" rx="90" ry="32" fill="none" stroke="#7dd3fc" stroke-width="2" transform="rotate(-30)" />
    <circle cx="0" cy="0" r="14" fill="#38bdf8" />
  </g>
  
  <text x="400" y="350" font-family="'Tajawal', sans-serif" font-size="28" font-weight="bold" fill="#ffffff" text-anchor="middle">معرض المبتكرين والذكاء الاصطناعي</text>
  <text x="400" y="385" font-family="'Tajawal', sans-serif" font-size="16" fill="#bae6fd" text-anchor="middle">ابتكارات الطلاب ومشاريع الروبوت · المرحلة المتوسطة</text>
</svg>
`);

// 3. Sports & Football Cup
const sportsDayCover = createSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
  <defs>
    <linearGradient id="sp_bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#14532d" />
      <stop offset="60%" stop-color="#166534" />
      <stop offset="100%" stop-color="#15803d" />
    </linearGradient>
  </defs>
  <rect width="800" height="500" fill="url(#sp_bg)" />
  
  <!-- Turf Lines -->
  <line x1="400" y1="0" x2="400" y2="500" stroke="rgba(255,255,255,0.12)" stroke-width="3" />
  <circle cx="400" cy="250" r="140" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="3" />
  <circle cx="400" cy="250" r="8" fill="rgba(255,255,255,0.3)" />

  <!-- Trophy Icon in Gold -->
  <g transform="translate(400, 190) scale(1.1)">
    <path d="M-30,-50 L30,-50 C30,-50 35,-10 0,10 C-35,-10 -30,-50 -30,-50 Z" fill="#fbbf24" stroke="#f59e0b" stroke-width="2"/>
    <path d="M-30,-40 C-50,-40 -50,-15 -25,-10" fill="none" stroke="#fbbf24" stroke-width="5" stroke-linecap="round"/>
    <path d="M30,-40 C50,-40 50,-15 25,-10" fill="none" stroke="#fbbf24" stroke-width="5" stroke-linecap="round"/>
    <rect x="-8" y="10" width="16" height="25" fill="#f59e0b" />
    <path d="M-25,35 L25,35 L20,48 L-20,48 Z" fill="#d97706" />
    <polygon points="0,-35 4,-24 16,-24 7,-17 10,-6 0,-13 -10,-6 -7,-17 -16,-24 -4,-24" fill="#ffffff" />
  </g>

  <text x="400" y="350" font-family="'Tajawal', sans-serif" font-size="28" font-weight="bold" fill="#ffffff" text-anchor="middle">دوري مجمع الشريعة لكرة القدم</text>
  <text x="400" y="385" font-family="'Tajawal', sans-serif" font-size="16" fill="#bbf7d0" text-anchor="middle">كأس التميز الرياضي والصحة المدرسية · المرحلة الابتدائية</text>
</svg>
`);

// 4. Honoring Outstanding Students
const honoringCover = createSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
  <defs>
    <linearGradient id="hn_bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#312e81" />
      <stop offset="50%" stop-color="#3730a3" />
      <stop offset="100%" stop-color="#4f46e5" />
    </linearGradient>
  </defs>
  <rect width="800" height="500" fill="url(#hn_bg)" />

  <!-- Radiance Rays -->
  <g stroke="rgba(251,191,36,0.12)" stroke-width="2">
    <line x1="400" y1="200" x2="200" y2="50" />
    <line x1="400" y1="200" x2="600" y2="50" />
    <line x1="400" y1="200" x2="150" y2="200" />
    <line x1="400" y1="200" x2="650" y2="200" />
    <line x1="400" y1="200" x2="220" y2="340" />
    <line x1="400" y1="200" x2="580" y2="340" />
  </g>

  <!-- Medal & Certificate Ribbon -->
  <g transform="translate(400, 180) scale(1.15)">
    <circle cx="0" cy="0" r="42" fill="#fbbf24" stroke="#d97706" stroke-width="3"/>
    <circle cx="0" cy="0" r="34" fill="none" stroke="#ffffff" stroke-width="2" stroke-dasharray="4,4"/>
    <polygon points="0,-22 6,-6 22,-6 10,4 14,20 0,10 -14,20 -10,4 -22,-6 -6,-6" fill="#ffffff" />
    <!-- Ribbons -->
    <path d="M-15,35 L-25,75 L-5,65 L5,75 L-5,35 Z" fill="#ef4444" opacity="0.9"/>
    <path d="M15,35 L25,75 L5,65 L-5,75 L5,35 Z" fill="#2563eb" opacity="0.9"/>
  </g>

  <text x="400" y="340" font-family="'Tajawal', sans-serif" font-size="28" font-weight="bold" fill="#ffffff" text-anchor="middle">حفل تكريم فرسان التميز الأكاديمي</text>
  <text x="400" y="375" font-family="'Tajawal', sans-serif" font-size="16" fill="#c7d2fe" text-anchor="middle">تكريم المتفوقين للفصل الدراسي الأول · المجمع العام</text>
</svg>
`);

// 5. Environmental & Tree Planting Initiative
const plantingCover = createSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
  <defs>
    <linearGradient id="pl_bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#064e3b" />
      <stop offset="60%" stop-color="#047857" />
      <stop offset="100%" stop-color="#0d9488" />
    </linearGradient>
  </defs>
  <rect width="800" height="500" fill="url(#pl_bg)" />

  <g transform="translate(400, 190) scale(1.1)">
    <!-- Soil base -->
    <ellipse cx="0" cy="50" rx="60" ry="14" fill="#78350f" opacity="0.8"/>
    <!-- Stem & Leaves -->
    <path d="M0,45 Q-10,10 0,-25 Q10,10 0,45" fill="#a7f3d0"/>
    <path d="M-2,-10 C-35,-25 -40,10 -5,15" fill="#34d399"/>
    <path d="M2,-5 C35,-20 40,15 5,20" fill="#10b981"/>
    <circle cx="0" cy="-30" r="14" fill="#6ee7b7" />
  </g>

  <text x="400" y="340" font-family="'Tajawal', sans-serif" font-size="28" font-weight="bold" fill="#ffffff" text-anchor="middle">مبادرة الشريعة الخضراء وغرس الشتلات</text>
  <text x="400" y="375" font-family="'Tajawal', sans-serif" font-size="16" fill="#a7f3d0" text-anchor="middle">تطوع بيئي وتوعية بمبادرة السعودية الخضراء · المرحلة المتوسطة</text>
</svg>
`);

// 6. School Radio & Arabic Language Contest
const languageContestCover = createSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
  <defs>
    <linearGradient id="lc_bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#7c2d12" />
      <stop offset="50%" stop-color="#9a3412" />
      <stop offset="100%" stop-color="#c2410c" />
    </linearGradient>
  </defs>
  <rect width="800" height="500" fill="url(#lc_bg)" />

  <g transform="translate(400, 185) scale(1.15)">
    <!-- Book open -->
    <path d="M0,15 C-25,0 -60,5 -75,25 L-75,-25 C-60,-45 -25,-40 0,-30 C25,-40 60,-45 75,-25 L75,25 C60,5 25,0 0,15 Z" fill="#ffedd5" stroke="#ea580c" stroke-width="2"/>
    <line x1="0" y1="-30" x2="0" y2="15" stroke="#9a3412" stroke-width="2"/>
    <!-- Quill / Pen -->
    <path d="M10,-45 Q35,-65 45,-80 Q25,-60 10,-45" fill="#fef08a" stroke="#ca8a04" stroke-width="2"/>
  </g>

  <text x="400" y="340" font-family="'Tajawal', sans-serif" font-size="28" font-weight="bold" fill="#ffffff" text-anchor="middle">مسابقة الخطابة وفنون الإلقاء العربي</text>
  <text x="400" y="375" font-family="'Tajawal', sans-serif" font-size="16" fill="#fed7aa" text-anchor="middle">الإذاعة المدرسية وتعزيز الفصاحة · المرحلة الابتدائية</text>
</svg>
`);

export const INITIAL_ACTIVITIES: Activity[] = [
  {
    id: 'act-1',
    title: 'احتفال مجمع الشريعة باليوم الوطني الـ 94 (نحلم ونحقق)',
    stage: 'high',
    category: 'اليوم الوطني ويوم التأسيس',
    date: '2024-09-23',
    hijriDate: '19 ربيع الأول 1446هـ',
    semester: '1',
    supervisor: 'أ/ أحمد محمد فقيه (رائد النشاط الطلابي)',
    location: 'مسرح المجمع والصالة الرياضية الكبرى',
    participantsCount: 320,
    description:
      'نظم مجمع الشريعة التعليمي برنامجاً احتفالياً بهيجاً بمناسبة اليوم الوطني الـ 94، اشتمل على أوبريت وطني، وعروض مرئية لتاريخ المملكة ومسيرة التنمية في رؤية 2030، ومعرض فني لأعمال ومشاريع الطلاب، ومسابقات ثقافية وطنية شارك فيها منسوبو المجمع والطلاب وأولياء الأمور.',
    objectives: [
      'تعزيز الانتماء الوطني والولاء للقيادة الرشيدة',
      'إبراز مكتسبات الوطن ومنجزات رؤية السعودية 2030',
      'تشجيع الطلاب على التعبير الفني والإبداعي عن حب الوطن',
    ],
    photos: [
      {
        id: 'p-1-1',
        url: nationalDayCover,
        caption: 'لوحة الاحتفال الرئيسية بمشاركة طلاب المرحلة الثانوية بمسرح المجمع',
        isCover: true,
        uploadedAt: '2024-09-23T10:30:00Z',
      },
      {
        id: 'p-1-2',
        url: nationalDayCover,
        caption: 'الطلاب أثناء أداء العرضة الوطنية ومشاركة الكادر التعليمي والإداري',
        isCover: false,
        uploadedAt: '2024-09-23T11:00:00Z',
      },
    ],
    coverPhotoId: 'p-1-1',
    createdAt: '2024-09-23T08:00:00Z',
    updatedAt: '2024-09-23T12:00:00Z',
  },
  {
    id: 'act-2',
    title: 'المعرض العلمي السنوي للمبتكرين والذكاء الاصطناعي',
    stage: 'middle',
    category: 'المعارض العلمية والابتكار',
    date: '2024-11-14',
    hijriDate: '12 جمادى الأولى 1446هـ',
    semester: '1',
    supervisor: 'أ/ أحمد محمد فقيه (رائد النشاط الطلابي)',
    location: 'قاعة مصادر التعلم والمعامل العلمية',
    participantsCount: 145,
    description:
      'أقام مجمع الشريعة التعليمي معرض الابتكارات الطلابية السنوي تحت شعار "عقول تبتكر لمستقبل مشرق"، استعرض فيه الطلاب 24 مشروعاً علمياً في مجالات الطاقة المتجددة، والبرمجة بالذكاء الاصطناعي، ونماذج الروبوت الذاتي.',
    objectives: [
      'تنمية مهارات التفكير العلمي والبحثي لدى الطلاب',
      'توظيف تقنيات الذكاء الاصطناعي في حلول تطبيقية',
      'تشجيع ثقافة الابتكار والمشاركة في المسابقات المركزية (إبداع)',
    ],
    photos: [
      {
        id: 'p-2-1',
        url: scienceFairCover,
        caption: 'منصة عرض الروبوتات الذكية ونماذج فرز النفايات الذاتية',
        isCover: true,
        uploadedAt: '2024-11-14T09:15:00Z',
      },
      {
        id: 'p-2-2',
        url: scienceFairCover,
        caption: 'لجنة التحكيم والمعلمون أثناء تقييم المشاريع المشاركة',
        isCover: false,
        uploadedAt: '2024-11-14T10:45:00Z',
      },
    ],
    coverPhotoId: 'p-2-1',
    createdAt: '2024-11-14T08:00:00Z',
    updatedAt: '2024-11-14T11:30:00Z',
  },
  {
    id: 'act-3',
    title: 'دوري مجمع الشريعة لكرة القدم الشتوي وكأس التميز',
    stage: 'primary',
    category: 'النشاط الرياضي والكشفي',
    date: '2024-12-05',
    hijriDate: '4 جمادى الآخرة 1446هـ',
    semester: '2',
    supervisor: 'أ/ أحمد محمد فقيه (رائد النشاط الطلابي)',
    location: 'الملاعب الرياضية الخارجية المعشبة',
    participantsCount: 180,
    description:
      'اختتمت فعاليات دوري كرة القدم المدرسي للمرحلة الابتدائية بمباراة نهائية حماسية بين فصلي السادس (أ) والخامس (ب)، بحضور مدير المجمع والمعلمين وجمع من الطلاب، وتم تتويج الفريق الفائز بكأس البطولة والميداليات الذهبية.',
    objectives: [
      'غرس الروح الرياضية والعمل الجماعي بين الطلاب',
      'تشجيع النشاط البدني ونمط الحياة الصحي',
      'اكتشاف المواهب الرياضية الواعدة وتطويرها',
    ],
    photos: [
      {
        id: 'p-3-1',
        url: sportsDayCover,
        caption: 'لحظة تتويج الفريق البطل وتسليم كأس البطولة من إدارة المجمع',
        isCover: true,
        uploadedAt: '2024-12-05T11:00:00Z',
      },
      {
        id: 'p-3-2',
        url: sportsDayCover,
        caption: 'لقطة جماعية للفرق المشاركة مع معلمي التربية البدنية والمدربين',
        isCover: false,
        uploadedAt: '2024-12-05T11:40:00Z',
      },
    ],
    coverPhotoId: 'p-3-1',
    createdAt: '2024-12-05T07:30:00Z',
    updatedAt: '2024-12-05T12:00:00Z',
  },
  {
    id: 'act-4',
    title: 'حفل تكريم فرسان التميز الأكاديمي والمتفوقين دراسياً',
    stage: 'general',
    category: 'التوجيه والإرشاد والتفوق',
    date: '2025-01-16',
    hijriDate: '16 رجب 1446هـ',
    semester: '2',
    supervisor: 'أ/ أحمد محمد فقيه (رائد النشاط الطلابي)',
    location: 'المسرح الرئيسي لمجمع الشريعة التعليمي',
    participantsCount: 95,
    description:
      'في احتفالية تعليمية مميزة، كرمت إدارة مجمع الشريعة التعليمي الطلاب الأوائل والمتفوقين دراسياً الحاصلين على درجات الامتياز في جميع المراحل (الابتدائية، المتوسطة، الثانوية)، تقديراً لجهدهم ومثابرتهم خلال الفصل الدراسي الأول.',
    objectives: [
      'تحفيز الطلاب على مواصلة التفوق والاجتهاد العلمي',
      'تعزيز الشراكة بين المدرسة وأولياء الأمور',
      'بناء بيئة تعليمية إيجابية تحتفي بالإنجازات',
    ],
    photos: [
      {
        id: 'p-4-1',
        url: honoringCover,
        caption: 'تسليم الدروع التذكارية وشهادات الشكر للطلاب المتفوقين',
        isCover: true,
        uploadedAt: '2025-01-16T10:15:00Z',
      },
    ],
    coverPhotoId: 'p-4-1',
    createdAt: '2025-01-16T08:00:00Z',
    updatedAt: '2025-01-16T11:00:00Z',
  },
  {
    id: 'act-5',
    title: 'مبادرة الشريعة الخضراء لغرس الشتلات والتطوع البيئي',
    stage: 'middle',
    category: 'التطوع وخدمة المجتمع',
    date: '2025-02-06',
    hijriDate: '7 شعبان 1446هـ',
    semester: '2',
    supervisor: 'أ/ أحمد محمد فقيه (رائد النشاط الطلابي)',
    location: 'حديقة المجمع وفناء الفصول الخارجية',
    participantsCount: 65,
    description:
      'تزامناً مع أسبوع البيئة، أطلق طلاب المرحلة المتوسطة مبادرة لتشجير وتجميل مرافق المجمع، حيث غرس الطلاب أكثر من 120 شتلة صديقة للبيئة، مع إعداد لوحات توعوية حول ترشيد المياه والعناية بالنباتات.',
    objectives: [
      'تنمية ثقافة التطوع والمسؤولية المجتمعية لدى الطلاب',
      'تحسين البيئة المدرسية وزيادة المسطحات الخضراء',
      'التوعية بمستهدفات مبادرة السعودية الخضراء',
    ],
    photos: [
      {
        id: 'p-5-1',
        url: plantingCover,
        caption: 'الطلاب أثناء غرس الشتلات في الحديقة المدرسية',
        isCover: true,
        uploadedAt: '2025-02-06T09:00:00Z',
      },
    ],
    coverPhotoId: 'p-5-1',
    createdAt: '2025-02-06T07:30:00Z',
    updatedAt: '2025-02-06T10:30:00Z',
  },
  {
    id: 'act-6',
    title: 'مسابقة الخطابة والفصاحة والإذاعة المدرسية المتميزة',
    stage: 'primary',
    category: 'الإذاعة المدرسية والمسابقات',
    date: '2025-02-20',
    hijriDate: '21 شعبان 1446هـ',
    semester: '2',
    supervisor: 'أ/ أحمد محمد فقيه (رائد النشاط الطلابي)',
    location: 'فناء الطابور الصباحي ومصلى المدرسة',
    participantsCount: 85,
    description:
      'أقام مجمع الشريعة التصفيات النهائية لمسابقة الإلقاء الشعري والخطابة لفرسان المرحلة الابتدائية، وشهدت المسابقة تنافساً قوياً بين الطلاب في فصاحة اللسان وجمال التعبير وقوة الحضور المسرحي.',
    objectives: [
      'تنمية مهارات التحدث والجرأة الأدبية لدى النشء',
      'صقل المواهب اللغوية في الإلقاء والشعر العربي الفصيح',
      'تفعيل الدور التربوي للإذاعة الصباحية في بناء شخصية الطالب',
    ],
    photos: [
      {
        id: 'p-6-1',
        url: languageContestCover,
        caption: 'المتسابقون أمام لجنة تحكيم مسابقة الخطابة والإلقاء',
        isCover: true,
        uploadedAt: '2025-02-20T08:15:00Z',
      },
    ],
    coverPhotoId: 'p-6-1',
    createdAt: '2025-02-20T07:00:00Z',
    updatedAt: '2025-02-20T09:30:00Z',
  },
];
