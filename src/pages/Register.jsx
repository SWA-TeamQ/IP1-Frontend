import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { isValidEmail, isStrongPassword } from "../utils/auth.js";

function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });

  const updateField = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (event) => {
    event.preventDefault();
    setMessage({ type: "", text: "" });

    if (!isValidEmail(form.email)) {
      setMessage({ type: "error", text: "Invalid email address." });
      return;
    }
    if (!isStrongPassword(form.password)) {
      setMessage({ type: "error", text: "Password is too weak." });
      return;
    }
    if (form.password !== form.confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match." });
      return;
    }

    const result = register({
      fullName: form.fullName,
      email: form.email,
      phone: form.phone,
      password: form.password,
    });

    if (!result.ok) {
      setMessage({ type: "error", text: result.message });
      return;
    }

    setMessage({
      type: "success",
      text: "Account created successfully. Redirecting to login...",
    });
    setTimeout(() => navigate("/login"), 1200);
  };

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="text-center">
        <div className="text-lg font-semibold text-slate-900">ShopLight</div>
        <p className="mt-2 text-sm text-slate-500">
          Create your shopping account
        </p>
      </div>

      <h1 className="mt-6 text-2xl font-semibold text-slate-900">
        Create Account
      </h1>
      <p className="mt-2 text-sm text-slate-600">All fields are required</p>

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
        <div>
          <label className="text-sm font-semibold text-slate-700">
            Full Name
          </label>
          <input
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            value={form.fullName}
            onChange={(event) => updateField("fullName", event.target.value)}
            required
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-700">Email</label>
          <input
            type="email"
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
            required
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-700">
            Phone Number
          </label>
          <input
            type="tel"
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            value={form.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            required
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-700">
            Password
          </label>
          <input
            type="password"
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            value={form.password}
            onChange={(event) => updateField("password", event.target.value)}
            required
          />
          <p className="mt-1 text-xs text-slate-500">
            Min 8 chars, uppercase, lowercase & number
          </p>
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-700">
            Confirm Password
          </label>
          <input
            type="password"
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            value={form.confirmPassword}
            onChange={(event) =>
              updateField("confirmPassword", event.target.value)
            }
            required
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
        >
          Create Account
        </button>
      </form>

      <div className="mt-6 text-sm text-slate-600">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-slate-900">
          Login
        </Link>
      </div>
    </div>
  );
}

export default RegisterPage;