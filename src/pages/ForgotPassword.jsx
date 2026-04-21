import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isStrongPassword } from "../utils/auth.js";
import { resetPassword } from "../services/auth.js";

function ForgotPasswordPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [message, setMessage] = useState({ type: "", text: "" });

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage({ type: "", text: "" });

        if (!isStrongPassword(newPassword)) {
            setMessage({
                type: "error",
                text: "Password does not meet requirements.",
            });
            return;
        }
        if (newPassword !== confirm) {
            setMessage({ type: "error", text: "Passwords do not match." });
            return;
        }

        const result = await resetPassword({
            email: email.trim(),
            password: newPassword,
        });
        if (!result.ok) {
            setMessage({
                type: "error",
                text: result.message || "Unable to reset password.",
            });
            return;
        }

        setMessage({ type: "success", text: "Password updated successfully." });
        setTimeout(() => navigate("/login"), 1200);
    };

    return (
        <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="text-center">
                <div className="text-lg font-semibold text-slate-900">
                    ShopLight
                </div>
                <p className="mt-2 text-sm text-slate-500">Password Recovery</p>
            </div>

            <h1 className="mt-6 text-2xl font-semibold text-slate-900">
                Reset Password
            </h1>
            <p className="mt-2 text-sm text-slate-600">
                Enter your email and choose a new secure password.
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
                    <label className="text-sm font-semibold text-slate-700">
                        Email
                    </label>
                    <input
                        className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="text-sm font-semibold text-slate-700">
                        New Password
                    </label>
                    <input
                        type="password"
                        className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                        value={newPassword}
                        onChange={(event) => setNewPassword(event.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="text-sm font-semibold text-slate-700">
                        Confirm New Password
                    </label>
                    <input
                        type="password"
                        className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                        value={confirm}
                        onChange={(event) => setConfirm(event.target.value)}
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
                >
                    Update Password
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
