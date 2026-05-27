import { useState } from "react";
import { Link } from "react-router-dom";
import { apiClient } from "../../api/api.js";

function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: "", message: "" });
    setIsSubmitting(true);

    try {
      // The backend expects 'name' (combined), 'email', and 'message'
      const payload = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        message: formData.message,
      };

      await apiClient.post("/contact", payload);
      setStatus({ type: "success", message: "Message sent! We will get back to you soon." });
      setFormData({ firstName: "", lastName: "", email: "", message: "" });
    } catch (err) {
      setStatus({ 
        type: "error", 
        message: err.response?.data?.message || "Something went wrong. Please try again later." 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">Contact</h1>
        <p className="mt-2 text-sm text-slate-600">
          Reach out for order support, product questions, or partnership
          inquiries.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900">Send a message</h2>
        <form
          className="mt-4 grid gap-4 sm:grid-cols-2"
          onSubmit={handleSubmit}
        >
          <div>
            <label className="text-sm font-semibold text-slate-700">
              First name
            </label>
            <input 
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" 
              required
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700">
              Last name
            </label>
            <input 
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" 
              required
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm font-semibold text-slate-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              required
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm font-semibold text-slate-700">
              Message
            </label>
            <textarea
              name="message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              required
            />
          </div>

          {status.message && (
            <div className={`sm:col-span-2 p-3 rounded-lg text-sm ${
              status.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-rose-50 text-rose-700 border border-rose-200"
            }`}>
              {status.message}
            </div>
          )}

          <div className="sm:col-span-2 flex flex-wrap gap-3">
            <button 
              disabled={isSubmitting}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              {isSubmitting ? "Sending..." : "Send message"}
            </button>
            <Link
              to="/"
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
            >
              Back to home
            </Link>
          </div>
        </form>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-slate-900">Email</h3>
          <p className="mt-2 text-sm text-slate-600">hello@shoplight.io</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-slate-900">Phone</h3>
          <p className="mt-2 text-sm text-slate-600">+251 900 000 000</p>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;