export default function NavBar() {
  return (
    <header className="fixed top-5 left-0 right-0 z-50 flex justify-center pointer-events-none">
      <nav className="pointer-events-auto bg-[linear-gradient(90deg,rgba(255,255,255,0.02),transparent)] rounded-full px-4 py-2 flex gap-4 items-center shadow-lg backdrop-blur">
        <a
          href="#hero"
          className="text-white font-bold px-3 py-1 rounded-full bg-white/5"
        >
          Future3D
        </a>
        <a href="#about" className="text-white/70 hover:text-white">
          About
        </a>
        <a href="#contact" className="text-white/70 hover:text-white">
          Contact
        </a>
      </nav>
    </header>
  );
}
