'use client'

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { HeroSection } from "@/components/coming-soon/hero-section";
import { FeaturesGrid } from "@/components/coming-soon/features-grid";
import { CTASection } from "@/components/coming-soon/cta-section";
import { Footer } from "@/components/coming-soon/footer";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen medical-gradient flex items-center justify-center p-4">
      <main className="max-w-4xl w-full text-center">
        <HeroSection />
        <FeaturesGrid />
        <CTASection />
        <Footer />
      </main>
    </div>
  );
}
