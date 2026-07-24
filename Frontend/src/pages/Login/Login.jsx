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
import loginBg from "../../assets/login-bg.png"


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
        <img
          src={loginBg}
          alt='Login Background'
          className="login-bg-image"
        />

        <div className="hero-content">
          {/* <div className="hero-logo">
            <img src={logo} alt="CranioAI Logo" />
            <h2>Cranio<span>AI</span></h2>
          </div> */}

          <div className="hero-logo">
            <h2>Cranio<span>AI</span></h2>
          </div>

          <div className="ai-badge">
            AI-Powered
          </div>
          <h1 className="hero-title">
            Precision.
            <br />
            <span>Symmetry.</span>
            <br />
            Perfection.
          </h1>
          <div className='hero-line'></div>
          <p className='hero-description'>
            Advanced 3D facial analysis technology
            <br />
            for accurate insights and better outcomes.
          </p>

          <div className="feature-box">

            <div className="feature">
              <div className="icon">🛡️</div>
              <h4>Secure & Private</h4>
              <p>Your data is encrypted and protected</p>
            </div>

            <div className="divider"></div>

            <div className="feature">
              <div className="icon">🧠</div>
              <h4>AI-Powered</h4>
              <p>Advanced AI for precise symmetry analysis</p>
            </div>

            <div className="divider"></div>

            <div className="feature">
              <div className="icon">📦</div>
              <h4>3D Visualization</h4>
              <p>Detailed 3D insights and visual feedback</p>
            </div>

          </div>

          <div className="trusted">
            🛡️ Trusted by professionals. Built for accuracy.
          </div>
        </div>
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
