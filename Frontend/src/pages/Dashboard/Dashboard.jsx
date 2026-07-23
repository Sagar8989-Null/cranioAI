import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import './Dashboard.css'
import { useNavigate } from "react-router-dom";

const topStats = [
  { label: 'Overall Symmetry', value: '87%', icon: 'symmetry', trend: '+3% this month' },
  { label: 'Analysis This Month', value: '4', icon: 'scan', trend: '2 pending' },
  { label: 'Best Score', value: '91%', icon: 'trophy', trend: 'Jun 15, 2024' },
  { label: 'Face Age', value: '23', icon: 'clock', trend: 'Estimated' },
]

const metrics = [
  { label: 'Left/Right Balance', value: 85 },
  { label: 'Eye Symmetry', value: 90 },
  { label: 'Nose Symmetry', value: 88 },
  { label: 'Mouth Symmetry', value: 82 },
  { label: 'Chin & Jawline', value: 85 },
]

const chartData = [
  { day: 'Jun 1', score: 78 }, { day: 'Jun 5', score: 80 }, { day: 'Jun 10', score: 82 },
  { day: 'Jun 15', score: 85 }, { day: 'Jun 20', score: 84 }, { day: 'Jun 25', score: 86 },
  { day: 'Jun 30', score: 87 },
]

const recommendations = [
  { title: 'Jaw Alignment Exercise', freq: '3 sets × 10 reps', icon: 'jaw' },
  { title: 'Eye Symmetry Drill', freq: '2 sets × 15 reps', icon: 'eye' },
  { title: 'Facial Massage Routine', freq: '5 min daily', icon: 'massage' },
]

const recentAnalyses = [
  { date: 'Jun 30, 2024', score: 87, status: 'Good' },
  { date: 'Jun 25, 2024', score: 86, status: 'Good' },
  { date: 'Jun 20, 2024', score: 84, status: 'Average' },
]

const iconPaths = {
  symmetry: <><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a9 9 0 0 1 0 18M12 3a9 9 0 0 0 0 18"/></>,
  scan: <><path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2M7 12h10"/></>,
  trophy: <><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22M18 2H6v7a6 6 0 0 0 12 0V2Z"/></>,
  clock: <><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></>,
  jaw: <><path d="M3 12h18M5 12c0 4 3 7 7 7s7-3 7-7"/></>,
  eye: <><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></>,
  massage: <><path d="M3 12c0-5 4-9 9-9s9 4 9 9-4 9-9 9-9-4-9-9Z"/><path d="M9 12h6M12 9v6"/></>,
}

