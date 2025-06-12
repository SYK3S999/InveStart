export type Project = {
  status: string;
  id: number;
  title: string;
  description: string;
  category: string;
  wilaya: string;
  sector: string;
  equipmentType: string | null;
  goal: {
    equipment: { type: string; quantity: number; condition: string } | null;
  };
  raised: {
    equipment: { type: string; quantity: number; condition: string } | null;
  };
  blockchainVerified: boolean;
  documents: {
    name: string;
    status: "قيد التحقق" | "تمت المصادقة" | "مرفوض";
  }[];
  updates: {
    id: number;
    date: string;
    content: string;
  }[];
  messages: {
    id: number;
    sender: string;
    content: string;
    date: string;
  }[];
  images: string[];
};

// Pledge type definition
export type Pledge = {
  id: number;
  projectId: number;
  sponsor: string;
  equipment: { type: string; quantity: number; condition: string } | null;
  date: string;
};

// Initialize storage with default data
export const initializeStorage = () => {
  if (typeof window === "undefined") return;

  // Only initialize if not already set
  if (!sessionStorage.getItem("projects")) {
    sessionStorage.setItem("projects", JSON.stringify(initialProjects));
  }

  if (!sessionStorage.getItem("pledges")) {
    sessionStorage.setItem("pledges", JSON.stringify([]));
  }
};

// Get all projects
export const getProjects = (): Project[] => {
  if (typeof window === "undefined") return [];

  const projects = sessionStorage.getItem("projects");
  return projects ? JSON.parse(projects) : [];
};

// Get a single project by ID
export const getProject = (id: number): Project | undefined => {
  const projects = getProjects();
  return projects.find((p) => p.id === id);
};

// Save a new project
export const saveProject = (project: Omit<Project, "id">): Project => {
  const projects = getProjects();
  const newProject = {
    ...project,
    id: projects.length > 0 ? Math.max(...projects.map((p) => p.id)) + 1 : 1,
  };

  projects.push(newProject);
  sessionStorage.setItem("projects", JSON.stringify(projects));
  return newProject;
};

// Save a pledge
export const savePledge = (pledge: Omit<Pledge, "id">): Pledge => {
  const pledges = getPledges();
  const newPledge = {
    ...pledge,
    id: pledges.length > 0 ? Math.max(...pledges.map((p) => p.id)) + 1 : 1,
  };

  // Update project's raised equipment
  const projects = getProjects();
  const project = projects.find((p) => p.id === pledge.projectId);

  if (project && pledge.equipment) {
    if (!project.raised.equipment) {
      project.raised.equipment = { ...pledge.equipment };
    } else if (project.raised.equipment.type === pledge.equipment.type) {
      project.raised.equipment.quantity += pledge.equipment.quantity;
    }
    sessionStorage.setItem("projects", JSON.stringify(projects));
  }

  // Save the pledge
  pledges.push(newPledge);
  sessionStorage.setItem("pledges", JSON.stringify(pledges));

  return newPledge;
};

// Get all pledges
export const getPledges = (): Pledge[] => {
  if (typeof window === "undefined") return [];

  const pledges = sessionStorage.getItem("pledges");
  return pledges ? JSON.parse(pledges) : [];
};

// Get pledges for a specific project
export const getProjectPledges = (projectId: number): Pledge[] => {
  const pledges = getPledges();
  return pledges.filter((p) => p.projectId === projectId);
};

// Add a message to a project
export const addMessage = (projectId: number, message: { sender: string; content: string }) => {
  const projects = getProjects();
  const project = projects.find((p) => p.id === projectId);

  if (project) {
    const newMessage = {
      id: project.messages.length > 0 ? Math.max(...project.messages.map((m) => m.id)) + 1 : 1,
      sender: message.sender,
      content: message.content,
      date: new Date().toISOString(),
    };

    project.messages.push(newMessage);
    sessionStorage.setItem("projects", JSON.stringify(projects));
    return newMessage;
  }

  return null;
};

// Add an update to a project
export const addUpdate = (projectId: number, content: string) => {
  const projects = getProjects();
  const project = projects.find((p) => p.id === projectId);

  if (project) {
    const newUpdate = {
      id: project.updates.length > 0 ? Math.max(...project.updates.map((u) => u.id)) + 1 : 10,
      content,
      date: new Date().toISOString(),
    };

    project.updates.push(newUpdate);
    sessionStorage.setItem("projects", JSON.stringify(projects));
    return newUpdate;
  }

  return null;
};

