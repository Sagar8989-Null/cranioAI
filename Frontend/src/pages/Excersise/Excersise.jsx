import { useState } from 'react'
import './Recommendations.css'

const tabs = ['All', 'Face', 'Jaw', 'Eyes']

const exercises = [
  {
    category: 'Face',
    title: 'Facial Massage Routine',
    desc: 'Gentle circular massage to improve blood circulation and muscle tone across the face.',
    sets: '5 min daily',
    difficulty: 'Easy',
    icon: 'massage',
  },
  {
    category: 'Jaw',
    title: 'Jaw Alignment Exercise',
    desc: 'Controlled jaw movements to improve alignment and strengthen jaw muscles.',
    sets: '3 sets × 10 reps',
    difficulty: 'Medium',
    icon: 'jaw',
  },
  {
    category: 'Eyes',
    title: 'Eye Symmetry Drill',
    desc: 'Targeted eye exercises to balance muscle tension and improve symmetry.',
    sets: '2 sets × 15 reps',
    difficulty: 'Easy',
    icon: 'eye',
  },
  {
    category: 'Face',
    title: 'Cheek Toning Exercise',
    desc: 'Puff and release technique to tone cheek muscles and improve facial balance.',
    sets: '3 sets × 12 reps',
    difficulty: 'Easy',
    icon: 'cheek',
  },
  {
    category: 'Jaw',
    title: 'Chin Lift & Hold',
    desc: 'Lift chin upward and hold to strengthen neck and jawline muscles.',
    sets: '4 sets × 20 sec',
    difficulty: 'Hard',
    icon: 'chin',
  },
  {
    category: 'Eyes',
    title: 'Eye Focus Training',
    desc: 'Focus shifting exercises to strengthen eye muscles and improve coordination.',
    sets: '2 sets × 10 reps',
    difficulty: 'Medium',
    icon: 'focus',
  },
]

const iconPaths = {
  massage: <><circle cx="12" cy="12" r="9"/><path d="M9 9c0-1 1-2 3-2s3 1 3 2M8 14c0 2 2 4 4 4s4-2 4-4"/></>,
  jaw: <><path d="M3 12h18M5 12c0 4 3 7 7 7s7-3 7-7"/></>,
  eye: <><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></>,
  cheek: <><circle cx="12" cy="12" r="9"/><path d="M8 10c1-1 2-1 3 0M13 10c1-1 2-1 3 0M9 15c1 1 4 1 6 0"/></>,
  chin: <><path d="M4 8c2 8 4 12 8 12s6-4 8-12M4 8h16"/></>,
  focus: <><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1" fill="currentColor"/></>,
}

export default function Recommendations() {
  const [activeTab, setActiveTab] = useState('All')
  const filtered = activeTab === 'All' ? exercises : exercises.filter(e => e.category === activeTab)

  return (
    <div className="rec-page">
      <div className="rec-header">
        <div>
          <h2>AI Recommendations</h2>
          <p>Personalized exercises based on your facial symmetry analysis</p>
        </div>
        <div className="rec-tabs">
          {tabs.map(t => (
            <button
              key={t}
              className={`rec-tab ${activeTab === t ? 'active' : ''}`}
              onClick={() => setActiveTab(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="rec-grid">
        {filtered.map((ex) => (
          <div className="rec-card" key={ex.title}>
            <div className="rec-card-top">
              <div className="rec-card-icon">
                <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {iconPaths[ex.icon]}
                </svg>
              </div>
              <span className={`rec-difficulty ${ex.difficulty.toLowerCase()}`}>{ex.difficulty}</span>
            </div>
            <h3 className="rec-card-title">{ex.title}</h3>
            <p className="rec-card-desc">{ex.desc}</p>
            <div className="rec-card-meta">
              <div className="rec-meta-item">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                <span>{ex.sets}</span>
              </div>
              <div className="rec-meta-item">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/></svg>
                <span>{ex.category}</span>
              </div>
            </div>
            <button className="rec-start-btn">Start Exercise</button>
          </div>
        ))}
      </div>

      <div className="rec-tip-card">
        <div className="rec-tip-icon">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6M10 22h4"/></svg>
        </div>
        <div>
          <h3>Pro Tip</h3>
          <p>Consistency is key! Perform these exercises daily for best results. Track your progress in the Progress section to see improvements over time.</p>
        </div>
      </div>
    </div>
  )
}
