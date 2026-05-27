import { Link } from "react-router-dom";

function ServicesPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-12 py-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Our Services</h1>
        <p className="mx-auto max-w-2xl text-lg text-slate-600">
          We don't just deliver products; we provide a seamless shopping experience 
          built on reliability, speed, and exceptional support.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {[
          {
            title: "Curated Selection",
            body: "Every product in our store undergoes a strict quality check. We prioritize materials that last and designs that stay timeless, so you spend less time replacing and more time enjoying.",
            icon: "💎",
          },
          {
            title: "Precision Logistics",
            body: "Our logistics network is optimized for speed and accuracy. With real-time tracking and proactive updates, you'll always know exactly where your order is.",
            icon: "🚀",
          },
          {
            title: "Secure Ecosystem",
            body: "Your data security is non-negotiable. We use industry-leading encryption and fraud prevention tools to ensure your checkout process is safe and worry-free.",
            icon: "🛡️",
          },
          {
            title: "Concierge Support",
            body: "Have a question about a product or an order? Our specialists are available around the clock to provide personalized guidance and resolve issues instantly.",
            icon: "🎧",
          },
        ].map((service) => (
          <div
            key={service.title}
            className="group rounded-3xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
          >
            <div className="mb-4 text-3xl">{service.icon}</div>
            <h2 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-slate-700 transition-colors">
              {service.title}
            </h2>
            <p className="text-sm leading-relaxed text-slate-600">
              {service.body}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-3xl border border-slate-200 bg-slate-900 p-10 text-center space-y-6 text-white">
        <h2 className="text-2xl font-bold">Ready to upgrade your lifestyle?</h2>
        <p className="text-slate-300 max-w-lg mx-auto text-sm">
          Join thousands of satisfied customers who trust ShopLight for their modern essentials.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/products"
            className="rounded-full bg-white px-8 py-3 text-sm font-bold text-slate-900 hover:bg-slate-100 transition-colors"
          >
            Shop Now
          </Link>
          <Link
            to="/contact"
            className="rounded-full border border-slate-700 px-8 py-3 text-sm font-bold text-white hover:bg-slate-800 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ServicesPage;