import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Signup.css'
import axios from "axios"
import { useNavigate } from 'react-router-dom'
import { FaEye, FaEyeSlash } from "react-icons/fa";
import loginBg from "../../assets/login-bg.png";

export default function Signup() {

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {

    e.preventDefault()
    console.log('Signup:', form)

    if (form.password !== form.confirm) {
      alert("Passwords do not match");
      return;
    }

    try {

      const data = {
        username: form.name,
        email: form.email,
        password: form.password
      };

      const response = await axios.post("http://127.0.0.1:8000/accounts/signup/", data);

      alert(response.data.message);

      if (response.data.message === "User created Successfully") {
        navigate("/login");
      }

    } catch (error) {
      console.log(error);
      alert("signup Failed");
    }

  }



  return (
    <div className="signup-page">
      <div className="signup-left">
        <img
          src={loginBg}
          alt="Signup Background"
          className="signup-bg-image"
        />

        <div className="hero-logo">
          <h2>Cranio<span>AI</span></h2>
        </div>

        <div className="hero-content">

          <div className="ai-badge">
            AI-POWERED
          </div>

          <h1 className="hero-title">
            Precision.<br />
            <span>Symmetry.</span><br />
            Perfection.
          </h1>

          <div className="hero-line"></div>

          <p className="hero-description">
            Advanced 3D facial analysis technology
            <br />
            for accurate insights and better outcomes.
          </p>

        </div>


        <div className="feature-box">
          <div className="feature">
            <h4>Secure & Private</h4>
          </div>
        </div>

        <div className="trusted">
          🛡 Trusted by professionals. Built for accuracy.
        </div>

      </div>



      <div className="signup-right">
        <div className="signup-form-wrap">
          <h1 className="signup-title">Create Account</h1>
          <p className="signup-subtitle">Get started with CranioAI in seconds</p>

          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="signup-field">
              <label>Full Name</label>
              <input type="text" name="name" placeholder="John Doe" value={form.name} onChange={handleChange} required />
            </div>
            <div className="signup-field">
              <label>Email Address</label>
              <input type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
            </div>
            <div className="signup-field">
              <label>Password</label>
              <div className="password-input">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a Password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                <span
                  className='toggle-password'
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}

                </span>
              </div>
            </div>
            <div className="signup-field">
              <label>Confirm Password</label>
              <div className="password-input">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirm"
                  placeholder="ConfirmPassword"
                  value={form.confirm}
                  onChange={handleChange}
                  required
                />
                <span
                  className='toggle-password'
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}

                </span>


              </div>
            </div>
            <label className="signup-terms">
              <input type="checkbox" required /> I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
            </label>
            <button type="submit" className="signup-submit">Create Account</button>
          </form>

          <div className="signup-divider"><span>or</span></div>

          <button className="signup-google">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38z" />
            </svg>
            Sign up with Google
          </button>

          <p className="signup-login">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
