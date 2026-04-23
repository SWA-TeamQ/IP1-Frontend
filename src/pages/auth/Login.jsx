import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { isValidEmail } from "../../utils/auth.js";

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSubmit = (event) => {
    event.preventDefault();
    setMessage({ type: "", text: "" });

    if (!isValidEmail(email)) {
      setMessage({ type: "error", text: "Invalid email address." });
      return;
    }

    const result = login(email, password);
    if (!result.ok) {
      setMessage({ type: "error", text: result.message });
      return;
    }

    setMessage({ type: "success", text: "Login successful. Redirecting..." });
    setTimeout(() => navigate("/profile"), 800);
  };

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="text-center">
        <div className="text-lg font-semibold text-slate-900">ShopLight</div>
        <p className="mt-2 text-sm text-slate-500">Smart & Simple Shopping</p>
      </div>

      <h1 className="mt-6 text-2xl font-semibold text-slate-900">
        Welcome Back
      </h1>
      <p className="mt-2 text-sm text-slate-600">Login to continue shopping</p>

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
            Email Address
          </label>
          <input
            type="email"
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
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
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
        >
          Login
        </button>
      </form>

      <div className="mt-6 text-sm text-slate-600">
        <Link to="/forgot-password" className="font-semibold text-slate-900">
          Forgot Password?
        </Link>
      </div>
      <div className="mt-4 text-sm text-slate-600">
        Don't have an account?{" "}
        <Link to="/register" className="font-semibold text-slate-900">
          Create one
        </Link>
      </div>
    </div>
  );
}

export default LoginPage;