export default function Dashboard() {
  const [view, setView] = useState('before')
  const score = 87
  const circumference = 2 * Math.PI * 52
  const offset = circumference - (score / 100) * circumference
  const navigate = useNavigate();


      useEffect(() => {
      const token =
        localStorage.getItem("access") ||
        sessionStorage.getItem("access");

      if (!token) {
        navigate("/login");
      }
    }, [navigate]);


  return (
    <div className="dash-page">
      {/* Top Stats */}
      <div className="dash-stats-row">
        {topStats.map((s) => (
          <div className="dash-stat-card" key={s.label}>
            <div className="dash-stat-icon">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {iconPaths[s.icon]}
              </svg>
            </div>
            <div className="dash-stat-info">
              <div className="dash-stat-label">{s.label}</div>
              <div className="dash-stat-value">{s.value}</div>
              <div className="dash-stat-trend">{s.trend}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Middle Row */}
      <div className="dash-mid-row">
        <div className="dash-card dash-upload-card">
          <div className="dash-card-head">
            <h3>Upload & Analyze</h3>
            <span className="dash-card-badge">New</span>
          </div>
          <div className="dash-upload-body">
            <div className="dash-dropzone">
              <div className="dash-dropzone-icon">
                <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
              </div>
              <p>Drag & drop your photo here</p>
              <span>or click to browse</span>
              <button className="dash-upload-btn">Choose File</button>
            </div>
            <div className="dash-preview">
              <div className="dash-preview-img">
                <svg viewBox="0 0 100 120" width="100%" height="100%">
                  <ellipse cx="50" cy="60" rx="35" ry="50" fill="none" stroke="var(--border)" strokeWidth="1.5"/>
                  <circle cx="38" cy="48" r="3" fill="var(--text-muted)"/>
                  <circle cx="62" cy="48" r="3" fill="var(--text-muted)"/>
                  <path d="M 42 75 Q 50 80 58 75" fill="none" stroke="var(--text-muted)" strokeWidth="1.5"/>
                </svg>
              </div>
              <div className="dash-preview-info">
                <div className="dash-preview-name">profile.jpg</div>
                <div className="dash-preview-size">2.4 MB</div>
                <div className="dash-preview-status">Ready to analyze</div>
              </div>
            </div>
          </div>
        </div>

        <div className="dash-card dash-score-card">
          <div className="dash-card-head"><h3>Symmetry Score</h3></div>
          <div className="dash-score-body">
            <div className="dash-score-ring">
              <svg viewBox="0 0 120 120" width="140" height="140">
                <circle cx="60" cy="60" r="52" fill="none" stroke="var(--border-light)" strokeWidth="10" />
                <circle
                  cx="60" cy="60" r="52" fill="none"
                  stroke="url(#scoreGrad)" strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  transform="rotate(-90 60 60)"
                />
                <defs>
                  <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--primary-light)" />
                    <stop offset="100%" stopColor="var(--accent)" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="dash-score-num">
                <span className="dash-score-pct">{score}%</span>
                <span className="dash-score-lbl">Symmetry</span>
              </div>
            </div>
            <div className="dash-metrics">
              {metrics.map((m) => (
                <div className="dash-metric" key={m.label}>
                  <div className="dash-metric-head">
                    <span>{m.label}</span>
                    <span className="dash-metric-val">{m.value}%</span>
                  </div>
                  <div className="dash-metric-bar">
                    <div className="dash-metric-fill" style={{ width: `${m.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="dash-bottom-row">
        <div className="dash-card dash-ba-card">
          <div className="dash-card-head">
            <h3>3D Face Before/After</h3>
            <div className="dash-ba-toggle">
              <button className={view === 'before' ? 'active' : ''} onClick={() => setView('before')}>Before</button>
              <button className={view === 'after' ? 'active' : ''} onClick={() => setView('after')}>After</button>
            </div>
          </div>
          <div className="dash-ba-body">
            <div className="dash-ba-face">
              <svg viewBox="0 0 120 140" width="100%" height="100%">
                <ellipse cx="60" cy="70" rx="45" ry="60" fill="none" stroke={view === 'after' ? 'var(--accent)' : 'var(--text-muted)'} strokeWidth="1.5"/>
                <ellipse cx="60" cy="70" rx="35" ry="48" fill="none" stroke={view === 'after' ? 'rgba(108,240,174,0.4)' : 'var(--border)'} strokeWidth="1"/>
                <line x1="60" y1="10" x2="60" y2="130" stroke={view === 'after' ? 'rgba(108,240,174,0.4)' : 'var(--border)'} strokeWidth="1" strokeDasharray="3 3"/>
                <circle cx="48" cy="55" r="4" fill={view === 'after' ? 'var(--accent)' : 'var(--text-muted)'}/>
                <circle cx="72" cy="55" r="4" fill={view === 'after' ? 'var(--accent)' : 'var(--text-muted)'}/>
                <path d="M 52 85 Q 60 92 68 85" fill="none" stroke={view === 'after' ? 'var(--accent)' : 'var(--text-muted)'} strokeWidth="1.5"/>
              </svg>
              <span className="dash-ba-label">{view === 'before' ? 'Before — 72%' : 'After — 89%'}</span>
            </div>
            <div className="dash-ba-info">
              <p>Improvement over 30 days of exercises:</p>
              <div className="dash-ba-improve">+17%</div>
              <p className="dash-ba-note">Keep up the routine to maintain progress!</p>
            </div>
          </div>
        </div>

        <div className="dash-card dash-rec-card">
          <div className="dash-card-head">
            <h3>AI Recommendations</h3>
            <button className="dash-view-all">View All</button>
          </div>
          <div className="dash-rec-list">
            {recommendations.map((r) => (
              <div className="dash-rec-item" key={r.title}>
                <div className="dash-rec-icon">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {iconPaths[r.icon]}
                  </svg>
                </div>
                <div className="dash-rec-info">
                  <div className="dash-rec-title">{r.title}</div>
                  <div className="dash-rec-freq">{r.freq}</div>
                </div>
                <button className="dash-rec-start">Start</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="dash-card dash-chart-card">
        <div className="dash-card-head">
          <h3>Progress Over Time</h3>
          <span className="dash-chart-range">Last 30 Days</span>
        </div>
        <div className="dash-chart">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
              <XAxis dataKey="day" stroke="var(--text-muted)" fontSize={12} />
              <YAxis stroke="var(--text-muted)" fontSize={12} domain={[70, 100]} />
              <Tooltip
                contentStyle={{ borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}
              />
              <Line type="monotone" dataKey="score" stroke="var(--primary)" strokeWidth={3} dot={{ fill: 'var(--primary)', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent */}
      <div className="dash-card dash-recent-card">
        <div className="dash-card-head"><h3>Recent Analysis</h3></div>
        <div className="dash-recent-list">
          {recentAnalyses.map((a, i) => (
            <div className="dash-recent-item" key={i}>
              <div className="dash-recent-thumb">
                <svg viewBox="0 0 40 48" width="40" height="48">
                  <ellipse cx="20" cy="24" rx="15" ry="20" fill="none" stroke="var(--border)" strokeWidth="1.5"/>
                  <circle cx="15" cy="20" r="1.5" fill="var(--text-muted)"/>
                  <circle cx="25" cy="20" r="1.5" fill="var(--text-muted)"/>
                </svg>
              </div>
              <div className="dash-recent-date">{a.date}</div>
              <div className="dash-recent-score">{a.score}%</div>
              <span className={`dash-recent-status ${a.status.toLowerCase()}`}>{a.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
