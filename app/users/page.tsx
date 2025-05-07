"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import { useAuth } from "@/lib/authContext"
import { User, Users, Building, Briefcase, Mail, Phone, Edit, Trash2, Shield, UserPlus } from "lucide-react"
import ProtectedRoute from "@/components/protected-route"

// Mock users data
type UserType = {
  id: number
  name: string
  email: string
  phone: string
  role: "startup" | "sponsor" | "admin" | string
  company: string
  joinDate: string
  status: string
  projects?: number
  investments?: number
}

const mockUsers: UserType[] = [
  {
    id: 1,
    name: "أحمد محمد",
    email: "ahmed@example.com",
    phone: "0555123456",
    role: "startup",
    company: "شركة التقنية الحديثة",
    joinDate: "2023-05-15",
    status: "نشط",
    projects: 3,
  },
  {
    id: 2,
    name: "سارة علي",
    email: "sara@example.com",
    phone: "0555789012",
    role: "sponsor",
    company: "مجموعة الاستثمار العربية",
    joinDate: "2023-06-20",
    status: "نشط",
    investments: 5,
  },
  {
    id: 3,
    name: "محمد خالد",
    email: "mohamed@example.com",
    phone: "0555456789",
    role: "startup",
    company: "شركة الحلول الذكية",
    joinDate: "2023-04-10",
    status: "نشط",
    projects: 1,
  },
  {
    id: 4,
    name: "فاطمة أحمد",
    email: "fatima@example.com",
    phone: "0555234567",
    role: "sponsor",
    company: "شركة التمويل الوطنية",
    joinDate: "2023-07-05",
    status: "نشط",
    investments: 2,
  },
  {
    id: 5,
    name: "عمر حسن",
    email: "omar@example.com",
    phone: "0555345678",
    role: "startup",
    company: "مؤسسة الابتكار",
    joinDate: "2023-03-25",
    status: "معلق",
    projects: 0,
  },
  {
    id: 6,
    name: "ليلى يوسف",
    email: "layla@example.com",
    phone: "0555567890",
    role: "sponsor",
    company: "مجموعة الاستثمارات الدولية",
    joinDate: "2023-08-12",
    status: "نشط",
    investments: 3,
  },
]

export default function UsersPage() {
  const { user } = useAuth()
  const [users, setUsers] = useState<UserType[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    // In a real app, you would fetch users from an API
    // For now, we'll use the mock data
    setUsers(mockUsers)
  }, [])

  const filteredUsers = users.filter(
    (user) =>
      (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.company.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (roleFilter === "all" || user.role === roleFilter) &&
      (statusFilter === "all" || user.status === statusFilter),
  )

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "startup":
        return <Building className="h-5 w-5 text-blue-500" />
      case "sponsor":
        return <Briefcase className="h-5 w-5 text-green-500" />
      case "admin":
        return <Shield className="h-5 w-5 text-purple-500" />
      default:
        return <User className="h-5 w-5 text-gray-500" />
    }
  }

  const getRoleText = (role: string) => {
    switch (role) {
      case "startup":
        return "صاحب مشروع"
      case "sponsor":
        return "مستثمر"
      case "admin":
        return "مشرف"
      default:
        return "مستخدم"
    }
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case "نشط":
        return "bg-green-100 text-green-800 border-green-200"
      case "معلق":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "محظور":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="flex flex-col min-h-screen font-amiri bg-gradient-to-b from-white to-cream text-primary-900">
        <Navbar />
        <main className="flex-1 py-12 md:py-24 overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-primary-500 mb-10 md:mb-12"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              إدارة المستخدمين
            </motion.h1>

            {/* Search and Filter */}
            <div className="mb-8 flex flex-col md:flex-row gap-4">
              <Input
                type="text"
                placeholder="البحث عن مستخدم..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="md:w-1/3"
              />
              <select
                className="border border-primary-200 rounded-lg px-3 py-2 text-primary-500 bg-white focus:outline-none focus:ring-2 focus:ring-primary-400"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="all">جميع الأدوار</option>
                <option value="startup">أصحاب المشاريع</option>
                <option value="sponsor">المستثمرون</option>
                <option value="admin">المشرفون</option>
              </select>
              <select
                className="border border-primary-200 rounded-lg px-3 py-2 text-primary-500 bg-white focus:outline-none focus:ring-2 focus:ring-primary-400"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">جميع الحالات</option>
                <option value="نشط">نشط</option>
                <option value="معلق">معلق</option>
                <option value="محظور">محظور</option>
              </select>
              <Button className="md:mr-auto flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                إضافة مستخدم
              </Button>
            </div>

            {/* Users List */}
            {filteredUsers.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full bg-white rounded-xl shadow-lg overflow-hidden">
                  <thead className="bg-primary-50 text-primary-600">
                    <tr>
                      <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">المستخدم</th>
                      <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">الدور</th>
                      <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
                        معلومات الاتصال
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">الحالة</th>
                      <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                              <User className="h-5 w-5 text-primary-500" />
                            </div>
                            <div className="mr-4">
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.company}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getRoleIcon(user.role)}
                            <span className="mr-2 text-sm text-gray-900">{getRoleText(user.role)}</span>
                          </div>
                          <div className="text-xs text-gray-500">
                            {user.role === "startup"
                              ? `${user.projects} مشاريع`
                              : user.role === "sponsor"
                                ? `${user.investments} استثمارات`
                                : ""}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-900 mb-1">
                            <Mail className="h-4 w-4 ml-1" />
                            {user.email}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Phone className="h-4 w-4 ml-1" />
                            {user.phone}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusClass(
                              user.status,
                            )}`}
                          >
                            {user.status}
                          </span>
                          <div className="text-xs text-gray-500 mt-1">
                            منذ {new Date(user.joinDate).toLocaleDateString("ar-DZ")}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2 space-x-reverse">
                            <Button variant="outline" size="sm" className="flex items-center gap-1 px-2 py-1">
                              <Edit className="h-3 w-3" />
                              تعديل
                            </Button>
                            <Button variant="destructive" size="sm" className="flex items-center gap-1 px-2 py-1">
                              <Trash2 className="h-3 w-3" />
                              حذف
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl shadow-md">
                <div className="h-20 w-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-10 w-10 text-primary-500" />
                </div>
                <h3 className="text-xl font-medium text-gray-600 mb-2">لا يوجد مستخدمون</h3>
                <p className="text-gray-500 mb-6">لم يتم العثور على أي مستخدمين يطابقون معايير البحث</p>
                <Button
                  onClick={() => {
                    setSearchTerm("")
                    setRoleFilter("all")
                    setStatusFilter("all")
                  }}
                >
                  عرض جميع المستخدمين
                </Button>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  )
}
