"use client";

import React from "react";
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";
import MagicButton from "./MagicButton";

const Contact = () => {
  const contactLinks = [
    {
      id: 1,
      title: "GitHub",
      link: "https://github.com/Kartavya728",
      icon: FaGithub,
      color: "from-gray-400 to-gray-600",
    },
    {
      id: 2,
      title: "LinkedIn",
      link: "https://linkedin.com/in/kartavya-suryawanshi",
      icon: FaLinkedin,
      color: "from-blue-400 to-blue-600",
    },
    {
      id: 3,
      title: "Twitter",
      link: "https://twitter.com/mannupaaji",
      icon: FaTwitter,
      color: "from-sky-400 to-sky-600",
    },
    {
      id: 4,
      title: "Email",
      link: "mailto:your.email@example.com",
      icon: FaEnvelope,
      color: "from-red-400 to-red-600",
    },
  ];

  return <section id="contact" className="py-20"></section>;
};

export default Contact;
