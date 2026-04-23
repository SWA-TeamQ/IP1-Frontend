import { Link } from "react-router-dom";

function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">About ShopLight</h1>
        <p className="mt-2 text-sm text-slate-600">
          We curate modern essentials that blend design, comfort, and reliable
          performance for everyday life.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {[
          {
            title: "Our Mission",
            body: "Deliver thoughtfully chosen products that elevate daily routines.",
          },
          {
            title: "Our Promise",
            body: "Transparent pricing, responsible sourcing, and quality you can trust.",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-slate-200 bg-white p-6"
          >
            <h2 className="text-lg font-semibold text-slate-900">
              {item.title}
            </h2>
            <p className="mt-2 text-sm text-slate-600">{item.body}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900">How we work</h2>
        <ul className="mt-3 space-y-2 text-sm text-slate-600">
          <li>• Vet products for performance and durability.</li>
          <li>• Curate collections around lifestyle needs.</li>
          <li>• Partner with makers who prioritize quality.</li>
        </ul>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          to="/products"
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
        >
          Shop products
        </Link>
        <Link
          to="/services"
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
        >
          View services
        </Link>
      </div>
    </div>
  );
}

export default AboutPage;