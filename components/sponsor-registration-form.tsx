// components/SponsorRegistrationForm.tsx
"use client";

import { useState } from "react";
import { useAuth } from "@/lib/authContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type SponsorRegistrationFormProps = {
  onComplete: () => void;
};

export function SponsorRegistrationForm({ onComplete }: SponsorRegistrationFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [investmentFocus, setInvestmentFocus] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const { register, isLoading } = useAuth();

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) {
      setEmailError("البريد الإلكتروني مطلوب");
    } else if (!emailRegex.test(value)) {
      setEmailError("البريد الإلكتروني غير صالح");
    } else {
      setEmailError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    validateEmail(email);
    if (emailError || !name || !password || !investmentFocus) return;

    try {
      await register(name, email, password, "sponsor");
      onComplete();
    } catch (err: any) {
      setError(
        err.message === "Email already exists"
          ? "البريد الإلكتروني مسجل مسبقًا"
          : "حدث خطأ أثناء التسجيل"
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-semibold text-primary-500 mb-4">تسجيل راعي / مستثمر</h2>
      {error && <p className="text-red-500 text-center">{error}</p>}
      <div>
        <Label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          الاسم
        </Label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          aria-describedby="name-error"
        />
      </div>
      <div>
        <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          البريد الإلكتروني
        </Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            validateEmail(e.target.value);
          }}
          required
          aria-invalid={!!emailError}
          aria-describedby={emailError ? "email-error" : undefined}
          className={emailError ? "border-red-500" : ""}
        />
        {emailError && (
          <p id="email-error" className="text-red-500 text-sm mt-1">{emailError}</p>
        )}
      </div>
      <div>
        <Label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          كلمة المرور
        </Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          aria-describedby="password-error"
        />
      </div>
      <div>
        <Label htmlFor="investmentFocus" className="block text-sm font-medium text-gray-700 mb-1">
          مجال الاستثمار (مثال: التكنولوجيا، العقارات)
        </Label>
        <Input
          id="investmentFocus"
          type="text"
          value={investmentFocus}
          onChange={(e) => setInvestmentFocus(e.target.value)}
          required
          aria-describedby="investmentFocus-error"
        />
      </div>
      <Button
        type="submit"
        className="w-full bg-primary-500 text-white hover:bg-primary-600 transition-colors"
        disabled={isLoading || !!emailError || !name || !email || !password || !investmentFocus}
      >
        {isLoading ? "جاري التحميل..." : "إنشاء حساب"}
      </Button>
    </form>
  );
}