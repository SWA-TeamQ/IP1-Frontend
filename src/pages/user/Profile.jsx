import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center">
        <h1 className="text-2xl font-semibold text-slate-900">Profile</h1>
        <p className="mt-2 text-sm text-slate-600">
          Please sign in to view your profile.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            to="/login"
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
          >
            Register
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">Profile</h1>
        <p className="mt-2 text-sm text-slate-600">
          Manage your account and view saved details.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="text-lg font-semibold text-slate-900">
          {user.firstName} {user.lastName}
        </div>
        <div className="mt-4 text-sm text-slate-500">Email</div>
        <div className="text-sm font-semibold text-slate-900">
          {user.email}
        </div>
        {user.phone && (
          <>
            <div className="mt-4 text-sm text-slate-500">Phone</div>
            <div className="text-sm font-semibold text-slate-900">
              {user.phone}
            </div>
          </>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => {
            logout();
            navigate("/");
          }}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
        >
          Logout
        </button>
        <Link
          to="/products"
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
        >
          Shop products
        </Link>
      </div>
    </div>
  );
}

export default ProfilePage;