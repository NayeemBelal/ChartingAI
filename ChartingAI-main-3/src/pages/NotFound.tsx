import { Link } from "react-router-dom";

const NotFound = () => (
  <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white px-6 text-center text-slate-900">
    <p className="text-sm uppercase tracking-wide text-slate-500">404</p>
    <h1 className="text-3xl font-semibold">Page Not Found</h1>
    <p className="max-w-md text-sm text-slate-600">
      The page you are looking for could not be located. Check the address or return to the dashboard to continue.
    </p>
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Link
        to="/"
        className="rounded border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
      >
        Go Home
      </Link>
      <Link
        to="/dashboard"
        className="rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
      >
        Open Dashboard
      </Link>
    </div>
  </main>
);

export default NotFound;

