import { useRef,useState,useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import './Visualization.css'
import FaceModel from "../../components/FaceModel";

function HeadMesh() {
  const meshRef = useRef(null)

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.15
    }
  })

  return (
    <mesh ref={meshRef} scale={[1, 1.3, 1]}>
      <sphereGeometry args={[1.5, 24, 24]} />
      <meshBasicMaterial color="#2D8A4E" wireframe transparent opacity={0.7} />
    </mesh>
  )
}

function InnerHead() {
  return (
    <mesh scale={[1, 1.3, 1]}>
      <sphereGeometry args={[1.48, 32, 32]} />
      <meshStandardMaterial color="#0D1F14" transparent opacity={0.4} />
    </mesh>
  )
}

function LandmarkDots() {
  const positions = [
    [0.6, 0.5, 1.2], [-0.6, 0.5, 1.2],
    [0, 0.2, 1.45], [0, -0.2, 1.4],
    [0.5, -0.5, 1.3], [-0.5, -0.5, 1.3],
    [0, -0.9, 1.1], [0, 0.9, 1.0],
    [0.8, 0, 1.0], [-0.8, 0, 1.0],
  ]
  return (
    <>
      {positions.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial color="#69F0AE" />
        </mesh>
      ))}
    </>
  )
}

const metrics = [
  { label: 'Symmetry Score', value: '87%' },
  { label: 'Left/Right Balance', value: '85%' },
  { label: 'Eye Symmetry', value: '90%' },
  { label: 'Nose Symmetry', value: '88%' },
  { label: 'Mouth Symmetry', value: '82%' },
  { label: 'Chin & Jawline', value: '85%' },
]

export default function Visualization() {
  
  const [analysis, setAnalysis] = useState(null);

  const handleReset = () => {
    window.location.reload()
  }

  const glb_url = localStorage.getItem("glb_url")

  useEffect(() => {
      const savedAnalysis = localStorage.getItem("analysis");
  
      if (savedAnalysis) {
        setAnalysis(JSON.parse(savedAnalysis));
      }
    }, []);

  const metrics = analysis
    ? Object.entries(analysis.symmetry_analysis.region_scores).map(
      ([key, value]) => ({
        label: key.charAt(0).toUpperCase() + key.slice(1),
        value,
      })
    )
    : [];

  return (
    <div className="viz-page">
      <div className="viz-canvas-wrap">
        {glb_url ? <FaceModel modelUrl={glb_url} config={{
          scale: 35,
          cameraPosition: [0, 0, 5],
          minDistance: 30,
          maxDistance: 60,
          position: [0, 0, 0],
        }} /> : <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#69F0AE" />
          <HeadMesh />
          <InnerHead />
          <LandmarkDots />
          <OrbitControls
            enablePan={false}
            minDistance={3}
            maxDistance={10}
            enableZoom={true}
          />
        </Canvas>}

        <div className="viz-controls">
          <button className="viz-control-btn" title="Rotate">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8M21 3v5h-5" />
            </svg>
          </button>
          <button className="viz-control-btn" title="Zoom In">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3M11 8v6M8 11h6" />
            </svg>
          </button>
          <button className="viz-control-btn" title="Zoom Out">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3M8 11h6" />
            </svg>
          </button>
          <button className="viz-control-btn" title="Reset" onClick={handleReset}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12a9 9 0 1 0 9-9M3 12l4-4M3 12l4 4" />
            </svg>
          </button>
        </div>

        <div className="viz-hint">Drag to rotate • Scroll to zoom</div>
      </div>

      <div className="viz-info-panel">
        <div className="viz-info-header">
          <h3>3D Face Analysis</h3>
          <span className="viz-info-badge">Live Model</span>
        </div>
        <p className="viz-info-desc">
          Interactive 3D wireframe model of facial structure. Green dots represent
          detected landmark points used for symmetry calculation.
        </p>

        <div className="viz-metrics">
          {metrics.map((m) => (
            <div className="viz-metric" key={m.label}>
              <span className="viz-metric-label">{m.label}</span>
              <span className="viz-metric-value">{m.value}%</span>
            </div>
          ))}
        </div>

        <div className="viz-landmark-info">
          <div className="viz-landmark-item">
            <span className="viz-landmark-dot" />
            <span>68 facial landmarks detected</span>
          </div>
          <div className="viz-landmark-item">
            <span className="viz-landmark-dot green" />
            <span>Wireframe mesh overlay</span>
          </div>
          <div className="viz-landmark-item">
            <span className="viz-landmark-dot accent" />
            <span>Real-time symmetry analysis</span>
          </div>
        </div>

        <button className="viz-export-btn">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
          </svg>
          Export 3D Model
        </button>
      </div>
    </div>
  )
}
