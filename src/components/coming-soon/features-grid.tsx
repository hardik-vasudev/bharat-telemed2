import { Activity, Users, Calendar } from "lucide-react";

const features = [
  {
    icon: Activity,
    title: "Real-time Monitoring",
    description: "Advanced health monitoring with instant data synchronization"
  },
  {
    icon: Users,
    title: "Expert Network",
    description: "Connect with certified healthcare professionals nationwide"
  },
  {
    icon: Calendar,
    title: "Smart Scheduling",
    description: "Intelligent appointment management and automated reminders"
  }
];

export function FeaturesGrid() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
      {features.map((feature, index) => (
        <div key={index} className="glass-card p-6 shadow-lg">
          <feature.icon className="h-8 w-8 text-medical-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-medical-900 mb-2">
            {feature.title}
          </h3>
          <p className="text-sm text-medical-700">
            {feature.description}
          </p>
        </div>
      ))}
    </section>
  );
}