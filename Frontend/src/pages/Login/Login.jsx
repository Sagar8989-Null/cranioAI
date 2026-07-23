import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Login.css'
import axios from "axios"
import { useNavigate } from 'react-router-dom'
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useGoogleLogin } from "@react-oauth/google";


export default function Login() {

  const navigate = useNavigate();
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {

      const response = await axios.post(
        "http://127.0.0.1:8000/accounts/google-login/",
        {
          access_token: tokenResponse.access_token,
        }
      );

      console.log(response.data);

      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);

      localStorage.setItem(
        "user",
        JSON.stringify({
          username: response.data.username,
          email: response.data.email,
        })
      );

      navigate("/dashboard");
    },

    onError: () => {
      console.log("Google Login Failed");
    },
  });
  useEffect(() => {
    const token =
      localStorage.getItem("access") ||
      sessionStorage.getItem("access");

    if (token) {
      navigate("/dashboard");
      return;
    }

    const savedEmail = localStorage.getItem("rememberEmail");

    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, [navigate]);

  const handleSubmit = async (e) => {

    e.preventDefault()

    try {
      const response = await axios.post("http://127.0.0.1:8000/accounts/login/", {
        email,
        password,
      });

      alert(response.data.message)

      if (response.data.message === "Login Successful") {
        localStorage.setItem("isLoggedIn", "true")

        localStorage.setItem(
          "user",
          JSON.stringify({
            username: response.data.username,
            email: response.data.email,
          })
        );

        if (rememberMe) {
          localStorage.setItem("access", response.data.access);
          localStorage.setItem("refresh", response.data.refresh);
        } else {
          sessionStorage.setItem("access", response.data.access);
          sessionStorage.setItem("refresh", response.data.refresh);
        }



        if (rememberMe) {
          localStorage.setItem("rememberEmail", email);

        }
        else {
          localStorage.removeItem("rememberEmail");
        }

        navigate("/dashboard")
      }


    }
    catch (error) {
      console.log(error);
      alert("login Failed");
    }
  }

  return (
    <div className="login-page">
      <div className="login-left">
        <Link to="/" className="login-brand">
          <div className="login-brand-logo">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a9 9 0 0 1 0 18M12 3a9 9 0 0 0 0 18" />
            </svg>
          </div>
          <span>CranioAI</span>
        </Link>
        <div className="login-illustration">
          <svg viewBox="0 0 200 240" width="200" height="240">
            <ellipse cx="100" cy="120" rx="70" ry="100" fill="none" stroke="rgba(108,240,174,0.5)" strokeWidth="1.5" />
            <ellipse cx="100" cy="120" rx="55" ry="85" fill="none" stroke="rgba(108,240,174,0.35)" strokeWidth="1" />
            <ellipse cx="100" cy="120" rx="40" ry="65" fill="none" stroke="rgba(108,240,174,0.25)" strokeWidth="1" />
            <line x1="100" y1="20" x2="100" y2="220" stroke="rgba(108,240,174,0.5)" strokeWidth="1" strokeDasharray="4 4" />
            <circle cx="80" cy="95" r="6" fill="rgba(108,240,174,0.7)" />
            <circle cx="120" cy="95" r="6" fill="rgba(108,240,174,0.7)" />
            <path d="M 90 140 Q 100 150 110 140" fill="none" stroke="rgba(108,240,174,0.7)" strokeWidth="2" />
            <path d="M 85 165 Q 100 175 115 165" fill="none" stroke="rgba(108,240,174,0.7)" strokeWidth="2" />
          </svg>
        </div>
        <h2 className="login-tagline">AI-Powered Facial Symmetry Analysis</h2>
        <p className="login-subtext">Discover your best version with advanced 3D face analysis technology</p>
      </div>

      <div className="login-right">
        <div className="login-form-wrap">
          <h1 className="login-title">Welcome Back</h1>
          <p className="login-subtitle">Sign in to your account to continue</p>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-field">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="login-field">
              <label>Password</label>
              <div className="password-input">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder='Enter your password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >

                  {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                </span>
              </div>
            </div>
            <div className="login-form-row">
              <label className="login-remember">
                <input type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => {
                    setRememberMe(e.target.checked);
                  }}
                />
                Remember me
              </label>
              <a href="#" className="login-forgot">Forgot password?</a>
            </div>
            <button type="submit" className="login-submit">Sign In</button>
          </form>

          <div className="login-divider"><span>or</span></div>

          <button className="login-google" onClick={() => googleLogin()}>
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38z" />
            </svg>
            Continue with Google
          </button>

          <p className="login-signup">
            Don&apos;t have an account? <Link to="/signup">Sign up free</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
