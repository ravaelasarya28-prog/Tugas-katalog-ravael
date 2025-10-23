import React, { useEffect, useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth"; // ✅ tambahin signInWithPopup
import { auth, googleProvider } from "../../firebase"; 
import { useNavigate } from "react-router-dom";
import "./loginAdmin.css";

function LoginAdmin() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log("Login sukses:", user.email);
      navigate("/dashboardbackup");
    } catch (err) {
      setError("Login gagal: " + err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider); // ✅ pakai signInWithPopup
      const user = result.user;

      if (user) {
        console.log("Login sukses (Google):", user.email);
        navigate("/dashboardbackup");
      }
    } catch (err) {
      console.error("Login gagal (Google):", err.message);
      setError("Login gagal: " + err.message);
    }
  };



  return (
    <div className="login-container-admin-dashboard">
      <h2 className="judl-halaman-login-admin-dashboard">Login Admin</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="tombol-login-admin-auth-dashboard">Login</button>

        {/* Tombol Google */}
        <button type="button" className="social-btn-login-admin-dashboard-Google" onClick={handleGoogleLogin}>
          <svg width="20" height="20" viewBox="0 0 533.5 544.3">
            <path fill="#4285F4" d="M533.5 278.4c0-17.7-1.5-35.1-4.4-51.9H272v98.3h146.9c-6.4 34-25.9 62.8-55.2 82v68h89.2c52-48 82.6-118.8 82.6-196.4z" />
            <path fill="#34A853" d="M272 544.3c74.9 0 137.7-24.8 183.6-67.4l-89.2-68c-24.9 16.7-56.8 26.5-94.4 26.5-72.7 0-134.3-49-156.4-114.6h-92.6v71.9C86.3 470.4 172 544.3 272 544.3z" />
            <path fill="#FBBC05" d="M115.6 321.7c-11.7-34.5-11.7-71.5 0-106l-92.6-71.9c-40.9 79.2-40.9 172.3 0 251.5l92.6-73.6z" />
            <path fill="#EA4335" d="M272 107.4c39.6-.6 77 14 105.7 40.5l79-79C409.8 24.5 346.9 0 272 0 172 0 86.3 73.9 23 179.4l92.6 71.9C137.7 156.4 199.3 107.4 272 107.4z" />
          </svg>
          <span>Google</span>
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default LoginAdmin;
