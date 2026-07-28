import { useState, useRef, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import './Dashboard.css'
import axios from "axios";

const recommendations = [
  { title: 'Jaw Alignment Exercise', freq: '3 sets × 10 reps', icon: 'jaw' },
  { title: 'Eye Symmetry Drill', freq: '2 sets × 15 reps', icon: 'eye' },
  { title: 'Facial Massage Routine', freq: '5 min daily', icon: 'massage' },
]

const iconPaths = {
  symmetry: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a9 9 0 0 1 0 18M12 3a9 9 0 0 0 0 18" /></>,
  scan: <><path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2M7 12h10" /></>,
  trophy: <><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22M18 2H6v7a6 6 0 0 0 12 0V2Z" /></>,
  clock: <><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></>,
  jaw: <><path d="M3 12h18M5 12c0 4 3 7 7 7s7-3 7-7" /></>,
  eye: <><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></>,
  massage: <><path d="M3 12c0-5 4-9 9-9s9 4 9 9-4 9-9 9-9-4-9-9Z" /><path d="M9 12h6M12 9v6" /></>,
}

export default function Dashboard() {

  const [analysis, setAnalysis] = useState(() => {
    const saved = localStorage.getItem("analysis");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    refreshDashboard();
  }, []);
  
  const [dashboardData, setDashboardData] = useState(null);
  
  const refreshDashboard = async () => {
    try {
      const access_token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
      const response = await axios.get(
        "http://127.0.0.1:8000/api/dashboard/",
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      
      setDashboardData(response.data);
      
      localStorage.setItem(
        "dashboardData",
        JSON.stringify(response.data)
      );
    } catch (error) {
      console.error(error);
    }
  };
  
  const latestAnalysis = dashboardData?.recent_uploads?.[0];
  const score = latestAnalysis?.overall_score || 0;
  const circumference = 2 * Math.PI * 52;
  const offset = circumference - (score / 100) * circumference;
  const metrics = analysis
    ? Object.entries(analysis.symmetry_analysis.region_scores).map(
      ([key, value]) => ({
        label: key.charAt(0).toUpperCase() + key.slice(1),
        value,
      })
    )
    : [];

  const latestImage = dashboardData?.recent_uploads?.[0]?.uploaded_image;

  const stats = dashboardData?.stats;
  const averageSymmetry = stats?.average_score?.toFixed(1) || "0.0";
  const bestScore = stats?.best_score?.toFixed(1) || "0.0";
  const totalUploads = stats?.total_uploads || 0;

  // Current month uploads
  const currentMonthUploads =
    dashboardData?.graph?.filter(item => {
      const d = new Date(item.date);
      const now = new Date();

      return (
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear()
      );
    }).length || 0;

  const topStats = [
    { label: "Average Symmetry", value: `${averageSymmetry}%`, icon: "symmetry", trend: `${totalUploads} Total Analyses`, },
    { label: "This Month", value: currentMonthUploads, icon: "scan", trend: "Current Month", },
    { label: "Best Score", value: `${bestScore}%`, icon: "trophy", trend: "All Time", },
  ];


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
            <h3>Recent Analysis</h3>
          </div>
          <div className="dash-preview-img">
            {dashboardData ? (
              <img src={`http://127.0.0.1:8000${latestImage}`} alt="Preview" className="preview-image" />
            ) : (
              <svg viewBox="0 0 100 120" width="100%" height="100%">
                <ellipse cx="50" cy="60" rx="35" ry="50" fill="none" stroke="var(--border)" strokeWidth="1.5" />
                <circle cx="38" cy="48" r="3" fill="var(--text-muted)" />
                <circle cx="62" cy="48" r="3" fill="var(--text-muted)" />
                <path d="M 42 75 Q 50 80 58 75" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" />
              </svg>
            )}
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
                <span className="dash-score-pct">{score.toFixed(1)}%</span>
                <span className="dash-score-lbl">Symmetry</span>
              </div>
            </div>
            <div className="dash-metrics">
              {metrics.map((m) => (
                <div className="dash-metric" key={m.label}>
                  <div className="dash-metric-head">
                    <span>{m.label}</span>
                    <span className="dash-metric-val">{m.value.toFixed(1)}%</span>
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
            <LineChart data={dashboardData?.graph || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
              <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} />
              <YAxis stroke="var(--text-muted)" fontSize={12} domain={[0, 100]} />
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
          {dashboardData?.recent_uploads?.map((a) => (
            <div className="dash-recent-item" key={a.id}>
              <div className="dash-recent-thumb">
                <img
                  src={`http://127.0.0.1:8000${a.uploaded_image || ''}`}
                  alt="upload"
                />
              </div>
              <div className="dash-recent-date">{a.date}</div>
              <div className="dash-recent-score">{a.overall_score}%</div>
              <span className={`dash-recent-status ${a.overall_score >= 85 ? "good" : a.overall_score >= 70 ? "average" : "starting"}`}>{a.overall_score >= 85 ? "Excellent" : a.overall_score >= 70 ? "Good" : "Needs Work"}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
