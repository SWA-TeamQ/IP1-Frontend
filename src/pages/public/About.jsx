import { Link } from "react-router-dom";

function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-12 py-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Our Story</h1>
        <p className="mx-auto max-w-2xl text-lg text-slate-600">
          ShopLight was born from a simple idea: that high-quality, thoughtfully designed 
          essentials shouldn't be a luxury. We believe in the intersection of 
          form and function.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-md transition-shadow">
          <div className="mb-4 text-3xl">🎯</div>
          <h2 className="text-xl font-bold text-slate-900 mb-3">Our Mission</h2>
          <p className="text-sm leading-relaxed text-slate-600">
            To empower your daily life by providing tools and accessories that 
            enhance productivity, comfort, and style. We curate every single 
            item in our catalog with a rigorous eye for detail, ensuring that 
            what you buy today remains useful and beautiful for years to come.
          </p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-md transition-shadow">
          <div className="mb-4 text-3xl">🤝</div>
          <h2 className="text-xl font-bold text-slate-900 mb-3">Our Promise</h2>
          <p className="text-sm leading-relaxed text-slate-600">
            Transparency is at our core. From honest pricing to ethical sourcing, 
            we strive to build a relationship of trust with our community. We 
            don't just sell products; we provide a guarantee of quality and 
            dedicated support for every purchase you make.
          </p>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center space-y-6">
        <h2 className="text-2xl font-bold text-slate-900">Why Choose ShopLight?</h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            { label: "Curated Quality", desc: "Each product is vetted for durability." },
            { label: "Modern Design", desc: "Minimalist aesthetics, maximum utility." },
            { label: "Customer First", desc: "Support that actually listens." },
          ].map((item) => (
            <div key={item.label} className="space-y-2">
              <div className="font-bold text-slate-900">{item.label}</div>
              <div className="text-xs text-slate-600">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <Link
          to="/products"
          className="rounded-full bg-slate-900 px-8 py-3 text-sm font-bold text-white hover:bg-slate-800 transition-colors"
        >
          Explore Collection
        </Link>
        <Link
          to="/contact"
          className="rounded-full border border-slate-200 bg-white px-8 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          Get in Touch
        </Link>
      </div>
    </div>
  );
}

export default AboutPage;