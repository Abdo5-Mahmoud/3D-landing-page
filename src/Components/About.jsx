// src/components/About.jsx
import { useEffect, useRef } from "react";
import { features } from "../constants/aboutConst.js";

export default function About() {
  const cardsRef = useRef([]);
  const iconsRef = useRef([]);

  useEffect(() => {
    // === Reveal on scroll + slight 3D tilt based on pointer ===
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("about-revealed");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    cardsRef.current.forEach((el) => {
      if (el) {
        el.classList.add("about-hidden");
        io.observe(el);
      }
    });

    // === Floating / rotating icons animation (requestAnimationFrame) ===
    let raf = null;
    let start = performance.now();
    function tick(now) {
      const t = (now - start) / 1000;
      iconsRef.current.forEach((el, idx) => {
        if (!el) return;
        // subtle bob + rotation + slight 3D tilt
        const bob = Math.sin(t * (0.9 + idx * 0.12)) * 6; // px vertical
        const rot = Math.sin(t * (0.7 + idx * 0.1)) * 6; // deg
        el.style.transform = `translateY(${bob}px) rotateZ(${rot}deg) translateZ(0)`;
      });
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    // pointer tilt effect for cards
    function onPointerMove(e) {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const cx = w / 2;
      const cy = h / 2;
      const px = (e.clientX - cx) / cx; // -1..1
      const py = (e.clientY - cy) / cy; // -1..1
      cardsRef.current.forEach((card) => {
        if (!card) return;
        // apply subtle perspective tilt
        card.style.transform = `perspective(1000px) rotateX(${
          py * 3
        }deg) rotateY(${px * 3}deg) translateZ(0)`;
      });
    }
    window.addEventListener("pointermove", onPointerMove);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  return (
    <section id="about" className="py-20 px-6 lg:px-12">
      <div className="flex items-center justify-between gap-8 flex-wrap">
        <div className="max-w-2xl">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4 headline-float">
            About Us
          </h2>
          <p className="text-neon1/70 mt-2">
            We specialize in cutting-edge 3D design and technology to bring your
            ideas to life. From interactive product demos to immersive web
            experiences.
          </p>
        </div>

        <div className="flex gap-4">
          <div
            ref={(el) => (iconsRef.current[0] = el)}
            className="w-28 h-28 bg-white/5 rounded-xl flex items-center justify-center text-3xl transform-gpu shadow-2xl"
            aria-hidden
          >
            🌐
          </div>
          <div
            ref={(el) => (iconsRef.current[1] = el)}
            className="w-28 h-28 bg-white/5 rounded-xl flex items-center justify-center text-3xl transform-gpu shadow-2xl"
            aria-hidden
          >
            🛠️
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
        {features.map((f, i) => (
          <article
            key={f.id}
            ref={(el) => (cardsRef.current[i] = el)}
            className="relative bg-white/5 border border-white/8 p-6 rounded-xl shadow-md will-change-transform transition-shadow duration-300 hover:shadow-[0_30px_90px_rgba(99,57,255,0.14)] hover:-translate-y-2"
          >
            {/* Fake 3D contact shadow (CSS) */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-3 blur-[30px] opacity-60 bg-gradient-to-r from-[rgba(109,240,255,0.06)] to-[rgba(179,107,255,0.04)] rounded-full shadow-contact pointer-events-none"></div>

            <div className="text-4xl mb-3">{f.icon}</div>
            <h3 className="text-lg font-bold text-white">{f.title}</h3>
            <p className="text-neon1/60 mt-2 text-sm">{f.desc}</p>

            {/* 3D hover highlight */}
            <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-transparent about-hover-glow"></div>
          </article>
        ))}
      </div>
    </section>
  );
}
