import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { isValidEmail } from "../utils/auth.js";

function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!isValidEmail(formData.email)) {
      setMessage({ type: "error", text: "Invalid email address." });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match." });
      return;
    }

    if (formData.password.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters." });
      return;
    }

    setLoading(true);
    const result = await register({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
    });
    setLoading(false);

    if (!result.ok) {
      setMessage({ type: "error", text: result.message });
      return;
    }

    setMessage({
      type: "success",
      text: "Registration successful! Redirecting to login...",
    });
    setTimeout(() => navigate("/login"), 1500);
  };

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="text-center">
        <div className="text-lg font-semibold text-slate-900">ShopLight</div>
        <p className="mt-2 text-sm text-slate-500">Create your account</p>
      </div>

      {message.text && (
        <div
          className={`mt-4 rounded-lg px-4 py-2 text-sm ${
            message.type === "error"
              ? "bg-rose-50 text-rose-600"
              : "bg-emerald-50 text-emerald-600"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-slate-700">First Name</label>
            <input
              name="firstName"
              type="text"
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              value={formData.firstName}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700">Last Name</label>
            <input
              name="lastName"
              type="text"
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              value={formData.lastName}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700">Email Address</label>
          <input
            name="email"
            type="email"
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700">Password</label>
          <input
            name="password"
            type="password"
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700">Confirm Password</label>
          <input
            name="confirmPassword"
            type="password"
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Creating account..." : "Register"}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-slate-600">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-slate-900">
          Login
        </Link>
      </div>
    </div>
  );
}

export default RegisterPage;
