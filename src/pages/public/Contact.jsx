import { Link } from "react-router-dom";

function ContactPage() {
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
          onSubmit={(event) => {
            event.preventDefault();
            alert("Message sent (simulation).");
          }}
        >
          <div>
            <label className="text-sm font-semibold text-slate-700">
              First name
            </label>
            <input className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700">
              Last name
            </label>
            <input className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm font-semibold text-slate-700">Email</label>
            <input
              type="email"
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm font-semibold text-slate-700">
              Message
            </label>
            <textarea
              rows="5"
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
          </div>
          <div className="sm:col-span-2 flex flex-wrap gap-3">
            <button className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
              Send message
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