import { useState, useCallback, useEffect, useRef } from "react";
import './FaceAnalyzer.css'
import axios from "axios";

const states = {
  idle: { label: 'Upload a photo to begin', color: 'var(--text-muted)' },
  uploading: { label: 'Uploading image...', color: 'var(--info)' },
  analyzing: { label: 'AI analyzing facial symmetry...', color: 'var(--primary)' },
  results: { label: 'Analysis complete!', color: 'var(--success)' },
  error: { label: 'Backend unavailable — showing demo results', color: 'var(--warning)' },
}

export default function FaceAnalyzer() {

  const [status, setStatus] = useState("idle");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analysis, setAnalysis] = useState(null);

  const fileInputRef = useRef(null);

  useEffect(() => {
    const savedAnalysis = localStorage.getItem("analysis");
    const savedPreview = localStorage.getItem("preview");
    const savedOverlay = localStorage.getItem("overlay_url");

    if (savedAnalysis) setAnalysis(JSON.parse(savedAnalysis));
    if (savedPreview) setPreview(savedPreview);

    if (savedOverlay) {
      localStorage.setItem("overlay_url", savedOverlay);
    }
  }, []);

  useEffect(() => {
    if (analysis) {
      localStorage.setItem("analysis", JSON.stringify(analysis));
    }
  }, [analysis]);

  useEffect(() => {
    if (preview) {
      localStorage.setItem("preview", preview);
    }
  }, [preview]);

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  const handleFile = useCallback(async (file) => {
    if (!file || !file.type.startsWith("image/")) return;

    setImage(file);

    const base64 = await fileToBase64(file);
    setPreview(base64);

    setAnalysis(null);
    setProgress(0);
    setStatus("idle");

    localStorage.removeItem("analysis");
    localStorage.removeItem("overlay_url");
    localStorage.removeItem("glb_url");
  }, []);

  const onDrop = useCallback((e) => {
    e.preventDefault()
    setDragOver(false)
    handleFile(e.dataTransfer.files[0])
  }, [handleFile])

  const onFileInput = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    handleFile(file);

    e.target.value = "";
  };

  const analyze = async () => {
    if (!image) return;

    setStatus("uploading");
    setProgress(20);

    const formData = new FormData();
    formData.append("image", image);

    try {

      const access_token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");

      setStatus("analyzing");
      setProgress(50);

      const response = await axios.post(
        "http://127.0.0.1:8000/api/analyze-generate/",
        formData,
        {
          headers: {
            "Authorization": `Bearer ${access_token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setAnalysis(response.data);

      localStorage.setItem(
        "analysis",
        JSON.stringify(response.data)
      );

      localStorage.setItem(
        "overlay_url",
        response.data.symmetry_analysis.overlay_image
      );

      localStorage.setItem(
        "recommendations",
        JSON.stringify(response.data.recommendations)
      );

      if (response.data.generated_model?.glb_url) {
        localStorage.setItem(
          "glb_url",
          response.data.generated_model.glb_url
        );
      }

      setStatus("results");
      setProgress(100);

    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  const reset = () => {
    setImage(null);
    setPreview(null);
    setAnalysis(null);
    setStatus("idle");
    setProgress(0);

    localStorage.removeItem("analysis");
    localStorage.removeItem("preview");
    localStorage.removeItem("overlay_url");
    localStorage.removeItem("glb_url");
    localStorage.removeItem("recommendations");
  };

  const score = analysis?.symmetry_analysis?.overall_score || 0;
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

  const overlayUrl =
    analysis?.symmetry_analysis?.overlay_image ||
    localStorage.getItem("overlay_url");

  const recommendations = analysis?.recommendations || JSON.parse(localStorage.getItem("recommendations") || "[]");

  return (
    <div className="analyzer-page">
      <div className="analyzer-header">
        <div>
          <h2>Face Analyzer</h2>
          <p>Upload a front-facing photo for AI-powered symmetry analysis</p>
        </div>
        {image && !analysis && (
          <button className="analyzer-reset" onClick={reset}>Clear</button>
        )}
      </div>

      <div className={`analyzer-status ${status}`}>
        <span className="analyzer-status-dot" style={{ background: states[status].color }} />
        {states[status].label}
        {(status === 'uploading' || status === 'analyzing') && (
          <div className="analyzer-progress">
            <div className="analyzer-progress-fill" style={{ width: `${progress}%` }} />
          </div>
        )}
      </div>

      <div className="analyzer-main">
        <div
          className={`analyzer-dropzone ${dragOver ? "drag" : ""} ${preview ? "has-image" : ""}`}
        >
          {/* Always mounted */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={onFileInput}
          />

          {preview ? (
            <div className="analyzer-preview">
              <img src={preview} alt="Preview" />

              <div className="analyzer-preview-overlay">
                <button
                  className="analyzer-change"
                  onClick={() => {
                    fileInputRef.current.value = "";
                    fileInputRef.current.click();
                  }}
                >
                  Change Photo
                </button>
              </div>
            </div>
          ) : (
            <div className="analyzer-dropzone-content">
              ...
              <button
                className="analyzer-browse"
                onClick={() => fileInputRef.current.click()}
              >
                Browse Files
              </button>
            </div>
          )}
        </div>

        {preview && (
          <div className="analyzer-actions">
            <button
              className="analyzer-analyze-btn"
              onClick={analyze}
              disabled={status === 'uploading' || status === 'analyzing'}
            >
              {status === 'uploading' || status === 'analyzing' ? (
                <>
                  <span className="analyzer-spinner" />
                  Analyzing...
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2M7 12h10" />
                  </svg>
                  Analyze Face
                </>
              )}
            </button>
          </div>
        )}

        <div className="analyzer-tips">
          <h4>Tips for best results:</h4>
          <ul>
            <li>Use a front-facing photo with good lighting</li>
            <li>Keep a neutral expression and face the camera directly</li>
            <li>Remove glasses and keep hair away from face</li>
            <li>Ensure the photo is clear and not blurry</li>
          </ul>
        </div>
      </div>

      {analysis && (
        <div className="analyzer-results">
          <div className="analyzer-results-grid">
            <div className="analyzer-card analyzer-original">
              <h3>Original Image</h3>
              <div className="analyzer-img-wrap">
                <img src={preview} alt="Original" />
                <div className="analyzer-scan-overlay" />
              </div>
            </div>
            <div className="analyzer-card analyzer-annotated">
              <h3>Annotated & Mirrored</h3>
              <div className="analyzer-img-wrap">
                <img src={preview} alt="Annotated" className="analyzer-mirror" />
                <svg className="analyzer-landmarks" viewBox="0 0 300 300" preserveAspectRatio="none">
                  <line x1="150" y1="20" x2="150" y2="280" stroke="var(--accent)" strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />
                  <line x1="20" y1="150" x2="280" y2="150" stroke="var(--accent)" strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />
                  {[100, 200].map(x => [100, 200].map(y => (
                    <circle key={`${x}-${y}`} cx={x} cy={y} r="3" fill="var(--accent)" opacity="0.8" />
                  )))}
                  <circle cx="150" cy="150" r="4" fill="var(--primary)" />
                </svg>
              </div>
            </div>
            <div className="analyzer-card analyzer-original">
              <h3>Overlay Image</h3>
              <div className="analyzer-img-wrap">
                <img src={overlayUrl} alt="Overlay" />
                <div className="analyzer-scan-overlay" />
              </div>
            </div>
          </div>

          <div className="analyzer-results-detail">
            <div className="analyzer-card analyzer-score-detail">
              <h3>Symmetry Breakdown</h3>
              <div className="analyzer-big-score">
                <div className="analyzer-big-num">{score.toFixed(1)}%</div>
                <div className="analyzer-big-label">Overall Symmetry</div>
              </div>
              <div className="analyzer-metric-list">
                {metrics.map((m) => (
                  <div className="analyzer-metric-item" key={m.label}>
                    <div className="analyzer-metric-head">
                      <span>{m.label}</span>
                      <span className="analyzer-metric-val">{Number(m.value).toFixed(2)}%</span>
                    </div>
                    <div className="analyzer-metric-bar">
                      <div className="analyzer-metric-fill" style={{ width: `${m.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="analyzer-card analyzer-recs">
              <h3>AI Recommendations</h3>
              <div className="analyzer-rec-list">
                {recommendations.map((r, i) => (
                  <div className="analyzer-rec-item" key={i}>
                    <div className="analyzer-rec-icon">
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>
                    </div>
                    <div className="analyzer-rec-title">{r.title}</div>
                    <div className="analyzer-rec-detail">{r.reason}</div>
                    <div className="analyzer-rec-detail"><strong>Priority:</strong>{r.priority_label}</div>
                    <div className="analyzer-rec-detail"><strong>Difficulty:</strong>{r.difficulty}</div>
                    <div className="analyzer-rec-detail"><strong>Duration:</strong>{r.duration}</div>
                  </div>
                ))}
              </div>
              <button className="analyzer-new-analysis" onClick={reset}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 1 0 9-9M3 12l4-4M3 12l4 4" /></svg>
                New Analysis
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
