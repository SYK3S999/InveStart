"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getProject, updateProject, type Project } from "@/lib/storage";
import {
  Save,
  X,
  Upload,
  Trash2,
  Building,
  Cpu,
  Leaf,
  Users,
  AlertCircle,
  Link,
} from "lucide-react";
import { motion } from "framer-motion";
import ProtectedRoute from "@/components/protected-route";
import toast, { Toaster } from "react-hot-toast";

// Simulated RBAC logic (consistent with ProjectDetailsPage)
const useAuth = () => {
  const user = { role: "startup", id: "user123" }; // Mock user
  return { isAuthenticated: !!user, role: user?.role || null, userId: user?.id || null };
};

export default function ProjectEditPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, role, userId } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    sector: "",
    wilaya: "",
    equipmentType: "",
    equipmentQuantity: "",
    equipmentCondition: "",
  });
  const [images, setImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [documents, setDocuments] = useState<{ name: string; status: "قيد التحقق" | "تمت المصادقة" | "مرفوض" }[]>([]);
  const [newDocuments, setNewDocuments] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  // Algerian wilayas (simplified list for demo)
  const wilayas = [
    "الجزائر",
    "وهران",
    "قسنطينة",
    "عنابة",
    "باتنة",
    "سطيف",
    "تلمسان",
    "بجاية",
    "أدرار",
    "الوادي",
  ];

  // Sectors (consistent with ProjectDetailsPage)
  const sectors = [
    "الصناعة التحويلية",
    "تكنولوجيا المعلومات",
    "الزراعة العضوية",
    "خدمات",
  ];

  useEffect(() => {
    if (!isAuthenticated || role !== "startup") {
      router.push("/login");
      return;
    }
    if (params.id) {
      const projectId = Number(params.id);
      const projectData = getProject(projectId);
      if (projectData) {
        setProject(projectData);
        setFormData({
          title: projectData.title,
          description: projectData.description,
          sector: projectData.sector,
          wilaya: projectData.wilaya || "",
          equipmentType: projectData.goal.equipment?.type || "",
          equipmentQuantity: projectData.goal.equipment?.quantity?.toString() || "",
          equipmentCondition: projectData.goal.equipment?.condition || "",
        });
        setImages(projectData.images);
        setDocuments(projectData.documents);
      } else {
        toast.error("المشروع غير موجود");
        router.push("/projects");
      }
    }
    setLoading(false);
  }, [params.id, router, isAuthenticated, role]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = "العنوان مطلوب";
    if (!formData.description.trim()) newErrors.description = "الوصف مطلوب";
    if (!formData.sector) newErrors.sector = "القطاع مطلوب";
    if (!formData.equipmentType.trim()) newErrors.equipmentType = "نوع المعدات مطلوب";
    if (!formData.equipmentQuantity || isNaN(parseInt(formData.equipmentQuantity)) || parseInt(formData.equipmentQuantity) <= 0) {
      newErrors.equipmentQuantity = "الكمية يجب أن تكون عدد صحيحي أكبر من 0";
    }
    if (!formData.equipmentCondition) newErrors.equipmentCondition = "حالة المعدات مطلوبة";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!project || !validateForm()) {
      toast("يرجى تصحيح الأخطاء في النموذج", { icon: "⚠️" });
      return;
    }

    // Simulate image and document uploads (convert files to mock URLs)
    const updatedImages = [
      ...images,
      ...newImages.map((file, index) => `/placeholder.svg?new_image_${Date.now()}_${index}`),
    ];
    const updatedDocuments = [
      ...documents,
      ...newDocuments.map((file) => ({
        id: `doc-${Date.now()}`,
        name: file.name,
        status: "قيد التحقق" as "قيد التحقق" | "تمت المصادقة" | "مرفوض",
      })),
    ];

    const updatedProject: Partial<Project> = {
      title: formData.title,
      description: formData.description,
      sector: formData.sector,
      wilaya: formData.wilaya || undefined,
      goal: {
        equipment: {
          type: formData.equipmentType,
          quantity: parseInt(formData.equipmentQuantity),
          condition: formData.equipmentCondition,
        },
      },
      images: updatedImages,
      documents: updatedDocuments,
    };

    const result = updateProject(project.id, updatedProject);
    if (result) {
      toast.success("تم تحديث المشروع بنجاح");
      router.push(`/projects/${project.id}`);
    } else {
      toast.error("فشل تحديث المشروع");
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setNewImages([...newImages, ...files]);
    }
  };

  const handleRemoveImage = (index: number) => {
    if (index < images.length) {
      setImages(images.filter((_, i) => i !== index));
    } else {
      const newImageIndex = index - images.length;
      setNewImages(newImages.filter((_, i) => i !== newImageIndex));
    }
    toast.success("تم حذف الصورة");
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setNewDocuments([...newDocuments, ...files]);
    }
  };

  const handleRemoveDocument = (index: number) => {
    setDocuments(documents.filter((_, i) => i !== index));
    toast.success("تم حذف الوثيقة");
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen font-amiri bg-gradient-to-b from-white to-cream">
        <Navbar />
        <main className="flex-1 py-12 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <div className="animate-spin w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-gray-600">جاري التحميل...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!project || !isAuthenticated || role !== "startup") {
    return null;
  }

  return (
    <ProtectedRoute allowedRoles={["startup"]}>
      <div className="flex flex-col min-h-screen font-amiri bg-gradient-to-b from-white to-cream text-primary-900">
        <Toaster position="top-right" />
        <Navbar />
        <main className="flex-1 py-12 md:py-24 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <div className="absolute top-10 right-10 w-64 h-64 rounded-full border-4 border-dashed border-primary-200/30 opacity-50"></div>
            <div className="absolute bottom-20 left-20 w-32 h-32 rounded-full border-2 border-primary-300/20"></div>
            <div className="absolute top-1/3 left-1/3 w-16 h-16 rotate-45 border-2 border-primary-200/30"></div>
            <div className="absolute bottom-1/4 right-1/4 w-24 h-24 border-2 border-primary-200/30 rounded-lg rotate-12"></div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl relative z-10">
            <motion.div
              className="bg-white rounded-xl shadow-lg overflow-hidden border border-primary-100/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="p-6 md:p-8 border-b border-primary-200">
                <h1 className="text-2xl md:text-3xl font-bold text-primary-500 mb-4">تعديل المشروع: {project.title}</h1>
                <p className="text-gray-600 text-sm md:text-base">قم بتحديث تفاصيل المشروع أدناه. تأكد من ملء جميع الحقول المطلوبة.</p>
              </div>

              <div className="p-6 md:p-8">
                <div className="space-y-6">
                  {/* Title */}
                  <div>
                    <label className="block text-sm md:text-base font-medium text-primary-600 mb-1">عنوان المشروع <span className="text-red-500">*</span></label>
                    <Input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full border border-primary-200 rounded-lg px-4 py-2 bg-white text-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-400"
                      placeholder="أدخل عنوان المشروع"
                      aria-label="عنوان المشروع"
                    />
                    {errors.title && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.title}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm md:text-base font-medium text-primary-600 mb-1">وصف المشروع <span className="text-red-500">*</span></label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full border border-primary-200 rounded-lg px-4 py-2 bg-white text-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-400 min-h-[100px]"
                      placeholder="أدخل وصف المشروع"
                      aria-label="وصف المشروع"
                    />
                    {errors.description && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.description}
                      </p>
                    )}
                  </div>

                  {/* Sector */}
                  <div>
                    <label className="block text-sm md:text-base font-medium text-primary-600 mb-1">القطاع <span className="text-red-500">*</span></label>
                    <select
                      value={formData.sector}
                      onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                      className="w-full border border-primary-200 rounded-lg px-4 py-2 bg-white text-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-400"
                      aria-label="القطاع"
                    >
                      <option value="">اختر القطاع</option>
                      {sectors.map((sector) => (
                        <option key={sector} value={sector}>{sector}</option>
                      ))}
                    </select>
                    {errors.sector && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.sector}
                      </p>
                    )}
                  </div>

                  {/* Wilaya */}
                  <div>
                    <label className="block text-sm md:text-base font-medium text-primary-600 mb-1">الولاية</label>
                    <select
                      value={formData.wilaya}
                      onChange={(e) => setFormData({ ...formData, wilaya: e.target.value })}
                      className="w-full border border-primary-200 rounded-lg px-4 py-2 bg-white text-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-400"
                      aria-label="الولاية"
                    >
                      <option value="">اختر الولاية</option>
                      {wilayas.map((wilaya) => (
                        <option key={wilaya} value={wilaya}>{wilaya}</option>
                      ))}
                    </select>
                  </div>

                  {/* Equipment Needs */}
                  <div className="border-t border-primary-200 pt-6">
                    <h3 className="text-lg font-bold text-primary-600 mb-4">المعدات المطلوبة <span className="text-red-500">*</span></h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm md:text-base font-medium text-primary-600 mb-1">نوع المعدات</label>
                        <Input
                          type="text"
                          value={formData.equipmentType}
                          onChange={(e) => setFormData({ ...formData, equipmentType: e.target.value })}
                          className="w-full border border-primary-200 rounded-lg px-4 py-2 bg-white text-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-400"
                          placeholder="مثال: ماكينة تعبئة"
                          aria-label="نوع المعدات"
                        />
                        {errors.equipmentType && (
                          <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle className="h-4 w-4" />
                            {errors.equipmentType}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm md:text-base font-medium text-primary-600 mb-1">الكمية</label>
                        <Input
                          type="number"
                          value={formData.equipmentQuantity}
                          onChange={(e) => setFormData({ ...formData, equipmentQuantity: e.target.value })}
                          className="w-full border border-primary-200 rounded-lg px-4 py-2 bg-white text-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-400"
                          placeholder="مثال: 2"
                          min="1"
                          aria-label="كمية المعدات"
                        />
                        {errors.equipmentQuantity && (
                          <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle className="h-4 w-4" />
                            {errors.equipmentQuantity}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm md:text-base font-medium text-primary-600 mb-1">الحالة</label>
                        <select
                          value={formData.equipmentCondition}
                          onChange={(e) => setFormData({ ...formData, equipmentCondition: e.target.value })}
                          className="w-full border border-primary-200 rounded-lg px-4 py-2 bg-white text-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-400"
                          aria-label="حالة المعدات"
                        >
                          <option value="">اختر الحالة</option>
                          <option value="جديد">جديد</option>
                          <option value="مستعمل بحالة جيدة">مستعمل بحالة جيدة</option>
                        </select>
                        {errors.equipmentCondition && (
                          <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle className="h-4 w-4" />
                            {errors.equipmentCondition}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Images */}
                  <div className="border-t border-primary-200 pt-6">
                    <h3 className="text-lg font-bold text-primary-600 mb-4">الصور</h3>
                    <div className="mb-4">
                      <label className="block text-sm md:text-base font-medium text-primary-600 mb-1">إضافة صور جديدة</label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageUpload}
                          className="w-full border border-primary-200 rounded-lg px-4 py-2 bg-white text-primary-900"
                          aria-label="إضافة صور"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1 bg-primary-50 hover:bg-primary-100"
                        >
                          <Upload className="h-4 w-4" />
                          رفع
                        </Button>
                      </div>
                    </div>
                    {(images.length > 0 || newImages.length > 0) && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {images.map((image, index) => (
                          <div key={`existing-${index}`} className="relative h-32 rounded-lg overflow-hidden border border-primary-200">
                            <Image
                              src={image}
                              alt={`صورة المشروع ${index + 1}`}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 50vw, 33vw"
                            />
                            <Button
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-600 rounded-full"
                              onClick={() => handleRemoveImage(index)}
                              aria-label={`حذف الصورة ${index + 1}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        {newImages.map((file, index) => (
                          <div key={`new-${index}`} className="relative h-32 rounded-lg overflow-hidden border border-primary-200">
                            <Image
                              src={URL.createObjectURL(file)}
                              alt={`صورة جديدة ${index + 1}`}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 50vw, 33vw"
                            />
                            <Button
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-600 rounded-full"
                              onClick={() => handleRemoveImage(images.length + index)}
                              aria-label={`حذف الصورة الجديدة ${index + 1}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Documents */}
                  <div className="border-t border-primary-200 pt-6">
                    <h3 className="text-lg font-bold text-primary-600 mb-4">الوثائق</h3>
                    <div className="mb-4">
                      <label className="block text-sm md:text-base font-medium text-primary-600 mb-1">إضافة وثائق جديدة</label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          multiple
                          onChange={handleDocumentUpload}
                          className="w-full border border-primary-200 rounded-lg px-4 py-2 bg-white text-primary-900"
                          aria-label="إضافة وثائق"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1 bg-primary-50 hover:bg-primary-100"
                        >
                          <Upload className="h-4 w-4" />
                          رفع
                        </Button>
                      </div>
                    </div>
                    {documents.length > 0 && (
                      <ul className="space-y-3">
                        {documents.map((doc, index) => (
                          <motion.li
                            key={index}
                            className="flex items-center justify-between p-4 bg-primary-50 rounded-lg border border-primary-200"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <span className="text-sm text-gray-600">{doc.name}</span>
                            <Button
                              variant="destructive"
                              size="sm"
                              className="flex items-center gap-1 bg-red-500 hover:bg-red-600"
                              onClick={() => handleRemoveDocument(index)}
                              aria-label={`حذف الوثيقة ${doc.name}`}
                            >
                              <Trash2 className="h-4 w-4" />
                              حذف
                            </Button>
                          </motion.li>
                        ))}
                      </ul>
                    )}
                    {newDocuments.length > 0 && (
                      <ul className="space-y-3 mt-4">
                        {newDocuments.map((file, index) => (
                          <motion.li
                            key={`new-${index}`}
                            className="flex items-center justify-between p-4 bg-primary-50 rounded-lg border border-primary-200"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <span className="text-sm text-gray-600">{file.name}</span>
                            <Button
                              variant="destructive"
                              size="sm"
                              className="flex items-center gap-1 bg-red-500 hover:bg-red-600"
                              onClick={() => setNewDocuments(newDocuments.filter((_, i) => i !== index))}
                              aria-label={`حذف الوثيقة الجديدة ${file.name}`}
                            >
                              <Trash2 className="h-4 w-4" />
                              حذف
                            </Button>
                          </motion.li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 mt-6">
                    <Button
                      onClick={handleSubmit}
                      className="flex-1 bg-primary-500 text-white rounded-full py-3 hover:bg-primary-600 shadow-md transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      حفظ التعديلات
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="flex-1 border-primary-200 rounded-full py-3 hover:bg-gray-100 flex items-center justify-center gap-2"
                    >
                      <Link href={`/projects/${project.id}`}>
                        <X className="h-4 w-4" />
                        إلغاء
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
