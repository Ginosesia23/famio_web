import { Navigate, Route, Routes } from 'react-router-dom'
import FamioLanding from './FamioLanding'
import AdminFamiliesPage from './pages/admin/AdminFamiliesPage'
import AdminLayout from './pages/admin/AdminLayout'
import AdminOverviewPage from './pages/admin/AdminOverviewPage'
import AdminRevenuePage from './pages/admin/AdminRevenuePage'
import AdminUsersPage from './pages/admin/AdminUsersPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import LoginPage from './pages/LoginPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import { AuthProvider } from './auth/AuthContext'
import { RequireAuth } from './auth/RequireAuth'
import { SupabaseAuthLandingRedirect } from './auth/SupabaseAuthLandingRedirect'
import './App.css'
import './admin-ui.css'

export default function App() {
  return (
    <AuthProvider>
      <SupabaseAuthLandingRedirect />
      <Routes>
        <Route path="/" element={<FamioLanding />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route
          element={
            <RequireAuth>
              <AdminLayout />
            </RequireAuth>
          }
          path="/admin"
        >
          <Route index element={<AdminOverviewPage />} />
          <Route element={<AdminRevenuePage />} path="revenue" />
          <Route element={<AdminFamiliesPage />} path="families" />
          <Route element={<AdminUsersPage />} path="users" />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}
