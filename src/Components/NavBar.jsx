import { useActiveSection } from "../Hooks/useActiveSection.js";
import PropTypes from "prop-types";
export default function NavBar() {
  const active = useActiveSection();
  return (
    <header className="fixed top-5 left-0 right-0 z-50 flex justify-center pointer-events-none">
      <nav className="pointer-events-auto bg-[linear-gradient(90deg,rgba(255,255,255,0.02),transparent)] rounded-full px-4 py-2 flex gap-4 items-center shadow-lg backdrop-blur">
        <a
          href="#hero"
          className={`text-white flex items-center relative justify-center font-bold px-3 py-1 rounded-full  gap-1
            transition-all duration-300 "text-white/70"`}
        >
          <img
            className="w-8"
            src="./favicon.png"
            alt="the website icon"
            aria-label="this image is an icon for the site"
          />
          Future3D
          <span
            className={`
          absolute left-0 -bottom-1 h-0.5 rounded-full 
          bg-linear-to-r from-[#6df0ff] to-[#b36bff] transition-all duration-300
          ${active === "hero" ? "w-full opacity-100" : "w-0 opacity-0"}
        `}
          />
        </a>
        <NavLink label="About" id="about" active={active} />
        <NavLink label="Contact" id="contact" active={active} />
      </nav>
    </header>
  );
}

function NavLink({ label, id, active }) {
  return (
    <a
      href={`#${id}`}
      className={`
        relative transition-all duration-300 
        ${
          active === id
            ? "text-white scale-110"
            : "text-white/70 hover:text-white"
        }
      `}
    >
      {label}

      {/* neon underline for active link */}
      <span
        className={`
          absolute left-0 -bottom-1 h-0.5 rounded-full 
          bg-linear-to-r from-[#6df0ff] to-[#b36bff] transition-all duration-300
          ${active === id ? "w-full opacity-100" : "w-0 opacity-0"}
        `}
      />
    </a>
  );
}

NavLink.propTypes = {
  label: PropTypes.string,
  id: PropTypes.string,
  active: PropTypes.string,
};
