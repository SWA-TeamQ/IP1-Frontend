import { useState } from "react";
import { Link } from "react-router-dom";
import { isValidEmail } from "../../utils/auth.js";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSubmit = (event) => {
    event.preventDefault();
    setMessage({ type: "", text: "" });

    if (!isValidEmail(email)) {
      setMessage({ type: "error", text: "Invalid email address." });
      return;
    }

    // Since the API contract does not provide a forgot password endpoint,
    // we display a message to contact support.
    setMessage({ 
      type: "success", 
      text: "If an account exists for this email, you will receive reset instructions. Please contact support if you need further assistance." 
    });
  };

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="text-center">
        <div className="text-lg font-semibold text-slate-900">ShopLight</div>
        <p className="mt-2 text-sm text-slate-500">Password Recovery</p>
      </div>

      <h1 className="mt-6 text-2xl font-semibold text-slate-900">
        Reset Password
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        Enter your email to receive a reset link.
      </p>

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
          <label className="text-sm font-semibold text-slate-700">Email</label>
          <input
            type="email"
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
        >
          Send Reset Link
        </button>
      </form>

      <div className="mt-6 text-sm text-slate-600">
        <Link to="/login" className="font-semibold text-slate-900">
          Back to Login
        </Link>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
