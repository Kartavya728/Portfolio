import { useState } from "react";
import { motion } from "motion/react";
import "./chromatic-image.css";

interface ChromaticImageProps {
  src: string;
  alt: string;
  className?: string;
}

// A hover effect that splits the image into offset red/cyan channel layers
// (classic "chromatic aberration") and snaps back together on mouse leave.
export function ChromaticImage({ src, alt, className }: ChromaticImageProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`chromatic-image ${className || ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img src={src} alt={alt} className="chromatic-image-base" />
      <motion.img
        src={src}
        alt=""
        aria-hidden
        className="chromatic-image-layer chromatic-image-red"
        animate={{
          x: isHovered ? -7 : 0,
          y: isHovered ? -2 : 0,
          opacity: isHovered ? 0.75 : 0,
        }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
      />
      <motion.img
        src={src}
        alt=""
        aria-hidden
        className="chromatic-image-layer chromatic-image-cyan"
        animate={{
          x: isHovered ? 7 : 0,
          y: isHovered ? 2 : 0,
          opacity: isHovered ? 0.75 : 0,
        }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
      />
      <motion.div
        className="chromatic-image-scanlines"
        animate={{ opacity: isHovered ? 0.15 : 0 }}
        transition={{ duration: 0.2 }}
      />
    </div>
  );
}
