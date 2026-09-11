"use client";

import React from "react";
import {
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";
import { motion } from "framer-motion";

const Contact = () => {
  const contactLinks = [
    {
      id: 1,
      title: "GitHub",
      subtitle: "Kartavya728",
      link: "https://github.com/Kartavya728",
      icon: FaGithub,
      color: "from-gray-400 to-gray-600",
    },
    {
      id: 2,
      title: "LinkedIn",
      subtitle: "Kartavya Suryawanshi",
      link: "https://www.linkedin.com/in/kartavya-suryawanshi-918753320",
      icon: FaLinkedin,
      color: "from-blue-400 to-blue-600",
    },
    {
      id: 3,
      title: "Email",
      subtitle: "kartavya.suryawanshi7@gmail.com",
      link: "mailto:kartavya.suryawanshi7@gmail.com",
      icon: FaEnvelope,
      color: "from-red-400 to-red-600",
    },
    {
      id: 4,
      title: "Phone",
      subtitle: "+91-8668944955",
      link: "tel:+918668944955",
      icon: FaPhone,
      color: "from-green-400 to-green-600",
    },
  ];

  return (
    <motion.section
      id="contact"
      className="py-20"
      initial={{ opacity: 0, scale: 0.85 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{ duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
    >
      <h1 className="heading">
        Get In <span className="text-purple">Touch</span>
      </h1>
      <p className="text-center text-gray-400 mt-4 text-lg max-w-2xl mx-auto">
        Open to internships, collaborations, and interesting problems. Reach
        out through any of these channels.
      </p>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
        {contactLinks.map((contact) => {
          const Icon = contact.icon;
          return (
            <a
              key={contact.id}
              href={contact.link}
              target={contact.link.startsWith("http") ? "_blank" : undefined}
              rel={contact.link.startsWith("http") ? "noopener noreferrer" : undefined}
              className="group relative rounded-xl overflow-hidden bg-gradient-to-br from-slate-900 via-black-100 to-black-200 border border-purple-500/20 hover:border-purple-500/60 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 hover:-translate-y-1 p-6 flex flex-col items-center text-center gap-3"
            >
              <div
                className={`w-12 h-12 rounded-full bg-gradient-to-br ${contact.color} flex items-center justify-center text-white text-xl`}
              >
                <Icon />
              </div>
              <div>
                <p className="text-white font-semibold group-hover:text-purple-300 transition-colors">
                  {contact.title}
                </p>
                <p className="text-xs text-gray-400 mt-1 break-all">
                  {contact.subtitle}
                </p>
              </div>
            </a>
          );
        })}
      </div>
    </motion.section>
  );
};

export default Contact;
