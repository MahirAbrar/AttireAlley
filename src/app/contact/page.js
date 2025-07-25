"use client";

import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from "@/context";

const ContactPage = () => {
  const { isDark } = useContext(GlobalContext);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const contactLinks = [
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/hamid-abrar-mahir/",
      description: "Connect with me professionally",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          className="fill-current"
        >
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      ),
    },
    {
      name: "GitHub",
      url: "https://github.com/mahirabrar",
      description: "Check out my code and projects",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          className="fill-current"
        >
          <path d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.6.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.604-2.665-.305-5.467-1.333-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.3 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.652.242 2.873.118 3.176.768.84 1.235 1.91 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.565 21.795 24 17.298 24 12c0-6.627-5.373-12-12-12z" />
        </svg>
      ),
    },
    {
      name: "Portfolio",
      url: "https://mahirabrar.net",
      description: "Visit my personal website",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          className="fill-current"
        >
          <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm1 16.057v-3.057h2.994c-.059 1.143-.212 2.24-.456 3.279-.823-.12-1.674-.188-2.538-.222zm1.957 2.162c-.499 1.33-1.159 2.497-1.957 3.456v-3.62c.666.028 1.319.081 1.957.164zm-1.957-7.219v-3.015c.868-.034 1.721-.103 2.548-.224.238 1.027.389 2.111.446 3.239h-2.994zm0-5.014v-3.661c.806.969 1.471 2.15 1.971 3.496-.642.084-1.3.137-1.971.165zm2.703-3.267c1.237.496 2.354 1.228 3.29 2.146-.642.234-1.311.442-2.019.607-.344-.992-.775-1.91-1.271-2.753zm-7.241 13.56c-.244-1.039-.398-2.136-.456-3.279h2.994v3.057c-.865.034-1.714.102-2.538.222zm2.538 1.776v3.62c-.798-.959-1.458-2.126-1.957-3.456.638-.083 1.291-.136 1.957-.164zm-2.994-7.055c.057-1.128.207-2.212.446-3.239.827.121 1.68.19 2.548.224v3.015h-2.994zm1.024-5.179c.5-1.346 1.165-2.527 1.97-3.496v3.661c-.671-.028-1.329-.081-1.97-.165zm-2.005-.35c-.708-.165-1.377-.373-2.018-.607.937-.918 2.053-1.65 3.29-2.146-.496.844-.927 1.762-1.272 2.753zm-.549 1.918c-.264 1.151-.434 2.36-.492 3.611h-3.933c.165-1.658.739-3.197 1.617-4.518.88.361 1.816.67 2.808.907zm.009 9.262c-.988.236-1.92.542-2.797.9-.89-1.328-1.471-2.879-1.637-4.551h3.934c.058 1.265.231 2.488.5 3.651zm.553 1.917c.342.976.768 1.881 1.257 2.712-1.223-.49-2.326-1.211-3.256-2.115.636-.229 1.299-.435 1.999-.597zm9.924 0c.7.163 1.362.367 1.999.597-.931.903-2.034 1.625-3.257 2.116.489-.832.915-1.737 1.258-2.713zm.553-1.917c.27-1.163.442-2.386.501-3.651h3.934c-.167 1.672-.748 3.223-1.638 4.551-.877-.358-1.81-.664-2.797-.9zm.501-5.651c-.058-1.251-.229-2.46-.492-3.611.992-.237 1.929-.546 2.809-.907.877 1.321 1.451 2.86 1.616 4.518h-3.933z" />
        </svg>
      ),
    },
    {
      name: "Email",
      url: "mailto:mahirabrar.au@gmail.com",
      description: "Send me an email directly",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          className="fill-current"
        >
          <path d="M12 12.713l-11.985-9.713h23.97l-11.985 9.713zm0 2.574l-12-9.725v15.438h24v-15.438l-12 9.725z" />
        </svg>
      ),
    },
  ];

  return (
    <div
      className={`min-h-screen transition-all duration-300 ${
        mounted && isDark
          ? "bg-backgroundDark text-white"
          : "bg-background text-black"
      }`}
    >
      <div className="container mx-auto flex flex-col items-center justify-center px-4 py-16">
        {/* Header Section */}
        <div className="mb-16 text-center">
          <h1
            className={`mb-6 text-5xl font-bold md:text-6xl ${
              mounted && isDark ? "text-white" : "text-black"
            }`}
          >
            Get In Touch
          </h1>
          <p
            className={`mx-auto max-w-3xl text-xl md:text-2xl ${
              mounted && isDark ? "text-white/80" : "text-black/80"
            }`}
          >
            I&apos;d love to hear from you! Whether you have a project in mind,
            want to collaborate, or just want to say hello, feel free to reach
            out through any of these channels.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {contactLinks.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target={link.name !== "Email" ? "_blank" : "_self"}
              rel={link.name !== "Email" ? "noopener noreferrer" : ""}
              className={`group rounded-xl border-2 p-8 transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                mounted && isDark
                  ? "border-primary/20 bg-gray-800 hover:border-primary/60 hover:bg-gray-700 hover:shadow-[0_0_20px_rgba(87,167,168,0.3)]"
                  : "border-primary/20 bg-white hover:border-primary/60 hover:shadow-[0_0_20px_rgba(87,167,168,0.2)]"
              }`}
            >
              <div className="text-center">
                <div
                  className={`mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full transition-colors duration-300 ${
                    mounted && isDark
                      ? "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white"
                      : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white"
                  }`}
                >
                  {link.icon}
                </div>
                <h3
                  className={`mb-2 text-xl font-semibold ${
                    mounted && isDark ? "text-white" : "text-black"
                  }`}
                >
                  {link.name}
                </h3>
                <p
                  className={`text-sm ${
                    mounted && isDark ? "text-white/70" : "text-black/70"
                  }`}
                >
                  {link.description}
                </p>
              </div>
            </a>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <div
            className={`inline-block rounded-lg p-6 ${
              mounted && isDark
                ? "border border-primary/20 bg-gray-800"
                : "bg-primary/5"
            }`}
          >
            <h3
              className={`mb-4 text-2xl font-semibold ${
                mounted && isDark ? "text-white" : "text-black"
              }`}
            >
              Let&apos;s Build Something Amazing Together
            </h3>
            <p
              className={`text-lg ${
                mounted && isDark ? "text-white/80" : "text-black/80"
              }`}
            >
              I&apos;m always open to discussing new opportunities, creative
              projects, and innovative ideas. Don&apos;t hesitate to reach out!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
