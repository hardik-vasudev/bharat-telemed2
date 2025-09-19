import Link from "next/link";

export function CTASection() {
  return (
    <section className="glass-card p-8 shadow-xl max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-medical-900 mb-4">
        Doctor Dashboard Ready
      </h2>
      <p className="text-medical-700 mb-6">
        Join Bharat Telemed today and transform your medical practice.
        Our comprehensive doctor dashboard is live with powerful features
        designed to enhance patient care and streamline medical practice management.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/auth/signup" className="btn btn-primary">
          Sign Up as Doctor
        </Link>
        <Link href="/auth/login" className="btn btn-outline">
          Login
        </Link>
      </div>
    </section>
  );
}