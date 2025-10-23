import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { User, Mail, Lock } from "lucide-react";
import "./css/registerusers.css"; // CSS biasa

function RegisterUsers() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validasi password minimal 6 karakter
    if (password.length < 6) {
      setError("Password minimal 6 karakter.");
      setLoading(false);
      return;
    }

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "pengguna", res.user.uid), {
        nama: name,
        email,
        status: "user",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        last_login: null,
      });
      navigate("/login");
    } catch (err) {
      setError("Gagal membuat akun: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      {/* Left Image */}
      <div className="register-left">
       
      </div>

      {/* Right Form */}
      <div className="register-right">
        <div className="register-box">
          <h2>Create Account</h2>
          <p>Fill in your details to get started</p>

          {error && <div className="error">{error}</div>}

          <form onSubmit={handleRegister}>
            {/* Name */}
            <div className="input-group">
              <User className="icon" />
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Email */}
            <div className="input-group">
              <Mail className="icon" />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div className="input-group">
              <Lock className="icon" />
              <input
                type="password"
                placeholder="Password (min 6 chars)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" disabled={loading}>
              {loading ? "Registering..." : "Create Account"}
            </button>
          </form>

          <div className="login-link">
            Already have an account?{" "}
            <Link to="/login" className="link-btn">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterUsers;
