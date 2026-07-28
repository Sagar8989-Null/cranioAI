import { useEffect, useRef, useState } from "react";
import axios from "axios";

const API = "http://127.0.0.1:8000/accounts/profile/";

export default function ProfileImageUploader() {
  // const [profile, setProfile] = useState(null);

  const [profile, setProfile] = useState(() => {
    const dashboardData = JSON.parse(
      localStorage.getItem("dashboardData") || "{}"
    );

    return dashboardData.user || {};
  });

  const [uploading, setUploading] = useState(false);

  const inputRef = useRef();

  const access_token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");

  // const fetchProfile = async () => {
  //   try {
  //     const res = await axios.get(API, {
  //       headers: {
  //         Authorization: `Bearer ${access_token}`,
  //       },
  //     });

  //     setProfile(res.data);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  // useEffect(() => {
  //   fetchProfile();
  // }, []);

  const uploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profile_image", file);

    try {
      setUploading(true);

      const res = await axios.put(API, formData, {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "multipart/form-data",
        },
      });

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

      setProfile(dashboardData.user);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="profile-avatar">
      {profile?.profile_image ? (
        <img className="avatar-circle"
          src={`http://127.0.0.1:8000/${profile.profile_image}`}
          alt="Profile"
        />
      ) : (
        <div className="avatar-circle">
          {profile?.username?.charAt(0).toUpperCase() || "U"}
        </div>
      )}

      <button
        className="camera-btn"
        onClick={() => inputRef.current.click()}
        disabled={uploading}
      >
        📷
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={uploadImage}
      />
    </div>
  );
}