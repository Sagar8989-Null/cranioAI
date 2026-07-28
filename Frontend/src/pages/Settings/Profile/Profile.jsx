import "./Profile.css";
import ProfileImageUploader from "../Components/ProfileImageUploader";
import { useEffect, useState } from "react";
import axios from "axios";


export default function Profile() {

  const dashboardData = JSON.parse(
    localStorage.getItem("dashboardData") || "{}"
  );

  const [user, setUser] = useState(
    dashboardData.user || {}
  );

  const [formData, setFormData] = useState({
    full_name: "",
    phone_number: "",
    location: "",
    about: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const access_token =
    localStorage.getItem("access_token") ||
    sessionStorage.getItem("access_token");

  const handleSave = async () => {
    try {
      const res = await axios.put(
        "http://127.0.0.1:8000/accounts/profile/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      const dashboardData = JSON.parse(
        localStorage.getItem("dashboardData") || "{}"
      );

      dashboardData.user = {
        ...dashboardData.user,
        ...res.data,
      };

      localStorage.setItem(
        "dashboardData",
        JSON.stringify(dashboardData)

      );

      setFormData({
        full_name: "",
        phone_number: "",
        location: "",
        about: "",
      });

      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="profile-page">

      {/* Header */}
      <div className="profile-header">
        <div className="breadcrumb">
          <span>Settings</span>
          <span className="breadcrumb-arrow">›</span>
          <span>Profile</span>
        </div>
        <h2>Profile</h2>
        <p>Manage your personal information and profile details</p>
      </div>


      {/* Main Grid */}
      <div className="profile-grid">

        {/* ================= Sidebar ================= */}

        <div className="profile-sidebar">
          <div className="profile-card">

            <ProfileImageUploader />

            <h3>{user.full_name || user.username}</h3>
            <span className="premium-badge">Premium</span>
            <p className="member-since">Member since May 2024</p>
            <hr />

            <div className="profile-info">
              <div className="info-item">📧<span>{user.email}</span></div>
              <div className="info-item">📍<span>{user.location || "Not provided"}</span></div>
              <div className="info-item">📞<span>{user.phone_number || "Not provided"}</span></div>
              <div className="info-item"><span>{user.about}</span></div>
            </div>

            {/* <button className="edit-profile-btn">Edit Profile</button> */}

          </div>
        </div>

        {/*  Right Side */}

        <div className="profile-content">
          {/* Personal Information */}
          <div className="content-card">
            <h3>Personal Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input type="email" value={user.email || ""} readOnly />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input type="text" name="phone_number" value={formData.phone_number} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input type="text" name="location" value={formData.location} onChange={handleChange} />
              </div>
            </div>

            <div className="form-group">
              <label>Bio</label>
              <textarea rows="4" name="about" value={formData.about} onChange={handleChange} />
            </div>
            <button className="save-btn" onClick={handleSave}>
              Save Changes
            </button>
          </div>

          {/* Bottom Cards */}

          <div className="bottom-grid">
            {/* Connected Accounts */}
            <div className="content-card">
              <h3>Connected Accounts</h3>
              <div className="account-item">
                <span>Google</span>
                <button>Connect</button>
              </div>
              <div className="account-item">
                <span>Apple</span>
                <button>Connect</button>
              </div>
              <div className="account-item">
                <span>Facebook</span>
                <button>Connect</button>
              </div>
            </div>

            {/* Statistics */}

            <div className="content-card">
              <h3>Account Statistics</h3>
              <div className="stats-item">
                <span>Total Scans</span>
                <strong>{dashboardData?.stats?.total_uploads || 0}</strong>
              </div>
              <div className="stats-item">
                <span>Member Since</span>
                <strong>May 15, 2024</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}