import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-900">Page not found</h1>
      <p className="mt-2 text-sm text-slate-600">
        The page you are looking for does not exist.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
      >
        Back to home
      </Link>
    </div>
  );
}

export default NotFoundPage;