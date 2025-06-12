"use client"

import { ChangeEvent, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { motion } from "framer-motion"
import { useAuth } from "@/lib/authContext"
import { useRouter } from "next/navigation"
import {
  Upload,
  FileText,
  ImageIcon,
  DollarSign,
  Info,
  CheckCircle,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
} from "lucide-react"
import ProtectedRoute from "@/components/protected-route"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"

// Project categories
const projectCategories = [
  { id: "tech", name: "تكنولوجيا", icon: "💻" },
  { id: "agriculture", name: "زراعة", icon: "🌱" },
  { id: "industry", name: "صناعة", icon: "🏭" },
  { id: "services", name: "خدمات", icon: "🛎️" },
  { id: "education", name: "تعليم", icon: "📚" },
  { id: "health", name: "صحة", icon: "🏥" },
  { id: "food", name: "طعام", icon: "🍽️" },
  { id: "retail", name: "تجارة", icon: "🛍️" },
  { id: "other", name: "أخرى", icon: "📋" },
]

// Form steps
const formSteps = [
  { id: "basic", title: "معلومات أساسية", icon: <Info className="h-5 w-5" /> },
  { id: "financial", title: "التفاصيل المالية", icon: <DollarSign className="h-5 w-5" /> },
  { id: "media", title: "الصور والملفات", icon: <ImageIcon className="h-5 w-5" /> },
  { id: "additional", title: "معلومات إضافية", icon: <FileText className="h-5 w-5" /> },
  { id: "review", title: "مراجعة وتقديم", icon: <CheckCircle className="h-5 w-5" /> },
]

export default function SubmitProjectPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [formProgress, setFormProgress] = useState(20)

  // Form state
  const [formData, setFormData] = useState<{
    title: string
    shortDescription: string
    fullDescription: string
    category: string
    tags: string
    goalAmount: string
    minInvestment: string
    maxInvestment: string
    equity: string
    duration: string
    images: string[]
    coverImage: any
    businessPlan: any
    financialProjections: any
    teamMembers: { name: string; role: string; bio: string }[]
    milestones: { title: string; description: string; date: string }[]
    risks: string
    termsAccepted: boolean
  }>({
    title: "",
    shortDescription: "",
    fullDescription: "",
    category: "",
    tags: "",
    goalAmount: "",
    minInvestment: "",
    maxInvestment: "",
    equity: "",
    duration: "3",
    images: [],
    coverImage: null,
    businessPlan: null,
    financialProjections: null,
    teamMembers: [{ name: "", role: "", bio: "" }],
    milestones: [{ title: "", description: "", date: "" }],
    risks: "",
    termsAccepted: false,
  })

  // Handle form input changes
  const handleInputChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  // Handle file uploads
  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>, fieldName: string) => {
    if (!e.target.files || e.target.files.length === 0) {
      return
    }
    const file = e.target.files[0]
    if (file) {
      if (fieldName === "images") {
        setFormData({
          ...formData,
          images: [...formData.images, URL.createObjectURL(file)],
        })
      } else {
        setFormData({
          ...formData,
          [fieldName]: {
            name: file.name,
            size: file.size,
            type: file.type,
            url: URL.createObjectURL(file),
          },
        })
      }
    }
  }

  // Handle team members
  const handleTeamMemberChange = (index: number, field: string, value: string) => {
    const updatedTeamMembers = [...formData.teamMembers]
    updatedTeamMembers[index] = {
      ...updatedTeamMembers[index],
      [field]: value,
    }
    setFormData({ ...formData, teamMembers: updatedTeamMembers })
  }

  const addTeamMember = () => {
    setFormData({
      ...formData,
      teamMembers: [...formData.teamMembers, { name: "", role: "", bio: "" }],
    })
  }

  const removeTeamMember = (index: number) => {
    const updatedTeamMembers = [...formData.teamMembers]
    updatedTeamMembers.splice(index, 1)
    setFormData({ ...formData, teamMembers: updatedTeamMembers })
  }

  // Handle milestones
  const handleMilestoneChange = (index: number, field: string, value: string) => {
    const updatedMilestones = [...formData.milestones]
    updatedMilestones[index] = {
      ...updatedMilestones[index],
      [field]: value,
    }
    setFormData({ ...formData, milestones: updatedMilestones })
  }

  const addMilestone = () => {
    setFormData({
      ...formData,
      milestones: [...formData.milestones, { title: "", description: "", date: "" }],
    })
  }

  const removeMilestone = (index: number) => {
    const updatedMilestones = [...formData.milestones]
    updatedMilestones.splice(index, 1)
    setFormData({ ...formData, milestones: updatedMilestones })
  }

  // Handle form submission
  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError("")

    try {
      // Prepare the data to match Omit<Project, "id">
      // Adjust the property names/types as per your Project interface
      const projectToSubmit = {
        title: formData.title,
        description: formData.fullDescription,
        category: formData.category,
        goal: Number(formData.goalAmount),
        equity: Number(formData.equity),
        duration: Number(formData.duration),
        minInvestment: formData.minInvestment ? Number(formData.minInvestment) : undefined,
        maxInvestment: formData.maxInvestment ? Number(formData.maxInvestment) : undefined,
        tags: formData.tags,
        images: formData.images,
        coverImage: formData.coverImage,
        businessPlan: formData.businessPlan,
        financialProjections: formData.financialProjections,
        teamMembers: formData.teamMembers,
        milestones: formData.milestones,
        risks: formData.risks,
        // Add any other required fields from Project except "id"
      }

      // In a real app, you would send the projectToSubmit to an API
      await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate API call

      // Simulate successful submission
      setSubmitSuccess(true)

      // Redirect to the user's projects page after a delay
      setTimeout(() => {
        router.push("/projects/my")
      }, 3000)
    } catch (error) {
      console.error("Error submitting project:", error)
      setSubmitError("حدث خطأ أثناء تقديم المشروع. يرجى المحاولة مرة أخرى.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Navigate between form steps
  const nextStep = () => {
    if (currentStep < formSteps.length - 1) {
      setCurrentStep(currentStep + 1)
      setFormProgress(Math.min(100, (currentStep + 2) * (100 / formSteps.length)))
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      setFormProgress(Math.max(20, currentStep * (100 / formSteps.length)))
    }
  }

  // Validate current step
  const validateCurrentStep = () => {
    switch (currentStep) {
      case 0: // Basic info
        return formData.title && formData.shortDescription && formData.category
      case 1: // Financial details
        return formData.goalAmount && formData.equity && formData.duration
      case 2: // Media
        return true // Optional step
      case 3: // Additional info
        return formData.teamMembers.length > 0 && formData.teamMembers[0].name
      case 4: // Review
        return formData.termsAccepted
      default:
        return true
    }
  }

  // Render form steps
  const renderFormStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="title" className="block text-lg font-medium mb-2">
                عنوان المشروع <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="أدخل عنوان المشروع"
                className="w-full"
                required
              />
            </div>

            <div>
              <Label htmlFor="shortDescription" className="block text-lg font-medium mb-2">
                وصف مختصر <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="shortDescription"
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleInputChange}
                placeholder="وصف مختصر للمشروع (لا يتجاوز 200 حرف)"
                className="w-full h-20"
                maxLength={200}
                required
              />
              <p className="text-sm text-gray-500 mt-1">{formData.shortDescription.length}/200 حرف</p>
            </div>

            <div>
              <Label htmlFor="fullDescription" className="block text-lg font-medium mb-2">
                الوصف الكامل
              </Label>
              <Textarea
                id="fullDescription"
                name="fullDescription"
                value={formData.fullDescription}
                onChange={handleInputChange}
                placeholder="اشرح مشروعك بالتفصيل"
                className="w-full h-32"
              />
            </div>

            <div>
              <Label className="block text-lg font-medium mb-2">
                فئة المشروع <span className="text-red-500">*</span>
              </Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {projectCategories.map((category) => (
                  <div
                    key={category.id}
                    className={`border rounded-lg p-3 cursor-pointer transition-all ${
                      formData.category === category.id
                        ? "border-primary-500 bg-primary-50"
                        : "border-gray-200 hover:border-primary-300"
                    }`}
                    onClick={() => setFormData({ ...formData, category: category.id })}
                  >
                    <div className="flex items-center">
                      <span className="text-xl ml-2">{category.icon}</span>
                      <span>{category.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="tags" className="block text-lg font-medium mb-2">
                الكلمات المفتاحية
              </Label>
              <Input
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="أدخل الكلمات المفتاحية مفصولة بفواصل"
                className="w-full"
              />
              <p className="text-sm text-gray-500 mt-1">مثال: تكنولوجيا، تطبيق جوال، صحة</p>
            </div>
          </div>
        )

      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="goalAmount" className="block text-lg font-medium mb-2">
                المبلغ المستهدف (دج) <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <DollarSign className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <Input
                  id="goalAmount"
                  name="goalAmount"
                  type="number"
                  value={formData.goalAmount}
                  onChange={handleInputChange}
                  placeholder="أدخل المبلغ المستهدف"
                  className="w-full pr-10"
                  min="1000"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="minInvestment" className="block text-lg font-medium mb-2">
                  الحد الأدنى للاستثمار (دج)
                </Label>
                <div className="relative">
                  <DollarSign className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  <Input
                    id="minInvestment"
                    name="minInvestment"
                    type="number"
                    value={formData.minInvestment}
                    onChange={handleInputChange}
                    placeholder="الحد الأدنى"
                    className="w-full pr-10"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="maxInvestment" className="block text-lg font-medium mb-2">
                  الحد الأقصى للاستثمار (دج)
                </Label>
                <div className="relative">
                  <DollarSign className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  <Input
                    id="maxInvestment"
                    name="maxInvestment"
                    type="number"
                    value={formData.maxInvestment}
                    onChange={handleInputChange}
                    placeholder="الحد الأقصى"
                    className="w-full pr-10"
                    min="0"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="equity" className="block text-lg font-medium mb-2">
                نسبة الملكية المعروضة (%) <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="equity"
                  name="equity"
                  type="number"
                  value={formData.equity}
                  onChange={handleInputChange}
                  placeholder="أدخل نسبة الملكية المعروضة"
                  className="w-full"
                  min="1"
                  max="100"
                  required
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">النسبة المئوية من الشركة التي ستقدمها للمستثمرين</p>
            </div>

            <div>
              <Label className="block text-lg font-medium mb-2">
                مدة حملة التمويل (بالأشهر) <span className="text-red-500">*</span>
              </Label>
              <RadioGroup
                value={formData.duration}
                onValueChange={(value) => setFormData({ ...formData, duration: value })}
                className="flex flex-wrap gap-4"
              >
                {[1, 2, 3, 6, 12].map((months) => (
                  <div key={months} className="flex items-center space-x-2 space-x-reverse">
                    <RadioGroupItem value={months.toString()} id={`duration-${months}`} />
                    <Label htmlFor={`duration-${months}`}>
                      {months} {months === 1 ? "شهر" : "أشهر"}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label className="block text-lg font-medium mb-2">صورة الغلاف</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                {formData.coverImage ? (
                  <div className="relative">
                    <img
                      src={formData.coverImage.url || "/placeholder.svg"}
                      alt="Cover preview"
                      className="max-h-40 mx-auto rounded-lg"
                    />
                    <p className="mt-2 text-sm text-gray-500">{formData.coverImage.name}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => setFormData({ ...formData, coverImage: null })}
                    >
                      إزالة
                    </Button>
                  </div>
                ) : (
                  <div>
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 mb-2">اسحب وأفلت الصورة هنا أو</p>
                    <Button variant="outline" className="relative" asChild>
                      <label>
                        <span>اختر ملف</span>
                        <input
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, "coverImage")}
                        />
                      </label>
                    </Button>
                    <p className="mt-2 text-xs text-gray-500">PNG، JPG، GIF حتى 5MB</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label className="block text-lg font-medium mb-2">صور المشروع (حتى 5 صور)</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                {formData.images.length > 0 ? (
                  <div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                      {formData.images.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={image || "/placeholder.svg"}
                            alt={`Project image ${index + 1}`}
                            className="h-24 w-full object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                            onClick={() => {
                              const updatedImages = [...formData.images]
                              updatedImages.splice(index, 1)
                              setFormData({ ...formData, images: updatedImages })
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                    {formData.images.length < 5 && (
                      <Button variant="outline" className="relative" asChild>
                        <label>
                          <span>إضافة المزيد</span>
                          <input
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, "images")}
                          />
                        </label>
                      </Button>
                    )}
                  </div>
                ) : (
                  <div>
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 mb-2">اسحب وأفلت الصور هنا أو</p>
                    <Button variant="outline" className="relative" asChild>
                      <label>
                        <span>اختر ملفات</span>
                        <input
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, "images")}
                        />
                      </label>
                    </Button>
                    <p className="mt-2 text-xs text-gray-500">PNG، JPG، GIF حتى 5MB لكل صورة</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label className="block text-lg font-medium mb-2">خطة العمل (PDF)</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                {formData.businessPlan ? (
                  <div className="flex items-center justify-center gap-4">
                    <FileText className="h-8 w-8 text-primary-500" />
                    <div className="text-right">
                      <p className="font-medium">{formData.businessPlan.name}</p>
                      <p className="text-sm text-gray-500">
                        {(formData.businessPlan.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setFormData({ ...formData, businessPlan: null })}
                    >
                      إزالة
                    </Button>
                  </div>
                ) : (
                  <div>
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 mb-2">اسحب وأفلت ملف PDF هنا أو</p>
                    <Button variant="outline" className="relative" asChild>
                      <label>
                        <span>اختر ملف</span>
                        <input
                          type="file"
                          className="sr-only"
                          accept=".pdf"
                          onChange={(e) => handleFileUpload(e, "businessPlan")}
                        />
                      </label>
                    </Button>
                    <p className="mt-2 text-xs text-gray-500">ملف PDF حتى 10MB</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label className="block text-lg font-medium mb-2">التوقعات المالية (PDF أو Excel)</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                {formData.financialProjections ? (
                  <div className="flex items-center justify-center gap-4">
                    <FileText className="h-8 w-8 text-primary-500" />
                    <div className="text-right">
                      <p className="font-medium">{formData.financialProjections.name}</p>
                      <p className="text-sm text-gray-500">
                        {(formData.financialProjections.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setFormData({ ...formData, financialProjections: null })}
                    >
                      إزالة
                    </Button>
                  </div>
                ) : (
                  <div>
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 mb-2">اسحب وأفلت ملف هنا أو</p>
                    <Button variant="outline" className="relative" asChild>
                      <label>
                        <span>اختر ملف</span>
                        <input
                          type="file"
                          className="sr-only"
                          accept=".pdf,.xls,.xlsx"
                          onChange={(e) => handleFileUpload(e, "financialProjections")}
                        />
                      </label>
                    </Button>
                    <p className="mt-2 text-xs text-gray-500">ملف PDF أو Excel حتى 10MB</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="block text-lg font-medium">
                  فريق العمل <span className="text-red-500">*</span>
                </Label>
                <Button type="button" variant="outline" size="sm" onClick={addTeamMember}>
                  إضافة عضو
                </Button>
              </div>

              {formData.teamMembers.map((member, index) => (
                <div key={index} className="border rounded-lg p-4 mb-4 bg-white">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">عضو الفريق #{index + 1}</h4>
                    {formData.teamMembers.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTeamMember(index)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        إزالة
                      </Button>
                    )}
                  </div>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor={`team-name-${index}`} className="block text-sm font-medium mb-1">
                        الاسم <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id={`team-name-${index}`}
                        value={member.name}
                        onChange={(e) => handleTeamMemberChange(index, "name", e.target.value)}
                        placeholder="الاسم الكامل"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor={`team-role-${index}`} className="block text-sm font-medium mb-1">
                        المنصب <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id={`team-role-${index}`}
                        value={member.role}
                        onChange={(e) => handleTeamMemberChange(index, "role", e.target.value)}
                        placeholder="المنصب أو الدور"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor={`team-bio-${index}`} className="block text-sm font-medium mb-1">
                        نبذة مختصرة
                      </Label>
                      <Textarea
                        id={`team-bio-${index}`}
                        value={member.bio}
                        onChange={(e) => handleTeamMemberChange(index, "bio", e.target.value)}
                        placeholder="نبذة مختصرة عن الخبرات والمؤهلات"
                        className="h-20"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="block text-lg font-medium">المراحل الرئيسية</Label>
                <Button type="button" variant="outline" size="sm" onClick={addMilestone}>
                  إضافة مرحلة
                </Button>
              </div>

              {formData.milestones.map((milestone, index) => (
                <div key={index} className="border rounded-lg p-4 mb-4 bg-white">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">المرحلة #{index + 1}</h4>
                    {formData.milestones.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMilestone(index)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        إزالة
                      </Button>
                    )}
                  </div>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor={`milestone-title-${index}`} className="block text-sm font-medium mb-1">
                        العنوان
                      </Label>
                      <Input
                        id={`milestone-title-${index}`}
                        value={milestone.title}
                        onChange={(e) => handleMilestoneChange(index, "title", e.target.value)}
                        placeholder="عنوان المرحلة"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`milestone-date-${index}`} className="block text-sm font-medium mb-1">
                        التاريخ المتوقع
                      </Label>
                      <Input
                        id={`milestone-date-${index}`}
                        type="date"
                        value={milestone.date}
                        onChange={(e) => handleMilestoneChange(index, "date", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`milestone-description-${index}`} className="block text-sm font-medium mb-1">
                        الوصف
                      </Label>
                      <Textarea
                        id={`milestone-description-${index}`}
                        value={milestone.description}
                        onChange={(e) => handleMilestoneChange(index, "description", e.target.value)}
                        placeholder="وصف المرحلة والأهداف المرتبطة بها"
                        className="h-20"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <Label htmlFor="risks" className="block text-lg font-medium mb-2">
                المخاطر والتحديات
              </Label>
              <Textarea
                id="risks"
                name="risks"
                value={formData.risks}
                onChange={handleInputChange}
                placeholder="اشرح المخاطر المحتملة وكيفية التعامل معها"
                className="w-full h-32"
              />
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 ml-2" />
                <div>
                  <h3 className="font-medium text-amber-800">مراجعة المعلومات</h3>
                  <p className="text-amber-700 text-sm">
                    يرجى مراجعة جميع المعلومات بعناية قبل التقديم. بعد التقديم، سيتم مراجعة مشروعك من قبل فريقنا قبل
                    نشره.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-xl font-bold text-primary-500 mb-4">{formData.title || "عنوان المشروع"}</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">معلومات أساسية</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex">
                      <span className="font-medium ml-2">الفئة:</span>
                      <span>{projectCategories.find((c) => c.id === formData.category)?.name || "غير محدد"}</span>
                    </li>
                    <li className="flex">
                      <span className="font-medium ml-2">الكلمات المفتاحية:</span>
                      <span>{formData.tags || "غير محدد"}</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-2">التفاصيل المالية</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex">
                      <span className="font-medium ml-2">المبلغ المستهدف:</span>
                      <span>{formData.goalAmount ? `${formData.goalAmount} دج` : "غير محدد"}</span>
                    </li>
                    <li className="flex">
                      <span className="font-medium ml-2">نسبة الملكية:</span>
                      <span>{formData.equity ? `${formData.equity}%` : "غير محدد"}</span>
                    </li>
                    <li className="flex">
                      <span className="font-medium ml-2">مدة الحملة:</span>
                      <span>{formData.duration ? `${formData.duration} أشهر` : "غير محدد"}</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-2">الوصف المختصر</h4>
                <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                  {formData.shortDescription || "لم يتم إضافة وصف مختصر"}
                </p>
              </div>

              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-2">الملفات المرفقة</h4>
                <div className="flex flex-wrap gap-3">
                  {formData.coverImage && (
                    <div className="bg-gray-50 rounded-lg p-2 flex items-center">
                      <ImageIcon className="h-4 w-4 text-primary-500 ml-2" />
                      <span className="text-sm">صورة الغلاف</span>
                    </div>
                  )}
                  {formData.images.length > 0 && (
                    <div className="bg-gray-50 rounded-lg p-2 flex items-center">
                      <ImageIcon className="h-4 w-4 text-primary-500 ml-2" />
                      <span className="text-sm">{formData.images.length} صور للمشروع</span>
                    </div>
                  )}
                  {formData.businessPlan && (
                    <div className="bg-gray-50 rounded-lg p-2 flex items-center">
                      <FileText className="h-4 w-4 text-primary-500 ml-2" />
                      <span className="text-sm">خطة العمل</span>
                    </div>
                  )}
                  {formData.financialProjections && (
                    <div className="bg-gray-50 rounded-lg p-2 flex items-center">
                      <FileText className="h-4 w-4 text-primary-500 ml-2" />
                      <span className="text-sm">التوقعات المالية</span>
                    </div>
                  )}
                  {!formData.coverImage &&
                    formData.images.length === 0 &&
                    !formData.businessPlan &&
                    !formData.financialProjections && <span className="text-gray-500">لم يتم إرفاق أي ملفات</span>}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-2">فريق العمل</h4>
                <div className="space-y-2">
                  {formData.teamMembers.map((member, index) =>
                    member.name ? (
                      <div key={index} className="bg-gray-50 p-3 rounded-lg">
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-gray-600">{member.role}</div>
                      </div>
                    ) : null,
                  )}
                  {formData.teamMembers.every((m) => !m.name) && (
                    <span className="text-gray-500">لم يتم إضافة أعضاء الفريق</span>
                  )}
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center mb-4">
                  <Checkbox
                    id="terms"
                    checked={formData.termsAccepted}
                    onCheckedChange={(checked) => setFormData({ ...formData, termsAccepted: checked === true })}
                    className="ml-2"
                  />
                  <Label htmlFor="terms" className="text-sm">
                    أوافق على{" "}
                    <a href="/terms" className="text-primary-500 hover:underline" target="_blank" rel="noreferrer">
                      شروط الخدمة
                    </a>{" "}
                    و{" "}
                    <a href="/privacy" className="text-primary-500 hover:underline" target="_blank" rel="noreferrer">
                      سياسة الخصوصية
                    </a>{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <ProtectedRoute allowedRoles={["startup"]}>
      <div className="flex flex-col min-h-screen font-amiri bg-gradient-to-b from-white to-cream text-primary-900">
        <Navbar />
        <main className="flex-1 py-12 md:py-24 overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl relative z-10">
            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-primary-500 mb-6 md:mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              تقديم مشروع جديد
            </motion.h1>

            <motion.p
              className="text-center text-gray-600 mb-10 md:mb-12 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              قم بملء النموذج التالي لتقديم مشروعك للحصول على التمويل. سيتم مراجعة المشروع من قبل فريقنا قبل نشره على
              المنصة.
            </motion.p>

            {/* Form Progress */}
            <div className="mb-8">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-500">
                  الخطوة {currentStep + 1} من {formSteps.length}
                </span>
                <span className="text-sm font-medium text-primary-500">{formProgress}% مكتمل</span>
              </div>
              <Progress value={formProgress} className="h-2" />
            </div>

            {/* Form Steps Navigation */}
            <div className="flex overflow-x-auto pb-2 mb-6 gap-2">
              {formSteps.map((step, index) => (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setCurrentStep(index)}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm whitespace-nowrap ${
                    currentStep === index ? "bg-primary-500 text-white" : "bg-white text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {step.icon}
                  <span className="mr-1">{step.title}</span>
                </button>
              ))}
            </div>

            {/* Success Message */}
            {submitSuccess ? (
              <motion.div
                className="bg-green-50 border border-green-200 rounded-lg p-6 text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-green-800 mb-2">تم تقديم المشروع بنجاح!</h2>
                <p className="text-green-700 mb-6">سيتم مراجعة مشروعك من قبل فريقنا وسنعلمك بالنتيجة قريبًا.</p>
                <Button asChild>
                  <a href="/projects/my">العودة إلى مشاريعي</a>
                </Button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-6">{renderFormStep()}</div>

                {/* Error Message */}
                {submitError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-700">
                    <div className="flex">
                      <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 ml-2" />
                      <span>{submitError}</span>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className="flex items-center gap-1"
                  >
                    <ChevronRight className="h-4 w-4" />
                    السابق
                  </Button>

                  {currentStep < formSteps.length - 1 ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      disabled={!validateCurrentStep()}
                      className="flex items-center gap-1"
                    >
                      التالي
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isSubmitting || !validateCurrentStep()}
                      className="flex items-center gap-1"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full ml-2"></span>
                          جاري التقديم...
                        </>
                      ) : (
                        <>
                          تقديم المشروع
                          <CheckCircle className="h-4 w-4" />
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </form>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  )
}
