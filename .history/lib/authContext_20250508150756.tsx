// lib/authContext.tsx
"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

type UserRole = "startup" | "sponsor" | "admin";

type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  companyName?: string; // For startups
  investmentFocus?: string; // For sponsors
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    role: UserRole,
    extraData?: { companyName?: string; investmentFocus?: string }
  ) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for demonstration purposes
const mockUsers: User[] = [
  {
    id: "1",
    name: "صاحب المشروع",
    email: "startup@example.com",
    role: "startup",
    avatar: "/placeholder.svg?height=40&width=40&text=ص",
    companyName: "شركة نموذجية",
  },
  {
    id: "2",
    name: "المستثمر",
    email: "investor@example.com",
    role: "sponsor",
    avatar: "/placeholder.svg?height=40&width=40&text=م",
    investmentFocus: "التكنولوجيا",
  },
  {
    id: "3",
    name: "المشرف",
    email: "admin@example.com",
    role: "admin",
    avatar: "/placeholder.svg?height=40&width=40&text=ا",
  },
];

// Define protected routes with their allowed roles
const protectedRoutes: Record<string, UserRole[]> = {
  "/dashboard/startup": ["startup"],
  "/dashboard/sponsor": ["sponsor"],
  "/dashboard/admin": ["admin"],
  "/contracts": ["startup", "sponsor", "admin"],
  "/projects/my": ["startup"],
  "/projects/submit": ["startup"],
  "/projects/pending": ["admin"],
  "/users": ["admin"],
  "/reports": ["admin"],
  "/investments": ["sponsor"],
  "/messages": ["startup", "sponsor", "admin"],
  "/notifications": ["startup", "sponsor", "admin"],
  "/analytics": ["startup", "sponsor", "admin"],
  "/calendar": ["startup", "sponsor", "admin"],
  "/settings/startup": ["startup"],
  "/settings/sponsor": ["sponsor"],
  "/settings/admin": ["admin"],
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Protect routes based on user role
  useEffect(() => {
    if (isLoading) return;

    const matchingRoute = Object.keys(protectedRoutes).find((route) => {
      if (pathname === route) return true;
      if (route.includes("[") && pathname.startsWith(route.split("[")[0])) return true;
      return false;
    });

    if (matchingRoute) {
      const allowedRoles = protectedRoutes[matchingRoute];
      if (!user || !allowedRoles.includes(user.role)) {
        router.push("/login");
      }
    }
  }, [pathname, user, isLoading, router]);

  // Handle user login
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const foundUser = mockUsers.find((u) => u.email === email);
      if (!foundUser || password !== "password") {
        throw new Error("بيانات الدخول غير صحيحة");
      }
      setUser(foundUser);
      localStorage.setItem("user", JSON.stringify(foundUser));
      router.push(`/dashboard/${foundUser.role}`);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Handle user registration
  const register = async (
    name: string,
    email: string,
    password: string,
    role: UserRole,
    extraData?: { companyName?: string; investmentFocus?: string }
  ) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Prevent admin registration via public form
      if (role === "admin") {
        throw new Error("لا يمكن تسجيل حساب مشرف من هنا");
      }

      // Validate inputs
      if (!name || !email || !password) {
        throw new Error("جميع الحقول مطلوبة");
      }
      if (password.length < 6) {
        throw new Error("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      }
      if (mockUsers.some((u) => u.email === email)) {
        throw new Error("البريد الإلكتروني مسجل مسبقًا");
      }

      // Create new user
      const newUser: User = {
        id: `${mockUsers.length + 1}`,
        name,
        email,
        role,
        avatar: `/placeholder.svg?height=40&width=40&text=${name.charAt(0) || "U"}`,
        companyName: extraData?.companyName,
        investmentFocus: extraData?.investmentFocus,
      };

      // Add to mock users (in-memory, non-persistent)
      mockUsers.push(newUser);
      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
      router.push(`/dashboard/${newUser.role}`);
    } catch (error: any) {
      console.error("Registration error:", error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Handle user logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    router.push("/");
  };

  // Check if user has one of the specified roles
  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    if (Array.isArray(roles)) {
      return roles.includes(user.role);
    }
    return user.role === roles;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isLoading,
        isAuthenticated: !!user,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};