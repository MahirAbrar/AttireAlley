import React from "react";
import Link from "next/link";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background text-text dark:bg-backgroundDark dark:text-textDark">
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-4xl font-bold text-primary dark:text-primaryDark">
          About This Project
        </h1>

        <div className="space-y-6">
          <section className="rounded-lg bg-secondary p-6 dark:bg-secondaryDark">
            <h2 className="mb-4 text-2xl font-semibold">Tech Stack</h2>
            <ul className="list-inside list-disc space-y-2">
              <li>Next.js</li>
              <li>Tailwind CSS</li>
              <li>Daisy UI</li>
              <li>
                MongoDB Atlas (for encrypted user data, products, and addresses)
              </li>
              <li>Passport.js (for authentication)</li>
              <li>Firebase (for product image storage)</li>
              <li>Stripe (for payment processing)</li>
              <li>JWT and Cookies</li>
            </ul>
          </section>

          <section className="rounded-lg bg-accent p-6 dark:bg-accentDark">
            <h2 className="mb-4 text-2xl font-semibold">Project Purpose</h2>
            <p>
              This project was created to showcase my skills and as a learning
              experience with Next.js. It demonstrates my ability to work with
              modern web technologies and create full-stack applications.
            </p>
          </section>

          <section className="rounded-lg bg-secondary p-6 dark:bg-secondaryDark">
            <h2 className="mb-4 text-2xl font-semibold">Test the Website</h2>
            <p>
              To explore the features of this website, you can log in using the
              following credentials:
            </p>
            <div className="mt-2">
              <h2 className="mb-4 text-2xl font-semibold">
                With an Admin User
              </h2>
              <p>
                <strong>Username:</strong> &quot;testuser@attirealley.com&quot;
              </p>
              <p>
                <strong>Password:</strong> &quot;abcd1234&quot;
              </p>
            </div>
            <div className="mt-2">
              <h2 className="mb-4 text-2xl font-semibold">
                With an Regular User
              </h2>
              <p>
                <strong>Username:</strong> &quot;useruser@attirealley.com&quot;
              </p>
              <p>
                <strong>Password:</strong> &quot;abcd1234&quot;
              </p>
            </div>
          </section>

          <section className="rounded-lg bg-accent p-6 dark:bg-accentDark">
            <h2 className="mb-4 text-2xl font-semibold">
              Portfolio and Contact
            </h2>
            <p>
              Visit my portfolio website (which may be under construction as of
              June 2024) at:
            </p>
            <Link
              href=""
              className="text-primary hover:underline dark:text-primaryDark"
            >
              &quot;Link&quot;
            </Link>
            <p className="mt-4">
              Visit my{" "}
              <Link
                href="https://www.linkedin.com/in/hamid-abrar-mahir/"
                className="text-primary hover:underline dark:text-primaryDark"
              >
                LinkedIn
              </Link>{" "}
              And{" "}
              <Link
                href="https://github.com/MahirAbrar"
                className="text-primary hover:underline dark:text-primaryDark"
              >
                GitHub
              </Link>{" "}
              Page.
            </p>
            <p className="mt-4">
              Thank you for visiting my website. I welcome the opportunity to
              speak with you if you feel I&apos;d be a strong candidate for a
              position in your organization.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
