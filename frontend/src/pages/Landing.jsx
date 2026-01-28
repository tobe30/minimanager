import { Link } from 'react-router-dom';
import { useState } from 'react';
import { 
  CheckSquare, 
  MapPin, 
  Flag, 
  BarChart3, 
  ArrowRight, 
  ChevronRight,
  Zap, 
  Shield, 
  Clock,
  Users,
  Globe,
  Award,
  Menu,
  X
} from 'lucide-react';

import heroImage from '../assets/hero-professional.png';
import fieldOpsImage from '../assets/mini.jpg';
import projectImage from '../assets/solution-project.png';
import timeImage from '../assets/solution-time.png';
import mobileImage from '../assets/mobile-mockup.png';
import { getAuthUser } from '../lib/api';
import { useQuery } from '@tanstack/react-query';

const features = [
  {
    icon: CheckSquare,
    title: 'Task Management',
    description: 'Create, organize, and complete tasks with intuitive controls. Stay on top of your daily workload effortlessly.',
  },
  {
    icon: MapPin,
    title: 'Site Tracking',
    description: 'Monitor progress across multiple sites in real-time. Get instant visibility into every location.',
  },
  {
    icon: Flag,
    title: 'Smart Priorities',
    description: 'Set High, Medium, or Low priority. Never miss important deadlines again.',
  },
  {
    icon: BarChart3,
    title: 'Deep Analytics',
    description: 'Track your performance over time with detailed analytics and reports.',
  },
];

const stats = [
  { value: '10K+', label: 'Active Users' },
  { value: '500K+', label: 'Tasks Completed' },
  { value: '99.9%', label: 'Uptime' },
  { value: '4.9/5', label: 'User Rating' },
];

const solutions = [
  {
    icon: Zap,
    title: 'Daily Task Management',
    description: 'Create, track, and complete tasks with ease. Stay organized throughout your workday.',
    image: fieldOpsImage,
  },
  {
    icon: Shield,
    title: 'Project Management',
    description: 'See progress per site at a glance. Monitor multiple locations effortlessly.',
    image: projectImage,
  },
  {
    icon: Clock,
    title: 'Priority & Deadlines',
    description: 'Set High, Medium, or Low priority. Never miss important deadlines again.',
    image: timeImage,
  },
];

