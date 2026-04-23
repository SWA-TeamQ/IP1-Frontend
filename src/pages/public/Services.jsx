import { Link } from "react-router-dom";

function ServicesPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">Services</h1>
        <p className="mt-2 text-sm text-slate-600">
          Support tailored to every step of your shopping journey.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {[
          {
            title: "Curated Quality",
            body: "Each item is tested for performance, durability, and style.",
          },
          {
            title: "Fast Shipping",
            body: "Reliable delivery with proactive tracking updates.",
          },
          {
            title: "Secure Checkout",
            body: "Encrypted payments with fraud monitoring built in.",
          },
          {
            title: "24/7 Support",
            body: "Dedicated specialists ready to help anytime.",
          },
        ].map((service) => (
          <div
            key={service.title}
            className="rounded-2xl border border-slate-200 bg-white p-6"
          >
            <h2 className="text-lg font-semibold text-slate-900">
              {service.title}
            </h2>
            <p className="mt-2 text-sm text-slate-600">{service.body}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          to="/products"
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
        >
          Shop products
        </Link>
        <Link
          to="/contact"
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
        >
          Contact support
        </Link>
      </div>
    </div>
  );
}

export default ServicesPage;