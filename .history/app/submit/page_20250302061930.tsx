"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { initializeStorage, saveProject } from "@/lib/storage"
import { Check, FileUp, Trash2 } from "lucide-react"

type ProjectFormData = {
  title: string
  description: string
  category: string
  cashGoal: number
  inKindGoal: string
  documents: { name: string; status: "قيد التحقق" }[]
  images: string[]
}

export default function SubmitProjectPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<ProjectFormData>({
    title: "",
    description: "",
    category: "",
    cashGoal: 0,
    inKindGoal: "",
    documents: [],
    images: [],
  })
  const [documentName, setDocumentName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // Initialize sessionStorage with default data
    initializeStorage()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAddDocument = () => {
    if (!documentName.trim()) return

    setFormData((prev) => ({
      ...prev,
      documents: [...prev.documents, { name: documentName, status: "قيد التحقق" }],
    }))

    setDocumentName("")
  }

  const handleRemoveDocument = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index),
    }))
  }

  const handleAddImage = () => {
    // In a real app, this would handle file uploads
    // For this demo, we'll add a placeholder image
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, `/placeholder.svg?height=400&width=600&text=صورة_${prev.images.length + 1}`],
    }))
  }

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Create project object
    const project = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      goal: {
        cash: formData.cashGoal,
        inKind: formData.inKindGoal || null,
      },
      raised: {
        cash: 0,
        inKind: null,
      },
      documents: formData.documents,
      updates: [],
      messages: [],
      images: formData.images.length > 0 ? formData.images : ["/placeholder.svg?height=400&width=600"],
    }

    // Save project to sessionStorage
    const savedProject = saveProject(project)

    // Redirect to dashboard
    setTimeout(() => {
      router.push("/dashboard")
    }, 1000)
  }

  const nextStep = () => {
    setStep((prev) => prev + 1)
  }

  const prevStep = () => {
    setStep((prev) => prev - 1)
  }

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.title.trim() !== "" && formData.description.trim() !== "" && formData.category !== ""
      case 2:
        return formData.cashGoal > 0
      case 3:
        return true
      default:
        return false
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-3xl font-bold mb-8 text-center">قدّم مشروعك</h1>

          {/* Stepper */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className={`flex flex-col items-center ${step >= 1 ? "text-blue-600" : "text-gray-400"}`}>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                    step >= 1 ? "bg-blue text-white" : "bg-gray-200"
                  }`}
                >
                  {step > 1 ? <Check className="h-6 w-6" /> : 1}
                </div>
                <span className="text-sm">تفاصيل المشروع</span>
              </div>

              <div className={`flex-1 h-1 mx-2 ${step >= 2 ? "bg-blue" : "bg-gray-200"}`}></div>

              <div className={`flex flex-col items-center ${step >= 2 ? "text-blue-600" : "text-gray-400"}`}>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                    step >= 2 ? "bg-blue text-white" : "bg-gray-200"
                  }`}
                >
                  {step > 2 ? <Check className="h-6 w-6" /> : 2}
                </div>
                <span className="text-sm">التمويل</span>
              </div>

              <div className={`flex-1 h-1 mx-2 ${step >= 3 ? "bg-blue" : "bg-gray-200"}`}></div>

              <div className={`flex flex-col items-center ${step >= 3 ? "text-blue-600" : "text-gray-400"}`}>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                    step >= 3 ? "bg-blue text-white" : "bg-gray-200"
                  }`}
                >
                  {step > 3 ? <Check className="h-6 w-6" /> : 3}
                </div>
                <span className="text-sm">الوثائق والصور</span>
              </div>

              <div className={`flex-1 h-1 mx-2 ${step >= 4 ? "bg-blue" : "bg-gray-200"}`}></div>

              <div className={`flex flex-col items-center ${step >= 4 ? "text-blue-600" : "text-gray-400"}`}>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                    step >= 4 ? "bg-blue text-white" : "bg-gray-200"
                  }`}
                >
                  4
                </div>
                <span className="text-sm">المعاينة</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <form onSubmit={handleSubmit}>
              {/* Step 1: Project Details */}
              {step === 1 && (
                <div className="animate-fade-in">
                  <h2 className="text-xl font-bold mb-6">تفاصيل المشروع</h2>

                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">عنوان المشروع</label>
                    <input
                      type="text"
                      name="title"
                      className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue"
                      value={formData.title}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">الفئة</label>
                    <select
                      name="category"
                      className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue"
                      value={formData.category}
                      onChange={handleChange}
                      required
                    >
                      <option value="">اختر الفئة</option>
                      <option value="صناعة">صناعة</option>
                      <option value="تكنولوجيا">تكنولوجيا</option>
                      <option value="زراعة">زراعة</option>
                      <option value="خدمات">خدمات</option>
                    </select>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-1">وصف المشروع</label>
                    <textarea
                      name="description"
                      rows={5}
                      className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue"
                      value={formData.description}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>

                  <div className="flex justify-end">
                    <Button type="button" onClick={nextStep} disabled={!isStepValid()}>
                      التالي
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 2: Funding */}
              {step === 2 && (
                <div className="animate-fade-in">
                  <h2 className="text-xl font-bold mb-6">تفاصيل التمويل</h2>

                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">هدف التمويل النقدي (دج)</label>
                    <input
                      type="number"
                      name="cashGoal"
                      min="0"
                      className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue"
                      value={formData.cashGoal || ""}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-1">هدف التمويل العيني (اختياري)</label>
                    <input
                      type="text"
                      name="inKindGoal"
                      placeholder="مثال: ماكينة تعبئة، أرض زراعية، معدات..."
                      className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue"
                      value={formData.inKindGoal}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={prevStep}>
                      السابق
                    </Button>
                    <Button type="button" onClick={nextStep} disabled={!isStepValid()}>
                      التالي
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Documents and Images */}
              {step === 3 && (
                <div className="animate-fade-in">
                  <h2 className="text-xl font-bold mb-6">الوثائق والصور</h2>

                  {/* Documents */}
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-3">الوثائق</h3>
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        placeholder="اسم الوثيقة (مثال: دراسة الجدوى.pdf)"
                        className="flex-1 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue"
                        value={documentName}
                        onChange={(e) => setDocumentName(e.target.value)}
                      />
                      <Button type="button" onClick={handleAddDocument} disabled={!documentName.trim()}>
                        إضافة
                      </Button>
                    </div>

                    {formData.documents.length > 0 ? (
                      <ul className="space-y-2 mb-4">
                        {formData.documents.map((doc, index) => (
                          <li key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                            <span>{doc.name}</span>
                            <button
                              type="button"
                              className="text-red-500 hover:text-red-700"
                              onClick={() => handleRemoveDocument(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500 mb-4">لم تتم إضافة أي وثائق بعد</p>
                    )}
                  </div>

                  {/* Images */}
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-3">صور المشروع</h3>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-24 border-dashed flex flex-col items-center justify-center mb-3"
                      onClick={handleAddImage}
                    >
                      <FileUp className="h-6 w-6 mb-2" />
                      <span>انقر لإضافة صورة</span>
                    </Button>

                    {formData.images.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {formData.images.map((image, index) => (
                          <div key={index} className="relative group">
                            <div className="aspect-video bg-gray-100 rounded-md overflow-hidden">
                              <img
                                src={image || "/placeholder.svg"}
                                alt={`صورة ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <button
                              type="button"
                              className="absolute top-1 left-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => handleRemoveImage(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={prevStep}>
                      السابق
                    </Button>
                    <Button type="button" onClick={nextStep} disabled={!isStepValid()}>
                      التالي
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 4: Preview */}
              {step === 4 && (
                <div className="animate-fade-in">
                  <h2 className="text-xl font-bold mb-6">معاينة المشروع</h2>

                  <div className="bg-gray-50 p-4 rounded-md mb-6">
                    <h3 className="text-lg font-bold mb-2">{formData.title || "عنوان المشروع"}</h3>
                    <div className="mb-2">
                      <span className="inline-block bg-blue/20 text-blue-800 px-2 py-1 rounded-full text-sm">
                        {formData.category || "الفئة"}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-4">{formData.description || "وصف المشروع"}</p>

                    <div className="mb-4">
                      <h4 className="font-bold mb-1">هدف التمويل:</h4>
                      <p>{formData.cashGoal.toLocaleString()} دج</p>
                      {formData.inKindGoal && (
                        <p className="mt-1">
                          <span className="font-bold">التمويل العيني: </span>
                          {formData.inKindGoal}
                        </p>
                      )}
                    </div>

                    {formData.documents.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-bold mb-1">الوثائق:</h4>
                        <ul className="list-disc list-inside">
                          {formData.documents.map((doc, index) => (
                            <li key={index}>{doc.name}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {formData.images.length > 0 && (
                      <div>
                        <h4 className="font-bold mb-1">الصور:</h4>
                        <div className="grid grid-cols-3 gap-2">
                          {formData.images.map((image, index) => (
                            <div key={index} className="aspect-video bg-gray-100 rounded-md overflow-hidden">
                              <img
                                src={image || "/placeholder.svg"}
                                alt={`صورة ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={prevStep}>
                      السابق
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <span className="animate-spin mr-2 inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full"></span>
                          جاري الإرسال...
                        </>
                      ) : (
                        "إرسال المشروع"
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

