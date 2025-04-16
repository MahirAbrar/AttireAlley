import React from "react";
import Link from "next/link";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 rounded-xl text-gray-800 dark:bg-backgroundDark dark:text-gray-200">
      <div className="container mx-auto px-4 py-12">
        <h1 className="mb-12 text-center text-5xl font-bold text-primary dark:text-primary">
          My Journey Building This Project
        </h1>

        <div className="space-y-12">
          {/* Section 1: Project Purpose */}
          <section className="transform rounded-lg border border-secondary bg-white p-8 shadow-lg transition duration-500 hover:scale-105 hover:shadow-xl dark:border-secondary dark:bg-gray-800">
            <h2 className="mb-6 text-3xl font-semibold text-secondary">
              The Spark: Why This Project?
            </h2>
            <p className="text-lg leading-relaxed">
              Every project starts with a spark, an idea. For me, this
              e-commerce platform was born out of a desire to deepen my skills
              in modern web development, particularly with Next.js. It&apos;s more
              than just code; it&apos;s a tangible demonstration of building a
              full-stack application from the ground up. I wanted to create
              something functional, user-friendly, and visually appealing.
            </p>
          </section>

          {/* Section 2: Tech Stack */}
          <section className="transform rounded-lg border border-accent bg-white p-8 shadow-lg transition duration-500 hover:scale-105 hover:shadow-xl dark:border-accent dark:bg-gray-800">
            <h2 className="mb-6 text-3xl font-semibold text-accent">
              The Toolkit: Technologies Used
            </h2>
            <p className="mb-4 text-lg">
              To bring this vision to life, I carefully selected a set of
              powerful and efficient tools:
            </p>
            <ul className="grid grid-cols-1 gap-4 text-lg sm:grid-cols-2">
              <li className="flex items-center space-x-3">
                <span className="text-primary">&#x2713;</span>
                <span>Next.js (React Framework)</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="text-primary">&#x2713;</span>
                <span>Tailwind CSS & Daisy UI (Styling)</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="text-primary">&#x2713;</span>
                <span>MongoDB Atlas (Database)</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="text-primary">&#x2713;</span>
                <span>Passport.js (Authentication)</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="text-primary">&#x2713;</span>
                <span>Firebase Storage (Image Storage)</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="text-primary">&#x2713;</span>
                <span>Stripe (Payment Processing)</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="text-primary">&#x2713;</span>
                <span>JWT & Cookies (Session Management)</span>
              </li>
            </ul>
          </section>

          {/* Section 3: Test Drive */}
          <section className="transform rounded-lg border border-primary bg-white p-8 shadow-lg transition duration-500 hover:scale-105 hover:shadow-xl dark:border-primary dark:bg-gray-800">
            <h2 className="mb-6 text-3xl font-semibold text-primary">
              Take It for a Spin: Test Credentials
            </h2>
            <p className="mb-6 text-lg">
              Experience the site firsthand! You can log in using these test
              accounts:
            </p>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div>
                <h3 className="mb-3 text-2xl font-medium text-secondary">
                  Admin User Access
                </h3>
                <p className="text-lg">
                  <strong>Username:</strong> testuser@attirealley.com
                </p>
                <p className="text-lg">
                  <strong>Password:</strong> abcd1234
                </p>
              </div>
              <div>
                <h3 className="mb-3 text-2xl font-medium text-secondary">
                  Regular User Access
                </h3>
                <p className="text-lg">
                  <strong>Username:</strong> useruser@attirealley.com
                </p>
                <p className="text-lg">
                  <strong>Password:</strong> abcd1234
                </p>
              </div>
            </div>
          </section>

          {/* Section 4: Connect */}
          <section className="transform rounded-lg border border-secondary bg-white p-8 shadow-lg transition duration-500 hover:scale-105 hover:shadow-xl dark:border-secondary dark:bg-gray-800">
            <h2 className="mb-6 text-3xl font-semibold text-secondary">
              Let&apos;s Connect
            </h2>
            <p className="mb-4 text-lg">
              See more of my work on my portfolio:{" "}
              <Link
                href="https://mahirabrar.net"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary underline transition hover:text-accent dark:text-primary dark:hover:text-accent"
              >
                mahirabrar.net
              </Link>
            </p>
            <p className="mb-6 text-lg">
              Find me on{" "}
              <Link
                href="https://www.linkedin.com/in/hamid-abrar-mahir/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary underline transition hover:text-accent dark:text-primary dark:hover:text-accent"
              >
                LinkedIn
              </Link>{" "}
              and{" "}
              <Link
                href="https://github.com/MahirAbrar"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary underline transition hover:text-accent dark:text-primary dark:hover:text-accent"
              >
                GitHub
              </Link>
              .
            </p>
            <p className="text-lg italic">
              Thank you for visiting! I&apos;m passionate about building great web
              experiences and am always open to discussing potential
              opportunities where I can contribute my skills.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
