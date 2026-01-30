import React, { useState, useEffect, use } from "react";
import {
  Heart,
  Shield,
  Clock,
  Users,
  Calendar,
  TestTube,
  Stethoscope,
  Activity,
  ChevronRight,
  Star,
  CheckCircle,
  ArrowRight,
  Play,
  Zap,
  Award,
  TrendingUp,
  Menu,
  X,
  BotIcon,
} from "lucide-react";
import CloudGlobe from "../component/Globe";
import { useNavigate } from "react-router-dom";
import Auth from "./Auth";

const HealthcareLandingPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const navigate = useNavigate()



  useEffect(() => {
    setIsVisible(true);

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleGetStarted = () => {
    navigate("/auth")

  };


  const features = [
    {
      icon: Calendar,
      title: "Smart Appointment Booking",
      description:
        "AI-powered scheduling that finds the perfect time for you and your doctor",
      color: "from-blue-500 to-cyan-500",
      stats: "99% Success Rate",
    },
    {
      icon: Clock,
      title: "Real-time Queue Management",
      description: "Live updates on wait times with smart notifications",
      color: "from-amber-500 to-orange-500",
      stats: "70% Less Wait Time",
    },
    {
      icon: TestTube,
      title: "Instant Lab Results",
      description: "Get your test results instantly with AI-powered insights",
      color: "from-purple-500 to-pink-500",
      stats: "24/7 Access",
    },
    {
      icon: Shield,
      title: "Advanced Security",
      description: "End-to-end encryption",
      color: "from-red-500 to-rose-500",
      stats: "100% Secure",
    },
    {
      icon: Activity,
      title: "AI Health Monitoring",
      description: "Predictive health analytics powered by machine learning",
      color: "from-emerald-500 to-teal-500",
      stats: "95% Accuracy",
    },
    {
      icon: BotIcon,
      title: "AI Assistant",
      description: "Your personal health assistant for 24/7 support",
      color: "from-violet-500 to-purple-500",
      stats: "99% Response Rate",
    },
  ];

  const testimonials = [
    {
      name: "Shubham Singh",
      role: "Software Engineer",
      content:
        "Triksha's AI-powered scheduling saved me 3 hours every week. The predictive health insights are incredible!",
      rating: 5,
      image: "S",
    },
    {
      name: "Dr. Harshit Singh",
      role: "Cardiologist",
      content:
        "The platform has revolutionized my practice. Patient engagement increased by 200% since we started using Triksha.",
      rating: 5,
      image: "H",
    },
    {
      name: "Anjali Verma",
      role: "Working Mother",
      content:
        "Managing my family's health has never been this simple. The emergency alerts potentially saved my son's life.",
      rating: 5,
      image: "A",
    },
  ];

  const stats = [
    { number: "50K+", label: "Happy Patients", icon: Heart },
    { number: "500+", label: "Expert Doctors", icon: Stethoscope },
    { number: "100+", label: "Partner Labs", icon: TestTube },
    { number: "99.9%", label: "Uptime", icon: Shield },
  ];




  return (
    <div className="bg-gradient-to-br from-slate-900 via-black to-slate-900 text-white min-h-screen overflow-x-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute top-1/2 -left-40 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-0 right-1/2 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      {/* Enhanced Navigation */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300  'bg-transparent-500/10 backdrop-blur-md border-b border-gray-800/50 ${scrolled ? "bg-black/80 shadow-lg" : ""
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className="relative">
                <div className="p-2 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-xl border border-emerald-500/30 group-hover:border-emerald-400/50 transition-all duration-300 group-hover:scale-105 group-hover:rotate-3">
                  <Stethoscope className="text-emerald-300 w-7 h-7 group-hover:text-emerald-200 transition-colors duration-300" />
                </div>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-300 via-cyan-200 to-blue-300 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
                Triksha
              </h1>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              {["Features", "About", "Reviews", "Contact"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="relative text-gray-300 hover:text-white transition-colors group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-400 to-cyan-400 group-hover:w-full transition-all duration-300"></span>
                </a>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={handleGetStarted}
                className="hidden sm:flex items-center text-black bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-500 hover:to-cyan-500 px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-emerald-400/30"
              >
                <Zap className="w-4 h-4 mr-2" />
                Get Started
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-800/50 transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-300 ${mobileMenuOpen
              ? "max-h-64 opacity-100"
              : "max-h-0 opacity-0 overflow-hidden"
            }`}
        >
          <div className="bg-black/95 backdrop-blur-md border-t border-gray-800/50 px-4 py-4 space-y-2">
            {["Features", "About", "Reviews", "Contact"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="block py-2 text-gray-300 hover:text-white transition-colors"
              >
                {item}
              </a>
            ))}
            <button
              onClick={handleGetStarted}
              className="w-full bg-gradient-to-r from-emerald-400 to-cyan-400 text-black py-2 rounded-lg font-semibold mt-4"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Enhanced Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-30">
        <div
          className={`relative z-10 text-center max-w-5xl mx-auto transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
        >
          <div className="mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border border-cyan-700 text-cyan-300 font-semibold shadow-sm backdrop-blur-md">
              <span className="text-lg">✨</span>
              <span>#1 Healthcare Platform in India</span>
            </span>
          </div>

          <h1 className="text-5xl md:text-8xl font-black mb-8 leading-tight">
            <span className="bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
              Healthcare
            </span>
            <br />
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent ">
              Reimagined
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
            Experience the future of healthcare with our AI-powered platform.
            Seamless appointments, instant results, and personalized care - all
            at your fingertips.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <button
              onClick={handleGetStarted}
              className="group cursor-pointer relative overflow-hidden bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 px-8 py-4 rounded-2xl font-bold text-lg text-black transition-all duration-300 transform hover:scale-105 "
            >
              <span className="relative z-10 flex items-center">
                Start Your Journey
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>

            <button className="group flex items-center cursor-pointer px-8 py-4 rounded-2xl font-semibold text-lg border-2 border-gray-600 hover:border-emerald-400/50 transition-all duration-300 hover:bg-emerald-500/5 backdrop-blur-sm">
              <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Watch Demo
            </button>
          </div>

          <br />
          <br />
          <br />

          {/* Enhanced Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="group text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-2xl mb-4 group-hover:scale-110 group-hover:border-emerald-500/50 transition-all duration-300">
                  <stat.icon className="w-8 h-8 text-emerald-400" />
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-400 text-sm font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6">
              <TrendingUp className="w-4 h-4 mr-2" />
              Advanced Features
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Why Choose
              </span>
              <br />
              <span className="text-white">Triksha?</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Cutting-edge technology meets compassionate care. Discover
              features designed for the modern healthcare experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-gradient-to-br from-gray-900/80 to-gray-800/40 p-8 rounded-3xl border border-gray-700/50 hover:border-emerald-500/30 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/10 backdrop-blur-sm"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>

                <div className="relative z-10">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} p-4 mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
                  >
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white group-hover:text-emerald-200 transition-colors">
                      {feature.title}
                    </h3>
                    <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full font-medium">
                      {feature.stats}
                    </span>
                  </div>

                  <p className="text-gray-300 leading-relaxed mb-4">
                    {feature.description}
                  </p>

                  <div className="flex items-center text-emerald-400 font-medium group-hover:text-emerald-300 transition-colors">
                    Learn More
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials Section */}
      <section id="reviews" className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/30 via-transparent to-gray-900/30"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm font-medium mb-6">
              <Star className="w-4 h-4 mr-2 fill-current" />
              Customer Stories
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Loved by
              </span>
              <span className="text-white pl-6">Thousands</span>
              <br />
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Real stories from real people who transformed their healthcare
              journey with Triksha
            </p>
          </div>

          {/* Testimonial Carousel */}
          <div className="max-w-4xl mx-auto">
            <div className="relative bg-gradient-to-br from-gray-800/60 to-gray-900/40 p-12 rounded-3xl border border-gray-600/40 backdrop-blur-sm">
              <div className="flex items-center justify-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-6 h-6 text-yellow-400 fill-current mx-1"
                  />
                ))}
              </div>

              <blockquote className="text-2xl text-center text-gray-200 mb-8 leading-relaxed font-light italic">
                "{testimonials[currentTestimonial].content}"
              </blockquote>

              <div className="flex items-center justify-center">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full flex items-center justify-center text-black font-bold text-xl mr-4">
                  {testimonials[currentTestimonial].image}
                </div>
                <div className="text-left">
                  <div className="font-bold text-white text-lg">
                    {testimonials[currentTestimonial].name}
                  </div>
                  <div className="text-gray-400">
                    {testimonials[currentTestimonial].role}
                  </div>
                </div>
              </div>

              {/* Testimonial Indicators */}
              <div className="flex justify-center mt-8 space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentTestimonial
                        ? "bg-emerald-400 scale-125"
                        : "bg-gray-600 hover:bg-gray-500"
                      }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <div className="relative bg-gradient-to-br from-emerald-900/20 via-cyan-900/20 to-blue-900/20 rounded-3xl p-16 border border-emerald-500/30 backdrop-blur-sm overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-cyan-500/5"></div>

            <div className="relative z-10">
              <h2 className="text-5xl md:text-6xl font-bold mb-8">
                <span className="bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                  Ready to Transform
                </span>
                <br />
                <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  Your Health?
                </span>
              </h2>

              <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                Join over 50,000 users who have revolutionized their healthcare
                experience. Start your journey today.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <button
                  onClick={handleGetStarted}
                  className="group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 px-10 py-5 rounded-2xl font-bold text-lg text-black transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/30"
                >
                  <span className="relative z-10 flex items-center">
                    Start Free Trial
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>

                <div className="text-gray-400 text-sm">
                  ✨ No credit card required • 14-day free trial
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}

      {/* Enhanced Footer */}
      <footer className=" md:py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden min-h-[400px] md:min-h-[500px]">
        {/* Globe and overlay background */}
        <div className="absolute inset-0 z-0 flex items-center justify-center">
          <div className="relative">
            {/* Globe size responsive */}
            <div className="w-[250px] h-[250px] sm:w-[300px] sm:h-[300px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px]">
              <CloudGlobe />
            </div>

            {/* Light overlay to enhance readability */}
            <div className="absolute inset-0 bg-black/20 pointer-events-none rounded-full" />
          </div>
        </div>

        {/* Gradient overlay for subtle readability improvement */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-[1]" />

        {/* Footer content on top */}
        <div className="relative z-10 max-w-7xl mx-auto text-center flex flex-col justify-center min-h-[400px] md:min-h-[500px]">
          {/* Logo and Brand */}
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-3 mb-6 group">
            <div className="p-2.5 md:p-3 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-xl border border-emerald-500/30 group-hover:border-emerald-400/50 transition-all duration-300 group-hover:scale-105">
              <Stethoscope className="text-emerald-300 w-6 h-6 md:w-8 md:h-8 group-hover:text-emerald-200 transition-colors duration-300" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-300 via-cyan-200 to-blue-300 bg-clip-text text-transparent">
              Triksha
            </h1>
          </div>

          {/* Tagline */}
          <p className="text-white text-base md:text-lg mb-6 md:mb-8 px-4">
            Transforming healthcare, one patient at a time
          </p>

          {/* Copyright */}
          <div className="text-white text-xs md:text-sm">
            © 2025 Triksha. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HealthcareLandingPage;
