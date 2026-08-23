import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import CategoriesPage from './pages/CategoriesPage'
import SearchPage from './pages/SearchPage'
import BusinessProfilePage from './pages/BusinessProfilePage'
import WriteReviewPage from './pages/WriteReviewPage'
import BusinessDashboardPage from './pages/BusinessDashboardPage'
import AuthPage from './pages/AuthPage'
import VerifyEmailPage from './pages/VerifyEmailPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import PricingPage from './pages/PricingPage'
import DashboardLayout from './components/dashboard/DashboardLayout'
import DashboardHome from './pages/dashboard/DashboardHome'
import DiscoverPage from './pages/dashboard/DiscoverPage'
import OpportunitiesPage from './pages/dashboard/OpportunitiesPage'
import ConnectionsPage from './pages/dashboard/ConnectionsPage'
import MessagesPage from './pages/dashboard/MessagesPage'
import ProfilePage from './pages/dashboard/ProfilePage'
import SettingsPage from './pages/dashboard/SettingsPage'
import ProtectedRoute from './components/ProtectedRoute'
import PublicOnlyRoute from './components/PublicOnlyRoute'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/categories" element={<CategoriesPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/business/:id" element={<BusinessProfilePage />} />
      <Route path="/write-review" element={<WriteReviewPage />} />
      <Route path="/business-dashboard" element={<BusinessDashboardPage />} />
      <Route path="/login" element={<PublicOnlyRoute><AuthPage /></PublicOnlyRoute>} />
      <Route path="/signup" element={<PublicOnlyRoute><AuthPage /></PublicOnlyRoute>} />
      <Route path="/verify-email" element={<PublicOnlyRoute><VerifyEmailPage /></PublicOnlyRoute>} />
      <Route path="/reset-password" element={<PublicOnlyRoute><ResetPasswordPage /></PublicOnlyRoute>} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<DashboardHome />} />
        <Route path="discover" element={<DiscoverPage />} />
        <Route path="opportunities" element={<OpportunitiesPage />} />
        <Route path="connections" element={<ConnectionsPage />} />
        <Route path="messages" element={<MessagesPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  )
}

export default App
