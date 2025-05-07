export type Project = {
  id: number
  title: string
  description: string
  category: string
  goal: {
    cash: number
    inKind: string | null
  }
  raised: {
    cash: number
    inKind: string | null
  }
  documents: {
    name: string
    status: "قيد التحقق" | "تمت المصادقة" | "مرفوض"
  }[]
  updates: {
    id: number
    date: string
    content: string
  }[]
  messages: {
    id: number
    sender: string
    content: string
    date: string
  }[]
  images: string[]
}

// Pledge type definition
export type Pledge = {
  id: number
  projectId: number
  investor: string
  cash: number
  inKind: string | null
  date: string
}

// Initialize storage with default data
export const initializeStorage = () => {
  if (typeof window === "undefined") return

  // Only initialize if not already set
  if (!sessionStorage.getItem("projects")) {
    sessionStorage.setItem("projects", JSON.stringify(initialProjects))
  }

  if (!sessionStorage.getItem("pledges")) {
    sessionStorage.setItem("pledges", JSON.stringify([]))
  }
}

// Get all projects
export const getProjects = (): Project[] => {
  if (typeof window === "undefined") return []

  const projects = sessionStorage.getItem("projects")
  return projects ? JSON.parse(projects) : []
}

// Get a single project by ID
export const getProject = (id: number): Project | undefined => {
  const projects = getProjects()
  return projects.find((p) => p.id === id)
}

// Save a new project
export const saveProject = (project: Omit<Project, "id">): Project => {
  const projects = getProjects()
  const newProject = {
    ...project,
    id: projects.length > 0 ? Math.max(...projects.map((p) => p.id)) + 1 : 1,
  }

  projects.push(newProject)
  sessionStorage.setItem("projects", JSON.stringify(projects))
  return newProject
}

// Save a pledge
export const savePledge = (pledge: Omit<Pledge, "id">): Pledge => {
  const pledges = getPledges()
  const newPledge = {
    ...pledge,
    id: pledges.length > 0 ? Math.max(...pledges.map((p) => p.id)) + 1 : 1,
  }

  // Update project's raised amount
  const projects = getProjects()
  const project = projects.find((p) => p.id === pledge.projectId)

  if (project) {
    project.raised.cash += pledge.cash || 0
    if (pledge.inKind) {
      project.raised.inKind = pledge.inKind
    }
    sessionStorage.setItem("projects", JSON.stringify(projects))
  }

  // Save the pledge
  pledges.push(newPledge)
  sessionStorage.setItem("pledges", JSON.stringify(pledges))

  return newPledge
}

// Get all pledges
export const getPledges = (): Pledge[] => {
  if (typeof window === "undefined") return []

  const pledges = sessionStorage.getItem("pledges")
  return pledges ? JSON.parse(pledges) : []
}

// Get pledges for a specific project
export const getProjectPledges = (projectId: number): Pledge[] => {
  const pledges = getPledges()
  return pledges.filter((p) => p.projectId === projectId)
}

// Add a message to a project
export const addMessage = (projectId: number, message: { sender: string; content: string }) => {
  const projects = getProjects()
  const project = projects.find((p) => p.id === projectId)

  if (project) {
    const newMessage = {
      id: project.messages.length > 0 ? Math.max(...project.messages.map((m) => m.id)) + 1 : 1,
      sender: message.sender,
      content: message.content,
      date: new Date().toISOString(),
    }

    project.messages.push(newMessage)
    sessionStorage.setItem("projects", JSON.stringify(projects))
    return newMessage
  }

  return null
}

// Add an update to a project
export const addUpdate = (projectId: number, content: string) => {
  const projects = getProjects()
  const project = projects.find((p) => p.id === projectId)

  if (project) {
    const newUpdate = {
      id: project.updates.length > 0 ? Math.max(...project.updates.map((u) => u.id)) + 1 : 1,
      content,
      date: new Date().toISOString(),
    }

    project.updates.push(newUpdate)
    sessionStorage.setItem("projects", JSON.stringify(projects))
    return newUpdate
  }

  return null
}

