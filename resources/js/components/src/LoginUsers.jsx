import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth, db, googleProvider } from "../../firebase";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import "./css/Loginusers.css";

function LoginUsers() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const navigate = useNavigate();

  // 🔹 Login dengan Email & Password
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      console.log("Login sukses:", user.email);
      navigate("/home");
    } catch (err) {
      setError("Login gagal: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Login dengan Google
  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      if (user) {
        console.log("Login sukses (Google):", user.email);
        navigate("/home");
      }
    } catch (err) {
      console.error("Login gagal (Google):", err.message);
      setError("Login gagal: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Reset Password
  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Email reset password sudah dikirim. Cek inbox kamu!");
    } catch (err) {
      setError("Terjadi kesalahan: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container-users">
      <div className="login-left-users">

      </div>

      <div className="login-right-users">
        <div className="login-box-users">
          <h2>Welcome Back!</h2>
          <p>Please login to your account</p>

          {error && <div className="error">{error}</div>}
          {message && <div className="success">{message}</div>}

          <form onSubmit={handleLogin}>
            {/* Email */}
            <div className="input-group-users">
              <label>Email:</label>
              <div className="input-wrapper-users">
                <Mail className="icon" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="input-group-users">
              <label>Password:</label>
              <div className="input-wrapper-users">
                <Lock className="icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="show-btn-users"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            {/* Options */}
            <div className="options-users">
              <label>
                <input type="checkbox" /> Remember me
              </label>
              <button
                type="button"
                className="forgot-btn"
                onClick={() => setShowForgot(true)}
              >
                Forgot Password?
              </button>
            </div>

            {/* Login Button */}
            <button type="submit" disabled={loading}>
              {loading ? "Loading..." : "Login"}
            </button>

            <div className="divider-users">or continue with</div>

            {/* Social Login */}
            <div className="social-login-users">
              {/* Google */}
              <button
                type="button"
                className="social-btn-google-users"
                onClick={handleGoogleLogin}
                disabled={loading}
              >
                <svg width="18" height="18" viewBox="0 0 533.5 544.3">
                  <path
                    fill="#4285F4"
                    d="M533.5 278.4c0-17.7-1.5-35.1-4.4-51.9H272v98.3h146.9c-6.4 34-25.9 62.8-55.2 82v68h89.2c52-48 82.6-118.8 82.6-196.4z"
                  />
                  <path
                    fill="#34A853"
                    d="M272 544.3c74.9 0 137.7-24.8 183.6-67.4l-89.2-68c-24.9 16.7-56.8 26.5-94.4 26.5-72.7 0-134.3-49-156.4-114.6h-92.6v71.9C86.3 470.4 172 544.3 272 544.3z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M115.6 321.7c-11.7-34.5-11.7-71.5 0-106l-92.6-71.9c-40.9 79.2-40.9 172.3 0 251.5l92.6-73.6z"
                  />
                  <path
                    fill="#EA4335"
                    d="M272 107.4c39.6-.6 77 14 105.7 40.5l79-79C409.8 24.5 346.9 0 272 0 172 0 86.3 73.9 23 179.4l92.6 71.9C137.7 156.4 199.3 107.4 272 107.4z"
                  />
                </svg>
                <span>Google</span>
              </button>

              {/* Facebook */}
              <button type="button" className="social-btn-facebook-users">
                <svg width="18" height="18" viewBox="0 0 320 512">
                  <path
                    fill="#1877F2"
                    d="M279.14 288l14.22-92.66h-88.91V117.33c0-25.35 12.42-50.06 52.24-50.06H293V6.26S259.36 0 225.36 0C141.09 0 89.09 54.42 89.09 154.81V195.3H0v92.66h89.09V512h107.78V288z"
                  />
                </svg>
                <span>Facebook</span>
              </button>

              {/* Admin */}
              <Link to="/loginAnd" className="social-btn-Admin">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="8" r="4" fill="white" />
                  <path fill="white" d="M4 22c0-4 4-6 8-6s8 2 8 6H4z" />
                </svg>
                <span>Admin</span>
              </Link>
            </div>

            {/* Register */}
            <div className="signup">
              Don't have an account? <Link to="/register">Sign up</Link>
            </div>
          </form>

          {/* Reset Password Form */}
          {showForgot && (
            <div className="reset-box">
              <h3>Reset Password</h3>
              <p>Masukkan email untuk reset password</p>
              <form onSubmit={handleReset}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
                <button type="submit" disabled={loading}>
                  {loading ? "Loading..." : "Kirim Reset Link"}
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowForgot(false)}
                >
                  Batal
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LoginUsers;
