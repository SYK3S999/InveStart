// components/register/SponsorRegistrationForm.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useAuth } from "@/lib/authContext"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@radix-ui/react-tooltip"
import { Info, Upload, Camera, CheckCircle } from "lucide-react"
import { Toast } from "@/components/ui/toast"

interface SponsorRegistrationFormProps {
  onComplete: () => void
}

export function SponsorRegistrationForm({ onComplete }: SponsorRegistrationFormProps) {
  const router = useRouter()
  const { register } = useAuth()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
    documentType: "",
    documentFile: null as File | null,
    faceIdVerified: false,
    equipmentExpertise: "",
    termsAccepted: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [transactionHash, setTransactionHash] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)

  const clearError = (field: string) => {
    setErrors((prev) => {
      const { [field]: _, ...rest } = prev
      return rest
    })
  }

  const validateStep = (currentStep: number) => {
    const newErrors: Record<string, string> = {}
    if (currentStep === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = "الاسم الكامل مطلوب"
      if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = "البريد الإلكتروني غير صالح"
      if (formData.password.length < 8) newErrors.password = "كلمة المرور يجب أن تكون 8 أحرف على الأقل"
      if (!formData.phoneNumber.match(/^\+213[5-7]\d{8}$/))
        newErrors.phoneNumber = "رقم الهاتف يجب أن يكون بصيغة +213xxxxxxxxx"
    } else if (currentStep === 2) {
      if (!formData.documentType) newErrors.documentType = "يرجى اختيار نوع الوثيقة"
      if (!formData.documentFile) newErrors.documentFile = "يرجى رفع الوثيقة"
      if (!formData.faceIdVerified) newErrors.faceIdVerified = "يرجى إكمال التحقق من الهوية"
    } else if (currentStep === 3) {
      if (!formData.equipmentExpertise) newErrors.equipmentExpertise = "يرجى اختيار مجال المعدات"
      if (!formData.termsAccepted) newErrors.termsAccepted = "يجب الموافقة على الشروط والأحكام"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1)
    }
  }

  const handleSubmit = async () => {
    if (validateStep(3)) {
      setIsSubmitting(true)
      try {
        await register(formData.fullName, formData.email, formData.password, "sponsor")
        const mockTxHash = `0x${Math.random().toString(16).slice(2, 66)}`
        setTransactionHash(mockTxHash)
        console.log("Registration submitted:", formData, "Blockchain Tx Hash:", mockTxHash)
        setToast({ message: "تم التسجيل بنجاح! تم حفظ بياناتك في التخزين السحابي.", type: "success" })
        setTimeout(() => onComplete(), 2000)
      } catch (error) {
        setErrors({ submit: "فشل التسجيل، يرجى المحاولة لاحقًا" })
        setToast({ message: "فشل التسجيل، يرجى المحاولة لاحقًا", type: "error" })
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, documentFile: "حجم الملف يجب أن يكون أقل من 5 ميغابايت" })
        return
      }
      if (!["image/jpeg", "image/png", "application/pdf"].includes(file.type)) {
        setErrors({ ...errors, documentFile: "الملف يجب أن يكون PDF، JPEG، أو PNG" })
        return
      }
      setFormData({ ...formData, documentFile: file })
      clearError("documentFile")
    }
  }

  const handleFaceIdMock = () => {
    setToast({ message: "تم التحقق من الهوية بنجاح (محاكاة)", type: "success" })
    setFormData({ ...formData, faceIdVerified: true })
    clearError("faceIdVerified")
  }

  const renderStepIndicator = () => (
    <div className="flex items-center justify-between mb-8 relative">
      {["المعلومات الشخصية", "التحقق من الهوية", "تفاصيل الرعاية"].map((label, index) => (
        <div key={index} className="flex flex-col items-center relative z-10">
          <motion.div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-md ${
              step >= index + 1
                ? "bg-gradient-to-r from-primary-500 to-primary-600 dark:bg-gradient-to-r dark:from-primary-600 dark:to-primary-700 text-white dark:text-white"
                : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400"
            }`}
            animate={{ scale: step === index + 1 ? 1.1 : 1 }}
            transition={{ duration: 0.3 }}
          >
            {index + 1}
          </motion.div>
          <span className="text-xs mt-2 text-gray-600 dark:text-gray-400">{label}</span>
        </div>
      ))}
      <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700">
        <motion.div
          className="h-full bg-gradient-to-r from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700"
          initial={{ width: `${(step - 1) * 50}%` }}
          animate={{ width: `${(step - 1) * 50}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>
    </div>
  )

  return (
    <div className="relative">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
          className="fixed top-4 left-2 right-2 sm:left-auto sm:right-4 max-w-lg z-50"
        />
      )}
      {renderStepIndicator()}
      {errors.submit && (
        <motion.p
          className="text-red-500 dark:text-red-400 text-sm mb-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {errors.submit}
        </motion.p>
      )}
      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        {step === 1 && (
          <motion.fieldset
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div>
              <Label htmlFor="fullName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                الاسم الكامل
              </Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => {
                  setFormData({ ...formData, fullName: e.target.value })
                  clearError("fullName")
                }}
                placeholder="أدخل اسمك الكامل"
                className={`mt-2 rounded-lg shadow-sm transition-all duration-200 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent ${
                    errors.fullName ? "border-red-500 dark:border-red-400" : ""
                }`}
                aria-label="Full name"
                aria-describedby={errors.fullName ? "fullName-error" : undefined}
              />
              {errors.fullName && (
                <p id="fullName-error" className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.fullName}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                البريد الإلكتروني
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value })
                  clearError("email")
                }}
                placeholder="أدخل بريدك الإلكتروني"
                className={`mt-2 rounded-lg shadow-sm transition-all duration-200 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent ${
                  errors.email ? "border-red-500 dark:border-red-400" : ""
                }`}
                aria-label="Email"
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && (
                <p id="email-error" className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.email}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                كلمة المرور
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value })
                  clearError("password")
                }}
                placeholder="أدخل كلمة المرور (8 أحرف على الأقل)"
                className={`mt-2 rounded-lg shadow-sm transition-all duration-200 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent ${
                  errors.password ? "border-red-500 dark:border-red-400" : ""
                }`}
                aria-label="Password"
                aria-describedby={errors.password ? "password-error" : undefined}
              />
              {errors.password && (
                <p id="password-error" className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.password}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                رقم الهاتف
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="inline-block h-4 w-4 mr-1 ml-1 text-gray-500 dark:text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>أدخل رقم هاتف صالح بصيغة +213xxxxxxxxx</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <Input
                type="tel"
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) => {
                  setFormData({ ...formData, phoneNumber: e.target.value })
                  clearError("phoneNumber")
                }}
                placeholder="+213xxxxxxxxx"
                className={`mt-2 rounded-lg shadow-sm transition-all duration-200 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent ${
                  errors.phoneNumber ? "border-red-500 dark:border-red-400" : ""
                }`}
                aria-label="رقم الهاتف"
                aria-describedby={errors.phoneNumber ? "phoneNumber-error" : undefined}
              />
              {errors.phoneNumber && (
                <p id="phoneNumber-error" className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.phoneNumber}
                </p>
              )}
            </div>
            <Button
              onClick={handleNext}
              className="w-full bg-gradient-to-r from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 text-white rounded-xl py-6 text-lg font-semibold shadow-sm hover:shadow-lg transition-all duration-300"
            >
              التالي
            </Button>
          </motion.fieldset>
        )}
        {step === 2 && (
          <motion.fieldset
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div>
              <Label htmlFor="documentType" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                نوع الوثيقة
              </Label>
              <Select
                onValueChange={(value) => {
                  setFormData({ ...formData, documentType: value })
                  clearError("documentType")
                }}
                value={formData.documentType}
              >
                <SelectTrigger
                  id="documentType"
                  className={`mt-2 rounded-lg shadow-sm transition-all duration-200 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent ${
                    errors.documentType ? "border-red-500 dark:border-red-400" : ""
                  }`}
                  aria-label="نوع الوثيقة"
                >
                  <SelectValue placeholder="اختر نوع الوثيقة" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-600 rounded-lg shadow-sm">
                  <SelectItem value="national_id" className="hover:bg-gray-100 dark:hover:bg-gray-700">
                    بطاقة وطنية
                  </SelectItem>
                  <SelectItem value="driver_license" className="hover:bg-gray-100 dark:hover:bg-gray-700">
                    رخصة سياقة
                  </SelectItem>
                  <SelectItem value="passport" className="hover:bg-gray-100 dark:hover:bg-gray-700">
                    جواز سفر
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.documentType && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.documentType}</p>
              )}
            </div>
            <div>
              <Label htmlFor="documentFile" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                رفع الوثيقة
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="inline-block h-4 w-4 mr-1 text-gray-500 dark:text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>الملف يجب أن يكون PDF、JPEG、أو PNG بحد أقصى 5MB.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <div className="flex items-center gap-2">
                <input
                  id="documentFile"
                  type="file"
                  accept="image/jpeg,image/png,application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById("documentFile")?.click()}
                  className={`w-full rounded-lg shadow-sm flex items-center justify-between gap-3 px-4 py-5 transition-all duration-200 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 ${
                    formData.documentFile ? "border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-900/50" : ""
                  }`}
                  aria-label="رفع الوثيقة"
                >
                  <div className="flex items-center gap-2">
                    <Upload className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <span className="truncate max-w-[200px]">
                      {formData.documentFile ? formData.documentFile.name : "اختر ملف (PDF、JPEG、أو PNG)"}
                    </span>
                  </div>
                  {formData.documentFile && <CheckCircle className="h-4 w-4 text-green-500 dark:text-green-400" />}
                </Button>
              </div>
              {errors.documentFile && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.documentFile}</p>
              )}
            </div>
            <div>
              <Label htmlFor="faceId" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                التحقق من الهوية (Face ID)
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="inline-block h-4 w-4 mr-1 text-gray-500 dark:text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>اضغط لبدء التحقق من الهوية (محاكاة).</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <Button
                variant="outline"
                onClick={handleFaceIdMock}
                disabled={formData.faceIdVerified}
                className={`w-full rounded-lg shadow-sm flex items-center justify-center gap-2 px-4 py-5 transition-all duration-200 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 ${
                    formData.faceIdVerified ? "border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-900/50" : ""
                }`}
                aria-label="التحقق من الهوية"
              >
                {formData.faceIdVerified ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-500 dark:text-green-400" />
                    تم التحقق
                  </>
                ) : (
                  <>
                    <Camera className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    بدء التحقق
                  </>
                )}
              </Button>
              {errors.faceIdVerified && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.faceIdVerified}</p>
              )}
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                className="w-full rounded-lg shadow-sm bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 py-4"
              >
                السابق
              </Button>
              <Button
                onClick={handleNext}
                className="w-full bg-gradient-to-r from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 text-white rounded-xl py-6 text-lg font-semibold shadow-sm hover:shadow-lg transition-all duration-200"
              >
              التالي
            </Button>
          </div>
        </motion.fieldset>
      )}
      {step === 3 && (
        <motion.fieldset
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          <div>
            <Label htmlFor="equipmentExpertise" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              مجال المعدات
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="inline-block h-4 w-4 mr-1 text-gray-500 dark:text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>اختر نوع المعدات التي يمكنك تقديمها كراعي مواد.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <Select
              onValueChange={(value) => {
                setFormData({ ...formData, equipmentExpertise: value })
                clearError("equipmentExpertise")
              }}
              value={formData.equipmentExpertise}
            >
              <SelectTrigger
                id="equipmentExpertise"
                className={`mt-2 rounded-lg shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent ${
                  errors.equipmentExpertise ? "border-red-500 dark:border-red-400" : ""
                }`}
                aria-label="مجال المعدات"
              >
                <SelectValue placeholder="اختر مجال المعدات" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-600 rounded-lg shadow-sm">
                <SelectItem value="الصناعة" className="hover:bg-gray-100 dark:hover:bg-gray-700">
                  معدات صناعية
                </SelectItem>
                <SelectItem value="الزراعة" className="hover:bg-gray-100 dark:hover:bg-gray-700">
                  معدات زراعية
                </SelectItem>
                <SelectItem value="التكنولوجيا" className="hover:bg-gray-100 dark:hover:bg-gray-700">
                  معدات تكنولوجية
                </SelectItem>
                <SelectItem value="أخرى" className="hover:bg-gray-100 dark:hover:bg-gray-700">
                  أخرى
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.equipmentExpertise && (
              <p className="text-red-500 dark:text-red-400 text-xs mt-2">{errors.equipmentExpertise}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="termsAccepted"
              checked={formData.termsAccepted}
              onCheckedChange={(checked) => {
                setFormData({ ...formData, termsAccepted: !!checked })
                clearError("termsAccepted")
              }}
              className="h-4 w-5 rounded border-gray-300 dark:border-gray-600 text-primary-500 dark:text-primary-400 focus:ring-primary-500 dark:focus:ring-primary-400 data-[state=checked]:bg-primary-500 dark:data-[state=checked]:text-white"
              aria-label="الموافقة على الشروط والأحكام"
            />
            <Label
              htmlFor="termsAccepted"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              أوافق على{" "}
              <a href="/terms" className="text-primary-500 dark:text-primary-400 hover:underline">
                الشروط والأحكام
              </a>
            </Label>
          </div>
          {errors.termsAccepted && (
            <p className="text-red-500 dark:text-red-400 mt-1">{errors.termsAccepted}</p>
          )}
          {transactionHash && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-white dark:bg-gray-800 border bg-gray-200 dark:border-gray-700 rounded-lg"
            >
              <p className="text-gray-600 dark:text-gray-400 text-sm break-all">
                رمز العملية على البلوكشين: {" "}
                <span className="font-mono text-primary-500 dark:text-primary-400">{transactionHash}</span>
              </p>
            </motion.div>
          )}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setStep(2)}
              className="w-full rounded-lg shadow-sm bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 py-4"
            >
              السابق
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !!transactionHash}
              className="w-full bg-gradient-to-r from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 text-white rounded-xl py-6 text-lg font-semibold shadow-sm hover:shadow-lg transition-all duration-200 disabled:opacity-50"
            >
              {isSubmitting ? "جاري الإنشاء..." : "إنشاء الحساب"}
            </Button>
          </div>
        </motion.fieldset>
      )}
    </form>
  </div>
)}