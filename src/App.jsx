import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import VerifyEmailPage from './pages/VerifyEmailPage'
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
      <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
      <Route path="/signup" element={<PublicOnlyRoute><SignUpPage /></PublicOnlyRoute>} />
      <Route path="/verify-email" element={<PublicOnlyRoute><VerifyEmailPage /></PublicOnlyRoute>} />
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
