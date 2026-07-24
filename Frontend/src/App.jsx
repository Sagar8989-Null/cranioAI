import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home/Home'
import Login from './pages/Login/Login'
import Signup from './pages/Signup/Signup'
import Dashboard from './pages/Dashboard/Dashboard'
import FaceAnalyzer from './pages/FaceAnalyzer/FaceAnalyzer'
import Visualization from './pages/Visualization/Visualization'
import Progress from './pages/Progress/Progress'
import Recommendations from './pages/Recommendations/Recommendations'
import Excersise from './pages/Excersise/Excersise'
import History from './pages/History/History'
import Settings from './pages/Settings/Settings'
import DashboardLayout from './layouts/DashboardLayout'
import ProtectedRoute from "./components/ProtectedRoutes";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="analyzer" element={<FaceAnalyzer />} />
          <Route path="visualization" element={<Visualization />} />
          <Route path="progress" element={<Progress />} />
          <Route path="recommendations" element={<Recommendations />} />
          <Route path="excersise" element={<Excersise />} />
          <Route path="history" element={<History />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </BrowserRouter>
  );
}
