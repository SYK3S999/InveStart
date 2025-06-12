"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select } from "@/components/ui/select"

export function StartupRegistrationForm({ onComplete }: { onComplete: () => void }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    companyName: "",
    fieldOfWork: "",
    requiredLicenses: "",
    businessPlan: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the data to your backend
    console.log("Startup registration data:", formData)
    onComplete()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          الاسم الكامل
        </label>
        <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          البريد الإلكتروني
        </label>
        <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          كلمة المرور
        </label>
        <Input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
          اسم الشركة
        </label>
        <Input id="companyName" name="companyName" value={formData.companyName} onChange={handleChange} required />
      </div>
      <div>
        <label htmlFor="fieldOfWork" className="block text-sm font-medium text-gray-700 mb-1">
          مجال العمل
        </label>
        <select
          id="fieldOfWork"
          name="fieldOfWork"
          value={formData.fieldOfWork}
          onChange={handleChange}
          required
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">اختر مجال العمل</option>
          <option value="technology">التكنولوجيا</option>
          <option value="healthcare">الرعاية الصحية</option>
          <option value="education">التعليم</option>
          <option value="finance">المالية</option>
          <option value="other">أخرى</option>
        </select>
      </div>
      <div>
        <label htmlFor="requiredLicenses" className="block text-sm font-medium text-gray-700 mb-1">
          التراخيص المطلوبة
        </label>
        <Textarea
          id="requiredLicenses"
          name="requiredLicenses"
          value={formData.requiredLicenses}
          onChange={handleChange}
          rows={3}
        />
      </div>
      <div>
        <label htmlFor="businessPlan" className="block text-sm font-medium text-gray-700 mb-1">
          خطة العمل
        </label>
        <Textarea
          id="businessPlan"
          name="businessPlan"
          value={formData.businessPlan}
          onChange={handleChange}
          rows={5}
        />
      </div>
      <Button type="submit" className="w-full">
        تسجيل المشروع الناشئ
      </Button>
    </form>
  )
}