const Landing = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const {data:authUser,isLoading} = useQuery({
    queryKey: ['authUser'],
    queryFn: getAuthUser,
    retry: false,
  })


  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-primary backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm sm:text-lg">M</span>
              </div>
              <span className="font-bold text-lg sm:text-xl text-white">MiniManager</span>
            </div>
            <div className="hidden md:flex items-center gap-10">
              <a href="#solutions" className="text-sm text-gray-400 hover:text-white transition-colors">Solutions</a>
              <a href="#features" className="text-sm text-gray-400 hover:text-white transition-colors">Features</a>
              <a href="#about" className="text-sm text-gray-400 hover:text-white transition-colors">About</a>
              <a href="#contact" className="text-sm text-gray-400 hover:text-white transition-colors">Contact</a>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
               {isLoading? (
                <div className="w-24 h-8 bg-gray-300 rounded animate-pulse"></div>     
              )  : authUser ? (
                  <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full px-5 py-3 bg-white text-black rounded-full text-base font-medium"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Link>
              ) : (
                  <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-base text-white py-2"
              >
                Log in
              </Link>
              )}
              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-white hover:bg-[hsl(var(--hero-foreground))]/10 transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[hsl(var(--hero-bg))] border-t border-[hsl(var(--hero-foreground))]/10">
            <div className="px-4 py-6 space-y-4">
              <a 
                href="#solutions" 
                onClick={() => setMobileMenuOpen(false)}
                className="block text-base text-gray-400 hover:text-[hsl(var(--hero-foreground))] transition-colors py-2"
              >
                Solutions
              </a>
              <a 
                href="#features" 
                onClick={() => setMobileMenuOpen(false)}
                className="block text-base text-gray-400 hover:text-[hsl(var(--hero-foreground))] transition-colors py-2"
              >
                Features
              </a>
              <a 
                href="#about" 
                onClick={() => setMobileMenuOpen(false)}
                className="block text-base text-gray-400 hover:text-[hsl(var(--hero-foreground))] transition-colors py-2"
              >
                About
              </a>
              <a 
                href="#contact" 
                onClick={() => setMobileMenuOpen(false)}
                className="block text-base text-gray-400 hover:text-[hsl(var(--hero-foreground))] transition-colors py-2"
              >
                Contact
              </a>
              <hr className="border-[hsl(var(--hero-foreground))]/10" />
              {isLoading? (
                <div className="w-24 h-8 bg-gray-300 rounded animate-pulse"></div>     
              )  : authUser ? (
                  <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full px-5 py-3 bg-white text-black rounded-full text-base font-medium"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Link>
              ) : (
                  <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-base text-white py-2"
              >
                Log in
              </Link>
              )}
              
              
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen bg-[#070d1b] overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,#0f2a4f,transparent_40%)]" />
        
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[calc(100vh-8rem)]">
            <div className="space-y-8 lg:space-y-10">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-300/10 border border-gray-200/20">
                <Globe className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-white">Trusted by teams worldwide</span>
              </div>
              
              {/* Headline */}
              <div className="space-y-6">
                <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl text-white leading-[1.1]">
                  <span className="italic">Productivity</span> that moves with you
                </h1>
                <p className="text-lg lg:text-xl text-gray-400 max-w-lg leading-relaxed">
                  MiniManager provides an all-in-one task management, site tracking, and analytics platform for modern field teams.
                </p>
              </div>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[hsl(var(--hero-bg))] rounded-full text-base font-semibold hover:bg-blue-500 hover:text-white transition-all duration-300 shadow-lg shadow-[hsl(var(--hero-foreground))]/20"
                >
                  Start Free Trial
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <a
                  href="#solutions"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-gray-200/30 text-white rounded-full text-base font-medium hover:bg-gray-300/10 transition-all duration-300"
                >
                  See How It Works
                </a>
              </div>
            </div>
            
            {/* Hero Image - Seamlessly blends with background */}
<div className="relative mt-8 lg:mt-0 flex justify-center lg:justify-end">

  {/* Soft blue glow */}
  <div className="absolute -right-24 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-3xl" />

  {/* Image card */}
  <div className="relative 
    w-[280px] sm:w-[320px] md:w-[380px] lg:w-[440px] xl:w-[480px]
    h-[420px] sm:h-[480px] md:h-[560px] lg:h-[620px]
    bg-[#0b152a] border border-white/10 rounded-xl overflow-hidden shadow-2xl">

    <img
      src={heroImage}
      alt="Professional using MiniManager"
      className="w-full h-full object-cover object-top"
    />

  </div>

</div>


          </div>
        </div>
        
        {/* Wave Divider */}
{/* Clean premium wave */}
<div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
  <svg
    viewBox="0 0 1440 120"
    preserveAspectRatio="none"
    className="w-full h-[120px]"
    fill="white"
  >
    <path d="M0,80 C240,120 480,120 720,110 960,100 1200,70 1440,60 L1440,120 L0,120 Z" />
  </svg>
</div>

      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl sm:text-5xl font-bold text-foreground mb-2">{stat.value}</div>
                <div className="text-sm text-gray-500 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section id="solutions" className="py-24 px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-blue-500 font-semibold mb-4 uppercase tracking-wider text-sm">Solutions</p>
            <h2 className="font-display text-4xl sm:text-5xl text-foreground mb-6">
              Simple solutions for <span className="italic">complex</span> workflows
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Here's how we help teams grow without limits
            </p>
          </div>
          
          <div className="space-y-8">
            {solutions.map((solution, index) => (
              <div 
                key={solution.title}
                className="group relative overflow-hidden rounded-3xl bg-card border border-gray-200 hover:border-blue-500/30 transition-all duration-500"
              >
                <div className="grid lg:grid-cols-2 gap-8">
                  <div className={`p-8 lg:p-12 flex flex-col justify-center ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                    <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:bg-blue-500 group-hover:scale-110 transition-all duration-300">
                      <solution.icon className="w-7 h-7 text-blue-500 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="font-display text-3xl text-foreground mb-4 italic">{solution.title}</h3>
                    <p className="text-gray-500 mb-6 leading-relaxed">{solution.description}</p>
                    <Link 
                      to="/dashboard" 
                      className="inline-flex items-center gap-2 text-blue-500 font-semibold group-hover:gap-3 transition-all"
                    >
                      Learn more
                      <ChevronRight className="w-5 h-5" />
                    </Link>
                  </div>
                  <div className={`relative h-64 lg:h-auto ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
                    <img 
                      src={solution.image} 
                      alt={solution.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 lg:px-8 bg-primary">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-blue-500 font-semibold mb-4 uppercase tracking-wider text-sm">Features</p>
            <h2 className="font-display text-4xl sm:text-5xl text-white mb-6">
              Everything you need to <span className="italic">succeed</span>
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Powerful features designed specifically for field engineers and site managers.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group p-8 rounded-3xl bg-gray-500/10 border border-gray-200/10 hover:bg-blue-500/10 hover:border-primary/30 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                  <feature.icon className="w-7 h-7 text-blue-500 group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile App Section */}
      <section id="about" className="py-24 px-6 lg:px-8 bg-background overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - Image */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-blue-500/20 to-transparent rounded-[3rem] blur-3xl" />
              <div className="absolute top-10 -left-10 w-32 h-32 rounded-full bg-blue-500/20" />
              <div className="absolute bottom-10 -right-10 w-24 h-24 rounded-full bg-gray-700/10" />
              <img
                src={mobileImage}
                alt="MiniManager mobile app"
                className="relative mx-auto max-w-sm w-full drop-shadow-2xl"
              />
            </div>
            
            {/* Right Column - Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <p className="text-blue-600 font-semibold uppercase tracking-wider text-sm">ADS Mobile Ready</p>
                <h2 className="font-display text-4xl sm:text-5xl text-foreground leading-tight">
                  Manage tasks <span className="italic">anywhere,</span> anytime
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Access your dashboard on the go. MiniManager is fully optimized for mobile devices, giving you complete control from any location.
                </p>
              </div>
              
              <div className="space-y-4">
                {[
                  { icon: Zap, title: 'Lightning Fast', desc: 'Instant updates and real-time sync across all devices.' },
                  { icon: Shield, title: 'Secure & Reliable', desc: 'Bank-level encryption keeps your data safe.' },
                  { icon: Users, title: 'Team Collaboration', desc: 'Work together seamlessly with shared dashboards.' },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-4 p-5 rounded-2xl bg-card border border-gray-200 hover:border-blue-500/30 transition-colors">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-8 py-4 bg-blue-500 text-white rounded-full text-base font-semibold hover:bg-primary/90 transition-all duration-300 shadow-lg shadow-primary/25"
              >
                Try It Free
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 lg:px-8 bg-primary relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-48 h-48 rounded-full bg-primary/5 blur-3xl" />
        
        <div className="relative max-w-4xl mx-auto text-center">
          <Award className="w-12 h-12 text-blue-500 mx-auto mb-6" />
          <h2 className="font-display text-4xl sm:text-5xl text-white mb-6">
            Ready to work <span className="italic">smarter?</span>
          </h2>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Join thousands of field engineers who trust MiniManager to organize their day and boost productivity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[hsl(var(--hero-bg))] rounded-full text-base font-semibold hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-lg"
            >
              Start Managing Today
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-gray-300/30 text-white rounded-full text-base font-medium hover:bg-gray-100/10 transition-all duration-300"
            >
              Contact Sales
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="py-16 px-6 lg:px-8 bg-primary border-t border-gray-100/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-5 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-700 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">M</span>
                </div>
                <span className="font-bold text-xl text-white">MiniManager</span>
              </div>
              <p className="text-gray-400 max-w-sm mb-6 leading-relaxed">
                The complete task and site management solution for field engineers. Stay organized, track progress, and work smarter.
              </p>
              <p className="text-sm text-gray-400">
                Built by <span className="text-blue-400 font-semibold">Marizu Inc</span>
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-3">
                <li><a href="#features" className="text-sm text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#solutions" className="text-sm text-gray-400 hover:text-white transition-colors">Solutions</a></li>
                <li><Link to="/dashboard" className="text-sm text-gray-400 hover:text-white transition-colors">Dashboard</Link></li>
                <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-3">
                <li><a href="#about" className="text-sm text-gray-400 hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Careers</a></li>
                <li><a href="#contact" className="text-sm text-gray-400 hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-500/10 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} MiniManager. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Twitter</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">LinkedIn</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;