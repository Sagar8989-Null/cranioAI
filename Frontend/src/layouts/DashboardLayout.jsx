import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { useState } from 'react'
import './DashboardLayout.css'
import { useNavigate } from "react-router-dom";

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: 'grid', end: true },
  { to: '/dashboard/analyzer', label: 'Face Analyzer', icon: 'scan' },
  { to: '/dashboard/visualization', label: '3D Visualization', icon: 'cube' },
  { to: '/dashboard/progress', label: 'Progress', icon: 'trending' },
  { to: '/dashboard/recommendations', label: 'Recommendations', icon: 'bulb' },
  { to: '/dashboard/history', label: 'History', icon: 'clock' },
  { to: '/dashboard/settings', label: 'Settings', icon: 'settings' },
]

const icons = {
  grid: () => (<><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>),
  scan: () => (<><path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2M7 12h10"/></>),
  cube: () => (<><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="m3.3 7 8.7 5 8.7-5M12 22V12"/></>),
  trending: () => (<><path d="M22 7 13.5 15.5 8.5 10.5 2 17"/><path d="M16 7h6v6"/></>),
  bulb: () => (<><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6M10 22h4"/></>),
  clock: () => (<><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></>),
  settings: () => (<><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></>),
}

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/dashboard/analyzer': 'Face Analyzer',
  '/dashboard/visualization': '3D Visualization',
  '/dashboard/progress': 'Progress Tracking',
  '/dashboard/recommendations': 'AI Recommendations',
  '/dashboard/history': 'Analysis History',
  '/dashboard/settings': 'Settings',
}

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const title = pageTitles[location.pathname] || 'Dashboard'
  
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");

    sessionStorage.removeItem("access");
    sessionStorage.removeItem("refresh");

    navigate("/login");
  };


  return (
    <div className="dash-layout">
      <aside className={`dash-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="dash-brand">
          <div className="dash-logo">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a9 9 0 0 1 0 18M12 3a9 9 0 0 0 0 18"/>
            </svg>
          </div>
          <span className="dash-brand-name">CranioAI</span>
        </div>

        <nav className="dash-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className="dash-nav-item"
              onClick={() => setSidebarOpen(false)}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {icons[item.icon]()}
              </svg>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="dash-sidebar-bottom">
          <div className="dash-upgrade-card">
            <div className="dash-upgrade-icon">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m12 2 2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8 5.8 21.3l2.4-7.4L2 9.4h7.6z"/></svg>
            </div>
            <h4>Upgrade to Pro</h4>
            <p>Unlock advanced 3D analysis & unlimited scans</p>
            <button className="dash-upgrade-btn">Upgrade Now</button>
          </div>

          <div className="dash-user-profile">
            <div className="dash-avatar">SJ</div>
            <div className="dash-user-info">
              <div className="dash-user-name">{user.username}</div>
              <div className="dash-user-badge">Premium</div>
              <div className="dash-user-since">Member since May 2024</div>
            </div>
          </div>
        </div>
      </aside>

      {sidebarOpen && <div className="dash-overlay" onClick={() => setSidebarOpen(false)} />}

      <div className="dash-main">
        <header className="dash-topbar">
          <button className="dash-hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
          </button>
          <h1 className="dash-page-title">{title}</h1>
          <div className="dash-topbar-right">
            <button className="dash-icon-btn">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
              <span className="dash-notif-dot"></span>
            </button>
            <div className="dash-topbar-user">
              <div className="dash-avatar sm">{user.username.slice(0,1)}</div>
              <span className="dash-topbar-name">{user.username}</span>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
            <div className= "logout" onClick={handleLogout}>Logout</div>
            </div>
          </div>
        </header>

        <main className="dash-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
