import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/editProfile.css";

const EditProfile = () => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    name: "",
    mobile: "",
    email: "",
    dob: "",
    anniversary: "",
    gender: "",
    photo: "",
  });

  // 🔹 Load saved profile (realtime persistence)
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("userProfile"));

    if (saved) {
      setProfile(saved);
    } else {
      const defaultProfile = {
        name: "Nikhita Adigannavar",
        mobile: "",
        email: "nikhitaadigannavar14@gmail.com",
        dob: "2000-08-14",
        anniversary: "",
        gender: "",
        photo: "",
      };
      setProfile(defaultProfile);
      localStorage.setItem("userProfile", JSON.stringify(defaultProfile));
    }
  }, []);

  // 🔹 Handle editable inputs
  const handleChange = (e) => {
    const updated = { ...profile, [e.target.name]: e.target.value };
    setProfile(updated);
    localStorage.setItem("userProfile", JSON.stringify(updated));
  };

  // 🔹 Handle profile photo upload (camera / gallery)
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const updated = { ...profile, photo: reader.result };
      setProfile(updated);
      localStorage.setItem("userProfile", JSON.stringify(updated));
    };
    reader.readAsDataURL(file);
  };

  // 🔹 Save profile
  const handleUpdate = () => {
    localStorage.setItem("userProfile", JSON.stringify(profile));
    alert("Profile updated successfully");
    navigate(-1);
  };

  return (
    <div className="edit-profile-container">
      {/* Header */}
      <div className="edit-profile-header">
        {/* <span onClick={() => navigate(-1)}>⌄</span> */}
        <h3>Your Profile</h3>
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*"
        capture="environment"
        id="profileUpload"
        hidden
        onChange={handlePhotoChange}
      />

      {/* Profile Image */}
      <div
        className="profile-image-section"
        onClick={() => document.getElementById("profileUpload").click()}
      >
        <img
          src={
            profile.photo
              ? profile.photo
              : "/image/profile.jpg"
          }
          alt="profile"
          className="profile-image"
        />
        <div className="edit-icon">✎</div>
      </div>

      {/* Form */}
      <div className="profile-form">
        <label>Name</label>
        <input
          name="name"
          value={profile.name}
          onChange={handleChange}
        />

        <label>Mobile</label>
        <div className="input-with-action">
          <input
            value={profile.mobile}
            placeholder="Mobile"
            readOnly
          />
          <span onClick={() => navigate("/change-mobile")}>
            CHANGE
          </span>
        </div>

        <label>Email</label>
        <div className="input-with-action">
          <input
            value={profile.email}
            readOnly
          />
          <span onClick={() => navigate("/change-email")}>
            CHANGE
          </span>
        </div>

        <label>Date of birth</label>
        <input
          type="date"
          name="dob"
          value={profile.dob}
          onChange={handleChange}
        />

        <label>Anniversary</label>
        <input
          type="date"
          name="anniversary"
          value={profile.anniversary}
          onChange={handleChange}
        />

        <label>Gender</label>
        <input
          name="gender"
          value={profile.gender}
          placeholder="Gender"
          onChange={handleChange}
        />
      </div>

      {/* Update Button */}
      <button className="update-btn" onClick={handleUpdate}>
        Update profile
      </button>
    </div>
  );
};

export default EditProfile;