// Initial dummy data
export const initialProjects: Project[] = [
  {
    status: "available",
    id: 1,
    title: "تزويد معدات لمصنع عصير صغير",
    description:
      "مشروع لإنتاج عصير طبيعي بطاقة 1000 علية يوميًا. نحتاج إلى معدات تعبئة لتوفير منتج صحي باستخدام فواكه محلية. المشروع سيوفر فرص عمل ويساهم في تنمية الاقتصاد المحلي.",
    category: "صناعة",
    wilaya: "40",
    sector: "الصناعة التحويلية",
    equipmentType: "ماكينة تعبئة",
    goal: { equipment: { type: "ماكينة تعبئة", quantity: 5, condition: "جديد" } },
    raised: { equipment: { type: "ماكينة تعبئة", quantity: 2, condition: "جديد" } },
    blockchainVerified: true,
    documents: [
      { name: "دراسة الجدوى.pdf", status: "تمت المصادقة" },
      { name: "خطة العمل.pdf", status: "قيد التحقق" },
      { name: "تراخيص.pdf", status: "تمت المصادقة" },
    ],
    updates: [
      { id: 1, date: "2023-12-15T10:30:00Z", content: "تم الانتهاء من دراسة الجدوى وإرسالها للمراجعة" },
      { id: 2, date: "2024-01-20T14:45:00Z", content: "تزويد ماكينتين تعبئة جديدتين" },
    ],
    messages: [
      {
        id: 1,
        sender: "راعي المواد",
        content: "هل يمكنني الاطلاع على مواصفات ماكينات التعبئة المطلوبة؟",
        date: "2024-01-25T09:15:00Z",
      },
      {
        id: 2,
        sender: "صاحب المشروع",
        content: "بالطبع، سأرسل قائمة مفصلة بالمواصفات",
        date: "2024-01-25T11:30:00Z",
      },
    ],
    images: [
      "/assets/juice1.jpg",
      "/assets/juice2.jpg",
      "/assets/juice3.jpg",
    ],
  },
  {
    status: "available",
    id: 2,
    title: "تزويد معدات لتطبيق توصيل طلبات",
    description:
      "تطبيق لتوصيل الطعام يربط المطاعم بالزبائن. نحتاج إلى خوادم وأجهزة حاسوب لتطوير التطبيق وتشغيله بكفاءة، مع التركيز على دعم المطاعم الصغيرة.",
    category: "تكنولوجيا",
    wilaya: "31",
    sector: "تكنولوجيا المعلومات",
    equipmentType: "خوادم وأجهزة حاسوب",
    goal: { equipment: { type: "خوادم وأجهزة حاسوب", quantity: 10, condition: "جديد" } },
    raised: { equipment: { type: "خوادم وأجهزة حاسوب", quantity: 6, condition: "جديد" } },
    blockchainVerified: false,
    documents: [
      { name: "خطة التسويق.pdf", status: "تمت المصادقة" },
      { name: "نموذج أولي.pdf", status: "تمت المصادقة" },
    ],
    updates: [
      { id: 1, date: "2024-01-10T08:20:00Z", content: "تم الانتهاء من تصميم واجهة المستخدم" },
      { id: 2, date: "2024-02-05T16:30:00Z", content: "تزويد 3 خوادم جديدة" },
    ],
    messages: [
      { id: 1, sender: "راعي المواد", content: "ما هي مواصفات الخوادم المطلوبة؟", date: "2024-02-10T13:45:00Z" },
      {
        id: 2,
        sender: "صاحب المشروع",
        content: "نحتاج خوادم بمعالجات حديثة وذاكرة عالية، سأرسل التفاصيل",
        date: "2024-02-10T15:20:00Z",
      },
    ],
    images: [
      "/assets/del2.webp",
      "/assets/del3.webp",
    ],
  },
  {
    status: "available",
    id: 3,
    title: "تزويد معدات لمزرعة عضوية",
    description:
      "مزرعة للخضروات العضوية في تيبازة. نحتاج إلى جرارات وأدوات زراعية لإنتاج خضروات خالية من المبيدات، مع توزيعها عبر اشتراك أسبوعي.",
    category: "زراعة",
    wilaya: "42",
    sector: "الزراعة العضوية",
    equipmentType: "جرارات وأدوات زراعية",
    goal: { equipment: { type: "جرارات وأدوات زراعية", quantity: 3, condition: "جديد أو مستعمل بحالة جيدة" } },
    raised: { equipment: null },
    blockchainVerified: false,
    documents: [
      { name: "خطة الزراعة.pdf", status: "قيد التحقق" },
      { name: "دراسة التربة.pdf", status: "تمت المصادقة" },
    ],
    updates: [
      {
        id: 1,
        date: "2024-01-05T11:15:00Z",
        content: "الانتهاء من دراسة التربة والمناخ في الموقع المقترح",
      },
    ],
    messages: [
      { id: 1, sender: "راعي المواد", content: "هل تحتاجون إلى أدوات ري بالتنقيط؟", date: "2024-02-15T10:30:00Z" },
      {
        id: 2,
        sender: "صاحب المشروع",
        content: "نعم، سنضيفها إلى قائمة المعدات في المرحلة القادمة",
        date: "2024-02-15T14:10:00Z",
      },
    ],
    images: [
      "/assets/farm1.jpg",
      "/assets/farm2.jpg",
      "/assets/farm3.jpg",
    ],
  },
];
// storage.ts (suggested addition)
export function updateProject(projectId: number, updatedData: Partial<Project>): Project | null {
  const projects = JSON.parse(localStorage.getItem("projects") || "[]");
  const projectIndex = projects.findIndex((p: Project) => p.id === projectId);
  if (projectIndex === -1) return null;
  projects[projectIndex] = { ...projects[projectIndex], ...updatedData };
  localStorage.setItem("projects", JSON.stringify(projects));
  return projects[projectIndex];
}

// Utility functions
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("ar-DZ", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function calculateProgress(
  raised: { type: string; quantity: number; condition: string } | null,
  goal: { type: string; quantity: number; condition: string } | null,
): number {
  if (!raised || !goal || raised.type !== goal.type) return 0;
  return Math.min(Math.round((raised.quantity / goal.quantity) * 100), 100);
}
