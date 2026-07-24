import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="399763734005-hbv5jkpi6ihqta8gle7vg0ilbonven2p.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </StrictMode>
)