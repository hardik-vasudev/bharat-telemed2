import { Heart } from "lucide-react";

export function HeroSection() {
  return (
    <section className="mb-12">
      <div className="flex items-center justify-center mb-6">
        <div className="bg-medical-600 rounded-full p-4 mr-4">
          <Heart className="h-12 w-12 text-white" />
        </div>
        <h1 className="text-5xl font-bold text-medical-900">
          Bharat Telemed
        </h1>
      </div>
      <p className="text-xl text-medical-700 mb-8 max-w-2xl mx-auto">
        Revolutionizing healthcare through innovative telemedicine solutions.
        Connecting patients and doctors across India with cutting-edge technology.
      </p>
    </section>
  );
}