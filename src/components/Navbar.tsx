import { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HoverLinks from "./HoverLinks";
import { gsap } from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { MdKeyboardArrowDown } from "react-icons/md";
import "./styles/Navbar.css";

gsap.registerPlugin(ScrollSmoother, ScrollTrigger);
export let smoother: ScrollSmoother;

const MORE_LINKS = [
  { href: "#whatido", text: "SKILLS" },
  { href: "#career", text: "EXPERIENCE" },
  { href: "#research", text: "RESEARCH" },
  { href: "#achievements", text: "ACHIEVEMENTS" },
  { href: "#certificates", text: "CERTIFICATES" },
  { href: "#techstack", text: "TECH STACK" },
];

const Navbar = () => {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const moreRef = useRef<HTMLLIElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setIsMoreOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    smoother = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 1.7,
      speed: 1.7,
      effects: true,
      autoResize: true,
      ignoreMobileResize: true,
    });

    smoother.scrollTop(0);
    smoother.paused(true);

    let links = document.querySelectorAll(".header ul a");
    links.forEach((elem) => {
      let element = elem as HTMLAnchorElement;
      element.addEventListener("click", (e) => {
        if (window.innerWidth > 1024) {
          e.preventDefault();
          let elem = e.currentTarget as HTMLAnchorElement;
          let section = elem.getAttribute("data-href");
          smoother.scrollTo(section, true, "top top");
        }
      });
    });
    window.addEventListener("resize", () => {
      ScrollSmoother.refresh(true);
    });
  }, []);
  return (
    <>
      <div className="header">
        <a href="/#" className="navbar-title" data-cursor="disable">
          KS
        </a>
        <a
          href="mailto:kartavya.suryawanshi7@gmail.com"
          className="navbar-connect"
          data-cursor="disable"
        >
          kartavya.suryawanshi7@gmail.com
        </a>
        <ul>
          <li>
            <a data-href="#about" href="#about">
              <HoverLinks text="ABOUT" />
            </a>
          </li>
          <li>
            <a data-href="#work" href="#work">
              <HoverLinks text="WORK" />
            </a>
          </li>
          <li>
            <a data-href="#contact" href="#contact">
              <HoverLinks text="CONTACT" />
            </a>
          </li>
          <li className="nav-more" ref={moreRef}>
            <button
              type="button"
              className="nav-more-toggle"
              onClick={() => setIsMoreOpen((prev) => !prev)}
            >
              <HoverLinks text="MORE" />
              <MdKeyboardArrowDown
                className={`nav-more-arrow ${isMoreOpen ? "nav-more-arrow-open" : ""}`}
              />
            </button>
            <ul className={`nav-more-dropdown ${isMoreOpen ? "nav-more-dropdown-open" : ""}`}>
              {MORE_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    data-href={link.href}
                    href={link.href}
                    onClick={() => setIsMoreOpen(false)}
                  >
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </div>

      <div className="landing-circle1"></div>
      <div className="landing-circle2"></div>
      <div className="nav-fade"></div>
    </>
  );
};

export default Navbar;
