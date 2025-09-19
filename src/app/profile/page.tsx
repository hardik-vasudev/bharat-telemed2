"use client";

import {
  User,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Award,
  BookOpen,
  Users,
  Star,
  Video,
  Clock,
  Heart,
  Stethoscope,
  GraduationCap,
  Trophy,
  Medal,
  Badge,
  Camera,
  Edit3,
  Briefcase,
  Globe,
  FileText,
  TrendingUp,
  CheckCircle2,
  Shield
} from "lucide-react";

const doctorProfile = {
  personalInfo: {
    name: "Dr. Rajesh Kumar",
    title: "MD, MBBS, Cardiologist",
    specialization: "Interventional Cardiology",
    experience: "15+ Years",
    location: "Mumbai, Maharashtra",
    phone: "+91 98765 43210",
    email: "dr.rajesh.kumar@bharattelemed.com",
    languages: ["Hindi", "English", "Marathi"],
    photo: null // We'll use an avatar placeholder
  },
  professionalStats: {
    totalConsultations: 2847,
    totalPatients: 1653,
    rating: 4.9,
    totalReviews: 342,
    successRate: 96.8,
    responseTime: "< 2 minutes",
    experienceYears: 15,
    onlineAvailability: "Mon-Sat, 9 AM - 6 PM"
  },
  education: [
    {
      degree: "MD - Cardiology",
      institution: "All India Institute of Medical Sciences (AIIMS), Delhi",
      year: "2012",
      grade: "First Class with Distinction"
    },
    {
      degree: "MBBS",
      institution: "King George's Medical University, Lucknow",
      year: "2008",
      grade: "Gold Medal"
    },
    {
      degree: "Fellowship in Interventional Cardiology",
      institution: "Apollo Hospitals, Chennai",
      year: "2014",
      grade: "Distinction"
    }
  ],
  certifications: [
    "Board Certified Cardiologist - Indian Medical Association",
    "Advanced Cardiac Life Support (ACLS) Certified",
    "Fellow of American College of Cardiology (FACC)",
    "European Society of Cardiology Member",
    "Interventional Cardiology Specialist Certificate"
  ],
  awards: [
    {
      title: "Best Cardiologist Award 2023",
      organization: "Maharashtra Medical Council",
      year: "2023",
      description: "For outstanding contribution to cardiac care"
    },
    {
      title: "Excellence in Telemedicine",
      organization: "Digital Health India",
      year: "2022",
      description: "Leading telemedicine adoption in cardiology"
    },
    {
      title: "Patient Choice Award",
      organization: "Healthcare Excellence Board",
      year: "2021",
      description: "Highest patient satisfaction ratings"
    },
    {
      title: "Research Excellence Award",
      organization: "Indian Heart Association",
      year: "2020",
      description: "For research in minimally invasive cardiac procedures"
    }
  ],
  specialties: [
    "Coronary Angioplasty",
    "Heart Failure Management",
    "Cardiac Catheterization",
    "Preventive Cardiology",
    "Arrhythmia Treatment",
    "Hypertension Management",
    "Chest Pain Evaluation",
    "ECG Interpretation"
  ],
  experience: [
    {
      position: "Senior Consultant Cardiologist",
      hospital: "Bharat Telemed Platform",
      duration: "2020 - Present",
      description: "Leading telemedicine consultations and patient care digitally"
    },
    {
      position: "Consultant Cardiologist",
      hospital: "Fortis Hospital, Mumbai",
      duration: "2016 - 2020",
      description: "Performed 500+ angioplasties with 98% success rate"
    },
    {
      position: "Assistant Professor",
      hospital: "KEM Hospital, Mumbai",
      duration: "2014 - 2016",
      description: "Teaching and clinical practice in interventional cardiology"
    }
  ]
};

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-brand-600 to-brand-700 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-start space-x-8">
            {/* Profile Photo */}
            <div className="relative">
              <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border-4 border-white/30">
                <User className="h-16 w-16 text-white" />
              </div>
              <button className="absolute bottom-2 right-2 w-8 h-8 bg-brand-500 rounded-full flex items-center justify-center hover:bg-brand-600 transition-colors">
                <Camera className="h-4 w-4 text-white" />
              </button>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{doctorProfile.personalInfo.name}</h1>
                  <p className="text-xl text-brand-100 mb-1">{doctorProfile.personalInfo.title}</p>
                  <p className="text-brand-200 mb-4">{doctorProfile.personalInfo.specialization}</p>

                  <div className="flex items-center space-x-6 text-brand-100">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span>{doctorProfile.personalInfo.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Briefcase className="h-4 w-4" />
                      <span>{doctorProfile.personalInfo.experience}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{doctorProfile.professionalStats.rating}</span>
                      <span>({doctorProfile.professionalStats.totalReviews} reviews)</span>
                    </div>
                  </div>
                </div>

                <button className="btn bg-white text-brand-600 hover:bg-brand-50 flex items-center space-x-2">
                  <Edit3 className="h-4 w-4" />
                  <span>Edit Profile</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Professional Statistics */}
            <div className="glass-card p-6">
              <h2 className="heading-3 mb-6 flex items-center">
                <TrendingUp className="h-5 w-5 text-brand-600 mr-2" />
                Professional Statistics
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Video className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{doctorProfile.professionalStats.totalConsultations.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Total Consultations</div>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{doctorProfile.professionalStats.totalPatients.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Patients Treated</div>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Star className="h-8 w-8 text-yellow-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{doctorProfile.professionalStats.rating}/5.0</div>
                  <div className="text-sm text-gray-600">Patient Rating</div>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Heart className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{doctorProfile.professionalStats.successRate}%</div>
                  <div className="text-sm text-gray-600">Success Rate</div>
                </div>
              </div>
            </div>

            {/* Education & Qualifications */}
            <div className="glass-card p-6">
              <h2 className="heading-3 mb-6 flex items-center">
                <GraduationCap className="h-5 w-5 text-brand-600 mr-2" />
                Education & Qualifications
              </h2>

              <div className="space-y-4">
                {doctorProfile.education.map((edu, index) => (
                  <div key={index} className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                        <p className="text-gray-600 mt-1">{edu.institution}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-sm text-gray-500">Year: {edu.year}</span>
                          <span className="status-badge bg-green-100 text-green-700">{edu.grade}</span>
                        </div>
                      </div>
                      <BookOpen className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Awards & Achievements */}
            <div className="glass-card p-6">
              <h2 className="heading-3 mb-6 flex items-center">
                <Trophy className="h-5 w-5 text-brand-600 mr-2" />
                Awards & Achievements
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {doctorProfile.awards.map((award, index) => (
                  <div key={index} className="border border-gray-100 rounded-lg p-4 hover:shadow-sm transition-all">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Medal className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{award.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{award.organization} • {award.year}</p>
                        <p className="text-xs text-gray-500 mt-2">{award.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Professional Experience */}
            <div className="glass-card p-6">
              <h2 className="heading-3 mb-6 flex items-center">
                <Briefcase className="h-5 w-5 text-brand-600 mr-2" />
                Professional Experience
              </h2>

              <div className="space-y-6">
                {doctorProfile.experience.map((exp, index) => (
                  <div key={index} className="relative">
                    {index !== doctorProfile.experience.length - 1 && (
                      <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-200"></div>
                    )}
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Stethoscope className="h-6 w-6 text-brand-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                        <p className="text-brand-600 font-medium">{exp.hospital}</p>
                        <p className="text-sm text-gray-500 mt-1">{exp.duration}</p>
                        <p className="text-sm text-gray-600 mt-2">{exp.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="glass-card p-6">
              <h3 className="heading-3 mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700">{doctorProfile.personalInfo.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700">{doctorProfile.personalInfo.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700">{doctorProfile.professionalStats.onlineAvailability}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Globe className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700">{doctorProfile.personalInfo.languages.join(", ")}</span>
                </div>
              </div>
            </div>

            {/* Specializations */}
            <div className="glass-card p-6">
              <h3 className="heading-3 mb-4">Medical Specializations</h3>
              <div className="space-y-2">
                {doctorProfile.specialties.map((specialty, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle2 className="h-4 w-4 text-brand-600" />
                    <span className="text-sm text-gray-700">{specialty}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div className="glass-card p-6">
              <h3 className="heading-3 mb-4 flex items-center">
                <Shield className="h-4 w-4 text-brand-600 mr-2" />
                Certifications
              </h3>
              <div className="space-y-3">
                {doctorProfile.certifications.map((cert, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <Badge className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700 leading-relaxed">{cert}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="glass-card p-6">
              <h3 className="heading-3 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Response Time</span>
                  <span className="text-sm font-semibold text-green-600">{doctorProfile.professionalStats.responseTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Experience</span>
                  <span className="text-sm font-semibold text-gray-900">{doctorProfile.professionalStats.experienceYears} Years</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Success Rate</span>
                  <span className="text-sm font-semibold text-brand-600">{doctorProfile.professionalStats.successRate}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}