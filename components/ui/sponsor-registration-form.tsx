"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select } from "@/components/ui/select"

export function SponsorRegistrationForm({ onComplete }: { onComplete: () => void }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    companyName: "",
    industryFocus: "",
    investmentCapacity: "",
    interests: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the data to your backend
    console.log("Sponsor registration data:", formData)
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
        <label htmlFor="industryFocus" className="block text-sm font-medium text-gray-700 mb-1">
          التركيز الصناعي
        </label>
        <select
          id="industryFocus"
          name="industryFocus"
          value={formData.industryFocus}
          onChange={handleChange}
          required
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">اختر مجال التركيز</option>
          <option value="technology">التكنولوجيا</option>
          <option value="healthcare">الرعاية الصحية</option>
          <option value="education">التعليم</option>
          <option value="finance">المالية</option>
          <option value="other">أخرى</option>
        </select>
      </div>
      <div>
        <label htmlFor="investmentCapacity" className="block text-sm font-medium text-gray-700 mb-1">
          القدرة الاستثمارية
        </label>
        <select
          id="investmentCapacity"
          name="investmentCapacity"
          value={formData.investmentCapacity}
          onChange={handleChange}
          required
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">اختر القدرة الاستثمارية</option>
          <option value="small">أقل من 100,000 دولار</option>
          <option value="medium">100,000 - 500,000 دولار</option>
          <option value="large">500,000 - 1,000,000 دولار</option>
          <option value="xlarge">أكثر من 1,000,000 دولار</option>
        </select>
      </div>
      <div>
        <label htmlFor="interests" className="block text-sm font-medium text-gray-700 mb-1">
          مجالات الاهتمام
        </label>
        <Textarea id="interests" name="interests" value={formData.interests} onChange={handleChange} rows={4} />
      </div>
      <Button type="submit" className="w-full">
        تسجيل كراعي / مستثمر
      </Button>
    </form>
  )
}
