import About from "./About.jsx";
import Contact from "./Contact.jsx";
import Hero from "./Hero.jsx";
import NavBar from "./NavBar.jsx";

export default function Layout() {
  return (
    <div className="min-h-screen bg-dark">
      <NavBar />
      <main className="pt-28">
        <Hero />
        <About />
        <Contact />
      </main>
    </div>
  );
}
