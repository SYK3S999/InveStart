// Simulated authentication and role-based access control

export type UserRole = "startup" | "fournisseur" | "admin"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
}

let currentUser: User | null = null

export function login(email: string, password: string): User | null {
  // Simulated login logic
  if (email === "startup@example.com" && password === "password") {
    currentUser = { id: "1", name: "صاحب المشروع", email, role: "startup" }
  } else if (email === "investor@example.com" && password === "password") {
    currentUser = { id: "2", name: "المستثمر", email, role: "fournisseur" }
  } else if (email === "admin@example.com" && password === "password") {
    currentUser = { id: "3", name: "المشرف", email, role: "admin" }
  }
  return currentUser
}

export function logout(): void {
  currentUser = null
}

export function getCurrentUser(): User | null {
  return currentUser
}

export function isAuthenticated(): boolean {
  return currentUser !== null
}

export function hasRole(role: UserRole): boolean {
  return currentUser?.role === role
}
