import { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HoverLinks from "./HoverLinks";
import { gsap } from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { MdKeyboardArrowDown } from "react-icons/md";
import { setupSectionPause } from "./utils/sectionPause";
import "./styles/Navbar.css";
import navbarLinks from "../../public/images/navbar/links.json";

gsap.registerPlugin(ScrollSmoother, ScrollTrigger);
export let smoother: ScrollSmoother;

const MORE_LINKS = navbarLinks.more;

interface Highlight {
  left: number;
  top: number;
  width: number;
  height: number;
  opacity: number;
}

const Navbar = () => {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const moreRef = useRef<HTMLLIElement | null>(null);
  const [highlight, setHighlight] = useState<Highlight>({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    opacity: 0,
  });

  // The highlight is padded a bit wider than the <li>'s own box (rather
  // than padding the <li> itself), so it reads as a nice pill without
  // growing the nav's real layout width - which would shift the whole
  // right-aligned nav list further left and risk overlapping the
  // absolutely-centered email link next to it.
  const HIGHLIGHT_PAD_X = 12;

  const handleNavItemHover = (e: React.MouseEvent<HTMLLIElement>) => {
    const li = e.currentTarget;
    setHighlight({
      left: li.offsetLeft - HIGHLIGHT_PAD_X,
      top: li.offsetTop,
      width: li.offsetWidth + HIGHLIGHT_PAD_X * 2,
      height: li.offsetHeight,
      opacity: 1,
    });
  };

  const handleNavListLeave = () => {
    setHighlight((prev) => ({ ...prev, opacity: 0 }));
  };

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

    const teardownSectionPause = setupSectionPause();
    return teardownSectionPause;
  }, []);
  return (
    <>
      <div className="header">
        <a href={navbarLinks.brandHref} className="navbar-title" data-cursor="disable">
          KS
        </a>
        <a
          href={navbarLinks.emailHref}
          className="navbar-connect"
          data-cursor="disable"
        >
          {navbarLinks.email}
        </a>
        <div className="nav-list-wrap" onMouseLeave={handleNavListLeave}>
          <span
            className="nav-highlight"
            style={{
              transform: `translate(${highlight.left}px, ${highlight.top}px)`,
              width: highlight.width,
              height: highlight.height,
              opacity: highlight.opacity,
            }}
          />
          <ul>
            {navbarLinks.primary.map((link) => (
              <li onMouseEnter={handleNavItemHover} key={link.href}>
                <a data-href={link.href} href={link.href}>
                  <HoverLinks text={link.text} />
                </a>
              </li>
            ))}
            <li className="nav-more" ref={moreRef} onMouseEnter={handleNavItemHover}>
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
      </div>

      <div className="landing-circle1"></div>
      <div className="landing-circle2"></div>
      <div className="nav-fade"></div>
    </>
  );
};

export default Navbar;