// Initial dummy data
export const initialProjects: Project[] = [
  {
    id: 1,
    title: "مصنع عصير صغير",
    description:
      "مشروع لإنتاج عصير طبيعي بطاقة 1000 علبة يوميًا. نهدف إلى توفير منتج صحي وطبيعي للمستهلكين الجزائريين باستخدام فواكه محلية طازجة. المشروع سيوفر فرص عمل للشباب ويساهم في تنمية الاقتصاد المحلي.",
    category: "صناعة",
    goal: { cash: 7000000, inKind: "ماكينة تعبئة" },
    raised: { cash: 2500000, inKind: null },
    documents: [
      { name: "دراسة الجدوى.pdf", status: "تمت المصادقة" },
      { name: "خطة العمل.pdf", status: "قيد التحقق" },
      { name: "تراخيص.pdf", status: "تمت المصادقة" },
    ],
    updates: [
      { id: 1, date: "2023-12-15T10:30:00Z", content: "تم الانتهاء من دراسة الجدوى وإرسالها للمراجعة" },
      { id: 2, date: "2024-01-20T14:45:00Z", content: "الحصول على الموافقة المبدئية من البلدية" },
    ],
    messages: [
      {
        id: 1,
        sender: "مستثمر",
        content: "هل يمكنني الاطلاع على تفاصيل أكثر حول المعدات المطلوبة؟",
        date: "2024-01-25T09:15:00Z",
      },
      {
        id: 2,
        sender: "صاحب المشروع",
        content: "بالتأكيد، سأرسل لك قائمة مفصلة بالمعدات والمواصفات المطلوبة",
        date: "2024-01-25T11:30:00Z",
      },
    ],
    images: [
      "https://images.unsplash.com/photo-1585409787452-47a3e2698b2b?q=80&w=600&auto=format&fit=crop", // Conveyor belt with juice bottles
      "https://images.unsplash.com/photo-1628222053895-a351c4fdadca?q=80&w=600&auto=format&fit=crop", // Fresh oranges being juiced
      "https://images.unsplash.com/photo-1633421838023-2bd7b090bbef?q=80&w=600&auto=format&fit=crop", // Juice production line with equipment
    ],
  },
  {
    id: 2,
    title: "تطبيق توصيل طلبات",
    description:
      "تطبيق للهواتف الذكية يربط بين المطاعم المحلية والزبائن لتوصيل الطعام. يهدف المشروع إلى تسهيل عملية طلب الطعام وتوصيله للمنازل في المدن الجزائرية، مع التركيز على المطاعم الصغيرة والمتوسطة.",
    category: "تكنولوجيا",
    goal: { cash: 5000000, inKind: null },
    raised: { cash: 3000000, inKind: null },
    documents: [
      { name: "خطة التسويق.pdf", status: "تمت المصادقة" },
      { name: "نموذج أولي.pdf", status: "تمت المصادقة" },
    ],
    updates: [
      { id: 1, date: "2024-01-10T08:20:00Z", content: "تم الانتهاء من تصميم واجهة المستخدم" },
      { id: 2, date: "2024-02-05T16:30:00Z", content: "بدء اختبار النسخة التجريبية مع عدد محدود من المطاعم" },
    ],
    messages: [
      { id: 1, sender: "مستثمر", content: "ما هي خطتكم للتوسع في باقي المدن؟", date: "2024-02-10T13:45:00Z" },
      {
        id: 2,
        sender: "صاحب المشروع",
        content: "نخطط للبدء في العاصمة ثم التوسع تدريجياً للمدن الكبرى خلال السنة الأولى",
        date: "2024-02-10T15:20:00Z",
      },
    ],
    images: [
      "https://images.unsplash.com/photo-1565299624946-baccd3057191?q=80&w=600&auto=format&fit=crop", // Delivery bag with food
      "https://images.unsplash.com/photo-1519710164238-8b853e26808f?q=80&w=600&auto=format&fit=crop", // Food delivery app on smartphone
    ],
  },
  {
    id: 3,
    title: "مزرعة عضوية",
    description:
      "مشروع لإنشاء مزرعة للخضروات العضوية في منطقة تيبازة. يهدف المشروع إلى إنتاج خضروات عالية الجودة خالية من المبيدات والأسمدة الكيميائية، وتوفيرها للمستهلكين مباشرة عبر نظام اشتراك أسبوعي.",
    category: "زراعة",
    goal: { cash: 4000000, inKind: "أرض زراعية" },
    raised: { cash: 1000000, inKind: null },
    documents: [
      { name: "خطة الزراعة.pdf", status: "قيد التحقق" },
      { name: "دراسة التربة.pdf", status: "تمت المصادقة" },
    ],
    updates: [{ id: 1, date: "2024-01-05T11:15:00Z", content: "الانتهاء من دراسة التربة والمناخ في الموقع المقترح" }],
    messages: [
      { id: 1, sender: "مستثمر", content: "هل تفكرون في إضافة تربية النحل للمشروع؟", date: "2024-02-15T10:30:00Z" },
      {
        id: 2,
        sender: "صاحب المشروع",
        content: "فكرة ممتازة! نعم، نخطط لإضافة ذلك في المرحلة الثانية من المشروع",
        date: "2024-02-15T14:10:00Z",
      },
    ],
    images: [
      "https://images.unsplash.com/photo-1500595046743-cd271d6942f3?q=80&w=600&auto=format&fit=crop", // Organic vegetables in field
      "https://images.unsplash.com/photo-1508948956644-00136e3d5d75?q=80&w=600&auto=format&fit=crop", // Freshly harvested produce
      "https://images.unsplash.com/photo-1542601098-8fc114e148e2?q=80&w=600&auto=format&fit=crop", // Farmer in organic field
    ],
  },
];

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("ar-DZ", {
    style: "currency",
    currency: "DZD",
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("ar-DZ", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function calculateProgress(raised: number, goal: number): number {
  return Math.min(Math.round((raised / goal) * 100), 100)
}

