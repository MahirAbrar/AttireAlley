"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  CodeBracketIcon,
  ServerIcon,
  ShoppingBagIcon,
  CreditCardIcon,
  CloudArrowUpIcon,
  ShieldCheckIcon,
  ClipboardDocumentCheckIcon,
  CheckCircleIcon,
  CommandLineIcon,
  CpuChipIcon,
  CircleStackIcon,
  RocketLaunchIcon,
} from "@heroicons/react/24/outline";

gsap.registerPlugin(ScrollTrigger);

const AboutPage = () => {
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const journeyRef = useRef(null);
  const [copiedAdmin, setCopiedAdmin] = useState(false);
  const [copiedUser, setCopiedUser] = useState(false);
  const [activeTimelineItem, setActiveTimelineItem] = useState(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animation
      gsap.fromTo(
        ".hero-content > *",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
        },
      );

      // Cards animation
      gsap.fromTo(
        ".content-card",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".content-section",
            start: "top 80%",
          },
        },
      );

      // Stats counter animation
      const stats = statsRef.current?.querySelectorAll(".stat-number");
      if (stats) {
        stats.forEach((stat) => {
          const endValue = parseInt(stat.getAttribute("data-value"));
          gsap.to(stat, {
            textContent: endValue,
            duration: 2,
            ease: "power1.out",
            snap: { textContent: 1 },
            scrollTrigger: {
              trigger: stat,
              start: "top 85%",
            },
          });
        });
      }

      // Journey section animations
      if (journeyRef.current) {
        // Floating code snippets animation
        gsap.to(".floating-code", {
          y: -20,
          opacity: 0.3,
          duration: 3,
          stagger: 0.5,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
        });

        // Paragraph stagger animation
        gsap.fromTo(
          ".journey-paragraph",
          { opacity: 0, x: -30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            stagger: 0.3,
            ease: "power2.out",
            scrollTrigger: {
              trigger: journeyRef.current,
              start: "top 70%",
            },
          }
        );

        // Timeline animation
        gsap.fromTo(
          ".timeline-item",
          { opacity: 0, scale: 0.8 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            stagger: 0.1,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: ".timeline-container",
              start: "top 80%",
            },
          }
        );

        // Typewriter effect for final line
        const finalLine = journeyRef.current.querySelector(".final-line");
        if (finalLine) {
          ScrollTrigger.create({
            trigger: finalLine,
            start: "top 85%",
            onEnter: () => {
              gsap.fromTo(
                finalLine,
                { width: 0, opacity: 1 },
                { width: "auto", duration: 2, ease: "power2.out" }
              );
            },
            once: true,
          });
        }

        // Background gradient animation
        gsap.to(".gradient-bg", {
          backgroundPosition: "200% 200%",
          duration: 20,
          repeat: -1,
          ease: "linear",
        });
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const copyToClipboard = (text, isAdmin) => {
    navigator.clipboard.writeText(text);
    if (isAdmin) {
      setCopiedAdmin(true);
      setTimeout(() => setCopiedAdmin(false), 2000);
    } else {
      setCopiedUser(true);
      setTimeout(() => setCopiedUser(false), 2000);
    }
  };

  const techStack = [
    {
      name: "Next.js",
      icon: <CodeBracketIcon className="h-8 w-8" />,
      color: "text-black dark:text-white",
    },
    {
      name: "Tailwind CSS",
      icon: <CodeBracketIcon className="h-8 w-8" />,
      color: "text-cyan-500",
    },
    {
      name: "MongoDB",
      icon: <ServerIcon className="h-8 w-8" />,
      color: "text-green-600",
    },
    {
      name: "Stripe",
      icon: <CreditCardIcon className="h-8 w-8" />,
      color: "text-purple-600",
    },
    {
      name: "Firebase",
      icon: <CloudArrowUpIcon className="h-8 w-8" />,
      color: "text-orange-500",
    },
    {
      name: "JWT Auth",
      icon: <ShieldCheckIcon className="h-8 w-8" />,
      color: "text-blue-600",
    },
  ];

  const features = [
    "Responsive design for all devices",
    "Secure user authentication",
    "Real-time cart updates",
    "Admin dashboard",
    "Payment integration",
    "Image optimization",
    "Dark mode support",
    "SEO optimized",
  ];

  const timeline = [
    { date: "Day 1", title: "First Commit", description: "Started with create-next-app", icon: "🚀" },
    { date: "Week 2", title: "Login System", description: "Built authentication with JWT", icon: "🔐" },
    { date: "Month 1", title: "Admin Dashboard", description: "Created admin views & controls", icon: "⚙️" },
    { date: "Month 2", title: "Product Section", description: "Built dynamic product pages", icon: "🛍️" },
    { date: "Month 3", title: "Shopping Cart", description: "Added cart with global state", icon: "🛒" },
    { date: "Month 4", title: "Payment Gateway", description: "Integrated Stripe checkout", icon: "💳" },
    { date: "Month 5", title: "Performance", description: "Optimized images & code", icon: "⚡" },
    { date: "Ongoing", title: "Refinements", description: "Continuous improvements", icon: "✨" },
  ];

  const codeSnippets = [
    "const [cart, setCart] = useState([]);",
    "async function fetchProducts() {...}",
    "export default withAuth(AdminRoute);",
    "<Image src={product.image} alt={product.name} />",
    "const stripe = await loadStripe(key);",
    "useEffect(() => { gsap.to(...) }, []);",
  ];

  return (
    <div
      ref={heroRef}
      className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-backgroundDark dark:to-gray-900"
      style={{
        backgroundImage: `radial-gradient(circle, rgba(87, 167, 168, 0.15) 2px, transparent 2px)`,
        backgroundSize: '25px 25px',
        backgroundPosition: '0 0',
      }}
    >
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/15 via-gray-50 to-secondary/15 py-20 dark:from-primary/20 dark:via-backgroundDark dark:to-secondary/20">
        <div className="absolute inset-0">
          <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -right-20 bottom-20 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />
        </div>

        <div className="hero-content relative z-10 mx-auto max-w-4xl px-4 text-center lg:max-w-6xl xl:max-w-7xl">
          <h1 className="mb-6 text-5xl font-bold text-gray-900 dark:text-white md:text-6xl lg:text-7xl">
            The Story Behind
            <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              AttireAlley
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-gray-600 dark:text-gray-300">
            A full-stack e-commerce platform built with modern technologies and
            a passion for great user experiences
          </p>

          {/* Scroll indicator */}
          <div className="mt-12 animate-bounce">
            <svg
              className="mx-auto h-8 w-8 text-gray-600 dark:text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="relative py-16 overflow-hidden">
        
        <div className="relative mx-auto max-w-6xl px-4 lg:max-w-7xl xl:max-w-full xl:px-8 2xl:px-12">
          <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-3">
            <div className="content-card">
              <div
                className="stat-number text-4xl font-bold text-primary"
                data-value="50"
              >
                0
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                Components Built
              </div>
            </div>
            <div className="content-card">
              <div
                className="stat-number text-4xl font-bold text-secondary"
                data-value="15"
              >
                0
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                API Endpoints
              </div>
            </div>

            <div className="content-card">
              <div className="text-4xl font-bold text-green-600">∞</div>
              <div className="text-gray-600 dark:text-gray-400">
                Learning Value
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <div className="content-section relative mx-auto max-w-6xl px-4 py-16 lg:max-w-7xl xl:max-w-full xl:px-8 2xl:px-12">
        {/* Project Purpose - Enhanced with interactions */}
        <section ref={journeyRef} className="content-card mb-16 relative overflow-hidden">
          {/* Animated gradient background */}
          <div className="gradient-bg absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 dark:from-primary/10 dark:to-secondary/10" 
               style={{ backgroundSize: '400% 400%' }} />
          
          {/* Floating code snippets in background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {codeSnippets.map((code, index) => (
              <div
                key={index}
                className="floating-code absolute text-xs md:text-sm font-mono text-gray-300 dark:text-gray-600 opacity-0"
                style={{
                  left: `${10 + (index * 15) % 80}%`,
                  top: `${10 + (index * 20) % 80}%`,
                  transform: 'rotate(-5deg)',
                }}
              >
                {code}
              </div>
            ))}
            
            {/* Floating tech icons */}
            <div className="absolute top-10 right-10 text-primary/10 animate-pulse">
              <CodeBracketIcon className="h-16 w-16" />
            </div>
            <div className="absolute bottom-20 left-20 text-secondary/10 animate-pulse" style={{ animationDelay: '1s' }}>
              <ServerIcon className="h-20 w-20" />
            </div>
            <div className="absolute top-1/2 right-1/4 text-accent/10 animate-pulse" style={{ animationDelay: '2s' }}>
              <CircleStackIcon className="h-14 w-14" />
            </div>
            <div className="absolute bottom-1/3 left-1/3 text-primary/10 animate-pulse" style={{ animationDelay: '1.5s' }}>
              <RocketLaunchIcon className="h-18 w-18" />
            </div>
          </div>

          <div className="relative rounded-2xl bg-white p-8 shadow-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 md:p-12">
            <h2 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">
              Why I Built This
            </h2>
            
            {/* Enhanced paragraphs with animations */}
            <div className="space-y-4 text-lg leading-relaxed text-gray-600 dark:text-gray-300 mb-8">
              <p className="journey-paragraph relative">
                <span className="absolute -left-6 top-1 text-primary/20 text-4xl font-bold">1</span>
                AttireAlley represents my journey into modern full-stack
                development. More than just an e-commerce site, it&apos;s a
                comprehensive demonstration of building scalable, user-friendly
                applications with cutting-edge technologies.
              </p>
              <p className="journey-paragraph relative">
                <span className="absolute -left-6 top-1 text-primary/20 text-4xl font-bold">2</span>
                I learned as I went, tackling challenges one by one and discovering
                new solutions along the way. I&apos;ve always come back to this project
                to add more features, refine the code, and apply new concepts I&apos;ve
                learned. Each return visit brought fresh perspectives and better
                implementations.
              </p>
              <p className="journey-paragraph relative">
                <span className="absolute -left-6 top-1 text-primary/20 text-4xl font-bold">3</span>
                While it&apos;s not a perfect website - far from it - AttireAlley
                represents something more important: a journey of continuous learning.
                It&apos;s a testament to growth, persistence, and the iterative nature
                of development. Every bug fixed, every feature added, and every
                refactoring session contributed to my evolution as a developer.
              </p>
              <div className="overflow-hidden">
                <p className="final-line font-semibold text-primary dark:text-primary text-xl inline-block whitespace-nowrap">
                  Here&apos;s to the next project, armed with all the lessons learned
                  from this one! 🚀
                </p>
              </div>
            </div>

            {/* Interactive Timeline */}
            <div className="timeline-container mt-12">
              <h3 className="mb-6 text-2xl font-bold text-gray-800 dark:text-white">
                The Journey Timeline
              </h3>
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary to-secondary"></div>
                
                {/* Timeline items */}
                <div className="space-y-6">
                  {timeline.map((item, index) => (
                    <div
                      key={index}
                      className="timeline-item relative flex items-start gap-4 group cursor-pointer"
                      onMouseEnter={() => setActiveTimelineItem(index)}
                      onMouseLeave={() => setActiveTimelineItem(null)}
                    >
                      {/* Icon */}
                      <div className={`relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-white dark:bg-gray-800 border-4 transition-all duration-300 ${
                        activeTimelineItem === index 
                          ? 'border-primary scale-110 shadow-lg shadow-primary/30' 
                          : 'border-gray-300 dark:border-gray-600'
                      }`}>
                        <span className="text-2xl">{item.icon}</span>
                      </div>
                      
                      {/* Content */}
                      <div className={`flex-1 transition-all duration-300 ${
                        activeTimelineItem === index ? 'translate-x-2' : ''
                      }`}>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{item.date}</div>
                        <h4 className="font-bold text-gray-900 dark:text-white">{item.title}</h4>
                        <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Code Evolution Animation */}
            <div className="mt-12 rounded-xl bg-gray-900 p-6 overflow-hidden">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                <span className="ml-2 text-sm text-gray-400">evolution.js</span>
              </div>
              <pre className="text-sm text-gray-300">
                <code className="language-javascript">
{`// From this...
function App() {
  return <div>Hello World</div>
}

// To this...
function App() {
  const [user, setUser] = useState(null)
  const [cart, setCart] = useState([])
  
  return (
    <AuthProvider>
      <CartProvider value={{ cart, setCart }}>
        <Router>
          <Routes>...</Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  )
}`}
                </code>
              </pre>
            </div>
          </div>
        </section>

        {/* Tech Stack */}
        <section className="content-card mb-16">
          <div className="rounded-2xl bg-white p-8 shadow-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 md:p-12">
            <h2 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">
              Built With Modern Tech
            </h2>
            <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
              {techStack.map((tech, index) => (
                <div
                  key={index}
                  className="group flex flex-col items-center rounded-xl bg-gray-100 border border-gray-200 p-6 transition-all hover:bg-gray-200 hover:border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:border-gray-500"
                >
                  <div
                    className={`mb-3 transition-transform group-hover:scale-110 ${tech.color}`}
                  >
                    {tech.icon}
                  </div>
                  <span className="text-center font-medium text-gray-700 dark:text-gray-300">
                    {tech.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="content-card mb-16">
          <div className="rounded-2xl bg-gradient-to-r from-primary/20 to-secondary/20 p-8 shadow-xl border border-primary/20 dark:border-primary/30 dark:from-primary/20 dark:to-secondary/20 md:p-12">
            <h2 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">
              Key Features
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircleIcon className="h-6 w-6 flex-shrink-0 text-primary" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Test Credentials */}
        <section className="content-card mb-16">
          <div className="rounded-2xl bg-white p-8 shadow-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 md:p-12">
            <h2 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">
              Try It Out
            </h2>
            <div className="grid gap-8 md:grid-cols-2">
              {/* Admin Credentials */}
              <div className="rounded-xl bg-gray-100 border border-gray-200 p-6 dark:bg-gray-700 dark:border-gray-600">
                <h3 className="mb-4 text-xl font-semibold text-primary">
                  Admin Access
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-lg bg-white p-3 dark:bg-gray-600">
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      testuser@attirealley.com
                    </span>
                    <button
                      onClick={() =>
                        copyToClipboard("testuser@attirealley.com", true)
                      }
                      className="flex items-center gap-2 rounded-md bg-primary/10 px-3 py-1 text-sm text-primary transition-all hover:bg-primary/20"
                    >
                      <ClipboardDocumentCheckIcon className="h-4 w-4" />
                      {copiedAdmin ? "Copied!" : "Copy"}
                    </button>
                  </div>
                  <div className="rounded-lg bg-white p-3 dark:bg-gray-600">
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Password: abcd1234
                    </span>
                  </div>
                </div>
              </div>

              {/* User Credentials */}
              <div className="rounded-xl bg-gray-100 border border-gray-200 p-6 dark:bg-gray-700 dark:border-gray-600">
                <h3 className="mb-4 text-xl font-semibold text-secondary">
                  User Access
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-lg bg-white p-3 dark:bg-gray-600">
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      useruser@attirealley.com
                    </span>
                    <button
                      onClick={() =>
                        copyToClipboard("useruser@attirealley.com", false)
                      }
                      className="flex items-center gap-2 rounded-md bg-secondary/10 px-3 py-1 text-sm text-secondary transition-all hover:bg-secondary/20"
                    >
                      <ClipboardDocumentCheckIcon className="h-4 w-4" />
                      {copiedUser ? "Copied!" : "Copy"}
                    </button>
                  </div>
                  <div className="rounded-lg bg-white p-3 dark:bg-gray-600">
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Password: abcd1234
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Connect Section */}
        <section className="content-card">
          <div className="rounded-2xl bg-gradient-to-r from-primary to-secondary p-1 shadow-xl">
            <div className="rounded-2xl bg-white p-8 dark:bg-gray-800 md:p-12">
              <h2 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">
                Let&apos;s Connect
              </h2>
              <p className="mb-8 text-lg text-gray-600 dark:text-gray-300">
                I&apos;m passionate about creating exceptional web experiences
                and am always excited to discuss new opportunities and
                collaborations.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="https://mahirabrar.net"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-white transition-all hover:bg-primary/90"
                >
                  <ShoppingBagIcon className="h-5 w-5" />
                  Portfolio
                </Link>
                <Link
                  href="https://www.linkedin.com/in/hamid-abrar-mahir/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 rounded-full border-2 border-primary px-6 py-3 font-semibold text-primary transition-all hover:bg-primary hover:text-white"
                >
                  LinkedIn
                </Link>
                <Link
                  href="https://github.com/MahirAbrar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 rounded-full border-2 border-gray-600 px-6 py-3 font-semibold text-gray-600 transition-all hover:bg-gray-600 hover:text-white dark:border-gray-400 dark:text-gray-400 dark:hover:bg-gray-400"
                >
                  GitHub
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
