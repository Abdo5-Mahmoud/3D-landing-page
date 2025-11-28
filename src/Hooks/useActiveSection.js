import { useEffect, useState } from "react";

export function useActiveSection() {
  const [active, setActive] = useState("hero");

  useEffect(() => {
    const sections = ["hero", "about", "contact"];

    const handleScroll = () => {
      let current = "hero";

      sections.forEach((id) => {
        const section = document.getElementById(id);
        if (section) {
          const top = section.getBoundingClientRect().top;
          if (top <= window.innerHeight * 0.3) {
            current = id;
          }
        }
      });

      setActive(current);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return active;
}
