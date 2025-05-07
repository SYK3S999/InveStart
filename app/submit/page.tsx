"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { initializeStorage, saveProject } from "@/lib/storage";
import { Check, FileUp, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";

type ProjectFormData = {
  title: string;
  description: string;
  category: string;
  cashGoal: number;
  inKindGoal: string;
  documents: { name: string; status: "قيد التحقق" }[];
  images: string[];
};

export default function SubmitProjectPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<ProjectFormData>({
    title: "",
    description: "",
    category: "",
    cashGoal: 0,
    inKindGoal: "",
    documents: [],
    images: [],
  });
  const [documentName, setDocumentName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    initializeStorage();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === "cashGoal" ? Number(value) : value }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }));
  };

  const handleAddDocument = () => {
    if (!documentName.trim()) return;
    setFormData((prev) => ({
      ...prev,
      documents: [...prev.documents, { name: documentName.endsWith(".pdf") ? documentName : `${documentName}.pdf`, status: "قيد التحقق" }],
    }));
    setDocumentName("");
  };

  const handleRemoveDocument = (index: number) => {
    setFormData((prev) => ({ ...prev, documents: prev.documents.filter((_, i) => i !== index) }));
  };

  const handleAddImage = () => {
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, `/placeholder.svg?height=400&width=600&text=صورة_${prev.images.length + 1}`],
    }));
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const project = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      goal: { cash: formData.cashGoal, inKind: formData.inKindGoal || null },
      raised: { cash: 0, inKind: null },
      documents: formData.documents,
      updates: [],
      messages: [],
      images: formData.images.length > 0 ? formData.images : ["/placeholder.svg?height=400&width=600"],
    };

    saveProject(project);
    setTimeout(() => router.push("/dashboard"), 1000);
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.title.trim() !== "" && formData.description.trim() !== "" && formData.category !== "";
      case 2:
        return formData.cashGoal > 0;
      case 3:
      case 4:
        return true;
      default:
        return false;
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <div className="flex flex-col min-h-screen font-amiri bg-gradient-to-b from-white to-cream text-primary-900">
      <Navbar />
      <main className="flex-1 py-12 md:py-24 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-10 right-10 w-64 h-64 rounded-full border-4 border-dashed border-primary-200/30 opacity-50"></div>
          <div className="absolute bottom-20 left-20 w-32 h-32 rounded-full border-2 border-primary-300/20"></div>
          <div className="absolute top-1/3 left-1/3 w-16 h-16 rotate-45 border-2 border-primary-200/30"></div>
          <div className="absolute bottom-1/4 right-1/4 w-24 h-24 border-2 border-primary-200/30 rounded-lg rotate-12"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl relative z-10">
          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-primary-500 mb-10 md:mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            قدّم مشروعك
          </motion.h1>

          {/* Stepper */}
          <div className="flex items-center justify-between mb-10 md:mb-12">
            {[
              ["تفاصيل المشروع", 1],
              ["التمويل", 2],
              ["الوثائق والصور", 3],
              ["المعاينة", 4],
            ].map(([label, stepNum], index) => (
              <div key={index} className="flex flex-col items-center">
                <motion.div
                  className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-sm md:text-base font-semibold mb-2 ${
                    step >= Number(stepNum) ? "bg-primary-500 text-white" : "bg-primary-50 text-primary-500"
                  }`}
                  animate={{ scale: step === Number(stepNum) ? 1.1 : 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {step > Number(stepNum) ? <Check className="h-5 w-5" /> : stepNum}
                </motion.div>
                <span className={`text-xs md:text-sm ${step >= Number(stepNum) ? "text-primary-500" : "text-gray-600"}`}>{label}</span>
                {index < 3 && (
                  <div className={`flex-1 h-1 mx-2 md:mx-4 ${step > Number(stepNum) ? "bg-primary-400" : "bg-primary-200"} w-12 md:w-16`}></div>
                )}
              </div>
            ))}
          </div>

          <motion.div
            className="bg-white rounded-xl p-6 md:p-8 shadow-lg border border-primary-100/50"
            initial="hidden"
            animate="visible"
            variants={stepVariants}
            key={step}
          >
            <form onSubmit={handleSubmit}>
              {/* Step 1: Project Details */}
              {step === 1 && (
                <>
                  <h2 className="text-xl md:text-2xl font-bold text-primary-500 mb-6">تفاصيل المشروع</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm md:text-base font-medium text-primary-500 mb-2">عنوان المشروع</label>
                      <Input
                        type="text"
                        name="title"
                        className="w-full border-primary-200 rounded-lg focus:ring-primary-400 focus:border-primary-400"
                        value={formData.title}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm md:text-base font-medium text-primary-500 mb-2">الفئة</label>
                      <Select value={formData.category} onValueChange={handleCategoryChange} required>
                        <SelectTrigger className="w-full border-primary-200 rounded-lg focus:ring-primary-400 focus:border-primary-400">
                          <SelectValue placeholder="اختر الفئة" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="صناعة">صناعة</SelectItem>
                          <SelectItem value="تكنولوجيا">تكنولوجيا</SelectItem>
                          <SelectItem value="زراعة">زراعة</SelectItem>
                          <SelectItem value="خدمات">خدمات</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm md:text-base font-medium text-primary-500 mb-2">وصف المشروع</label>
                      <Textarea
                        name="description"
                        rows={5}
                        className="w-full border-primary-200 rounded-lg focus:ring-primary-400 focus:border-primary-400"
                        value={formData.description}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="flex justify-end mt-8">
                    <Button
                      type="button"
                      onClick={nextStep}
                      disabled={!isStepValid()}
                      className="bg-primary-500 text-white rounded-full px-6 py-3 hover:bg-primary-600 shadow-md transition-all duration-300"
                    >
                      التالي
                    </Button>
                  </div>
                </>
              )}

              {/* Step 2: Funding */}
              {step === 2 && (
                <>
                  <h2 className="text-xl md:text-2xl font-bold text-primary-500 mb-6">تفاصيل التمويل</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm md:text-base font-medium text-primary-500 mb-2">هدف التمويل النقدي (دج)</label>
                      <Input
                        type="number"
                        name="cashGoal"
                        min="0"
                        className="w-full border-primary-200 rounded-lg focus:ring-primary-400 focus:border-primary-400"
                        value={formData.cashGoal || ""}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm md:text-base font-medium text-primary-500 mb-2">هدف التمويل العيني (اختياري)</label>
                      <Input
                        type="text"
                        name="inKindGoal"
                        placeholder="مثال: معدات، أرض زراعية..."
                        className="w-full border-primary-200 rounded-lg focus:ring-primary-400 focus:border-primary-400"
                        value={formData.inKindGoal}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between mt-8">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      className="border-primary-500 text-primary-500 rounded-full px-6 py-3 hover:bg-primary-50 transition-all duration-300"
                    >
                      السابق
                    </Button>
                    <Button
                      type="button"
                      onClick={nextStep}
                      disabled={!isStepValid()}
                      className="bg-primary-500 text-white rounded-full px-6 py-3 hover:bg-primary-600 shadow-md transition-all duration-300"
                    >
                      التالي
                    </Button>
                  </div>
                </>
              )}

              {/* Step 3: Documents and Images */}
              {step === 3 && (
                <>
                  <h2 className="text-xl md:text-2xl font-bold text-primary-500 mb-6">الوثائق والصور</h2>
                  <div className="space-y-8">
                    {/* Documents */}
                    <div>
                      <h3 className="text-lg md:text-xl font-semibold text-primary-500 mb-4">الوثائق</h3>
                      <div className="flex flex-col sm:flex-row gap-3 mb-4">
                        <Input
                          type="text"
                          placeholder="اسم الوثيقة (مثال: دراسة الجدوى)"
                          className="flex-1 border-primary-200 rounded-lg focus:ring-primary-400 focus:border-primary-400"
                          value={documentName}
                          onChange={(e) => setDocumentName(e.target.value)}
                        />
                        <Button
                          type="button"
                          onClick={handleAddDocument}
                          disabled={!documentName.trim()}
                          className="bg-primary-500 text-white rounded-full px-6 py-3 hover:bg-primary-600 transition-all duration-300"
                        >
                          إضافة
                        </Button>
                      </div>
                      {formData.documents.length > 0 ? (
                        <ul className="space-y-3">
                          {formData.documents.map((doc, index) => (
                            <motion.li
                              key={index}
                              className="flex items-center justify-between p-3 bg-primary-50 rounded-lg"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <span className="text-gray-600 text-sm md:text-base">{doc.name}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveDocument(index)}
                                className="text-primary-500 hover:text-primary-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </motion.li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-600 text-sm md:text-base">لم يتم إضافة وثائق بعد</p>
                      )}
                    </div>

                    {/* Images */}
                    <div>
                      <h3 className="text-lg md:text-xl font-semibold text-primary-500 mb-4">صور المشروع</h3>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full h-24 border-2 border-dashed border-primary-300 text-primary-500 rounded-lg flex flex-col items-center justify-center mb-4 hover:bg-primary-50 transition-all duration-300"
                        onClick={handleAddImage}
                      >
                        <FileUp className="h-6 w-6 mb-2" />
                        <span className="text-sm md:text-base">انقر لإضافة صورة</span>
                      </Button>
                      {formData.images.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                          {formData.images.map((image, index) => (
                            <motion.div
                              key={index}
                              className="relative group"
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <div className="aspect-video bg-primary-50 rounded-lg overflow-hidden shadow-lg">
                                <img src={image} alt={`صورة ${index + 1}`} className="w-full h-full object-cover" />
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="absolute top-2 left-2 bg-primary-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                onClick={() => handleRemoveImage(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between mt-8">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      className="border-primary-500 text-primary-500 rounded-full px-6 py-3 hover:bg-primary-50 transition-all duration-300"
                    >
                      السابق
                    </Button>
                    <Button
                      type="button"
                      onClick={nextStep}
                      disabled={!isStepValid()}
                      className="bg-primary-500 text-white rounded-full px-6 py-3 hover:bg-primary-600 shadow-md transition-all duration-300"
                    >
                      التالي
                    </Button>
                  </div>
                </>
              )}

              {/* Step 4: Preview */}
              {step === 4 && (
                <>
                  <h2 className="text-xl md:text-2xl font-bold text-primary-500 mb-6">معاينة المشروع</h2>
                  <div className="bg-primary-50 p-6 rounded-lg mb-8">
                    <h3 className="text-lg md:text-xl font-bold text-primary-500 mb-3">{formData.title || "عنوان المشروع"}</h3>
                    <span className="inline-block bg-primary-50 text-primary-500 px-3 py-1 rounded-full text-sm mb-4 shadow-sm">{formData.category || "الفئة"}</span>
                    <p className="text-gray-600 text-sm md:text-base mb-4">{formData.description || "وصف المشروع"}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="text-sm md:text-base font-semibold text-primary-500">هدف التمويل النقدي</h4>
                        <p className="text-gray-600">{formData.cashGoal.toLocaleString()} دج</p>
                      </div>
                      {formData.inKindGoal && (
                        <div>
                          <h4 className="text-sm md:text-base font-semibold text-primary-500">هدف التمويل العيني</h4>
                          <p className="text-gray-600">{formData.inKindGoal}</p>
                        </div>
                      )}
                    </div>
                    {formData.documents.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm md:text-base font-semibold text-primary-500 mb-2">الوثائق</h4>
                        <ul className="list-disc list-inside text-gray-600 text-sm md:text-base">
                          {formData.documents.map((doc, index) => (
                            <li key={index}>{doc.name}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {formData.images.length > 0 && (
                      <div>
                        <h4 className="text-sm md:text-base font-semibold text-primary-500 mb-2">الصور</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                          {formData.images.map((image, index) => (
                            <div key={index} className="aspect-video bg-primary-50 rounded-lg overflow-hidden shadow-lg">
                              <img src={image} alt={`صورة ${index + 1}`} className="w-full h-full object-cover" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      className="border-primary-500 text-primary-500 rounded-full px-6 py-3 hover:bg-primary-50 transition-all duration-300"
                    >
                      السابق
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-primary-500 text-white rounded-full px-6 py-3 hover:bg-primary-600 shadow-md transition-all duration-300 flex items-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                          جاري الإرسال...
                        </>
                      ) : (
                        "إرسال المشروع"
                      )}
                    </Button>
                  </div>
                </>
              )}
            </form>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}